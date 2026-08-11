import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { YellowBanner } from './components/YellowBanner';
import { ServicesSection } from './components/ServicesSection';
import { AboutUsSection } from './components/AboutUsSection';
import { ShopSection } from './components/ShopSection';
import { GlassmorphicLoginModal } from './components/GlassmorphicLoginModal';
import { VideoModal } from './components/VideoModal';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';

import { ActiveTab, CartItem, ProductItem, ServiceItem, UserAuth, ViewMode } from './types';
import { Layout, Sparkles, Sprout } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('login_standalone');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [userAuth, setUserAuth] = useState<UserAuth>({
    username: '',
    isLoggedIn: false,
  });

  // Cart operations
  const handleAddToCart = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Enforce mandatory login on initial load and when not authenticated
  if (viewMode === 'login_standalone' || !userAuth.isLoggedIn) {
    return (
      <GlassmorphicLoginModal
        isOpen={true}
        isStandalone={true}
        onLoginSuccess={(username) => {
          setUserAuth({ username, isLoggedIn: true });
          setViewMode('ecoland');
        }}
      />
    );
  }

  // Else rendering full Ecoland Webpage (Image 2)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-[#0e2913] font-sans antialiased selection:bg-[#82c419] selection:text-[#0e2913]">
      
      {/* Top Interactive Switch Banner */}
      <div className="bg-[#0b1e0f] border-b border-emerald-900/80 text-white text-xs py-2 px-4 flex items-center justify-between z-50">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#82c419] animate-pulse" />
          <span className="font-semibold text-emerald-200">
            Local Farmer Agriculture Platform
          </span>
          <span className="text-emerald-500 hidden sm:inline">•</span>
          <span className="text-slate-300 hidden sm:inline">
            Extracted components from reference screenshots
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode('login_standalone')}
            className="px-3 py-1 bg-[#168038] hover:bg-[#136e30] text-amber-300 rounded-full font-bold transition flex items-center space-x-1.5 shadow-sm"
          >
            <Layout className="w-3.5 h-3.5" />
            <span>View Image 1 Glass Login</span>
          </button>
        </div>
      </div>

      {/* Navbar Header matching Image 2 */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onSwitchToStandaloneLogin={() => setViewMode('login_standalone')}
        userAuth={userAuth}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Page Body depending on activeTab */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            {/* Hero Section matching Image 2 */}
            <Hero
              onDiscoverMore={() => setActiveTab('about')}
              onSeeAllServices={() => setActiveTab('services')}
            />

            {/* Yellow Banner Section matching Image 2 */}
            <YellowBanner
              onOpenVideoModal={() => setIsVideoModalOpen(true)}
              onReviewsClick={() => setActiveTab('about')}
            />

            {/* Services Section matching Image 2 */}
            <ServicesSection
              onSelectService={(service) => setSelectedService(service)}
            />

            {/* About Us Section */}
            <AboutUsSection />
          </>
        )}

        {activeTab === 'about' && (
          <div>
            <div className="bg-[#0e2913] text-white py-12 px-4 text-center">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border border-emerald-700 bg-emerald-950/60 text-amber-300 text-xs font-bold mb-3">
                <Sprout className="w-4 h-4" />
                <span>Our Heritage</span>
              </div>
              <h1 className="text-4xl font-black mb-2">About Local Farmer Organic</h1>
              <p className="text-slate-300 text-sm max-w-xl mx-auto">
                Dedicated to regenerative soil stewardship and organic fresh produce since 2012.
              </p>
            </div>
            <AboutUsSection />
          </div>
        )}

        {activeTab === 'services' && (
          <div>
            <div className="bg-[#0e2913] text-white py-12 px-4 text-center">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border border-emerald-700 bg-emerald-950/60 text-amber-300 text-xs font-bold mb-3">
                <Sparkles className="w-4 h-4" />
                <span>Eco & Agriculture Services</span>
              </div>
              <h1 className="text-4xl font-black mb-2">Agricultural Solutions</h1>
              <p className="text-slate-300 text-sm max-w-xl mx-auto">
                Explore our full suite of certified soil enhancement, crop consulting, and pasture dairy programs.
              </p>
            </div>
            <ServicesSection
              onSelectService={(service) => setSelectedService(service)}
            />
          </div>
        )}

        {activeTab === 'essential' && (
          <div>
            <div className="bg-[#0e2913] text-white py-12 px-4 text-center">
              <h1 className="text-4xl font-black mb-2">Essential Pages & Tools</h1>
              <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6">
                Access Ecoland platform modules, user authentication, and agricultural calculators.
              </p>
              <button
                onClick={() => setViewMode('login_standalone')}
                className="px-6 py-3 bg-[#168038] hover:bg-[#136e30] text-white font-bold rounded-2xl shadow-lg transition"
              >
                Open Glassmorphism Login Reference Screen
              </button>
            </div>
            <ServicesSection
              onSelectService={(service) => setSelectedService(service)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onSwitchToStandaloneLogin={() => setViewMode('login_standalone')}
      />

      {/* Glassmorphic Login Modal Overlay */}
      <GlassmorphicLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        isStandalone={false}
        onLoginSuccess={(username) => {
          setUserAuth({ username, isLoggedIn: true });
          setIsLoginModalOpen(false);
        }}
      />

      {/* Video Popup Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />

      {/* Service Assessment Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onOpenVideoModal={() => setIsVideoModalOpen(true)}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

    </div>
  );
}
