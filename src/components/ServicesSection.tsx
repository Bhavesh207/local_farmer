import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight, Sprout, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import { SERVICES_DATA } from '../constants/data';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const [viewAll, setViewAll] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [filterTag, setFilterTag] = useState<string>('all');
  const itemsPerPage = 3;

  const filterOptions = [
    { id: 'all', label: 'All Smart Services' },
    { id: 'mandi-price', label: 'Mandi Price' },
    { id: 'crop-calendar', label: 'Crop Calendar' },
    { id: 'crop-disease', label: 'Disease Finder' },
    { id: 'profit-calculator', label: 'Profit Calculator' },
    { id: 'government-schemes', label: 'Govt Schemes' },
    { id: 'human-expertise', label: 'Human Expertise' },
    { id: 'emergency-alerts', label: 'Emergency Alerts' },
  ];

  const filteredServices = filterTag === 'all'
    ? SERVICES_DATA
    : SERVICES_DATA.filter((s) => s.id === filterTag);

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % filteredServices.length);
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + filteredServices.length) % filteredServices.length);
  };

  // Visible items when in carousel mode
  const visibleServices = [];
  if (!viewAll && filteredServices.length > 0) {
    for (let i = 0; i < Math.min(itemsPerPage, filteredServices.length); i++) {
      const idx = (startIndex + i) % filteredServices.length;
      visibleServices.push(filteredServices[idx]);
    }
  } else {
    visibleServices.push(...filteredServices);
  }

  return (
    <section id="services-section" className="py-16 lg:py-24 bg-slate-50 text-[#0e2913] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          
          <div>
            {/* Sub-badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-emerald-800/30 bg-emerald-100/60 text-[#0e2913] font-medium text-xs sm:text-sm mb-4">
              <Sprout className="w-4 h-4 text-emerald-700" />
              <span>Smart Agriculture Platform</span>
              <span className="text-emerald-500">•</span>
              <span>Farmer Tools & Advisory</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0e2913] tracking-tight">
              Essential Farmer Services & Smart Tools
            </h2>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3 mt-6 md:mt-0">
            <button
              onClick={() => setViewAll(!viewAll)}
              className="px-4 py-2.5 rounded-full bg-emerald-900/10 hover:bg-emerald-900/20 text-[#0e2913] font-bold text-xs sm:text-sm flex items-center space-x-2 border border-emerald-800/30 transition"
            >
              <LayoutGrid className="w-4 h-4 text-emerald-700" />
              <span>{viewAll ? 'Carousel View' : 'View All Services'}</span>
            </button>

            {!viewAll && filteredServices.length > 3 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full bg-[#0e2913] hover:bg-[#168038] text-white flex items-center justify-center transition shadow-md active:scale-95"
                  title="Previous"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full bg-[#0e2913] hover:bg-[#168038] text-white flex items-center justify-center transition shadow-md active:scale-95"
                  title="Next"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Filter Chips Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                setFilterTag(opt.id);
                setStartIndex(0);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition border ${
                filterTag === opt.id
                  ? 'bg-[#0e2913] text-amber-300 border-[#0e2913] shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-600 hover:text-[#0e2913]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Services Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleServices.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="group bg-[#0e2913] text-white rounded-[28px] p-5 shadow-xl hover:shadow-2xl transition duration-300 flex flex-col justify-between cursor-pointer border border-emerald-800/40 hover:border-emerald-500/50 transform hover:-translate-y-1.5"
            >
              <div>
                {/* Card Top Image Container with Tailored Unique Photo */}
                <div className="relative h-56 sm:h-60 rounded-2xl overflow-hidden mb-6 bg-slate-800">
                  <img
                    src={service.image}
                    alt={service.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e2913]/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition duration-300" />
                  
                  {service.isComingSoon && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-lg flex items-center space-x-1">
                      <span>✦ Coming Soon</span>
                    </div>
                  )}
                </div>

                {/* Tag Badge pill */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="inline-block px-3.5 py-1 rounded-full border border-emerald-500/40 bg-emerald-950/60 text-emerald-300 text-xs font-semibold">
                    {service.tag}
                  </div>
                  {service.isComingSoon && (
                    <span className="text-[11px] text-amber-300 font-bold bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                      In Development
                    </span>
                  )}
                </div>

                {/* Card Title */}
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-300 transition">
                  {service.title}
                </h3>

                {/* Card Description */}
                <p className="text-white/80 text-sm font-normal leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              {/* Card Footer Action */}
              <div className="pt-4 border-t border-emerald-800/60 flex items-center justify-between text-xs font-semibold text-emerald-300 group-hover:text-amber-300">
                <span>{service.isComingSoon ? 'Coming Soon • View Program Details' : 'View Full Program & Details'}</span>
                <div className="w-8 h-8 rounded-full bg-emerald-800/60 group-hover:bg-[#82c419] group-hover:text-[#0e2913] flex items-center justify-center transition">
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

