import React from 'react';
import { PhoneCall } from 'lucide-react';

interface GigiBanterProps {
  quote: string;
  mood?: 'happy' | 'angry' | 'thinking';
}

export const GigiBanter: React.FC<GigiBanterProps> = ({ quote, mood = 'happy' }) => {
  const moodBorder =
    mood === 'angry'
      ? 'border-red-500 shadow-red-900/30'
      : mood === 'thinking'
      ? 'border-amber-500 shadow-amber-900/30'
      : 'border-gold shadow-gold/20';

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 my-1 sm:my-2">
      <div className={`relative flex items-center gap-2.5 sm:gap-3 bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 border-2 ${moodBorder} rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-xl backdrop-blur-md`}>
        {/* Gigi Avatar */}
        <div className="relative shrink-0">
          <img
            src={`${import.meta.env.BASE_URL}assets/gigi-taka-barcelona.jpg`}
            alt="Vocea Patronului"
            className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-gold shadow-md"
          />
          <div className="absolute -bottom-1 -right-1 bg-red-600 p-0.5 sm:p-1 rounded-full text-white shadow">
            <PhoneCall size={10} className="animate-bounce sm:w-3 sm:h-3" />
          </div>
        </div>

        {/* Speech Bubble */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-gold">
              Vocea Patronului din Lojă:
            </span>
          </div>
          <p className="text-[11px] sm:text-sm font-bold text-slate-100 italic leading-snug line-clamp-3 sm:line-clamp-none">
            "{quote}"
          </p>
        </div>
      </div>
    </div>
  );
};
