import React, { useState } from 'react';
import { Sprout, ShieldCheck, Sun, Droplets, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { IMAGES } from '../constants/data';

export const AboutUsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mission' | 'values' | 'sustainability'>('mission');

  return (
    <section className="py-16 sm:py-24 bg-white text-[#0e2913] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Side Images Collage */}
          <div className="relative">
            <div className="relative z-10 rounded-[32px] overflow-hidden shadow-2xl border-4 border-slate-100">
              <img
                src={IMAGES.consultingField}
                alt="Ecoland organic farm land"
                referrerPolicy="no-referrer"
                className="w-full h-[400px] sm:h-[480px] object-cover"
              />
            </div>

            {/* Overlapping Floating Stat Box */}
            <div className="absolute -bottom-8 -right-4 sm:bottom-6 sm:right-6 z-20 bg-[#0e2913] text-white p-6 rounded-3xl shadow-2xl border border-emerald-700/50 max-w-xs">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#82c419] flex items-center justify-center text-[#0e2913]">
                  <Award className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-2xl font-black text-amber-300">100% Certified</p>
                  <p className="text-xs text-white/80">Organic USDA & CCOF</p>
                </div>
              </div>
              <p className="text-xs text-white/80 font-normal">
                Strict adherence to soil micro-flora preservation and non-GMO agricultural standards.
              </p>
            </div>
          </div>

          {/* Right Side Content */}
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-emerald-800/30 bg-emerald-50 text-[#0e2913] font-medium text-xs sm:text-sm mb-4">
              <Sprout className="w-4 h-4 text-emerald-700" />
              <span>About Local Farmer Organic</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0e2913] tracking-tight mb-6">
              Leading the Future of Sustainable & Pure Local Agriculture
            </h2>

            <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed mb-8">
              Founded with a passion for living soil and chemical-free nutrition, Local Farmer integrates time-honored regenerative farming techniques with cutting-edge moisture and soil microbial monitoring.
            </p>

            {/* Sub Nav Tabs */}
            <div className="flex border-b border-slate-200 mb-6">
              <button
                onClick={() => setActiveTab('mission')}
                className={`pb-3 pr-6 text-sm sm:text-base font-bold transition border-b-2 ${
                  activeTab === 'mission'
                    ? 'border-[#168038] text-[#168038]'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Our Mission
              </button>
              <button
                onClick={() => setActiveTab('values')}
                className={`pb-3 px-6 text-sm sm:text-base font-bold transition border-b-2 ${
                  activeTab === 'values'
                    ? 'border-[#168038] text-[#168038]'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Core Values
              </button>
              <button
                onClick={() => setActiveTab('sustainability')}
                className={`pb-3 px-6 text-sm sm:text-base font-bold transition border-b-2 ${
                  activeTab === 'sustainability'
                    ? 'border-[#168038] text-[#168038]'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Sustainability
              </button>
            </div>

            {/* Tab Content Panels */}
            {activeTab === 'mission' && (
              <ul className="space-y-3 mb-8">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#168038] shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium text-sm sm:text-base">
                    Eliminate all chemical fertilizers, synthetic insecticides, and toxic runoff.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#168038] shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium text-sm sm:text-base">
                    Empower local family farms with high-efficiency soil restoration formulas.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#168038] shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium text-sm sm:text-base">
                    Deliver field-fresh produce within 24 hours of harvest to preserve enzyme vitality.
                  </span>
                </li>
              </ul>
            )}

            {activeTab === 'values' && (
              <ul className="space-y-3 mb-8">
                <li className="flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-[#168038] shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium text-sm sm:text-base">
                    Transparency: Full traceability from seed origins to retail packaging.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <Sun className="w-5 h-5 text-[#168038] shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium text-sm sm:text-base">
                    Solar Energy: 100% renewable powered greenhouses and cold storages.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <Droplets className="w-5 h-5 text-[#168038] shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium text-sm sm:text-base">
                    Water Stewardship: Advanced rainwater harvesting and micro-drip irrigation.
                  </span>
                </li>
              </ul>
            )}

            {activeTab === 'sustainability' && (
              <ul className="space-y-3 mb-8">
                <li className="flex items-start space-x-3">
                  <Sprout className="w-5 h-5 text-[#168038] shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium text-sm sm:text-base">
                    Regenerative grazing that sequester carbon deep into pasture soils.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <Sprout className="w-5 h-5 text-[#168038] shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium text-sm sm:text-base">
                    Zero single-use plastics: Glass milk bottles & compostable produce totes.
                  </span>
                </li>
              </ul>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
