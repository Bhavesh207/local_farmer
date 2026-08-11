import React from 'react';
import { ArrowUpRight, Play, CheckCircle } from 'lucide-react';
import { IMAGES } from '../constants/data';

interface YellowBannerProps {
  onOpenVideoModal: () => void;
  onReviewsClick: () => void;
}

export const YellowBanner: React.FC<YellowBannerProps> = ({
  onOpenVideoModal,
  onReviewsClick,
}) => {
  return (
    <section className="relative bg-[#f8c300] text-[#0e2913] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-inner border-b border-amber-500/30">
      
      {/* Background vegetable line art pattern SVG watermark */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#0e2913_1px,transparent_1px)] [background-size:16px_16px]">
        <svg
          className="w-full h-full text-[#0e2913]"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          fill="none"
        >
          <pattern
            id="veggies"
            x="0"
            y="0"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M30 20 C20 40 40 60 30 80 M70 10 C90 30 80 70 90 90 M10 100 Q 50 120 90 100"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#veggies)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Block 1: 100K+ Client With Positive Reviews + Avatars */}
          <div
            onClick={onReviewsClick}
            className="flex items-center space-x-4 cursor-pointer group bg-amber-400/30 hover:bg-amber-400/50 p-3 rounded-2xl transition border border-black/5"
          >
            <div className="flex -space-x-3 overflow-hidden shrink-0">
              <img
                src={IMAGES.avatar1}
                alt="Client review avatar 1"
                referrerPolicy="no-referrer"
                className="inline-block h-12 w-12 rounded-full ring-2 ring-[#f8c300] object-cover"
              />
              <img
                src={IMAGES.avatar2}
                alt="Client review avatar 2"
                referrerPolicy="no-referrer"
                className="inline-block h-12 w-12 rounded-full ring-2 ring-[#f8c300] object-cover"
              />
              <img
                src={IMAGES.avatar3}
                alt="Client review avatar 3"
                referrerPolicy="no-referrer"
                className="inline-block h-12 w-12 rounded-full ring-2 ring-[#f8c300] object-cover"
              />
            </div>
            <div>
              <p className="text-xl font-black text-[#0e2913] leading-tight group-hover:text-emerald-900 transition">
                100K+ Client With <br />
                Positive Reviews
              </p>
              <div className="flex items-center space-x-1 text-xs font-semibold text-emerald-900 mt-1">
                <CheckCircle className="w-3.5 h-3.5 fill-emerald-800 text-amber-300" />
                <span>4.9/5 Verified Ratings</span>
              </div>
            </div>
          </div>

          {/* Block 2: Center Stamp Badge "Vegetables • Agro • Organic • Farming" */}
          <div className="flex justify-center items-center py-2">
            <div className="relative w-28 h-28 flex items-center justify-center group cursor-pointer">
              
              {/* Outer spinning text badge ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#0e2913]/60 animate-[spin_20s_linear_infinite] group-hover:border-[#168038]">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <path
                    id="circlePath"
                    d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                    fill="none"
                  />
                  <text className="text-[9px] font-bold uppercase fill-[#0e2913] tracking-widest">
                    <textPath href="#circlePath">
                      • Vegetables • Agro • Organic • Farming
                    </textPath>
                  </text>
                </svg>
              </div>

              {/* Inner Green Circle with Diagonal Arrow matching Image 2 */}
              <div className="w-14 h-14 bg-[#168038] text-white rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-45 transition duration-300">
                <ArrowUpRight className="w-7 h-7 stroke-[2.5]" />
              </div>

            </div>
          </div>

          {/* Block 3: "Healthy Life With Fresh Products" */}
          <div className="flex items-center justify-between md:justify-end space-x-4">
            <div className="text-left md:text-right">
              <h3 className="text-xl font-black text-[#0e2913] leading-tight">
                Healthy Life With <br />
                Fresh Products
              </h3>
              <p className="text-xs font-semibold text-[#0e2913]/80 mt-1">
                100% Certified Organic Agriculture
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
