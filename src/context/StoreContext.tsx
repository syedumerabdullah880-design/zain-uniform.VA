import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  OrderStatus,
  CustomOrderQuote,
  WholesaleRequest,
  SiteSettings,
  FAQItem,
  Testimonial,
  Policies,
  CustomMeasurements,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
  INITIAL_FAQS,
  INITIAL_TESTIMONIALS,
  INITIAL_POLICIES,
} from '../data/initialData';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  customQuotes: CustomOrderQuote[];
  wholesaleRequests: WholesaleRequest[];
  settings: SiteSettings;
  faqs: FAQItem[];
  testimonials: Testimonial[];
  policies: Policies;
  language: 'en' | 'ur';
  isRtl: boolean;
  toggleLanguage: () => void;
  // Bag Actions
  addToCart: (
    product: Product,
    size: string,
    color: string,
    isStitched: boolean,
    customMeasurements?: CustomMeasurements,
    quantity?: number
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  // Order Actions
  placeOrder: (orderData: {
    customerName: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    city: string;
    area: string;
    postalCode?: string;
    notes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  getOrder: (orderNumber: string, phone: string) => Order | undefined;
  // Custom & Wholesale
  submitCustomQuote: (quote: Omit<CustomOrderQuote, 'id' | 'quoteNumber' | 'date' | 'status'>) => CustomOrderQuote;
  updateCustomQuoteStatus: (id: string, status: CustomOrderQuote['status'], notes?: string) => void;
  submitWholesaleRequest: (req: Omit<WholesaleRequest, 'id' | 'requestNumber' | 'date' | 'status'>) => WholesaleRequest;
  updateWholesaleStatus: (id: string, status: WholesaleRequest['status'], notes?: string) => void;
  // Admin Product Management
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  // Settings & CMS
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  updatePolicies: (newPolicies: Partial<Policies>) => void;
  addFaq: (faq: Omit<FAQItem, 'id'>) => void;
  updateFaq: (faq: FAQItem) => void;
  deleteFaq: (id: string) => void;
  addTestimonial: (t: Omit<Testimonial, 'id' | 'date'>) => void;
  // WhatsApp helper
  getWhatsAppLink: (text: string, customPhone?: string) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'zain_uniforms_products_v2',
  CART: 'zain_uniforms_cart_v2',
  ORDERS: 'zain_uniforms_orders_v2',
  CUSTOM_QUOTES: 'zain_uniforms_custom_quotes_v2',
  WHOLESALE: 'zain_uniforms_wholesale_v2',
  SETTINGS: 'zain_uniforms_settings_v3',
  FAQS: 'zain_uniforms_faqs_v2',
  TESTIMONIALS: 'zain_uniforms_testimonials_v2',
  POLICIES: 'zain_uniforms_policies_v3',
  LANG: 'zain_uniforms_lang_v2',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Cart / Booking items
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  // Orders - initialize empty or load legitimate orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Filter out any legacy dummy records with fake emails or numbers
        return parsed.filter(o => !o.email?.includes('@example.com') && !o.phone?.includes('03001234567'));
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Custom Quotes - initialize empty or load legitimate quotes
  const [customQuotes, setCustomQuotes] = useState<CustomOrderQuote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUOTES);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter(q => !q.email?.includes('@example.com') && !q.phone?.includes('03335551234'));
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Wholesale Requests - initialize empty or load legitimate requests
  const [wholesaleRequests, setWholesaleRequests] = useState<WholesaleRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WHOLESALE);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter(w => !w.email?.includes('@example.com') && !w.phone?.includes('03124445566'));
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Settings
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!saved) return INITIAL_SETTINGS;
    try {
      const parsed = JSON.parse(saved);
      // Ensure settings always use authentic business details
      if (
        !parsed.address ||
        !parsed.address.includes('koyla center') ||
        !parsed.phone2 ||
        parsed.phone?.includes('8594210')
      ) {
        return INITIAL_SETTINGS;
      }
      return { ...INITIAL_SETTINGS, ...parsed };
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // FAQs
  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAQS);
    return saved ? JSON.parse(saved) : INITIAL_FAQS;
  });

  // Testimonials
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
    return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
  });

  // Policies
  const [policies, setPolicies] = useState<Policies>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.POLICIES);
    if (!saved) return INITIAL_POLICIES;
    try {
      const parsed = JSON.parse(saved);
      if (
        JSON.stringify(parsed).includes('8594210') ||
        JSON.stringify(parsed).includes('Plot 44-B') ||
        JSON.stringify(parsed).includes('I-9 Industrial Area')
      ) {
        return INITIAL_POLICIES;
      }
      return { ...INITIAL_POLICIES, ...parsed };
    } catch {
      return INITIAL_POLICIES;
    }
  });

  // Language & RTL
  const [language, setLanguage] = useState<'en' | 'ur'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG);
    return (saved === 'ur' || saved === 'en') ? saved : 'en';
  });

  const isRtl = language === 'ur';

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUOTES, JSON.stringify(customQuotes));
  }, [customQuotes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WHOLESALE, JSON.stringify(wholesaleRequests));
  }, [wholesaleRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(policies));
  }, [policies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
    if (language === 'ur') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ur');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ur' : 'en'));
  };

  // Cart operations
  const addToCart = (
    product: Product,
    size: string,
    color: string,
    isStitched: boolean,
    customMeasurements?: CustomMeasurements,
    quantity = 1
  ) => {
    setCart(prev => {
      // Check if exact same item config already exists in bag (if not custom measurements)
      if (!customMeasurements) {
        const existingIdx = prev.findIndex(
          item =>
            item.product.id === product.id &&
            item.selectedSize === size &&
            item.selectedColor === color &&
            item.isStitched === isStitched &&
            !item.customMeasurements
        );
        if (existingIdx > -1) {
          const updated = [...prev];
          updated[existingIdx].quantity += quantity;
          return updated;
        }
      }

      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        product,
        selectedSize: size,
        selectedColor: color,
        isStitched,
        customMeasurements,
        quantity,
      };
      return [...prev, newItem];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Orders
  const placeOrder = (orderData: {
    customerName: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    city: string;
    area: string;
    postalCode?: string;
    notes?: string;
  }): Order => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ZU-2026-${randomNum}`;
    const now = new Date();
    const dateFormatted = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      date: dateFormatted,
      customerName: orderData.customerName,
      phone: orderData.phone,
      whatsapp: orderData.whatsapp || orderData.phone,
      email: orderData.email,
      address: orderData.address,
      city: orderData.city,
      area: orderData.area,
      postalCode: orderData.postalCode,
      items: [...cart],
      status: 'Pending',
      notes: orderData.notes,
      trackingHistory: [
        {
          status: 'Pending',
          timestamp: dateFormatted,
          note: `Order request submitted for ${cartCount} items`,
        },
      ],
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    const now = new Date();
    const dateFormatted = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;

    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const stepNote = note || `Status updated to ${newStatus}`;
          return {
            ...ord,
            status: newStatus,
            trackingHistory: [
              ...ord.trackingHistory,
              { status: newStatus, timestamp: dateFormatted, note: stepNote },
            ],
          };
        }
        return ord;
      })
    );
  };

  const getOrder = (orderNumber: string, phone: string): Order | undefined => {
    const cleanNum = orderNumber.trim().toUpperCase();
    const cleanPhone = phone.trim().replace(/\D/g, '');

    return orders.find(ord => {
      const matchNum = ord.orderNumber.toUpperCase() === cleanNum;
      const orderPhoneClean = ord.phone.replace(/\D/g, '');
      const orderWaClean = ord.whatsapp.replace(/\D/g, '');
      const matchPhone =
        orderPhoneClean.includes(cleanPhone) ||
        cleanPhone.includes(orderPhoneClean) ||
        orderWaClean.includes(cleanPhone);
      return matchNum && matchPhone;
    });
  };

  // Custom Quote
  const submitCustomQuote = (
    quote: Omit<CustomOrderQuote, 'id' | 'quoteNumber' | 'date' | 'status'>
  ): CustomOrderQuote => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const quoteNumber = `ZU-C2026-${randomNum}`;
    const now = new Date();
    const dateFormatted = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;

    const newQuote: CustomOrderQuote = {
      ...quote,
      id: `cq-${Date.now()}`,
      quoteNumber,
      date: dateFormatted,
      status: 'Received',
    };

    setCustomQuotes(prev => [newQuote, ...prev]);
    return newQuote;
  };

  const updateCustomQuoteStatus = (
    id: string,
    status: CustomOrderQuote['status'],
    adminNotes?: string
  ) => {
    setCustomQuotes(prev =>
      prev.map(q => {
        if (q.id === id) {
          return {
            ...q,
            status,
            ...(adminNotes !== undefined ? { adminNotes } : {}),
          };
        }
        return q;
      })
    );
  };

  // Wholesale Request
  const submitWholesaleRequest = (
    req: Omit<WholesaleRequest, 'id' | 'requestNumber' | 'date' | 'status'>
  ): WholesaleRequest => {
    const randomNum = Math.floor(10 + Math.random() * 90);
    const requestNumber = `ZU-W2026-${randomNum}`;
    const now = new Date();
    const dateFormatted = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;

    const newRequest: WholesaleRequest = {
      ...req,
      id: `ws-${Date.now()}`,
      requestNumber,
      date: dateFormatted,
      status: 'New',
    };

    setWholesaleRequests(prev => [newRequest, ...prev]);
    return newRequest;
  };

  const updateWholesaleStatus = (
    id: string,
    status: WholesaleRequest['status'],
    adminNotes?: string
  ) => {
    setWholesaleRequests(prev =>
      prev.map(r => {
        if (r.id === id) {
          return {
            ...r,
            status,
            ...(adminNotes !== undefined ? { adminNotes } : {}),
          };
        }
        return r;
      })
    );
  };

  // Product actions
  const addProduct = (p: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...p,
      id: `prod-${Date.now()}`,
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (p: Product) => {
    setProducts(prev => prev.map(item => (item.id === p.id ? p : item)));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(item => item.id !== productId));
  };

  // Settings & CMS
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updatePolicies = (newPolicies: Partial<Policies>) => {
    setPolicies(prev => ({ ...prev, ...newPolicies }));
  };

  const addFaq = (f: Omit<FAQItem, 'id'>) => {
    const newFaq: FAQItem = { ...f, id: `faq-${Date.now()}` };
    setFaqs(prev => [...prev, newFaq]);
  };

  const updateFaq = (f: FAQItem) => {
    setFaqs(prev => prev.map(item => (item.id === f.id ? f : item)));
  };

  const deleteFaq = (id: string) => {
    setFaqs(prev => prev.filter(item => item.id !== id));
  };

  const addTestimonial = (t: Omit<Testimonial, 'id' | 'date'>) => {
    const now = new Date();
    const date = `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`;
    const newT: Testimonial = { ...t, id: `t-${Date.now()}`, date };
    setTestimonials(prev => [newT, ...prev]);
  };

  const getWhatsAppLink = (text: string, customPhone?: string): string => {
    const rawNumber = customPhone || settings.whatsappNumber || '923185283067';
    const cleanNumber = rawNumber.replace(/\D/g, '');
    const encoded = encodeURIComponent(text);
    return `https://wa.me/${cleanNumber}?text=${encoded}`;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        orders,
        customQuotes,
        wholesaleRequests,
        settings,
        faqs,
        testimonials,
        policies,
        language,
        isRtl,
        toggleLanguage,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        placeOrder,
        updateOrderStatus,
        getOrder,
        submitCustomQuote,
        updateCustomQuoteStatus,
        submitWholesaleRequest,
        updateWholesaleStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        updateSettings,
        updatePolicies,
        addFaq,
        updateFaq,
        deleteFaq,
        addTestimonial,
        getWhatsAppLink,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
