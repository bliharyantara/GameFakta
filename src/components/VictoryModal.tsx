import React, { useEffect } from 'react';
import { Trophy, ArrowRight, RotateCcw, Home, Star, Coins, Clock } from 'lucide-react';

interface VictoryModalProps {
  score: number;
  coins: number;
  timeRemaining: number;
  worldIndex: number;
  onNextLevel: () => void;
  onRestart: () => void;
  onTitle: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  score,
  coins,
  timeRemaining,
  worldIndex,
  onNextLevel,
  onRestart,
  onTitle
}) => {
  const isFinalStage = worldIndex >= 2;
  const timeBonus = timeRemaining * 50;
  const totalStageScore = score + timeBonus + coins * 100;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onNextLevel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNextLevel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-brightness-50 select-none animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border-4 border-yellow-400 rounded-2xl p-6 sm:p-7 shadow-[0_0_50px_rgba(250,204,21,0.35)] flex flex-col items-center text-center">
        {/* Trophy Icon */}
        <div className="w-16 h-16 rounded-full bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center mb-4 text-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.4)]">
          <Trophy className="w-9 h-9 fill-current" />
        </div>

        {/* Victory Heading */}
        <h2 className="font-arcade text-lg sm:text-xl text-yellow-300 mb-1">
          LEVEL SELESAI!
        </h2>
        <p className="font-sans-clean text-xs sm:text-sm text-emerald-400 font-semibold mb-6">
          {isFinalStage
            ? 'Selamat! Anda Menjadi Pendekar Literasi Siber Sejati!'
            : 'Hebat! Anda Berhasil Membersihkan Dunia Ini dari Hoaks!'}
        </p>

        {/* Mastery Metric Tiles */}
        <div className="grid grid-cols-3 gap-2.5 w-full mb-6 font-arcade">
          <div className="p-3 bg-slate-950 border border-slate-700/80 rounded-xl flex flex-col items-center">
            <Coins className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[9px] text-slate-400">KOIN</span>
            <span className="text-sm text-amber-300 font-bold tabular-nums">+{coins * 100}</span>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-700/80 rounded-xl flex flex-col items-center">
            <Clock className="w-4 h-4 text-sky-400 mb-1" />
            <span className="text-[9px] text-slate-400">SISA WAKTU</span>
            <span className="text-sm text-sky-300 font-bold tabular-nums">+{timeBonus}</span>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-700/80 rounded-xl flex flex-col items-center">
            <Star className="w-4 h-4 text-yellow-400 mb-1" />
            <span className="text-[9px] text-slate-400">TOTAL</span>
            <span className="text-sm text-yellow-300 font-bold tabular-nums">{totalStageScore}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3 font-arcade text-xs">
          <button
            data-start="true"
            onClick={onNextLevel}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold rounded-xl border-2 border-yellow-300 flex items-center justify-center gap-2 shadow-[0_4px_0_#b45309] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            <span>{isFinalStage ? 'MAIN LAGI DARI AWAL' : 'DUNIA SELANJUTNYA (ENTER)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex gap-2 w-full mt-1">
            <button
              onClick={onRestart}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-600 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ULANGI</span>
            </button>
            <button
              onClick={onTitle}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-600 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>MENU</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
