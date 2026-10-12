import { Product, SiteSettings, FAQItem, Testimonial, Policies } from '../types';

export const INITIAL_SETTINGS: SiteSettings = {
  businessName: 'Zain Uniforms',
  tagline: 'Your School Uniform, Made to Fit.',
  taglineUrdu: 'آپ کی اسکول یونیفارم، بہترین سلائی اور سائز کے ساتھ',
  phone: '03185283067',
  phone2: '03145357249',
  whatsappNumber: '923185283067', // clean for wa.me/923185283067
  whatsappNumber2: '923145357249', // clean for wa.me/923145357249
  email: 'orders@zainuniforms.pk',
  address: 'koyla center, Shop#2867 Nishter St, Sadiqabad Rawalpindi, 46000',
  cityDeliveryTimes: {
    'Rawalpindi': '1-2 Days (Express)',
    'Islamabad': '1-2 Days (Express)',
    'Lahore': '2-3 Days',
    'Karachi': '3-4 Days',
    'Peshawar': '2-3 Days',
    'Faisalabad': '2-3 Days',
    'Multan': '2-3 Days',
    'Sialkot': '2-3 Days',
    'Gujranwala': '2-3 Days',
    'Quetta': '3-5 Days',
    'Abbottabad': '2-3 Days',
    'Other Cities': '3-5 Days Nationwide',
  },
  announcement: 'School Session 2026: Booking Open for Custom Sizing & School Bulk Quotations with Guaranteed On-Time Delivery.',
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Classic Oxford Formal School Shirt',
    nameUrdu: 'کلاسیک آکسفورڈ فارمل اسکول شرٹ',
    sku: 'ZU-SHT-101',
    category: 'School Shirts',
    gender: 'Boys',
    minWholesaleQty: 30,
    fabrics: ['Oxford Cotton 60/40', 'Fine Poplin', 'Wrinkle-Resistant Blend'],
    colors: [
      { name: 'Crisp White', hex: '#FFFFFF' },
      { name: 'Sky Blue', hex: '#BAE6FD' },
      { name: 'Cream / Off-White', hex: '#FEF9C3' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    stitchingOption: 'Both',
    stock: 120,
    isMadeToOrder: false,
    productionDays: 3,
    deliveryDaysEstimate: '2-4 business days across Pakistan',
    description: 'Masterfully stitched school shirt crafted from breathable high-count 60/40 Oxford cotton. Features an interlined stiffened collar that stays sharp through full school days, reinforced seam stitching, single chest pocket, and durable resin buttons.',
    descriptionUrdu: 'اعلیٰ کوالٹی آکسفورڈ کاٹن سے تیار کردہ پائیدار اور آرام دہ اسکول شرٹ۔ مضبوط کالر اور دھلائی کے بعد بھی شکن سے محفوظ۔',
    image: '/src/assets/images/product_formal_shirt_1791745342211.jpg',
    featured: true,
    careInstructions: 'Machine wash warm with like whites. Medium warm iron. Do not bleach.'
  },
  {
    id: 'prod-2',
    name: 'Tailored Smart School Uniform Trousers',
    nameUrdu: 'اسمارٹ اسکول یونیفارم پینٹ / ٹراؤزر',
    sku: 'ZU-TRS-102',
    category: 'Trousers & Pants',
    gender: 'Boys',
    minWholesaleQty: 30,
    fabrics: ['Tropical Poly-Viscose (All-Season)', 'Heavy Twill', 'Cotton Chino'],
    colors: [
      { name: 'Deep Navy Blue', hex: '#0F1E36' },
      { name: 'Charcoal Grey', hex: '#374151' },
      { name: 'Uniform Khaki', hex: '#D7BA89' }
    ],
    sizes: ['24', '26', '28', '30', '32', '34', '36', 'Custom'],
    stitchingOption: 'Both',
    stock: 85,
    isMadeToOrder: false,
    productionDays: 3,
    deliveryDaysEstimate: '2-4 business days',
    description: 'Durable school trousers engineered for classroom comfort and playground movement. Featuring double-reinforced knees, an adjustable internal waistband for growing boys, deep side pockets, and neat blind-hemmed bottoms.',
    descriptionUrdu: 'آل سیزن پولی وسکوز کپڑے سے تیار کردہ پائیدار ٹراؤزر۔ ڈبل سلائی اور ایڈجسٹ ایبل بیلٹ کے ساتھ۔',
    image: '/src/assets/images/craftsmanship_workshop_1791745387660.jpg',
    featured: true,
    careInstructions: 'Warm gentle wash. Line dry in shade. Warm iron.'
  },
  {
    id: 'prod-3',
    name: 'Girls Pleated School Pinafore & Skirt Set',
    nameUrdu: 'طالبات کے لیے پینا فور اور پلیٹڈ اسکرٹ سیٹ',
    sku: 'ZU-PIN-103',
    category: 'Skirts & Pinafores',
    gender: 'Girls',
    minWholesaleQty: 25,
    fabrics: ['Crease-Resistant Uniform Twill', 'Poly-Viscose Suiting'],
    colors: [
      { name: 'Deep Navy', hex: '#0F1E36' },
      { name: 'School Grey', hex: '#4B5563' },
      { name: 'Bottle Green', hex: '#14532D' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    stitchingOption: 'Both',
    stock: 64,
    isMadeToOrder: false,
    productionDays: 4,
    deliveryDaysEstimate: '3-5 business days',
    description: 'Classic school pinafore uniform dress with permanent sharp box pleats, inner lining for modest opacity, shoulder button closures, and side zipper with safety hook. Includes matching school collar ribbon tie.',
    descriptionUrdu: 'مضبوط پریسڈ پلیٹوں اور اعلیٰ اندرونی استر کے ساتھ تیار کردہ اسکول پینافور ڈریس۔ آرام دہ اور باوقار ڈیزائن۔',
    image: '/src/assets/images/product_girls_pinafore_1791745370566.jpg',
    featured: true,
    careInstructions: 'Hand or delicate machine wash. Hang immediately to preserve sharp pleats.'
  },
  {
    id: 'prod-4',
    name: 'Executive Tailored School Crest Blazer',
    nameUrdu: 'پریمیئم اسکول بلیزر (کوٹ)',
    sku: 'ZU-BLZ-104',
    category: 'Blazers & Sweaters',
    gender: 'Unisex',
    minWholesaleQty: 20,
    fabrics: ['Imported Terry Wool Blend', 'Tropical Wool-Poly Suiting'],
    colors: [
      { name: 'Midnight Navy', hex: '#0F1E36' },
      { name: 'Royal Maroon', hex: '#7F1D1D' },
      { name: 'Forest Green', hex: '#064E3B' },
      { name: 'Classic Black', hex: '#111827' }
    ],
    sizes: ['28', '30', '32', '34', '36', '38', '40', 'Custom'],
    stitchingOption: 'Stitched',
    stock: 45,
    isMadeToOrder: true,
    productionDays: 5,
    deliveryDaysEstimate: '4-6 business days',
    description: 'Distinguished winter uniform blazer structured with canvassed lapels, premium satin inner lining, two brass-finish gold crest front buttons, sleeve cuff buttons, and breast pocket tailored for direct embroidery or patch badge application.',
    descriptionUrdu: 'شاندار ٹیری وول سے تیار کردہ سرمائی اسکول بلیزر۔ اندرونی ساٹن استر اور سنہری کرسٹ بٹنوں کے ساتھ۔',
    image: '/src/assets/images/product_navy_blazer_1791745358334.jpg',
    featured: true,
    careInstructions: 'Dry clean recommended to maintain tailored structure and canvassing.'
  },
  {
    id: 'prod-5',
    name: 'Fine-Knit V-Neck School Pullover Sweater',
    nameUrdu: 'وی-نیک اسکول سویٹر اور کارڈیگن',
    sku: 'ZU-SWT-105',
    category: 'Blazers & Sweaters',
    gender: 'Unisex',
    minWholesaleQty: 30,
    fabrics: ['Anti-Pill Soft Cashmere-Feel Acrylic', 'Wool Blend Knit'],
    colors: [
      { name: 'Navy Blue', hex: '#0F1E36' },
      { name: 'Heather Grey', hex: '#6B7280' },
      { name: 'Deep Maroon', hex: '#831843' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stitchingOption: 'Stitched',
    stock: 90,
    isMadeToOrder: false,
    productionDays: 2,
    deliveryDaysEstimate: '2-4 business days',
    description: 'Warm, lightweight anti-pill knit uniform sweater with ribbed neckband, cuffs, and waist hem. Designed to layer smoothly over formal school collared shirts without excessive bulk.',
    descriptionUrdu: 'گرم اور نرم دھاگے سے بُنا گیا وی-نیک اسکول سویٹر۔ بار بار دھلائی کے باوجود روؤں سے محفوظ۔',
    image: '/src/assets/images/hero_pakistan_uniforms_1791745324118.jpg',
    featured: true,
    careInstructions: 'Machine wash cool on wool cycle or hand wash. Dry flat away from direct heat.'
  },
  {
    id: 'prod-6',
    name: 'School House Athletic PE Tracksuit Set',
    nameUrdu: 'اسکول ہاؤس اسپورٹس ٹریک سوٹ سیٹ',
    sku: 'ZU-SPT-106',
    category: 'Sports Uniforms',
    gender: 'Unisex',
    minWholesaleQty: 25,
    fabrics: ['Breathable Micro-Poly Tricot', 'Dry-Fit Honeycomb Mesh'],
    colors: [
      { name: 'Navy & White Piping', hex: '#0F1E36' },
      { name: 'Jinnah House (Green)', hex: '#15803D' },
      { name: 'Iqbal House (Maroon)', hex: '#991B1B' },
      { name: 'Liaquat House (Yellow Accent)', hex: '#EAB308' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    stitchingOption: 'Stitched',
    stock: 55,
    isMadeToOrder: false,
    productionDays: 3,
    deliveryDaysEstimate: '3-4 business days',
    description: 'High-performance school sports uniform set featuring a full-zip track jacket with ribbed stand collar and zip pockets, matched with ergonomic athletic track pants with an elasticated drawcord waist.',
    descriptionUrdu: 'کھیلوں اور پی ٹی کلاسز کے لیے لچکدار اور ہوادار مائیکرو پولی ٹریک سوٹ۔ ہاؤس کلرز کے مطابق دستیاب۔',
    image: '/src/assets/images/craftsmanship_workshop_1791745387660.jpg',
    featured: false,
    careInstructions: 'Machine wash cold. Do not iron directly on athletic prints.'
  },
  {
    id: 'prod-7',
    name: 'Combed Cotton School Piqué Polo Shirt',
    nameUrdu: 'کامبڈ کاٹن اسکول پولو شرٹ',
    sku: 'ZU-POLO-107',
    category: 'School Shirts',
    gender: 'Unisex',
    minWholesaleQty: 40,
    fabrics: ['100% Combed Cotton Piqué (220 GSM)', 'CVC Poly-Cotton'],
    colors: [
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Navy Blue', hex: '#0F1E36' },
      { name: 'Sky Blue', hex: '#38BDF8' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stitchingOption: 'Stitched',
    stock: 140,
    isMadeToOrder: false,
    productionDays: 2,
    deliveryDaysEstimate: '2-3 business days',
    description: 'Soft summer school uniform polo shirt tailored from 220 GSM double-pique combed cotton. Features a 3-button placket, reinforced collar stand that prevents edge rolling, and side vents for comfort.',
    descriptionUrdu: 'گرمیوں کے سیزن کے لیے خالص کاٹن کی نرم پولو شرٹ۔ پسینہ جذب کرنے کی بہترین صلاحیت۔',
    image: '/src/assets/images/product_formal_shirt_1791745342211.jpg',
    featured: false,
    careInstructions: 'Machine wash normal. Warm iron on reverse.'
  },
  {
    id: 'prod-8',
    name: 'School Uniform Tie & Webbed Belt Set',
    nameUrdu: 'اسکول ٹائی اور مضبوط بیلٹ سیٹ',
    sku: 'ZU-ACC-108',
    category: 'Accessories',
    gender: 'Unisex',
    minWholesaleQty: 50,
    fabrics: ['Woven Jacquard Polyester Tie', 'Heavy Cotton Webbed Belt'],
    colors: [
      { name: 'Navy & Gold Stripe', hex: '#0F1E36' },
      { name: 'Maroon & Silver Stripe', hex: '#831843' },
      { name: 'Solid Navy', hex: '#1E3A8A' }
    ],
    sizes: ['Junior (Primary)', 'Senior (Secondary / College)'],
    stitchingOption: 'Stitched',
    stock: 210,
    isMadeToOrder: false,
    productionDays: 1,
    deliveryDaysEstimate: '2-3 business days',
    description: 'Essential school uniform accessory combo: heavy-density jacquard woven tie with tipped tail and slide keeper, paired with a military-grade canvas webbed belt with solid brass sliding buckle.',
    descriptionUrdu: 'مضبوط اسکول ٹائی اور براس بکل والی کینوس بیلٹ کا مکمل سیٹ۔',
    image: '/src/assets/images/product_girls_pinafore_1791745370566.jpg',
    featured: false,
    careInstructions: 'Spot clean tie. Wipe belt buckle with dry cloth.'
  }
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Stitching & Sizes',
    question: 'Do you offer custom stitching for individual students?',
    questionUrdu: 'کیا آپ انفرادی طالب علموں کے لیے کسٹم ناپ پر سلائی کرتے ہیں؟',
    answer: 'Yes! You can either select standard sizes (XS through XXL) or enter custom body measurements (Chest, Shoulder, Shirt Length, Waist, Trouser Length). Our master tailors stitch specifically according to your provided measurements.',
    answerUrdu: 'جی ہاں! آپ اسٹینڈرڈ سائز منتخب کر سکتے ہیں یا اپنے بچے کا درست ناپ درج کر سکتے ہیں۔ ہمارے ماہر درزی آپ کے دیے گئے ناپ کے مطابق سلائی کرتے ہیں۔'
  },
  {
    id: 'faq-2',
    category: 'Stitching & Sizes',
    question: 'Can I order unstitched uniform fabric?',
    questionUrdu: 'کیا بغیر سلا کپڑا (ان اسٹچڈ) بھی مل سکتا ہے؟',
    answer: 'Yes, most of our uniform shirts, trousers, and shalwar kameez fabrics are available in both stitched and unstitched options. When unstitched is selected, we provide pre-cut measured fabric yardage.',
    answerUrdu: 'جی ہاں، ہماری زیادہ تر یونیفارم پروڈکٹس سلا اور بغیر سلا دونوں صورتوں میں دستیاب ہیں۔'
  },
  {
    id: 'faq-3',
    category: 'Bulk & School Orders',
    question: 'Can schools place bulk orders with custom logos and colors?',
    questionUrdu: 'کیا اسکول اپنے لوگو اور مخصوص رنگوں کے ساتھ بلک آرڈر دے سکتے ہیں؟',
    answer: 'Absolutely. We partner with private, semi-government, and military-foundation schools across Pakistan. We manufacture custom dyed fabrics, woven ties, embroidered crests, blazers, and sports kits for campuses.',
    answerUrdu: 'بالکل۔ ہم پورے پاکستان کے اسکولوں کے لیے مخصوص مونوگرام، کڑھائی اور کسٹم فیبرک کے ساتھ سپلائی فراہم کرتے ہیں۔'
  },
  {
    id: 'faq-4',
    category: 'Bulk & School Orders',
    question: 'What is the minimum wholesale order quantity?',
    questionUrdu: 'ہول سیل آرڈر کے لیے کم از کم کتنی تعداد ہونی چاہیے؟',
    answer: 'Our wholesale batch processing begins at 25-30 pieces per category. For custom dyed fabric or custom school jacquard ties, minimum batches are typically 50 units.',
    answerUrdu: 'ہول سیل پروڈکشن کم از کم 25 سے 30 عدد سے شروع ہوتی ہے، جبکہ مخصوص مونوگرام ٹائیوں کے لیے کم از کم 50 عدد درکار ہوتے ہیں۔'
  },
  {
    id: 'faq-5',
    category: 'Delivery & Logistics',
    question: 'How long does production and delivery take across Pakistan?',
    questionUrdu: 'تیاری اور پورے پاکستان میں ڈلیوری میں کتنا وقت لگتا ہے؟',
    answer: 'Ready-to-wear standard items are dispatched within 24-48 hours and arrive in 2-4 business days via courier (TCS, Leopard, PostEx). Custom made-to-measure orders take 3-5 days in production before dispatch.',
    answerUrdu: 'تیار شدہ یونیفارم 2 سے 4 دن میں کوریئر کے ذریعے پہنچ جاتی ہے۔ کسٹم سلائی کے لیے 3 سے 5 دن لگتے ہیں۔'
  },
  {
    id: 'faq-6',
    category: 'WhatsApp & Support',
    question: 'Can I place my order or send measurements directly on WhatsApp?',
    questionUrdu: 'کیا میں واٹس ایپ پر براہ راست آرڈر یا ناپ بھیج سکتا ہوں؟',
    answer: 'Yes! Every product, custom order step, and quotation form has a direct "Order on WhatsApp" button that automatically pre-fills your selected product details, size, and SKU to chat directly with our tailoring manager.',
    answerUrdu: 'جی ہاں! ہر پروڈکٹ کے ساتھ واٹس ایپ کا بٹن موجود ہے جس سے آپ کا آرڈر اور مطلوبہ تفصیلات ہمارے مینیجر تک پہنچ جاتی ہیں۔'
  },
  {
    id: 'faq-7',
    category: 'Exchange Policy',
    question: 'What is your size exchange policy?',
    questionUrdu: 'اگر سائز ٹھیک نہ آئے تو تبدیلی کا کیا طریقہ ہے؟',
    answer: 'Standard unworn and unwashed uniforms can be exchanged for size within 7 days of delivery. For custom made-to-measure orders, our tailoring team provides free fit alterations if there is any deviation from your submitted measurements.',
    answerUrdu: 'اسٹینڈرڈ سائز کی یونیفارم 7 دنوں کے اندر تبدیل کی جا سکتی ہے۔ کسٹم سلائی میں ناپ کے مطابق مفت درستی کی جاتی ہے۔'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    customerName: 'Mrs. Saima Tariq',
    schoolOrBusiness: 'Parent (Beaconhouse School System)',
    city: 'Islamabad',
    review: 'The quality of Oxford cotton shirts and trousers is noticeably superior to local uniform shops. The collar stays crisp even after repeated washes and the custom sleeve length was exact.',
    rating: 5,
    date: 'August 2026'
  },
  {
    id: 't-2',
    customerName: 'Muhammad Rizwan Khan',
    schoolOrBusiness: 'Administrator, City Grammar School',
    city: 'Lahore',
    review: 'We ordered 350 blazers and 700 pairs of trousers for our senior campus. Zain Uniforms delivered five days before our reopen deadline. Stitching consistency across all sizes was flawless.',
    rating: 5,
    date: 'September 2026'
  },
  {
    id: 't-3',
    customerName: 'Dr. Farhan Qureshi',
    schoolOrBusiness: 'Parent (Army Public School & College)',
    city: 'Rawalpindi',
    review: 'Ordered on WhatsApp with custom measurements for both my boys. Received prompt confirmation and tracking ID. Delivery arrived via Leopard Courier in two days. Highly recommended!',
    rating: 5,
    date: 'July 2026'
  }
];

export const INITIAL_POLICIES: Policies = {
  deliveryPolicy: `Zain Uniforms delivers to all major cities and remote districts across Pakistan using premier courier partners (Leopard Courier, TCS, and PostEx).

• Standard In-Stock Orders: Dispatched within 24 to 48 hours. Typical transit time is 2-3 business days for Islamabad, Rawalpindi, Lahore, and Karachi; 3-5 business days for other regional hubs.
• Custom Stitched & Made-to-Measure Orders: Require 3-5 business days of careful pattern drafting, precision cutting, stitching, and pressing before dispatch.
• School & Bulk Institutional Orders: Delivery timelines are established during quotation approval and shipped in protective carton packaging.
• Safe Delivery Guarantee: Every parcel is sealed in tamper-proof protective packaging and tracked live with your registered mobile and WhatsApp number.`,

  returnsPolicy: `We stand behind our Pakistani craftsmanship with our 7-Day Fit Guarantee.

• Standard Sizes: Unworn, unwashed uniforms with original tags and packaging can be exchanged within 7 days of delivery.
• Custom Stitched Uniforms: Because each piece is handcrafted to unique individual measurements, our workshop provides complimentary fit adjustments if there is any manufacturing discrepancy.
• Damaged / Defective Items: If any item arrives damaged or defective, notify us on WhatsApp (03185283067 / 03145357249) within 48 hours for immediate replacement with all courier transit covered by Zain Uniforms.`,

  exchangePolicy: `Size exchanges are straightforward:
1. Message our WhatsApp support (03185283067 / 03145357249) with your Order Number and desired new size.
2. Repack the unworn uniform securely.
3. Our courier will arrange pickup or you can dispatch it directly to our store (koyla center, Shop#2867 Nishter St, Sadiqabad Rawalpindi, 46000).
4. The replacement size is dispatched promptly upon receiving the returned item.`,

  customOrderPolicy: `Every custom uniform is drafted by master tailors with over two decades of school uniform expertise:
• Accurate Measurements: Please follow our visual "How to Measure" guide carefully. When in doubt, note your child's age, height, and build in the order notes or chat with us on WhatsApp.
• Ease Allowance: Our master tailors automatically build 1 to 1.5 inches of comfortable ease into school garments to accommodate active movement and child growth throughout the school year.
• School Design Reproduction: Upload your school's collar style, pocket crest photo, or badge. We will replicate the shade and cut to match official uniform regulations.`,

  wholesalePolicy: `Zain Uniforms operates a high-capacity uniform manufacturing and retail center at koyla center, Shop#2867 Nishter St, Sadiqabad Rawalpindi, 46000.
• Minimum Order Quantity (MOQ): Institutional batch orders start at 25-30 units per SKU.
• Custom Dyeing & Weaving: We source lab-tested uniform twills, tropical poly-viscose, and combed cottons. Custom school tie weaving available for batches of 50+.
• Samples: Physical pre-production samples are supplied for school board review before full volume cutting.
• Timelines: Production schedules are locked in with guaranteed delivery milestones before reopening academic sessions.`,

  privacyPolicy: `Zain Uniforms respects your family's and institution's privacy. We collect customer names, phone numbers, delivery addresses, and uniform measurements strictly to process orders and provide delivery updates via SMS and WhatsApp. We never sell, rent, or distribute your personal details to third parties.`,

  terms: `All orders placed on zainuniforms.pk are subject to product availability and order confirmation. We verify all order requests via phone call or WhatsApp before dispatch to ensure sizing accuracy and on-time delivery.`
};
