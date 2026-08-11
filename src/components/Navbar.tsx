import React, { useState } from 'react';
import { Sprout, ChevronDown, ArrowRight, User, ShoppingCart, Menu, X, Layout } from 'lucide-react';
import { ActiveTab, UserAuth } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenLogin: () => void;
  onSwitchToStandaloneLogin: () => void;
  userAuth: UserAuth;
  cartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenLogin,
  onSwitchToStandaloneLogin,
  userAuth,
  cartCount,
  onOpenCart,
}) => {
  const [isEssentialOpen, setIsEssentialOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0e2913] text-white shadow-xl border-b border-emerald-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo matching Image 2: Leaf/Sprout + "Local Farmer" */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#68a313] to-[#99de1c] flex items-center justify-center text-[#0e2913] shadow-lg shadow-emerald-950/40 group-hover:scale-105 transition duration-300">
              <Sprout className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white group-hover:text-amber-300 transition duration-300">
              Local Farmer
            </span>
          </div>

          {/* Desktop Nav Links matching Image 2 */}
          <nav className="hidden md:flex items-center space-x-8 text-base font-medium">
            <button
              onClick={() => setActiveTab('home')}
              className={`transition hover:text-amber-400 ${
                activeTab === 'home'
                  ? 'text-amber-400 font-semibold'
                  : 'text-white/90'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`transition hover:text-amber-400 ${
                activeTab === 'about'
                  ? 'text-amber-400 font-semibold'
                  : 'text-white/90'
              }`}
            >
              About Us
            </button>

            <button
              onClick={() => setActiveTab('shop')}
              className={`transition hover:text-amber-400 flex items-center space-x-1.5 ${
                activeTab === 'shop'
                  ? 'text-amber-400 font-semibold'
                  : 'text-white/90'
              }`}
            >
              <span>Plant Care Store</span>
              <span className="text-xs bg-[#82c419] text-[#0e2913] font-bold px-2 py-0.5 rounded-full">
                Shop
              </span>
            </button>

            {/* Dropdown: Essential Pages */}
            <div className="relative">
              <button
                onClick={() => setIsEssentialOpen(!isEssentialOpen)}
                onMouseEnter={() => setIsEssentialOpen(true)}
                className={`flex items-center space-x-1.5 transition hover:text-amber-400 ${
                  activeTab === 'essential' || activeTab === 'services'
                    ? 'text-amber-400 font-semibold'
                    : 'text-white/90'
                }`}
              >
                <span>Essential Pages</span>
                <ChevronDown className="w-4 h-4 opacity-80" />
              </button>

              {isEssentialOpen && (
                <div
                  onMouseLeave={() => setIsEssentialOpen(false)}
                  className="absolute top-full left-0 mt-2 w-60 bg-[#13351a] border border-emerald-700/50 rounded-2xl shadow-2xl py-2 z-50 text-sm animate-fade-in"
                >
                  <button
                    onClick={() => {
                      setActiveTab('shop');
                      setIsEssentialOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-emerald-800/50 text-amber-300 font-semibold transition flex items-center justify-between"
                  >
                    <span>🪴 Plant Care & Products Store</span>
                    <ShoppingCart className="w-4 h-4 text-amber-300" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('services');
                      setIsEssentialOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-emerald-800/50 text-white/90 hover:text-amber-300 transition"
                  >
                    🌱 Agriculture Services
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('about');
                      setIsEssentialOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-emerald-800/50 text-white/90 hover:text-amber-300 transition"
                  >
                    🚜 Our Organic Farm
                  </button>
                  <div className="border-t border-emerald-800/60 my-1"></div>
                  <button
                    onClick={() => {
                      onSwitchToStandaloneLogin();
                      setIsEssentialOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-emerald-800/50 text-amber-300 hover:text-amber-200 transition font-medium flex items-center justify-between"
                  >
                    <span>🔐 Login Screen</span>
                    <Layout className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Right Section Actions matching Image 2 + Login & View Mode switchers */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Shopping Cart Icon Button matching user image */}
            <button
              onClick={() => {
                setActiveTab('shop');
                onOpenCart();
              }}
              title="Open Plant Care Store & Shopping Cart"
              className="relative p-2.5 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-white transition flex items-center justify-center group shadow-md"
            >
              <ShoppingCart className="w-5 h-5 text-white group-hover:scale-110 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0e2913] animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* View Mode Toggle: Standalone Glass Login vs Local Farmer Page */}
            <button
              onClick={onSwitchToStandaloneLogin}
              title="View Standalone Glass Login"
              className="px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-600/40 text-emerald-200 text-xs rounded-full transition flex items-center space-x-1.5"
            >
              <Layout className="w-3.5 h-3.5 text-amber-300" />
              <span>Glass Login Screen</span>
            </button>

            {/* Login User state button */}
            <button
              onClick={onOpenLogin}
              className="flex items-center space-x-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition"
            >
              <User className="w-4 h-4 text-amber-400" />
              <span>{userAuth.isLoggedIn ? userAuth.username : 'Login'}</span>
            </button>

            {/* "Get Started Now →" Button matching Image 2 */}
            <button
              onClick={onOpenLogin}
              className="group flex items-center space-x-3 bg-[#168038] hover:bg-[#136e30] text-white font-medium text-sm pl-5 pr-2 py-2 rounded-full transition shadow-md hover:shadow-emerald-900/50"
            >
              <span>Get Started Now</span>
              <div className="w-7 h-7 rounded-full bg-[#82c419] flex items-center justify-center text-[#0e2913] group-hover:translate-x-0.5 transition">
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => {
                setActiveTab('shop');
                onOpenCart();
              }}
              className="relative p-2 text-white"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-amber-400 text-slate-950 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:text-amber-400"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a1e0f] border-b border-emerald-900 px-4 pt-2 pb-6 space-y-3">
          <button
            onClick={() => {
              setActiveTab('home');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-white font-medium hover:text-amber-400"
          >
            Home
          </button>
          <button
            onClick={() => {
              setActiveTab('about');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-white font-medium hover:text-amber-400"
          >
            About Us
          </button>
          <button
            onClick={() => {
              setActiveTab('services');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-white font-medium hover:text-amber-400"
          >
            Essential Pages & Services
          </button>

          <div className="pt-2 border-t border-emerald-900/60 flex flex-col space-y-2.5">
            <button
              onClick={() => {
                onSwitchToStandaloneLogin();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 bg-emerald-900/80 text-amber-300 rounded-xl text-center text-sm font-semibold border border-emerald-700/50"
            >
              View Image 1 Glassmorphic Login Screen
            </button>
            <button
              onClick={() => {
                onOpenLogin();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-[#168038] text-white rounded-xl text-center font-semibold text-sm flex items-center justify-center space-x-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
