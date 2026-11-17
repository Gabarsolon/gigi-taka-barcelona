import React from 'react';
import { X, Settings, Volume2, VolumeX, Dices, Calendar, Check, Flame, Crown, Star, ShieldAlert } from 'lucide-react';
import { DifficultyLevel } from '../types';
import { sound } from '../utils/soundEngine';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  difficulty: DifficultyLevel;
  onSelectDifficulty: (level: DifficultyLevel) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onGenerateNewGrid: () => void;
  onLoadDailyGrid: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  difficulty,
  onSelectDifficulty,
  soundEnabled,
  onToggleSound,
  onGenerateNewGrid,
  onLoadDailyGrid
}) => {
  if (!isOpen) return null;

  const difficultyOptions: {
    level: DifficultyLevel;
    title: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
    border: string;
    lives: number;
  }[] = [
    {
      level: 'Ușor',
      title: 'Ușor (Începător)',
      desc: 'Doar marile cluburi & Naționala. Minim 3-5 soluții per celulă.',
      icon: <Star size={16} className="text-emerald-400 sm:w-[18px] sm:h-[18px]" />,
      color: 'hover:border-emerald-500',
      border: 'border-emerald-500/80 bg-emerald-950/40',
      lives: 3
    },
    {
      level: 'Mediu',
      title: 'Mediu (Standard)',
      desc: 'Mix echilibrat între Liga 1 și cluburile străine cu români.',
      icon: <Flame size={16} className="text-gold sm:w-[18px] sm:h-[18px]" />,
      color: 'hover:border-gold',
      border: 'border-gold bg-gold/10',
      lives: 3
    },
    {
      level: 'Greu',
      title: 'Greu (Nostalgia)',
      desc: 'Include echipe de legendă: Vaslui, Urziceni, Oțelul, Bistrița.',
      icon: <ShieldAlert size={16} className="text-red-400 sm:w-[18px] sm:h-[18px]" />,
      color: 'hover:border-red-500',
      border: 'border-red-500 bg-red-950/40',
      lives: 3
    },
    {
      level: 'Mod Patron',
      title: 'Mod Patron (Gigi Boss Mode)',
      desc: 'Presiune maximă! Combinații rare și doar 2 vieți (cartonașe)!',
      icon: <Crown size={16} className="text-amber-300 sm:w-[18px] sm:h-[18px]" />,
      color: 'hover:border-purple-400',
      border: 'border-purple-500 bg-gradient-to-r from-purple-950/60 to-indigo-950/60',
      lives: 2
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border-2 border-slate-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="text-gold" size={20} />
            <h2 className="text-lg sm:text-xl font-black text-white">Setări & Dificultate</h2>
          </div>
          <button
            onClick={() => {
              sound.playPac();
              onClose();
            }}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            aria-label="Închide"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section: Difficulty */}
        <div className="my-3 sm:my-4">
          <p className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2">
            Alege Dificultatea Jocului:
          </p>
          <div className="space-y-1.5 sm:space-y-2">
            {difficultyOptions.map(opt => {
              const isSelected = difficulty === opt.level;
              return (
                <button
                  key={opt.level}
                  onClick={() => {
                    sound.playPoc();
                    onSelectDifficulty(opt.level);
                    onClose();
                  }}
                  className={`w-full text-left p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border-2 transition-all flex items-center justify-between gap-2 ${
                    isSelected
                      ? opt.border
                      : 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800 ' + opt.color
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-900/80 border border-slate-700 shrink-0">
                      {opt.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5 flex-wrap">
                        <span>{opt.title}</span>
                        {opt.lives === 2 && (
                          <span className="text-[9px] font-black uppercase bg-red-600/30 text-red-400 px-1.5 py-0.2 rounded border border-red-500/40">
                            2 vieți
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5 leading-snug line-clamp-2">
                        {opt.desc}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gold text-black flex items-center justify-center font-bold shadow shrink-0">
                      <Check size={12} strokeWidth={3} className="sm:w-3.5 sm:h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section: Audio */}
        <div className="my-3 sm:my-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold text-white">Sunete & Efecte Vocale</p>
            <p className="text-[10px] sm:text-xs text-slate-400 truncate">Replicile patronului și fluierul de meci</p>
          </div>
          <button
            onClick={() => {
              sound.playPac();
              onToggleSound();
            }}
            className={`p-2 sm:p-2.5 rounded-xl border transition flex items-center gap-1.5 font-bold text-xs shrink-0 ${
              soundEnabled
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400'
                : 'bg-red-950/60 border-red-500 text-red-400'
            }`}
          >
            {soundEnabled ? (
              <>
                <Volume2 size={15} /> Activat
              </>
            ) : (
              <>
                <VolumeX size={15} /> Oprit
              </>
            )}
          </button>
        </div>

        {/* Section: Grid Actions */}
        <div className="my-3 sm:my-4 pt-3 border-t border-slate-800">
          <p className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2">
            Acțiuni Rapide:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                sound.playPoc();
                onLoadDailyGrid();
                onClose();
              }}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 text-xs font-bold transition active:scale-95"
            >
              <Calendar size={14} className="text-emerald-400" />
              Grila Zilei #1
            </button>

            <button
              onClick={() => {
                sound.playPoc();
                onGenerateNewGrid();
                onClose();
              }}
              className="p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-600 flex items-center justify-center gap-1.5 text-xs font-black shadow-md transition active:scale-95"
            >
              <Dices size={14} className="text-gold" />
              Grilă Nouă
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playPac();
            onClose();
          }}
          className="w-full mt-2 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs sm:text-sm border border-slate-700 transition active:scale-95"
        >
          Închide
        </button>
      </div>
    </div>
  );
};
