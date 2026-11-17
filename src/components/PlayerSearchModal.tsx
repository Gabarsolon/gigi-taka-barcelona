import React, { useState, useEffect, useRef } from 'react';
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

export const PlayerSearchModal: React.FC<PlayerSearchModalProps> = ({
  isOpen,
  onClose,
  rowCriterion,
  colCriterion,
  allPlayers,
  usedPlayerIds,
  onSelectPlayer
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = searchPlayers(query, allPlayers, usedPlayerIds);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-emerald-600/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-800/50 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-gold flex items-center gap-1.5">
              <span>Cerințe Căsuță:</span>
            </div>
            <div className="text-sm sm:text-base font-black text-white flex items-center gap-2 mt-0.5">
              <span className="bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
                {rowCriterion.badge} {rowCriterion.name}
              </span>
              <span className="text-gold font-bold">×</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
                {colCriterion.badge} {colCriterion.name}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playPac();
              onClose();
            }}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/60">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Tastează numele fotbalistului (ex: Hagi, Mutu, Stanciu)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-800/90 border-2 border-slate-700 focus:border-gold text-white placeholder-slate-400 font-semibold outline-none transition shadow-inner"
            />
          </div>
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {query.trim().length === 0 ? (
            <div className="text-center py-10 px-4 text-slate-400">
              <User size={36} className="mx-auto mb-2 opacity-30 text-emerald-400" />
              <p className="text-sm font-semibold">Începe să tastezi pentru a căuta un fotbalist.</p>
              <p className="text-xs text-slate-500 mt-1">
                Poți căuta fotbaliști activi sau retrași din fotbalul românesc.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 px-4 text-slate-400">
              <p className="text-sm font-bold text-red-400">Niciun fotbalist găsit cu acest nume.</p>
              <p className="text-xs text-slate-500 mt-1">
                Verifică dacă ai scris corect sau încearcă alt jucător.
              </p>
            </div>
          ) : (
            results.map(player => (
              <button
                key={player.id}
                onClick={() => {
                  onSelectPlayer(player);
                }}
                className="w-full text-left p-3 rounded-2xl bg-slate-800/70 hover:bg-emerald-950/70 border border-slate-700 hover:border-emerald-500 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700 group-hover:bg-emerald-900 border border-slate-600 group-hover:border-emerald-400 flex items-center justify-center font-black text-sm text-gold shadow">
                    {player.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-black text-white group-hover:text-gold transition">
                      {player.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {player.position || 'Fotbalist'} • {player.nationality === 'RO' ? 'România 🇷🇴' : player.nationality}
                      {player.nationalCaps > 0 && ` • ${player.nationalCaps} selecții`}
                    </div>
                  </div>
                </div>

                {player.isCultHero && (
                  <span className="text-[10px] font-extrabold uppercase bg-gold/20 text-gold px-2 py-0.5 rounded-full border border-gold/30">
                    Cult
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
