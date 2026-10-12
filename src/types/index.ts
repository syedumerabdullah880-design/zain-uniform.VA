export type Gender = 'Boys' | 'Girls' | 'Unisex';
export type StitchingOption = 'Stitched' | 'Unstitched' | 'Both';
export type UniformCategory = 
  | 'School Shirts' 
  | 'Trousers & Pants' 
  | 'Skirts & Pinafores' 
  | 'Blazers & Sweaters' 
  | 'Sports Uniforms' 
  | 'Accessories'
  | 'Medical & Healthcare Uniforms';

export interface CustomMeasurements {
  unit: 'inches' | 'cm';
  chest?: string;
  shoulder?: string;
  shirtLength?: string;
  sleeveLength?: string;
  waist?: string;
  trouserLength?: string;
  hip?: string;
  inseam?: string;
  collar?: string;
  specialInstructions?: string;
}

export interface Product {
  id: string;
  name: string;
  nameUrdu: string;
  sku: string;
  category: UniformCategory;
  gender: Gender;
  minWholesaleQty: number;
  fabrics: string[];
  colors: { name: string; hex: string }[];
  sizes: string[]; // ['XS', 'S', 'M', 'L', 'XL', 'Custom']
  stitchingOption: StitchingOption;
  stock: number;
  isMadeToOrder: boolean;
  productionDays: number;
  deliveryDaysEstimate: string;
  description: string;
  descriptionUrdu: string;
  image: string;
  featured: boolean;
  careInstructions?: string;
}

export interface CartItem {
  id: string; // unique item id in request bag
  product: Product;
  selectedSize: string;
  selectedColor: string;
  isStitched: boolean;
  customMeasurements?: CustomMeasurements;
  quantity: number;
}

export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'In Production' 
  | 'Quality Check' 
  | 'Ready for Dispatch' 
  | 'Dispatched' 
  | 'Delivered' 
  | 'Cancelled' 
  | 'On Hold';

export interface TrackingStep {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. ZU-2026-0814
  date: string;
  customerName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  area: string;
  postalCode?: string;
  items: CartItem[];
  status: OrderStatus;
  notes?: string;
  trackingHistory: TrackingStep[];
}

export interface CustomOrderQuote {
  id: string;
  quoteNumber: string; // e.g. ZU-C2026-00125
  date: string;
  customerName: string;
  phone: string;
  whatsapp: string;
  email: string;
  schoolName?: string;
  uniformType: string;
  gender: Gender;
  fabric: string;
  color: string;
  sizePreference: 'standard' | 'custom';
  standardSize?: string;
  measurements?: CustomMeasurements;
  isStitched: boolean;
  quantity: number;
  requiredDate: string;
  specialInstructions: string;
  referenceImage?: string;
  status: 'Received' | 'Reviewed' | 'Approved' | 'In Production' | 'Completed' | 'Rejected';
  adminNotes?: string;
}

export interface WholesaleRequest {
  id: string;
  requestNumber: string; // e.g. ZU-W2026-00042
  date: string;
  schoolOrBusinessName: string;
  contactPerson: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  uniformType: string;
  estimatedQuantity: number;
  boysCount: number;
  girlsCount: number;
  sizeBreakdown: string;
  fabricPreference: string;
  color: string;
  designDetails: string;
  requiredDeliveryDate: string;
  referenceImage?: string;
  status: 'New' | 'Under Review' | 'Sample Dispatched' | 'Approved' | 'Declined';
  adminNotes?: string;
}

export interface SiteSettings {
  businessName: string;
  tagline: string;
  taglineUrdu: string;
  phone: string;
  phone2?: string;
  whatsappNumber: string; // plain digits with country code, e.g. 923185283067
  whatsappNumber2?: string; // plain digits with country code, e.g. 923145357249
  email: string;
  address: string;
  cityDeliveryTimes: Record<string, string>;
  announcement: string;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  questionUrdu: string;
  answer: string;
  answerUrdu: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  schoolOrBusiness: string;
  city: string;
  review: string;
  rating: number;
  date: string;
}

export interface Policies {
  deliveryPolicy: string;
  returnsPolicy: string;
  exchangePolicy: string;
  customOrderPolicy: string;
  wholesalePolicy: string;
  privacyPolicy: string;
  terms: string;
}
