import React, { useEffect } from 'react';
import { Volume2, VolumeX, Play, ShieldAlert, CheckCircle2, MessageSquareQuote } from 'lucide-react';
import { audio } from '../game/audio';

interface TitleScreenProps {
  onStart: (worldIndex: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, isMuted, onToggleMute }) => {
  const [selectedWorld, setSelectedWorld] = React.useState<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onStart(selectedWorld);
      } else if (e.key.toLowerCase() === 'm') {
        onToggleMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedWorld, onStart, onToggleMute]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-6 sm:p-8 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 overflow-hidden text-white select-none">
      {/* Background Animated Pixel Matrix Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Header Utilities */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2 px-3 py-1 bg-sky-950/60 border border-sky-500/40 rounded text-sky-300 font-arcade text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>LITERASI SIBER v1.0</span>
        </div>

        <button
          onClick={onToggleMute}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 rounded text-xs font-arcade transition-all cursor-pointer"
          title="Bisu Suara [M]"
          aria-label="Toggle Audio"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          <span>{isMuted ? 'MUTE [M]' : 'AUDIO [M]'}</span>
        </button>
      </div>

      {/* Main Title Centerpiece */}
      <div className="flex flex-col items-center text-center z-10 max-w-3xl my-auto">
        {/* Bespoke SVG Arcade Title Lockup */}
        <div className="relative mb-4">
          <svg className="w-full max-w-[580px] h-auto drop-shadow-[0_10px_25px_rgba(56,189,248,0.4)]" viewBox="0 0 580 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 3D Drop Shadow text */}
            <text x="290" y="58" textAnchor="middle" fill="#0f172a" fontSize="36" fontFamily="'Press Start 2P', monospace" fontWeight="bold">
              SUPER SIBER BROS
            </text>
            <text x="286" y="54" textAnchor="middle" fill="#0284c7" fontSize="36" fontFamily="'Press Start 2P', monospace" fontWeight="bold">
              SUPER SIBER BROS
            </text>
            <text x="284" y="52" textAnchor="middle" fill="#38bdf8" fontSize="36" fontFamily="'Press Start 2P', monospace" fontWeight="bold">
              SUPER SIBER BROS
            </text>

            {/* Subtitle ribbon */}
            <rect x="70" y="74" width="440" height="34" rx="6" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
            <text x="290" y="96" textAnchor="middle" fill="#fde047" fontSize="13" fontFamily="'Press Start 2P', monospace">
              FAKTA • OPINI • HOAKS
            </text>
          </svg>
        </div>

        {/* Thematic Educational Description */}
        <p className="text-slate-300 font-sans-clean text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-6">
          Selamatkan ruang digital dari banjir disinformasi! Lawan <strong className="text-red-400">Bot Hoaks</strong>, injak <strong className="text-amber-400">Monster Clickbait</strong>, dan pecahkan balok tantangan digital untuk membedakan fakta terverifikasi dan opini.
        </p>

        {/* World / Level Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 w-full max-w-lg">
          {[
            { id: 0, title: 'DUNIA 1-1', subtitle: 'Taman Algoritma', desc: 'Fakta vs Hoaks Berantai' },
            { id: 1, title: 'DUNIA 1-2', subtitle: 'Gua Netizen', desc: 'Opini vs Fakta' },
            { id: 2, title: 'DUNIA 1-3', subtitle: 'Menara Deepfake', desc: 'Tantangan Pamungkas' }
          ].map((world) => (
            <button
              key={world.id}
              onClick={() => setSelectedWorld(world.id)}
              className={`flex-1 min-w-[140px] px-3 py-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                selectedWorld === world.id
                  ? 'bg-sky-600/30 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                  : 'bg-slate-900/60 border-slate-700/70 hover:border-slate-500'
              }`}
            >
              <div className="font-arcade text-xs text-sky-400 mb-0.5">{world.title}</div>
              <div className="font-sans-clean font-bold text-xs text-white">{world.subtitle}</div>
              <div className="font-sans-clean text-[10px] text-slate-400">{world.desc}</div>
            </button>
          ))}
        </div>

        {/* Primary Start CTA Button */}
        <button
          data-start="true"
          onClick={() => onStart(selectedWorld)}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-arcade text-base sm:text-lg rounded-xl border-2 border-yellow-300 shadow-[0_6px_0_#b45309,0_12px_25px_rgba(234,179,8,0.4)] active:translate-y-1.5 active:shadow-[0_0_0_#b45309] transition-all cursor-pointer"
        >
          <Play className="w-6 h-6 fill-current animate-bounce" />
          <span>MULAI MAIN (SPACE / ENTER)</span>
        </button>

        {/* Digital Literacy 3 Pillars Hint */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-8 w-full max-w-xl text-left">
          <div className="p-2.5 rounded bg-slate-900/70 border border-emerald-500/30 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-arcade text-[10px] text-emerald-400">FAKTA</div>
              <div className="font-sans-clean text-[11px] text-slate-300">Data resmi & bukti nyata</div>
            </div>
          </div>
          <div className="p-2.5 rounded bg-slate-900/70 border border-sky-500/30 flex items-start gap-2">
            <MessageSquareQuote className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-arcade text-[10px] text-sky-400">OPINI</div>
              <div className="font-sans-clean text-[11px] text-slate-300">Pendapat subjektif</div>
            </div>
          </div>
          <div className="p-2.5 rounded bg-slate-900/70 border border-red-500/30 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-arcade text-[10px] text-red-400">HOAKS</div>
              <div className="font-sans-clean text-[11px] text-slate-300">Informasi palsu & tipuan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Control Hints Line */}
      <div className="w-full max-w-2xl text-center z-10 pt-4 border-t border-slate-800/80">
        <p className="font-arcade text-[11px] text-slate-400 tracking-wider">
          WASD / ◄► Bergerak · W / Spasi Lompat · Shift Lari · P / Esc Jeda · M Audio
        </p>
      </div>
    </div>
  );
};
