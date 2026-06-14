"use client";
import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const translations = {
  en: {
    // Nav
    home: "Home",
    products: "Products",
    categories: "Categories",
    cart: "Cart",
    myOrders: "My Orders",
    contact: "Contact",
    about: "About",
    login: "Login",
    register: "Register",
    logout: "Logout",
    adminPanel: "Admin Panel",

    // Home
    heroTitle: "Abu Al-Ezz Institution",
    heroSubtitle: "Your trusted destination for quality household items, heaters & hookah products",
    browseProducts: "Browse Products",
    contactUs: "Contact Us",
    featuredProducts: "Featured Products",
    shopByCategory: "Shop By Category",
    orderOnline: "Order Online",
    orderOnlineDesc: "Browse our products and submit your order request online — we'll confirm it and arrange delivery.",
    viewAll: "View All",
    viewDetails: "View Details",
    addToCart: "Add to Cart",
    outOfStock: "Out of Stock",
    available: "Available",

    // Products
    searchPlaceholder: "Search products...",
    filterCategory: "Filter by Category",
    filterAvailability: "Filter by Availability",
    allCategories: "All Categories",
    allAvailability: "All",
    noProducts: "No products found.",
    price: "Price",
    stock: "Stock",
    pieces: "pcs",

    // Product Details
    backToProducts: "Back to Products",
    quantity: "Quantity",
    category: "Category",
    subcategory: "Subcategory",
    description: "Description",
    inStock: "In Stock",

    // Cart
    myCart: "My Cart",
    emptyCart: "Your cart is empty",
    emptyCartDesc: "Browse our products and add items to your cart.",
    remove: "Remove",
    total: "Total",
    subtotal: "Subtotal",
    notes: "Order Notes",
    notesPlaceholder: "Any special instructions or notes for your order...",
    submitOrder: "Submit Order Request",
    orderSuccess: "Your order request has been submitted and is waiting for admin confirmation.",
    continueShopping: "Continue Shopping",
    placeNewOrder: "Place New Order",
    unit: "Unit",

    // Orders
    orderHistory: "My Orders",
    orderId: "Order ID",
    orderDate: "Date",
    orderStatus: "Status",
    orderTotal: "Total",
    orderNotes: "Notes",
    orderItems: "Items",
    pending: "Pending",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    completed: "Completed",
    noOrders: "No orders yet.",

    // Auth
    fullName: "Full Name",
    email: "Email",
    password: "Password",
    phone: "Phone Number",
    address: "Address",
    loginBtn: "Login",
    registerBtn: "Create Account",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    loginHere: "Login here",
    registerHere: "Register here",

    // Contact
    contactInfo: "Contact Information",
    phone_label: "Phone",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    openHours: "Opening Hours",
    visitUs: "Visit Us",
    sendMessage: "Send a Message",

    // Admin
    dashboard: "Dashboard",
    manageProducts: "Manage Products",
    manageCategories: "Manage Categories",
    manageOrders: "Manage Orders",
    storeSettings: "Store Settings",
    totalProducts: "Total Products",
    totalOrders: "Total Orders",
    pendingOrders: "Pending Orders",
    outOfStockItems: "Out of Stock",
    totalCustomers: "Total Customers",
    recentOrders: "Recent Orders",
    lowStock: "Low Stock Products",
    addProduct: "Add Product",
    editProduct: "Edit Product",
    deleteProduct: "Delete Product",
    productName: "Product Name",
    save: "Save",
    cancel: "Cancel",
    confirmDelete: "Are you sure you want to delete this item?",
    updateStatus: "Update Status",
    actions: "Actions",

    // About
    aboutTitle: "About Us",
    aboutDesc: "Abu Al-Ezz Institution is a trusted store in Lebanon offering quality household items, heaters, and premium hookah products. We allow customers to browse and submit order requests online.",

    // Footer
    quickLinks: "Quick Links",
    followUs: "Follow Us",
    allRights: "All Rights Reserved",
  },

  ar: {
    home: "الرئيسية",
    products: "المنتجات",
    categories: "التصنيفات",
    cart: "السلة",
    myOrders: "طلباتي",
    contact: "تواصل معنا",
    about: "من نحن",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    logout: "تسجيل الخروج",
    adminPanel: "لوحة الإدارة",

    heroTitle: "مؤسسة أبو العز و أولاده",
    heroSubtitle: "وجهتك الموثوقة للأدوات المنزلية والدفايات ومنتجات الأرجيلة",
    browseProducts: "تصفح المنتجات",
    contactUs: "تواصل معنا",
    featuredProducts: "منتجات مميزة",
    shopByCategory: "تسوق حسب التصنيف",
    orderOnline: "اطلب عبر الإنترنت",
    orderOnlineDesc: "تصفح منتجاتنا وأرسل طلبك عبر الإنترنت — سنؤكده ونرتب التسليم.",
    viewAll: "عرض الكل",
    viewDetails: "عرض التفاصيل",
    addToCart: "أضف للسلة",
    outOfStock: "غير متوفر",
    available: "متوفر",

    searchPlaceholder: "ابحث عن منتج...",
    filterCategory: "تصفية حسب التصنيف",
    filterAvailability: "تصفية حسب التوفر",
    allCategories: "جميع التصنيفات",
    allAvailability: "الكل",
    noProducts: "لا توجد منتجات.",
    price: "السعر",
    stock: "المخزون",
    pieces: "قطعة",

    backToProducts: "العودة للمنتجات",
    quantity: "الكمية",
    category: "التصنيف",
    subcategory: "التصنيف الفرعي",
    description: "الوصف",
    inStock: "متوفر في المخزن",

    myCart: "سلتي",
    emptyCart: "سلتك فارغة",
    emptyCartDesc: "تصفح منتجاتنا وأضف عناصر إلى سلتك.",
    remove: "حذف",
    total: "الإجمالي",
    subtotal: "المجموع الفرعي",
    notes: "ملاحظات الطلب",
    notesPlaceholder: "أي تعليمات أو ملاحظات خاصة بطلبك...",
    submitOrder: "إرسال طلب الشراء",
    orderSuccess: "تم إرسال طلبك بنجاح وهو بانتظار تأكيد الإدارة.",
    continueShopping: "متابعة التسوق",
    placeNewOrder: "طلب جديد",
    unit: "وحدة",

    orderHistory: "طلباتي",
    orderId: "رقم الطلب",
    orderDate: "التاريخ",
    orderStatus: "الحالة",
    orderTotal: "الإجمالي",
    orderNotes: "الملاحظات",
    orderItems: "المنتجات",
    pending: "قيد الانتظار",
    confirmed: "مؤكد",
    cancelled: "ملغى",
    completed: "مكتمل",
    noOrders: "لا توجد طلبات بعد.",

    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    phone: "رقم الهاتف",
    address: "العنوان",
    loginBtn: "دخول",
    registerBtn: "إنشاء حساب",
    alreadyHaveAccount: "هل لديك حساب بالفعل؟",
    dontHaveAccount: "ليس لديك حساب؟",
    loginHere: "سجل دخولك هنا",
    registerHere: "سجل هنا",

    contactInfo: "معلومات التواصل",
    phone_label: "الهاتف",
    whatsapp: "واتساب",
    instagram: "إنستغرام",
    openHours: "أوقات العمل",
    visitUs: "زورونا",
    sendMessage: "أرسل رسالة",

    dashboard: "لوحة التحكم",
    manageProducts: "إدارة المنتجات",
    manageCategories: "إدارة التصنيفات",
    manageOrders: "إدارة الطلبات",
    storeSettings: "إعدادات المتجر",
    totalProducts: "إجمالي المنتجات",
    totalOrders: "إجمالي الطلبات",
    pendingOrders: "الطلبات المعلقة",
    outOfStockItems: "نفاد المخزون",
    totalCustomers: "إجمالي العملاء",
    recentOrders: "الطلبات الأخيرة",
    lowStock: "منتجات بمخزون منخفض",
    addProduct: "إضافة منتج",
    editProduct: "تعديل المنتج",
    deleteProduct: "حذف المنتج",
    productName: "اسم المنتج",
    save: "حفظ",
    cancel: "إلغاء",
    confirmDelete: "هل أنت متأكد أنك تريد حذف هذا العنصر؟",
    updateStatus: "تحديث الحالة",
    actions: "الإجراءات",

    aboutTitle: "من نحن",
    aboutDesc: "مؤسسة أبو العز و أولاده هي متجر موثوق في لبنان يوفر أدوات منزلية عالية الجودة ودفايات ومنتجات أرجيلة فاخرة. نتيح للعملاء تصفح المنتجات وإرسال طلبات الشراء عبر الإنترنت.",

    quickLinks: "روابط سريعة",
    followUs: "تابعنا",
    allRights: "جميع الحقوق محفوظة",
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const [dir, setDir] = useState("ltr");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) {
      setLang(saved);
      setDir(saved === "ar" ? "rtl" : "ltr");
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "ar" : "en";
    setLang(newLang);
    setDir(newLang === "ar" ? "rtl" : "ltr");
    localStorage.setItem("lang", newLang);
  };

  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, dir, toggleLanguage, t }}>
      <div dir={dir} className={lang === "ar" ? "font-arabic" : ""}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
