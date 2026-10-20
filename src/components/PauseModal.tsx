import React, { useEffect } from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onTitle: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onTitle,
  isMuted,
  onToggleMute
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key.toLowerCase() === 'p') {
        onResume();
      } else if (e.key.toLowerCase() === 'r') {
        onRestart();
      } else if (e.key.toLowerCase() === 'm') {
        onToggleMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onResume, onRestart, onToggleMute]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-brightness-50 select-none animate-fadeIn">
      <div className="w-full max-w-sm bg-slate-900 border-2 border-sky-400 rounded-xl p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Title */}
        <h2 className="font-arcade text-lg text-sky-400 mb-6 drop-shadow-md">
          GAME DIJEDA
        </h2>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3 font-arcade text-xs">
          <button
            onClick={onResume}
            className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-lg border border-sky-400 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_3px_0_#0369a1] active:translate-y-0.5 active:shadow-none"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>LANJUTKAN [ESC/P]</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-600 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_3px_0_#334155] active:translate-y-0.5 active:shadow-none"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ULANGI LEVEL [R]</span>
          </button>

          <button
            onClick={onToggleMute}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-600 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_3px_0_#334155] active:translate-y-0.5 active:shadow-none"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>{isMuted ? 'SUARA: MATI [M]' : 'SUARA: AKTIF [M]'}</span>
          </button>

          <button
            onClick={onTitle}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
          >
            <Home className="w-4 h-4" />
            <span>MENU UTAMA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
