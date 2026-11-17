import React from 'react';
import { Volume2, VolumeX, HelpCircle, RotateCcw, Flame, Settings } from 'lucide-react';
import { DifficultyLevel } from '../types';
import { sound } from '../utils/soundEngine';

interface HeaderProps {
  score: number;
  lives: number;
  maxLives: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHelp: () => void;
  onOpenSettings: () => void;
  onReset: () => void;
  puzzleTitle: string;
  difficulty: DifficultyLevel;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  lives,
  maxLives,
  soundEnabled,
  onToggleSound,
  onOpenHelp,
  onOpenSettings,
  onReset,
  puzzleTitle,
  difficulty
}) => {
  const difficultyBadge =
    difficulty === 'Mod Patron' ? (
      <span className="bg-gradient-to-r from-purple-700 to-indigo-700 text-gold border border-gold/40 px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg text-[9px] sm:text-xs font-black shadow cursor-pointer whitespace-nowrap">
        👑 Mod Patron
      </span>
    ) : difficulty === 'Greu' ? (
      <span className="bg-red-800 text-white border border-red-600 px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg text-[9px] sm:text-xs font-black shadow cursor-pointer whitespace-nowrap">
        🔥 Greu
      </span>
    ) : difficulty === 'Ușor' ? (
      <span className="bg-emerald-800 text-emerald-200 border border-emerald-600 px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg text-[9px] sm:text-xs font-black shadow cursor-pointer whitespace-nowrap">
        ⭐ Ușor
      </span>
    ) : (
      <span className="bg-gold/20 text-gold border border-gold/40 px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg text-[9px] sm:text-xs font-black shadow cursor-pointer whitespace-nowrap">
        ⚽ Mediu
      </span>
    );

  return (
    <header className="w-full max-w-4xl mx-auto pt-2.5 sm:pt-4 pb-1 sm:pb-2 px-2.5 sm:px-4 flex flex-col gap-2 sm:gap-3">
      {/* Top Navbar */}
      <div className="flex items-center justify-between gap-1.5">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img
            src={`${import.meta.env.BASE_URL}assets/gigi-taka-barcelona.jpg`}
            alt="Gigi-Taka Logo"
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-gold object-cover shadow-lg shadow-gold/20 shrink-0"
          />
          <div className="min-w-0">
            <h1 className="text-base sm:text-2xl font-black tracking-tight text-white flex items-center gap-1 sm:gap-1.5 leading-none">
              <span className="truncate">GIGI-TAKA</span>
              <span className="text-gold shrink-0">BARCELONA</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-emerald-400 font-semibold tracking-wide mt-0.5 truncate">
              🇷🇴 Football Grid Trivia
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => {
              sound.playPac();
              onToggleSound();
            }}
            className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
            title={soundEnabled ? 'Oprește sunetul' : 'Pornește sunetul'}
            aria-label="Sunet"
          >
            {soundEnabled ? <Volume2 size={16} className="sm:w-[18px] sm:h-[18px]" /> : <VolumeX size={16} className="text-red-400 sm:w-[18px] sm:h-[18px]" />}
          </button>

          <button
            onClick={() => {
              sound.playPac();
              onOpenHelp();
            }}
            className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
            title="Cum se joacă"
            aria-label="Ajutor"
          >
            <HelpCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>

          <button
            onClick={() => {
              sound.playPac();
              onOpenSettings();
            }}
            className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-800/80 hover:bg-slate-700 text-gold hover:text-gold-light transition border border-slate-700"
            title="Setări și Dificultate"
            aria-label="Setări"
          >
            <Settings size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>

          <button
            onClick={() => {
              sound.playPoc();
              onReset();
            }}
            className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
            title="Meci nou (Grilă nouă)"
            aria-label="Meci Nou"
          >
            <RotateCcw size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      </div>

      {/* Game status bar */}
      <div className="flex items-center justify-between bg-pitch/90 border border-emerald-800/60 rounded-xl sm:rounded-2xl px-2.5 sm:px-4 py-2 sm:py-2.5 shadow-md gap-1.5">
        {/* Score */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <span className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-medium">Scor:</span>
          <span className="text-sm sm:text-lg font-black text-gold flex items-center gap-0.5 sm:gap-1">
            <Flame size={15} className="text-orange-500 animate-pulse sm:w-[18px] sm:h-[18px]" />
            {score}/9
          </span>
        </div>

        {/* Puzzle title + Difficulty badge */}
        <div className="flex items-center gap-1.5 min-w-0 justify-center">
          <span className="text-[11px] sm:text-sm font-semibold text-slate-300 truncate max-w-[90px] sm:max-w-[200px]">
            {puzzleTitle}
          </span>
          <button
            onClick={() => {
              sound.playPac();
              onOpenSettings();
            }}
            title="Schimbă dificultatea din Setări"
            className="shrink-0"
          >
            {difficultyBadge}
          </button>
        </div>

        {/* Lives / Cartonașe de patron */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <span className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 mr-0.5 font-medium">Vieți:</span>
          {Array.from({ length: maxLives }).map((_, i) => (
            <span
              key={i}
              className={`inline-block w-3.5 h-5 sm:w-4 sm:h-6 rounded-[2px] sm:rounded-sm shadow transition-all duration-300 ${
                i < lives
                  ? 'bg-amber-400 border border-amber-300 shadow-amber-400/40 rotate-[-4deg]'
                  : 'bg-red-950/40 border border-red-900/40 opacity-40 grayscale'
              }`}
              title={i < lives ? 'Cartonaș rămas' : 'Cartonaș pierdut'}
            />
          ))}
        </div>
      </div>
    </header>
  );
};
