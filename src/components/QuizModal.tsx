import React, { useState, useEffect } from 'react';
import { QuizQuestion, QuizCategory } from '../game/types';
import { validateQuizAnswer } from '../game/rules';
import { CheckCircle, AlertTriangle, HelpCircle, ArrowRight, Lightbulb, MessageSquare, Newspaper, ShieldAlert } from 'lucide-react';

interface QuizModalProps {
  question: QuizQuestion;
  onAnswerComplete: (isCorrect: boolean) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ question, onAnswerComplete }) => {
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [result, setResult] = useState<{ isCorrect: boolean; message: string; scoreDelta: number } | null>(null);

  const handleSelect = (category: QuizCategory) => {
    if (result) return; // Already answered
    const res = validateQuizAnswer(question, category);
    setSelectedCategory(category);
    setResult(res);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!result) {
        if (e.key === '1') handleSelect('FAKTA');
        if (e.key === '2') handleSelect('OPINI');
        if (e.key === '3') handleSelect('HOAKS');
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onAnswerComplete(result.isCorrect);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [result, onAnswerComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-brightness-50 animate-fadeIn select-none">
      <div className="relative w-full max-w-xl bg-slate-900 border-4 border-amber-400 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.35)] overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 px-5 py-3.5 flex items-center justify-between border-b-2 border-amber-600">
          <div className="flex items-center gap-2 text-slate-950 font-arcade text-xs sm:text-sm font-bold">
            <span className="p-1 bg-slate-950 text-amber-400 rounded">?</span>
            <span>TANTANGAN BALOK LITERASI SIBER</span>
          </div>
          <span className="font-arcade text-[10px] bg-slate-950/20 text-slate-950 px-2 py-0.5 rounded font-bold">
            POIN: +500
          </span>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 flex flex-col gap-5">
          {/* Context Tag */}
          <div className="flex items-center gap-2 text-xs text-sky-400 font-sans-clean">
            <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-600/50 text-[11px] font-bold">
              SUMBER
            </span>
            <span>{question.sourceContext}</span>
          </div>

          {/* Headline / Message Box (Social Media / News / Chat mockup) */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-700/80 shadow-inner">
            <p className="font-sans-clean text-white text-base sm:text-lg font-semibold leading-relaxed">
              {question.headline}
            </p>
          </div>

          {/* Question Prompt */}
          {!result ? (
            <div>
              <p className="text-center font-arcade text-xs sm:text-sm text-yellow-300 mb-4">
                PILIH KATEGORI YANG TEPAT:
              </p>

              {/* 3 Large Tactile Choice Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. FAKTA */}
                <button
                  onClick={() => handleSelect('FAKTA')}
                  className="group flex flex-col items-center justify-center p-3.5 bg-emerald-950/80 hover:bg-emerald-800/80 border-2 border-emerald-500 rounded-xl transition-all cursor-pointer shadow-[0_4px_0_#065f46] active:translate-y-1 active:shadow-none"
                >
                  <Newspaper className="w-6 h-6 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="font-arcade text-xs text-emerald-300 font-bold">1. FAKTA</span>
                  <span className="font-sans-clean text-[10px] text-emerald-200/70 mt-1">Data & Bukti Nyata</span>
                </button>

                {/* 2. OPINI */}
                <button
                  onClick={() => handleSelect('OPINI')}
                  className="group flex flex-col items-center justify-center p-3.5 bg-sky-950/80 hover:bg-sky-800/80 border-2 border-sky-500 rounded-xl transition-all cursor-pointer shadow-[0_4px_0_#075985] active:translate-y-1 active:shadow-none"
                >
                  <MessageSquare className="w-6 h-6 text-sky-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="font-arcade text-xs text-sky-300 font-bold">2. OPINI</span>
                  <span className="font-sans-clean text-[10px] text-sky-200/70 mt-1">Pandangan Subjektif</span>
                </button>

                {/* 3. HOAKS */}
                <button
                  onClick={() => handleSelect('HOAKS')}
                  className="group flex flex-col items-center justify-center p-3.5 bg-red-950/80 hover:bg-red-800/80 border-2 border-red-500 rounded-xl transition-all cursor-pointer shadow-[0_4px_0_#991b1b] active:translate-y-1 active:shadow-none"
                >
                  <ShieldAlert className="w-6 h-6 text-red-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="font-arcade text-xs text-red-300 font-bold">3. HOAKS</span>
                  <span className="font-sans-clean text-[10px] text-red-200/70 mt-1">Palsu / Menipu</span>
                </button>
              </div>
            </div>
          ) : (
            /* Educational Explanation Feedback */
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  result.isCorrect
                    ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-100'
                    : 'bg-red-950/80 border-red-500/80 text-red-100'
                }`}
              >
                {result.isCorrect ? (
                  <CheckCircle className="w-7 h-7 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-7 h-7 text-red-400 shrink-0 mt-0.5" />
                )}
                <div className="flex flex-col gap-1">
                  <div className="font-arcade text-xs font-bold tracking-wide">
                    {result.isCorrect ? 'JAWABAN BENAR! (+500 POIN)' : 'JAWABAN KURANG TEPAT!'}
                  </div>
                  <div className="font-sans-clean text-xs sm:text-sm font-semibold">
                    Kategori Asli: <strong className="underline text-amber-300">{question.category}</strong>
                  </div>
                  <p className="font-sans-clean text-xs leading-relaxed opacity-90 mt-1">
                    {question.explanation}
                  </p>
                </div>
              </div>

              {/* Digital Defense Tip */}
              <div className="p-3 bg-amber-950/40 border border-amber-600/40 rounded-lg flex items-start gap-2.5">
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="font-sans-clean text-xs text-amber-200 leading-normal">
                  <strong className="text-amber-300">Tips Cek Fakta:</strong> {question.tip}
                </p>
              </div>

              {/* Continue CTA */}
              <button
                onClick={() => onAnswerComplete(result.isCorrect)}
                className="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-arcade text-xs sm:text-sm font-bold rounded-xl border-2 border-yellow-200 shadow-[0_4px_0_#b45309] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>LANJUTKAN PETUALANGAN (SPASI/ENTER)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
