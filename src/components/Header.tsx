import React from 'react';
import { Volume2, VolumeX, HelpCircle, RotateCcw, Flame } from 'lucide-react';
import { sound } from '../utils/soundEngine';

interface HeaderProps {
  score: number;
  lives: number;
  maxLives: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHelp: () => void;
  onReset: () => void;
  puzzleTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  lives,
  maxLives,
  soundEnabled,
  onToggleSound,
  onOpenHelp,
  onReset,
  puzzleTitle
}) => {
  return (
    <header className="w-full max-w-4xl mx-auto pt-4 pb-2 px-4 flex flex-col gap-3">
      {/* Top Navbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={`${import.meta.env.BASE_URL}assets/gigi-taka-barcelona.jpg`}
            alt="Gigi-Taka Logo"
            className="w-11 h-11 rounded-full border-2 border-gold object-cover shadow-lg shadow-gold/20"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
              <span>GIGI-TAKA</span>
              <span className="text-gold">BARCELONA</span>
            </h1>
            <p className="text-xs text-emerald-400 font-semibold tracking-wide">
              🇷🇴 Football Grid Trivia
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPac();
              onToggleSound();
            }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
            title={soundEnabled ? 'Oprește sunetul' : 'Pornește sunetul'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="text-red-400" />}
          </button>

          <button
            onClick={() => {
              sound.playPac();
              onOpenHelp();
            }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
            title="Cum se joacă"
          >
            <HelpCircle size={18} />
          </button>

          <button
            onClick={() => {
              sound.playPoc();
              onReset();
            }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
            title="Meci nou"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Game status bar */}
      <div className="flex items-center justify-between bg-pitch/80 backdrop-blur border border-emerald-800/60 rounded-2xl px-4 py-2.5 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Scor:</span>
          <span className="text-lg font-black text-gold flex items-center gap-1">
            <Flame size={18} className="text-orange-500 animate-pulse" />
            {score}/9
          </span>
        </div>

        <div className="text-xs sm:text-sm font-semibold text-slate-300 truncate max-w-[180px] sm:max-w-none">
          {puzzleTitle}
        </div>

        {/* Lives / Cartonașe de patron */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs uppercase tracking-wider text-slate-400 mr-1 font-medium">Vieți:</span>
          {Array.from({ length: maxLives }).map((_, i) => (
            <span
              key={i}
              className={`inline-block w-4 h-6 rounded-sm shadow transition-all duration-300 ${
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
