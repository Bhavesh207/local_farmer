import React from 'react';
import { ArrowRight, Sprout, ChevronRight } from 'lucide-react';
import { IMAGES } from '../constants/data';

interface HeroProps {
  onDiscoverMore: () => void;
  onSeeAllServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onDiscoverMore, onSeeAllServices }) => {
  return (
    <section className="relative bg-[#0e2913] text-white overflow-hidden">
      {/* Background container layout with tractor image */}
      <div className="relative min-h-[560px] lg:min-h-[640px] flex items-center">
        
        {/* Right side tractor image background with gradient blend */}
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGES.heroTractorImg}
            alt="Organic farming tractor in field"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center brightness-90 contrast-105"
          />
          {/* Left-to-right dark green overlay gradient matching Image 2 layout */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e2913] via-[#0e2913]/85 to-transparent md:w-3/4 lg:w-2/3" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e2913] via-transparent to-black/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
          <div className="max-w-2xl">
            
            {/* Pill Badge matching Image 2: "We are Producing Natural Products" */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#82c419]/60 bg-[#0e2913]/80 backdrop-blur-md mb-6 text-xs sm:text-sm font-medium text-emerald-200 shadow-lg">
              <Sprout className="w-4 h-4 text-[#82c419]" />
              <span>We are Producing Natural Products</span>
            </div>

            {/* Main Headline matching Image 2: "Organic Farming and Agriculture" */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] mb-6">
              Organic Farming <br />
              <span className="text-white">and Agriculture</span>
            </h1>

            {/* Paragraph matching Image 2 */}
            <p className="text-white/85 text-base sm:text-lg font-normal leading-relaxed mb-8 max-w-xl">
              A successful middle-sized farm may generate gross revenue in the range of
              <span className="font-semibold text-amber-300"> ₹50 Lakhs to ₹5 Crore</span> annually,
              depending on the scale and type of operations.
            </p>

            {/* Hero Action Buttons matching Image 2 */}
            <div className="flex flex-wrap items-center gap-4">
              
              {/* Button 1: "Discover More →" */}
              <button
                onClick={onDiscoverMore}
                className="group inline-flex items-center space-x-3 bg-[#168038] hover:bg-[#136e30] text-white font-semibold text-base pl-6 pr-2.5 py-3 rounded-full transition shadow-xl hover:shadow-emerald-900/60 transform active:scale-[0.98]"
              >
                <span>Discover More</span>
                <div className="w-8 h-8 rounded-full bg-[#82c419] flex items-center justify-center text-[#0e2913] group-hover:translate-x-0.5 transition">
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </button>

              {/* Button 2: "See All Service →" */}
              <button
                onClick={onSeeAllServices}
                className="group inline-flex items-center space-x-3 border-2 border-white/40 hover:border-white bg-[#0e2913]/60 hover:bg-[#0e2913]/90 text-white font-semibold text-base pl-6 pr-2.5 py-3 rounded-full transition backdrop-blur-md"
              >
                <span>See All Service</span>
                <div className="w-8 h-8 rounded-full border border-white/60 bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#0e2913] transition">
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </button>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
