import React from 'react';
import { Volume2, VolumeX, Pause, Heart, Coins, Clock, Trophy } from 'lucide-react';

interface PlayingHUDProps {
  score: number;
  coins: number;
  lives: number;
  timeRemaining: number;
  worldName: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
}

export const PlayingHUD: React.FC<PlayingHUDProps> = ({
  score,
  coins,
  lives,
  timeRemaining,
  worldName,
  isMuted,
  onToggleMute,
  onPause
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 sm:p-6 select-none font-arcade">
      {/* Top Perimeter Status Cluster */}
      <div className="w-full flex items-start justify-between">
        {/* Left Status: Lives & World Name */}
        <div className="flex flex-col gap-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          <div className="text-[10px] sm:text-xs text-sky-300 font-bold tracking-wider whitespace-nowrap">{worldName}</div>
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-700/80 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md w-fit">
            <Heart className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-red-500 fill-red-500 animate-pulse" />
            <span className="text-white text-[11px] sm:text-xs tabular-nums font-bold">x {lives}</span>
          </div>
        </div>

        {/* Center Status: Coins & Time Countdown */}
        <div className="flex items-center gap-3 sm:gap-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {/* Coins Readout */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-amber-500/40 px-3 py-1.5 rounded-md">
            <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-amber-300 text-xs sm:text-sm tabular-nums font-bold">
              x {coins.toString().padStart(2, '0')}
            </span>
          </div>

          {/* Time Readout */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-700/80 px-3 py-1.5 rounded-md">
            <Clock className={`w-4 h-4 ${timeRemaining < 60 ? 'text-red-400 animate-ping' : 'text-slate-300'}`} />
            <span className={`text-xs sm:text-sm tabular-nums font-bold ${timeRemaining < 60 ? 'text-red-400' : 'text-white'}`}>
              {timeRemaining.toString().padStart(3, '0')}
            </span>
          </div>
        </div>

        {/* Right Status: Score & Utility Buttons */}
        <div className="flex items-center gap-3">
          {/* Score Counter */}
          <div className="hidden sm:flex flex-col items-end drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] bg-slate-950/70 border border-slate-700/80 px-3 py-1 rounded-md">
            <span className="text-[9px] text-slate-400">SKOR</span>
            <span className="text-sm text-yellow-300 tabular-nums font-bold">
              {score.toString().padStart(6, '0')}
            </span>
          </div>

          {/* Interactive Top-Right Controls */}
          <div className="pointer-events-auto flex items-center gap-1.5">
            <button
              onClick={onToggleMute}
              className="p-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-700 rounded-lg text-white transition-all cursor-pointer shadow-md"
              title="Mute Suara [M]"
              aria-label="Toggle Sound"
              tabIndex={-1}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={onPause}
              className="p-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-700 rounded-lg text-white transition-all cursor-pointer shadow-md"
              title="Jeda Game [P / Esc]"
              aria-label="Pause Game"
              tabIndex={-1}
            >
              <Pause className="w-4 h-4 text-sky-400 fill-sky-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Second Mobile Controls Bar for Touch or Hint */}
      <div className="w-full flex justify-between items-end">
        <div className="text-[9px] text-slate-400/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          <span className="hidden sm:inline">A/D / ◄►: Jalan · W/Spasi: Lompat · Shift: Lari</span>
        </div>
        <div className="text-[9px] text-amber-400/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          Hantam Balok [ ? ] untuk Tantangan Literasi!
        </div>
      </div>
    </div>
  );
};
