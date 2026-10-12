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
  getWhatsAppLink: (text: string) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'zain_uniforms_products_v2',
  CART: 'zain_uniforms_cart_v2',
  ORDERS: 'zain_uniforms_orders_v2',
  CUSTOM_QUOTES: 'zain_uniforms_custom_quotes_v2',
  WHOLESALE: 'zain_uniforms_wholesale_v2',
  SETTINGS: 'zain_uniforms_settings_v2',
  FAQS: 'zain_uniforms_faqs_v2',
  TESTIMONIALS: 'zain_uniforms_testimonials_v2',
  POLICIES: 'zain_uniforms_policies_v2',
  LANG: 'zain_uniforms_lang_v2',
};

// Seed initial orders without pricing/payment details
const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'ZU-2026-0081',
    date: '2026-10-09 14:30',
    customerName: 'Asad Mehmood',
    phone: '03001234567',
    whatsapp: '03001234567',
    email: 'asad.mehmood@example.com',
    address: 'House 14, Street 7, Sector F-8/2',
    city: 'Islamabad',
    area: 'F-8/2',
    postalCode: '44000',
    items: [
      {
        id: 'ci-101',
        product: INITIAL_PRODUCTS[0],
        selectedSize: 'M',
        selectedColor: 'Crisp White',
        isStitched: true,
        quantity: 2,
      },
      {
        id: 'ci-102',
        product: INITIAL_PRODUCTS[1],
        selectedSize: '30',
        selectedColor: 'Deep Navy Blue',
        isStitched: true,
        quantity: 2,
      }
    ],
    status: 'In Production',
    notes: 'Please add 1 extra inch to shirt length.',
    trackingHistory: [
      { status: 'Pending', timestamp: '2026-10-09 14:30', note: 'Order booking submitted by customer' },
      { status: 'Confirmed', timestamp: '2026-10-09 16:15', note: 'Order details and sizing verified with customer' },
      { status: 'In Production', timestamp: '2026-10-10 09:30', note: 'Pattern cut and sent to sewing line in I-9 workshop' },
    ]
  },
  {
    id: 'ord-102',
    orderNumber: 'ZU-2026-0094',
    date: '2026-10-10 11:15',
    customerName: 'Mrs. Hina Kamran',
    phone: '03219876543',
    whatsapp: '03219876543',
    email: 'hina.kamran@example.com',
    address: 'Apartment 4B, Gulberg Heights, Gulberg III',
    city: 'Lahore',
    area: 'Gulberg III',
    postalCode: '54000',
    items: [
      {
        id: 'ci-103',
        product: INITIAL_PRODUCTS[2],
        selectedSize: 'S',
        selectedColor: 'Deep Navy',
        isStitched: true,
        quantity: 1,
      }
    ],
    status: 'Ready for Dispatch',
    notes: 'Standard fit for Beaconhouse primary class 4.',
    trackingHistory: [
      { status: 'Pending', timestamp: '2026-10-10 11:15', note: 'Order booking submitted' },
      { status: 'Confirmed', timestamp: '2026-10-10 12:00', note: 'Measurements and school specifications confirmed' },
      { status: 'In Production', timestamp: '2026-10-10 13:45', note: 'Stitching started' },
      { status: 'Quality Check', timestamp: '2026-10-11 10:00', note: 'Inspection completed - pleats & seams verified' },
      { status: 'Ready for Dispatch', timestamp: '2026-10-11 11:30', note: 'Packed with label, waiting for Leopard Courier pickup' }
    ]
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Cart / Request Bag
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_DEMO_ORDERS;
  });

  // Custom Quotes
  const [customQuotes, setCustomQuotes] = useState<CustomOrderQuote[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUOTES);
    return saved ? JSON.parse(saved) : [
      {
        id: 'cq-1',
        quoteNumber: 'ZU-C2026-00125',
        date: '2026-10-10 15:40',
        customerName: 'Tahir Abbas',
        phone: '03335551234',
        whatsapp: '03335551234',
        email: 'tahir@example.com',
        schoolName: 'Roots Millennium School',
        uniformType: 'Winter Blazer & Trousers Combo',
        gender: 'Boys',
        fabric: 'Terry Wool Blend',
        color: 'Navy Blue with Gold Piping',
        sizePreference: 'custom',
        measurements: {
          unit: 'inches',
          chest: '32',
          shoulder: '14.5',
          shirtLength: '26',
          sleeveLength: '21',
          waist: '28',
          trouserLength: '36',
          hip: '33',
          inseam: '27',
          collar: '13.5',
          specialInstructions: 'Child is tall for his age, please allow 1.5 inch hem allowance inside.'
        },
        isStitched: true,
        quantity: 2,
        requiredDate: '2026-10-25',
        specialInstructions: 'Need custom brass crest embroidered on chest pocket.',
        status: 'Reviewed',
        adminNotes: 'Sample crest sent for approval on WhatsApp.'
      }
    ];
  });

  // Wholesale Requests
  const [wholesaleRequests, setWholesaleRequests] = useState<WholesaleRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WHOLESALE);
    return saved ? JSON.parse(saved) : [
      {
        id: 'ws-1',
        requestNumber: 'ZU-W2026-00042',
        date: '2026-10-08 10:20',
        schoolOrBusinessName: 'Al-Huda International School Campus II',
        contactPerson: 'Sir Naveed Akhtar (Admin Officer)',
        phone: '03124445566',
        whatsapp: '03124445566',
        email: 'admin.isb@alhuda.edu.pk',
        city: 'Islamabad',
        uniformType: 'Complete Primary School Uniform (Boys Shirts + Pants, Girls Abaya/Pinafore)',
        estimatedQuantity: 450,
        boysCount: 250,
        girlsCount: 200,
        sizeBreakdown: 'Class 1-3: 150 sets, Class 4-5: 180 sets, Class 6-7: 120 sets',
        fabricPreference: 'Oxford Cotton 60/40 & Tropical Poly-Viscose',
        color: 'Off-White Shirt, Charcoal Grey Trousers, Navy Blue Abaya',
        designDetails: 'Official school crest embroidery on left breast pocket.',
        requiredDeliveryDate: '2026-11-15',
        status: 'Under Review',
        adminNotes: 'Fabric lab swatches sent to campus office.'
      }
    ];
  });

  // Settings
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
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
    return saved ? JSON.parse(saved) : INITIAL_POLICIES;
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

  const getWhatsAppLink = (text: string): string => {
    const cleanNumber = settings.whatsappNumber.replace(/\D/g, '');
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
