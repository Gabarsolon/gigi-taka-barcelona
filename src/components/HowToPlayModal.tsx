import React from 'react';
import { X, Trophy, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/soundEngine';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-emerald-600/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="text-gold" size={20} />
            <h2 className="text-lg sm:text-xl font-black text-white">Cum se joacă Gigi-Taka?</h2>
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

        <div className="space-y-3 sm:space-y-4 my-3 sm:my-4 text-xs sm:text-sm text-slate-300">
          <div className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-800/60 border border-slate-700">
            <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-bold text-white text-xs sm:text-sm">Regula Dublei Condiții</p>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-relaxed">
                Fiecare dintre cele 9 celule reprezintă intersecția dintre o <strong>Linie</strong> și o <strong>Coloană</strong>. Trebuie să găsești un fotbalist care a jucat la ambele cluburi sau respectă ambele criterii.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-800/60 border border-slate-700">
            <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-bold text-white text-xs sm:text-sm">Fără Jucători Duplicați</p>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-relaxed">
                Un fotbalist folosit într-o celulă nu mai poate fi folosit în nicio altă celulă din același meci.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-800/60 border border-slate-700">
            <Sparkles className="text-gold shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-bold text-white text-xs sm:text-sm">Vieți & Schimbări Dictate din Lojă</p>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-relaxed">
                Ai la dispoziție <strong>3 vieți (cartonașe)</strong>. La fiecare răspuns greșit pierzi o viață și Gigi intervine cu replici tăioase! La epuizarea vieților ești schimbat la pauză!
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playPac();
            onClose();
          }}
          className="w-full mt-2 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-950 transition active:scale-95"
        >
          Am înțeles, tată! Începe meciul!
        </button>
      </div>
    </div>
  );
};
