import React, { useState } from 'react';
import { Sprout, Mail, Phone, MapPin, ArrowRight, Layout, Check } from 'lucide-react';
import { ActiveTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSwitchToStandaloneLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  onSwitchToStandaloneLogin,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#0a1e0f] text-white pt-16 pb-8 border-t border-emerald-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-900/60">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => setActiveTab('home')}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#68a313] to-[#99de1c] flex items-center justify-center text-[#0e2913]">
                <Sprout className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white group-hover:text-amber-300 transition">
                Local Farmer
              </span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              Empowering sustainable organic farming, clean pasture dairy, and pure soil nutrition across California and beyond.
            </p>

            <div className="pt-2">
              <button
                onClick={onSwitchToStandaloneLogin}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold text-amber-300 flex items-center space-x-2 transition"
              >
                <Layout className="w-4 h-4 text-amber-300" />
                <span>Switch to Glassmorphism Login View (Image 1)</span>
              </button>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-amber-400">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-amber-300 transition">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-amber-300 transition">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('services')} className="hover:text-amber-300 transition">
                  Agricultural Services
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-amber-400">Farm Contact</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#82c419] shrink-0 mt-0.5" />
                <span>742 Evergreen Valley Rd, Salinas, CA 93901</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#82c419] shrink-0" />
                <span>+1 (800) 555-FARMER</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#82c419] shrink-0" />
                <span>support@localfarmer-organic.com</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Eco Newsletter */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-amber-400">Organic Harvest Digest</h4>
            <p className="text-xs text-slate-300">
              Subscribe for weekly harvest schedules and organic living guides.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#168038] hover:bg-[#136e30] rounded-lg text-white transition flex items-center justify-center"
                >
                  {subscribed ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-[#82c419]">Subscribed successfully!</p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Local Farmer Organic Agriculture Inc. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};
