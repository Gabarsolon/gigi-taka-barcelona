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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-emerald-600/60 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="text-gold" size={22} />
            <h2 className="text-xl font-black text-white">Cum se joacă Gigi-Taka?</h2>
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

        <div className="space-y-4 my-4 text-sm text-slate-300">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700">
            <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-bold text-white">Regula Dublei Condiții</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Fiecare dintre cele 9 celule reprezintă intersecția dintre o <strong>Linie</strong> și o <strong>Coloană</strong>. Trebuie să găsești un fotbalist care a jucat la ambele cluburi sau respectă ambele criterii.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700">
            <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-bold text-white">Fără Jucători Duplicați</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Un fotbalist folosit într-o celulă nu mai poate fi folosit în nicio altă celulă din același meci.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700">
            <Sparkles className="text-gold shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-bold text-white">Vieți & Schimbări Dictate din Lojă</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Ai la dispoziție <strong>3 vieți (cartonașe)</strong>. La fiecare răspuns greșit pierzi o viață și Gigi intervine cu replici tăioase! La 3 greșeli ești schimbat la pauză!
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playPoc();
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-gold hover:bg-gold-light text-black font-black text-sm tracking-wide shadow-lg transition active:scale-95"
        >
          Am înțeles, să înceapă meciul!
        </button>
      </div>
    </div>
  );
};
