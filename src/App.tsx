import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameState, LevelConfig, QuizQuestion } from './game/types';
import { GameEngine } from './game/engine';
import { GameRenderer } from './game/renderer';
import { createWorldLevel } from './game/levels';
import { audio } from './game/audio';
import { TitleScreen } from './components/TitleScreen';
import { PlayingHUD } from './components/PlayingHUD';
import { QuizModal } from './components/QuizModal';
import { PauseModal } from './components/PauseModal';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('title');
  const [currentWorldIndex, setCurrentWorldIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(() => audio.getMuted());

  // HUD stats
  const [hudStats, setHudStats] = useState({
    score: 0,
    coins: 0,
    lives: 3,
    timeRemaining: 400
  });

  // Active Quiz question state
  const [activeQuizQuestion, setActiveQuizQuestion] = useState<QuizQuestion | null>(null);

  // Victory / Game Over stats
  const [victoryStats, setVictoryStats] = useState<{
    score: number;
    coins: number;
    timeRemaining: number;
    worldIndex: number;
  }>({ score: 0, coins: 0, timeRemaining: 0, worldIndex: 0 });

  const [gameOverStats, setGameOverStats] = useState<{
    score: number;
    coins: number;
    worldName: string;
  }>({ score: 0, coins: 0, worldName: '' });

  // DOM Refs for isolated 60fps canvas loop
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const rendererRef = useRef<GameRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Sync document.body.dataset.state for ultra-mode compliance
  useEffect(() => {
    document.body.dataset.state = gameState === 'quiz' ? 'playing' : gameState;
  }, [gameState]);

  // Audio mute toggle
  const handleToggleMute = useCallback(() => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
  }, []);

  // Initialize or Start Game
  const startGame = useCallback((worldIdx: number = 0) => {
    setCurrentWorldIndex(worldIdx);
    const levelConfig = createWorldLevel(worldIdx);

    const engine = new GameEngine(levelConfig, worldIdx, {
      onScoreUpdate: (score, coins, lives, time) => {
        setHudStats({ score, coins, lives, timeRemaining: time });
      },
      onTriggerQuiz: (question) => {
        setActiveQuizQuestion(question);
        setGameState('quiz');
      },
      onVictory: (stats) => {
        setVictoryStats(stats);
        setGameState('victory');
      },
      onGameOver: (stats) => {
        setGameOverStats(stats);
        setGameState('gameover');
      }
    });

    engineRef.current = engine;
    setHudStats({
      score: engine.score,
      coins: engine.coins,
      lives: engine.lives,
      timeRemaining: engine.timeRemaining
    });

    setGameState('playing');
    audio.startMusic(levelConfig.theme);
  }, []);

  // Check URL autostart (?autostart=1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      startGame(0);
    }
  }, [startGame]);

  // Resume after answering Quiz
  const handleQuizComplete = useCallback((isCorrect: boolean) => {
    if (engineRef.current && activeQuizQuestion) {
      engineRef.current.resumeFromQuiz(isCorrect, activeQuizQuestion);
    }
    setActiveQuizQuestion(null);
    setGameState('playing');
  }, [activeQuizQuestion]);

  // Pause & Resume handlers
  const handlePause = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused');
      audio.stopMusic();
    }
  }, [gameState]);

  const handleResume = useCallback(() => {
    if (gameState === 'paused') {
      setGameState('playing');
      const level = engineRef.current?.level;
      if (level) audio.startMusic(level.theme);
    }
  }, [gameState]);

  const handleRestartLevel = useCallback(() => {
    startGame(currentWorldIndex);
  }, [currentWorldIndex, startGame]);

  const handleReturnToTitle = useCallback(() => {
    audio.stopMusic();
    if (engineRef.current) {
      engineRef.current.clearInputs();
    }
    setGameState('title');
  }, []);

  const handleNextLevel = useCallback(() => {
    const nextWorld = (currentWorldIndex + 1) % 3;
    startGame(nextWorld);
  }, [currentWorldIndex, startGame]);

  // Keyboard input bindings
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Pause toggle
      if ((e.key === 'Escape' || e.key.toLowerCase() === 'p') && gameState === 'playing') {
        e.preventDefault();
        handlePause();
        return;
      }
      if ((e.key === 'Escape' || e.key.toLowerCase() === 'p') && gameState === 'paused') {
        e.preventDefault();
        handleResume();
        return;
      }
      if (e.key.toLowerCase() === 'm' && (gameState === 'playing' || gameState === 'title')) {
        handleToggleMute();
        return;
      }

      if (engineRef.current && gameState === 'playing') {
        engineRef.current.setInput(e.key, true);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (engineRef.current && gameState === 'playing') {
        engineRef.current.setInput(e.key, false);
      }
    };

    const onBlur = () => {
      if (engineRef.current) {
        engineRef.current.clearInputs();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [gameState, handlePause, handleResume, handleToggleMute]);

  // Main 60fps Game Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!rendererRef.current) {
      rendererRef.current = new GameRenderer(ctx, canvas.width, canvas.height);
    }

    const resizeCanvas = () => {
      if (canvas && rendererRef.current) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        // Virtual height 480px scaling
        const scale = Math.max(1, rect.height / 480);
        ctx.scale(dpr * scale, dpr * scale);

        const virtualWidth = rect.width / scale;
        const virtualHeight = rect.height / scale;
        rendererRef.current.resize(virtualWidth, virtualHeight);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let isRunning = true;
    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      if (!isRunning) return;

      const rawDt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const engine = engineRef.current;
      const renderer = rendererRef.current;

      if (engine && renderer && (gameState === 'playing' || gameState === 'quiz')) {
        engine.update(rawDt);

        const rect = canvas.getBoundingClientRect();
        renderer.render(
          engine.player,
          engine.level,
          engine.cameraX,
          engine.particles,
          engine.floatingTexts,
          rawDt
        );
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      window.removeEventListener('resize', resizeCanvas);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [gameState]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      audio.stopMusic();
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans-clean">
      {/* 1. Isolated 60fps Canvas Viewport */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block pixelated"
        tabIndex={0}
      />

      {/* 2. Title Screen Overlay */}
      {gameState === 'title' && (
        <div className="absolute inset-0 z-30">
          <TitleScreen
            onStart={startGame}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        </div>
      )}

      {/* 3. Playing HUD Overlay */}
      {(gameState === 'playing' || gameState === 'quiz') && (
        <PlayingHUD
          score={hudStats.score}
          coins={hudStats.coins}
          lives={hudStats.lives}
          timeRemaining={hudStats.timeRemaining}
          worldName={engineRef.current?.level.worldName || 'DUNIA 1-1'}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onPause={handlePause}
        />
      )}

      {/* 4. Touch Controls for Mobile/Tablet in playing mode */}
      {gameState === 'playing' && (
        <div className="sm:hidden fixed bottom-4 inset-x-4 z-20 flex justify-between items-end pointer-events-none select-none">
          {/* Virtual D-Pad Left/Right */}
          <div className="flex gap-2 pointer-events-auto">
            <button
              onPointerDown={() => engineRef.current?.setInput('arrowleft', true)}
              onPointerUp={() => engineRef.current?.setInput('arrowleft', false)}
              onPointerLeave={() => engineRef.current?.setInput('arrowleft', false)}
              className="w-14 h-14 bg-slate-900/80 active:bg-slate-700 border-2 border-slate-600 rounded-xl text-white font-arcade text-lg flex items-center justify-center shadow-lg"
              aria-label="Move Left"
            >
              ◄
            </button>
            <button
              onPointerDown={() => engineRef.current?.setInput('arrowright', true)}
              onPointerUp={() => engineRef.current?.setInput('arrowright', false)}
              onPointerLeave={() => engineRef.current?.setInput('arrowright', false)}
              className="w-14 h-14 bg-slate-900/80 active:bg-slate-700 border-2 border-slate-600 rounded-xl text-white font-arcade text-lg flex items-center justify-center shadow-lg"
              aria-label="Move Right"
            >
              ►
            </button>
          </div>

          {/* Virtual Jump & Dash buttons */}
          <div className="flex gap-3 pointer-events-auto">
            <button
              onPointerDown={() => engineRef.current?.setInput('shift', true)}
              onPointerUp={() => engineRef.current?.setInput('shift', false)}
              onPointerLeave={() => engineRef.current?.setInput('shift', false)}
              className="w-13 h-13 bg-amber-600/80 active:bg-amber-500 border-2 border-amber-400 rounded-full text-slate-950 font-arcade text-xs flex items-center justify-center shadow-lg"
              aria-label="Dash"
            >
              LARI
            </button>
            <button
              onPointerDown={() => engineRef.current?.setInput(' ', true)}
              onPointerUp={() => engineRef.current?.setInput(' ', false)}
              onPointerLeave={() => engineRef.current?.setInput(' ', false)}
              className="w-16 h-16 bg-yellow-500/90 active:bg-yellow-400 border-2 border-yellow-300 rounded-full text-slate-950 font-arcade text-xs font-bold flex items-center justify-center shadow-lg"
              aria-label="Jump"
            >
              LOMPAT
            </button>
          </div>
        </div>
      )}

      {/* 5. Digital Challenge Quiz Modal */}
      {gameState === 'quiz' && activeQuizQuestion && (
        <QuizModal
          question={activeQuizQuestion}
          onAnswerComplete={handleQuizComplete}
        />
      )}

      {/* 6. Pause Modal */}
      {gameState === 'paused' && (
        <PauseModal
          onResume={handleResume}
          onRestart={handleRestartLevel}
          onTitle={handleReturnToTitle}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* 7. Victory Modal */}
      {gameState === 'victory' && (
        <VictoryModal
          score={victoryStats.score}
          coins={victoryStats.coins}
          timeRemaining={victoryStats.timeRemaining}
          worldIndex={victoryStats.worldIndex}
          onNextLevel={handleNextLevel}
          onRestart={handleRestartLevel}
          onTitle={handleReturnToTitle}
        />
      )}

      {/* 8. Game Over Modal */}
      {gameState === 'gameover' && (
        <GameOverModal
          score={gameOverStats.score}
          coins={gameOverStats.coins}
          worldName={gameOverStats.worldName}
          onRestart={handleRestartLevel}
          onTitle={handleReturnToTitle}
        />
      )}
    </div>
  );
}
