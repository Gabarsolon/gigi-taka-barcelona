import React, { useState } from 'react';
import { Player } from '../types';
import { Trophy, Frown, Share2, RotateCcw, Check } from 'lucide-react';
import { sound } from '../utils/soundEngine';

interface GameSummaryModalProps {
  isOpen: boolean;
  isWon: boolean;
  score: number;
  grid: (Player | null)[][];
  gigiQuote: string;
  onPlayAgain: () => void;
  puzzleTitle: string;
}

export const GameSummaryModal: React.FC<GameSummaryModalProps> = ({
  isOpen,
  isWon,
  score,
  grid,
  gigiQuote,
  onPlayAgain,
  puzzleTitle
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateShareText = () => {
    let emojiGrid = '';
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        emojiGrid += grid[r][c] ? '🟩' : '🟥';
      }
      emojiGrid += '\n';
    }

    return `Gigi-Taka-Barcelona 🇷🇴⚽\n${puzzleTitle}\nScor: ${score}/9\n\n${emojiGrid}\n"${gigiQuote}"\n\nJoacă și tu pe Gigi-Taka-Barcelona!`;
  };

  const handleShare = async () => {
    sound.playPac();
    const text = generateShareText();
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border-2 border-gold rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
          isWon ? 'bg-gold/20' : 'bg-red-600/20'
        }`} />

        {/* Icon */}
        <div className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
          {isWon ? (
            <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center text-gold shadow-gold/40 shadow-lg">
              <Trophy size={32} className="animate-bounce" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-red-950/40 border-2 border-red-500 flex items-center justify-center text-red-500 shadow-red-900/40 shadow-lg">
              <Frown size={32} />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-white tracking-tight">
          {isWon ? 'CAMPIONII! PAC, PAC!' : 'SCHIMBARE LA PAUZĂ!'}
        </h2>
        <p className="text-sm font-semibold text-emerald-400 mt-1">
          Ai completat {score} din 9 căsuțe
        </p>

        {/* Gigi Final Quote */}
        <div className="my-4 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 italic text-sm text-slate-200 font-medium leading-relaxed">
          "{gigiQuote}"
        </div>

        {/* Emoji Matrix Preview */}
        <div className="inline-block p-3 rounded-2xl bg-slate-950/60 border border-slate-800 my-2">
          {grid.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-1.5 my-1">
              {row.map((cell, cIdx) => (
                <span key={cIdx} className="text-xl">
                  {cell ? '🟩' : '🟥'}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5 mt-4">
          <button
            onClick={handleShare}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm tracking-wide shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 transition active:scale-95"
          >
            {copied ? (
              <>
                <Check size={18} />
                Copiat în Clipboard!
              </>
            ) : (
              <>
                <Share2 size={18} />
                Distribuie Grila (Wordle style)
              </>
            )}
          </button>

          <button
            onClick={() => {
              sound.playPoc();
              onPlayAgain();
            }}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-sm border border-slate-700 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <RotateCcw size={18} />
            Meci Nou
          </button>
        </div>
      </div>
    </div>
  );
};
