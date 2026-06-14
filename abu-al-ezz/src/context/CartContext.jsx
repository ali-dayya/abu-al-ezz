"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) setCartItems(JSON.parse(saved));
    } catch {}
  }, []);

  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const addToCart = (product, qty = 1) => {
    const maxQty = product.stock_quantity ?? Infinity;
    if (maxQty <= 0) return;

    const existing = cartItems.find(i => i.product_id === product.product_id);
    let updated;
    if (existing) {
      updated = cartItems.map(i =>
        i.product_id === product.product_id
          ? { ...i, qty: Math.min(i.qty + qty, maxQty) }
          : i
      );
    } else {
      updated = [...cartItems, { ...product, qty: Math.min(qty, maxQty) }];
    }
    saveCart(updated);
  };

  const removeFromCart = (productId) => {
    saveCart(cartItems.filter(i => i.product_id !== productId));
  };

  const updateQty = (productId, qty) => {
    if (qty <= 0) { removeFromCart(productId); return; }
    saveCart(cartItems.map(i =>
      i.product_id === productId
        ? { ...i, qty: Math.min(qty, i.stock_quantity ?? Infinity) }
        : i
    ));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQty,
      clearCart, cartTotal, cartCount, orderSubmitted, setOrderSubmitted,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
