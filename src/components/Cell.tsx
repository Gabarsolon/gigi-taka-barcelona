import React from 'react';
import { Player } from '../types';
import { Check, Plus } from 'lucide-react';

interface CellProps {
  player: Player | null;
  isSelected: boolean;
  isError: boolean;
  onClick: () => void;
  disabled: boolean;
}

export const Cell: React.FC<CellProps> = React.memo(({
  player,
  isSelected,
  isError,
  onClick,
  disabled
}) => {
  if (player) {
    return (
      <div
        className="w-full h-full min-h-[72px] sm:min-h-[105px] md:min-h-[125px] rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-900/90 to-emerald-950/90 border sm:border-2 border-emerald-400/80 p-1 sm:p-3 flex flex-col justify-between items-center text-center shadow-lg shadow-emerald-950/50 relative overflow-hidden transition-all duration-300 transform scale-100 animate-in fade-in zoom-in-95"
      >
        <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 bg-emerald-500 text-black p-0.5 rounded-full shadow">
          <Check size={10} strokeWidth={3} className="sm:w-3 sm:h-3" />
        </div>

        {/* Player Initials Circle */}
        <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-slate-800 border border-emerald-400/40 flex items-center justify-center text-[9px] sm:text-sm font-black text-gold shadow-inner mt-0.5 sm:mt-1 shrink-0">
          {player.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .slice(0, 2)}
        </div>

        {/* Player Name & Position */}
        <div className="w-full my-auto px-0.5">
          <p className="text-[10px] sm:text-sm font-black text-white leading-tight line-clamp-2">
            {player.name}
          </p>
          <p className="text-[8px] sm:text-xs text-emerald-300 font-medium leading-none mt-0.5 hidden sm:block">
            {player.position || 'Fotbalist'}
          </p>
        </div>

        {player.isCultHero && (
          <span className="text-[7.5px] sm:text-[9px] font-extrabold uppercase bg-gold/20 text-gold px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded-full border border-gold/30 truncate max-w-full leading-none shrink-0">
            <span className="sm:hidden">Cult</span>
            <span className="hidden sm:inline">Legendă Cult</span>
          </span>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full h-full min-h-[72px] sm:min-h-[105px] md:min-h-[125px] rounded-lg sm:rounded-xl p-1 sm:p-3 flex flex-col items-center justify-center text-center transition-all duration-200 border sm:border-2 select-none group relative overflow-hidden ${
        isError
          ? 'bg-red-950/60 border-red-500 animate-shake'
          : isSelected
          ? 'bg-emerald-800/40 border-gold shadow-lg shadow-gold/20 scale-[1.02]'
          : 'bg-pitch-light/40 hover:bg-pitch-light/70 border-emerald-800/50 hover:border-emerald-600/80 active:scale-95'
      }`}
    >
      <div className={`p-1 sm:p-2 rounded-full transition-all duration-200 ${
        isSelected ? 'bg-gold text-black shadow-md' : 'bg-slate-800/60 text-slate-400 group-hover:text-emerald-300 group-hover:bg-slate-800'
      }`}>
        <Plus size={15} strokeWidth={2.5} className="sm:w-[18px] sm:h-[18px]" />
      </div>
      <span className="text-[9px] sm:text-[11px] font-semibold text-slate-400 group-hover:text-slate-200 mt-0.5 sm:mt-1 leading-none">
        <span className="sm:hidden">Alege</span>
        <span className="hidden sm:inline">Alege fotbalist</span>
      </span>
    </button>
  );
});
