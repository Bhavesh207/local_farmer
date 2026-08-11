import React from 'react';
import { X, Play } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center border border-white/20 transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Embedded Video Player Container */}
        <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center">
          <iframe
            className="w-full h-full"
            src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
            title="Ecoland Farm Tour & Fresh Produce Documentary"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video Caption */}
        <div className="p-5 bg-[#0e2913] text-white flex items-center justify-between">
          <div>
            <h4 className="font-bold text-lg">Ecoland Organic Farm Tour & Harvest Documentary</h4>
            <p className="text-xs text-white/70">Experience chemical-free soil cultivation & pasture dairy farming in high definition.</p>
          </div>
          <div className="bg-[#82c419] text-[#0e2913] text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1">
            <Play className="w-3.5 h-3.5 fill-[#0e2913]" />
            <span>HD 1080p</span>
          </div>
        </div>

      </div>
    </div>
  );
};
