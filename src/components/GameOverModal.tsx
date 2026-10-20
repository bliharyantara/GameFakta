import React, { useEffect } from 'react';
import { Skull, RotateCcw, Home, ShieldAlert, CheckCircle } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  coins: number;
  worldName: string;
  onRestart: () => void;
  onTitle: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  coins,
  worldName,
  onRestart,
  onTitle
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onRestart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRestart]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-brightness-50 select-none animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border-4 border-red-500 rounded-2xl p-6 sm:p-7 shadow-[0_0_50px_rgba(239,68,68,0.35)] flex flex-col items-center text-center">
        {/* Skull Icon */}
        <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center mb-4 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
          <Skull className="w-9 h-9" />
        </div>

        {/* Game Over Heading */}
        <h2 className="font-arcade text-xl sm:text-2xl text-red-500 mb-2">
          GAME OVER
        </h2>
        <p className="font-sans-clean text-xs sm:text-sm text-slate-300 mb-5">
          Kamu terperangkap jebakan disinformasi di <span className="text-white font-bold">{worldName}</span>.
        </p>

        {/* Stats */}
        <div className="w-full flex justify-around p-3 bg-slate-950 border border-slate-700/80 rounded-xl mb-5 font-arcade text-xs">
          <div>
            <span className="text-slate-400 block text-[9px]">SKOR AKHIR</span>
            <span className="text-amber-400 font-bold">{score}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px]">KOIN</span>
            <span className="text-yellow-300 font-bold">{coins}</span>
          </div>
        </div>

        {/* Digital Literacy Lesson / Encouragement */}
        <div className="w-full p-3.5 bg-sky-950/40 border border-sky-600/40 rounded-xl mb-6 text-left flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div className="font-sans-clean text-xs text-sky-200 leading-relaxed">
            <strong>Kunci Literasi:</strong> Jangan langsung percaya kabar sensasional atau tautan hadiah gratis. Selalu saring sebelum sharing!
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3 font-arcade text-xs">
          <button
            data-start="true"
            onClick={onRestart}
            className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl border-2 border-red-400 flex items-center justify-center gap-2 shadow-[0_4px_0_#991b1b] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>COBA LAGI (SPACE / ENTER)</span>
          </button>

          <button
            onClick={onTitle}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-600 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>KEMBALI KE MENU UTAMA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
