export type GameState = 'title' | 'playing' | 'paused' | 'quiz' | 'victory' | 'gameover';

export type QuizCategory = 'FAKTA' | 'OPINI' | 'HOAKS';

export interface QuizQuestion {
  id: string;
  headline: string;
  sourceContext: string;
  category: QuizCategory;
  explanation: string;
  tip: string;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Player extends Rect {
  vx: number;
  vy: number;
  isGrounded: boolean;
  isFacingRight: boolean;
  isCrouching: boolean;
  isSuper: boolean;
  isInvincible: boolean;
  invincibleTimer: number;
  starTimer: number;
  state: 'idle' | 'run' | 'jump' | 'skid' | 'dead' | 'victory';
  squashX: number;
  squashY: number;
  coyoteTimer: number;
  jumpBufferTimer: number;
  runFrame: number;
  runFrameTimer: number;
}

export type EnemyType = 'hoax_bot' | 'clickbait_turtle' | 'deepfake_drone';

export interface Enemy extends Rect {
  id: string;
  type: EnemyType;
  vx: number;
  vy: number;
  isGrounded: boolean;
  isDefeated: boolean;
  defeatTimer: number;
  direction: number; // -1 or 1
  shellState?: 'walking' | 'idle_shell' | 'sliding_shell';
  initialY: number;
  oscillationTimer?: number;
}

export type BlockType = 'ground' | 'brick' | 'question' | 'empty_question' | 'pipe_top' | 'pipe_body' | 'flag_pole' | 'flag_top' | 'castle';

export interface Block extends Rect {
  id: string;
  type: BlockType;
  bounceOffset: number;
  bounceSpeed: number;
  content: 'coin' | 'quiz' | 'powerup' | 'none';
  quizId?: string;
  isHit?: boolean;
}

export type ItemType = 'coin' | 'mushroom' | 'star';

export interface Item extends Rect {
  id: string;
  type: ItemType;
  vx: number;
  vy: number;
  isGrounded: boolean;
  collected: boolean;
  bounceCount?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  shape: 'rect' | 'spark';
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  vy: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
}

export interface LevelConfig {
  id: string;
  worldName: string;
  title: string;
  subtitle: string;
  theme: 'day' | 'underground' | 'cybercastle';
  width: number;
  height: number;
  timeLimit: number;
  flagPoleX: number;
  castleX: number;
  blocks: Block[];
  enemies: Enemy[];
  items: Item[];
}

export interface RunStats {
  score: number;
  coins: number;
  lives: number;
  timeRemaining: number;
  quizCorrect: number;
  quizAttempted: number;
  enemiesDebunked: number;
}
