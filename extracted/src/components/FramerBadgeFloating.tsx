import React, { useState } from 'react';
import { Sparkles, ExternalLink, X, Layout } from 'lucide-react';

interface FramerBadgeFloatingProps {
  onSwitchToStandaloneLogin: () => void;
}

export const FramerBadgeFloating: React.FC<FramerBadgeFloatingProps> = ({
  onSwitchToStandaloneLogin,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-2 select-none animate-bounce-subtle">
      {isExpanded && (
        <div className="bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 max-w-xs text-xs space-y-3 backdrop-blur-md mb-2">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="font-bold text-amber-400">Ecoland Template Spec</span>
            <button onClick={() => setIsExpanded(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-slate-300">
            Created with pixel precision from the reference screenshots. Features full responsive UI, glassmorphic auth modal, farm shop, and service catalog.
          </p>
          <button
            onClick={onSwitchToStandaloneLogin}
            className="w-full py-2 bg-[#168038] hover:bg-[#136e30] text-white font-bold rounded-xl flex items-center justify-center space-x-1.5 transition"
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Open Img 1 Glass Login</span>
          </button>
        </div>
      )}

      {/* Floating Badge Stack matching Image 2 */}
      <div className="bg-white/95 text-slate-900 border border-slate-200/80 rounded-2xl p-2 shadow-xl backdrop-blur-md flex flex-col space-y-1.5 text-right font-sans text-xs font-semibold">
        <div className="px-2.5 py-0.5 text-[11px] text-slate-500 font-medium">
          Get this <span className="font-bold text-emerald-700">$29</span>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-black text-white hover:bg-slate-800 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1 shadow-md transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Unlock 50+ Templates</span>
        </button>

        <button
          onClick={onSwitchToStandaloneLogin}
          className="text-[10px] text-slate-600 hover:text-emerald-700 flex items-center justify-end space-x-1 pt-0.5 px-1"
        >
          <span>Made in Framer</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
};
