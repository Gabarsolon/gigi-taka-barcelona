import React, { useState, useMemo } from 'react';
import { Player, Criterion } from '../types';
import { searchPlayers } from '../utils/gameLogic';
import { Search, X, User } from 'lucide-react';
import { sound } from '../utils/soundEngine';

interface PlayerSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowCriterion: Criterion;
  colCriterion: Criterion;
  allPlayers: Player[];
  usedPlayerIds: Set<string>;
  onSelectPlayer: (player: Player) => void;
}

export const PlayerSearchModal: React.FC<PlayerSearchModalProps> = React.memo(({
  isOpen,
  onClose,
  rowCriterion,
  colCriterion,
  allPlayers,
  usedPlayerIds,
  onSelectPlayer
}) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    return searchPlayers(query, allPlayers, usedPlayerIds);
  }, [query, allPlayers, usedPlayerIds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-emerald-600/70 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-3 sm:p-4 bg-slate-950 border-b border-emerald-900/60 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider text-gold">
              Cerințe Căsuță:
            </div>
            <div className="text-xs sm:text-base font-black text-white flex flex-wrap items-center gap-1 sm:gap-1.5 mt-0.5">
              <span className="bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700 truncate max-w-[130px] sm:max-w-none">
                {rowCriterion.badge} {rowCriterion.shortName || rowCriterion.name}
              </span>
              <span className="text-gold font-bold">×</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700 truncate max-w-[130px] sm:max-w-none">
                {colCriterion.badge} {colCriterion.shortName || colCriterion.name}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playPac();
              onClose();
            }}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition shrink-0"
            aria-label="Închide"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-900">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none sm:left-3.5 sm:w-5 sm:h-5"
            />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Nume fotbalist (ex: Hagi, Mutu, Stanciu)..."
              className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-slate-800 border-2 border-slate-700 focus:border-gold text-white placeholder-slate-400 font-semibold outline-none transition text-xs sm:text-base"
            />
          </div>
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-1.5 sm:space-y-2">
          {query.trim().length === 0 ? (
            <div className="text-center py-8 sm:py-10 px-4 text-slate-400">
              <User size={32} className="mx-auto mb-2 opacity-30 text-emerald-400 sm:w-9 sm:h-9" />
              <p className="text-xs sm:text-sm font-semibold">Începe să tastezi pentru a căuta un fotbalist.</p>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
                Poți căuta fotbaliști activi sau retrași din fotbalul românesc.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 sm:py-10 px-4 text-slate-400">
              <p className="text-xs sm:text-sm font-bold text-red-400">Niciun fotbalist găsit cu acest nume.</p>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
                Verifică dacă ai scris corect sau încearcă alt jucător.
              </p>
            </div>
          ) : (
            results.map(player => (
              <button
                key={player.id}
                onClick={() => onSelectPlayer(player)}
                className="w-full p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-emerald-500 flex items-center justify-between text-left transition group active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-900 border border-slate-600 flex items-center justify-center text-xs sm:text-sm font-black text-gold group-hover:border-gold transition shrink-0">
                    {player.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-base font-black text-white group-hover:text-gold transition truncate">
                        {player.name}
                      </span>
                      {player.isCultHero && (
                        <span className="text-[8px] sm:text-[9px] font-extrabold uppercase bg-gold/20 text-gold px-1.5 py-0.5 rounded-full border border-gold/30 shrink-0">
                          Cult
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-400 mt-0.5">
                      <span className="text-emerald-400 font-semibold">{player.position}</span>
                      <span>•</span>
                      <span>{player.nationality}</span>
                    </div>

                    <div className="text-[9px] sm:text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-md mt-0.5">
                      Echipe: {player.clubs.slice(0, 3).join(', ')}
                      {player.clubs.length > 3 ? ` + încă ${player.clubs.length - 3}` : ''}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-2">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 group-hover:text-emerald-400 transition bg-slate-900 px-2 py-1 rounded-lg border border-slate-700 group-hover:border-emerald-600">
                    Selectează
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
});
