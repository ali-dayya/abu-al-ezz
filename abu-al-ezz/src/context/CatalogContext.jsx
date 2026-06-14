"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";

const CatalogContext = createContext();

export function CatalogProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    apiRequest("/api/categories")
      .then((data) => {
        setCategories(data.categories);
        setSubcategories(data.subcategories);
      })
      .catch(() => {});
  }, []);

  const getCategoryName = (id, lang = "en") => {
    const cat = categories.find((c) => c.category_id === id);
    if (!cat) return "";
    return lang === "ar" ? cat.category_name_ar : cat.category_name_en;
  };

  const getSubcategoryName = (id, lang = "en") => {
    const sub = subcategories.find((s) => s.subcategory_id === id);
    if (!sub) return "";
    return lang === "ar" ? sub.subcategory_name_ar : sub.subcategory_name_en;
  };

  const getSubcategoriesForCategory = (categoryId) =>
    subcategories.filter((s) => s.category_id === categoryId);

  return (
    <CatalogContext.Provider value={{
      categories, subcategories,
      getCategoryName, getSubcategoryName, getSubcategoriesForCategory,
    }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  return useContext(CatalogContext);
}
