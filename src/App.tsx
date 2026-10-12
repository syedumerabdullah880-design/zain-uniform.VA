import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { CategoryGrid } from './components/CategoryGrid';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CustomUniforms } from './components/CustomUniforms';
import { SchoolWholesale } from './components/SchoolWholesale';
import { SizeGuidePage } from './components/SizeGuidePage';
import { ManufacturingShowcase } from './components/ManufacturingShowcase';
import { DeliverySection } from './components/DeliverySection';
import { OrderTracking } from './components/OrderTracking';
import { UniformsAndSportswearSection } from './components/UniformsAndSportswearSection';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderReceiptModal } from './components/OrderReceiptModal';
import { AdminDashboard } from './components/AdminDashboard';
import { FaqSection } from './components/FaqSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { PoliciesModal } from './components/PoliciesModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { ShopCatalog } from './components/ShopCatalog';
import { BusinessProfileModal } from './components/BusinessProfileModal';
import { Product, Order, UniformCategory } from './types';
import { ArrowRight, Scissors, Building2, MessageCircle, Sparkles, CheckCircle2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { products, language, getWhatsAppLink, settings } = useStore();

  // Navigation State
  const [activeView, setActiveView] = useState<'home' | 'shop' | 'custom' | 'wholesale' | 'track' | 'size-guide'>('home');
  const [selectedCategory, setSelectedCategory] = useState<UniformCategory | 'All'>('All');

  // Modals & Drawers
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [policiesModalTab, setPoliciesModalTab] = useState<string | null>(null);

  const navigateToSizeGuide = () => {
    setActiveView('size-guide');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick category selection from homepage
  const handleSelectCategoryFromHome = (cat: UniformCategory) => {
    setSelectedCategory(cat);
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const popularProducts = products.filter(p => p.featured).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={(v) => {
          setActiveView(v as any);
          if (v === 'shop') setSelectedCategory('All');
        }}
        openSearch={() => {
          setActiveView('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openSizeGuide={navigateToSizeGuide}
        openAdmin={() => setIsAdminOpen(true)}
        openProfile={() => setIsProfileOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {/* VIEW 1: HOME PAGE */}
        {activeView === 'home' && (
          <div>
            {/* 1. Hero Section */}
            <Hero
              onShopClick={() => {
                setActiveView('shop');
                setSelectedCategory('All');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onCustomClick={() => {
                setActiveView('custom');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBulkClick={() => {
                setActiveView('wholesale');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 2. Trust Bar */}
            <TrustBar />

            {/* 3. Shop Categories */}
            <CategoryGrid onSelectCategory={handleSelectCategoryFromHome} />

            {/* 4. Best Sellers / Popular School Uniforms */}
            <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0F1E36] tracking-wider uppercase mb-1">
                      <span>Most Requested</span>
                      <span aria-hidden="true">·</span>
                      <span>Ready to Wear & Custom</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1E36]">
                      {language === 'ur' ? 'سب سے زیادہ مقبول یونیفارمز' : 'Popular School Uniforms'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Engineered for durability, comfort, and standard Pakistani school regulations.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveView('shop');
                      setSelectedCategory('All');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F1E36] hover:text-[#C5A869] transition-colors cursor-pointer"
                  >
                    <span>View Entire Catalog ({products.length} Items)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {popularProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={p => setActiveProduct(p)}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* 5. Custom Uniform CTA */}
            <section className="py-14 bg-[#0F1E36] text-white border-b border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-r from-slate-900 via-[#13233D] to-slate-900 rounded-2xl p-8 sm:p-12 border border-slate-700/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-3 max-w-xl">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#C5A869] tracking-wider uppercase">
                      <Scissors className="w-4 h-4" />
                      <span>Custom Stitching Service</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                      Designed Around Your School. Stitched Around Your Measurements.
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Need custom collar designs, school monogram embroidery, or non-standard sleeve/waist measurements? Our master tailors cut and stitch bespoke school uniforms.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                    <button
                      onClick={() => {
                        setActiveView('custom');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full sm:w-auto px-6 py-3 bg-[#C5A869] hover:bg-[#d8bd81] text-[#0F1E36] rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm text-center"
                    >
                      Start Custom Order (6 Steps)
                    </button>
                    <button
                      onClick={navigateToSizeGuide}
                      className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors cursor-pointer text-center"
                    >
                      Size Guide & Matrix
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Manufacturing Showcase ("From Fabric to Finished Uniform") */}
            <ManufacturingShowcase />

            {/* 7. School & Wholesale CTA */}
            <section className="py-14 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="space-y-3 max-w-2xl">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F1E36] tracking-wider uppercase">
                      <Building2 className="w-4 h-4 text-[#C5A869]" />
                      <span>Institutional Supply</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1E36]">
                      School Administrations, Campuses & Uniform Retailers
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Zain Uniforms supplies complete uniform inventories for pre-schools, secondary campuses, cadet colleges, and uniform store chains with volume tiered discounts and guaranteed reopen deadlines.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-700 pt-1">
                      <span>✓ Pre-production samples</span>
                      <span>✓ Custom jacquard ties & crests</span>
                      <span>✓ Carton bulk dispatch</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        setActiveView('wholesale');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-6 py-3 bg-[#0F1E36] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      Request Wholesale Quote
                    </button>
                    <a
                      href={getWhatsAppLink('Salam Zain Uniforms! I represent a school and would like to discuss wholesale uniform manufacturing.')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp B2B Rep</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* 7.5 Uniforms & Sportswear Section */}
            <UniformsAndSportswearSection
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setActiveView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewProduct={(p) => setActiveProduct(p)}
            />

            {/* 8. Why Choose Zain Uniforms & Social Proof */}
            <TestimonialsSection />

            {/* 9. Pakistan-Wide Delivery */}
            <DeliverySection />

            {/* 10. FAQ */}
            <FaqSection />

            {/* 11. Final WhatsApp CTA Strip */}
            <section className="py-14 bg-[#0F1E36] text-white">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Need Help Choosing Your Child's School Uniform?
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                  Our Rawalpindi tailoring team is available on WhatsApp and phone to guide you on sizing, school fabric requirements, and order status.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={getWhatsAppLink('Assalam-o-Alaikum Zain Uniforms! I need help with school uniform sizing.', settings.whatsappNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm font-mono"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp: {settings.phone}</span>
                  </a>
                  <a
                    href={getWhatsAppLink('Assalam-o-Alaikum Zain Uniforms! I need help with school uniform sizing.', settings.whatsappNumber2 || '923145357249')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm font-mono"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp: {settings.phone2 || '03145357249'}</span>
                  </a>
                  <button
                    onClick={() => {
                      setActiveView('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 cursor-pointer"
                  >
                    Browse Uniform Catalog
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: SHOP CATALOG */}
        {activeView === 'shop' && (
          <ShopCatalog
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onViewProduct={p => setActiveProduct(p)}
          />
        )}

        {/* VIEW 3: CUSTOM UNIFORMS */}
        {activeView === 'custom' && (
          <CustomUniforms onOpenSizeGuide={navigateToSizeGuide} />
        )}

        {/* VIEW 4: SCHOOL & WHOLESALE */}
        {activeView === 'wholesale' && <SchoolWholesale />}

        {/* VIEW 5: ORDER TRACKING */}
        {activeView === 'track' && <OrderTracking />}

        {/* VIEW 6: SIZE GUIDE */}
        {activeView === 'size-guide' && <SizeGuidePage />}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(v) => {
          setActiveView(v as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onFilterCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveView('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPolicies={(tab) => setPoliciesModalTab(tab)}
        onOpenSizeGuide={navigateToSizeGuide}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />

      {/* MODALS & DRAWERS */}
      {/* 1. Product Detail Modal */}
      <ProductModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onOpenSizeGuide={navigateToSizeGuide}
        onBuyNow={() => {
          setActiveProduct(null);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 2. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(order) => setConfirmedOrder(order)}
      />

      {/* 3. Order Confirmation Receipt Modal */}
      <OrderReceiptModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onTrackOrder={(orderNumber) => {
          setConfirmedOrder(null);
          setActiveView('track');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 4. Admin Management Portal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onViewOrderReceipt={(order) => {
          setIsAdminOpen(false);
          setConfirmedOrder(order);
        }}
      />

      {/* 5. Policies Modal */}
      <PoliciesModal
        isOpen={policiesModalTab !== null}
        initialTab={policiesModalTab || 'delivery'}
        onClose={() => setPoliciesModalTab(null)}
      />

      {/* 6. Official Business Profile Modal */}
      <BusinessProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onNavigate={(v) => {
          setIsProfileOpen(false);
          setActiveView(v as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
