export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type QuizCategory = 'FAKTA' | 'OPINI' | 'HOAKS';

export interface QuizQuestion {
  id: string;
  headline: string;
  sourceContext: string;
  category: QuizCategory;
  explanation: string;
  tip: string;
}

export interface Enemy extends Rect {
  id: string;
  type: 'hoax_bot' | 'clickbait_turtle' | 'deepfake_drone';
  vx: number;
  vy: number;
  isGrounded: boolean;
  isDefeated: boolean;
  defeatTimer: number;
  direction: number;
  shellState?: 'walking' | 'idle_shell' | 'sliding_shell';
  initialY: number;
  oscillationTimer?: number;
}

/**
 * Pure 2D Axis-Aligned Bounding Box (AABB) intersection check
 */
export function checkAABBCollision(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/**
 * Checks overlap depth to determine primary collision side between entity and static block
 */
export function getCollisionSide(
  entity: Rect & { vx: number; vy: number },
  block: Rect
): 'bottom' | 'top' | 'left' | 'right' | null {
  if (!checkAABBCollision(entity, block)) return null;

  const overlapLeft = entity.x + entity.width - block.x;
  const overlapRight = block.x + block.width - entity.x;
  const overlapTop = entity.y + entity.height - block.y;
  const overlapBottom = block.y + block.height - entity.y;

  const minOverlapY = Math.min(overlapTop, overlapBottom);
  const minOverlapX = Math.min(overlapLeft, overlapRight);

  // If vertical penetration is smaller or equal, resolve vertically
  if (minOverlapY <= minOverlapX) {
    if (overlapTop < overlapBottom && entity.vy >= 0) {
      return 'bottom'; // Entity lands on top of block
    } else if (overlapBottom <= overlapTop && entity.vy <= 0) {
      return 'top'; // Entity hits bottom of block with head
    }
  }

  // Horizontal resolution
  if (overlapLeft < overlapRight) {
    return 'left';
  } else {
    return 'right';
  }
}

/**
 * Validates user's answer to Fact / Opinion / Hoax quiz
 */
export function validateQuizAnswer(
  question: QuizQuestion,
  selectedCategory: QuizCategory
): { isCorrect: boolean; scoreDelta: number; message: string } {
  const isCorrect = question.category === selectedCategory;
  if (isCorrect) {
    return {
      isCorrect: true,
      scoreDelta: 500,
      message: `Tepat sekali! Ini adalah ${question.category}. Pengetahuan literasimu menyelamatkan ruang digital!`
    };
  } else {
    return {
      isCorrect: false,
      scoreDelta: 0,
      message: `Kurang tepat. Sebenarnya ini adalah ${question.category}. Simak penjelasannya agar lebih waspada!`
    };
  }
}

/**
 * Calculates player damage response
 * If player has star invincibility: takes 0 damage
 * If player is Super: loses Super form, gets brief invulnerability, lives remain intact
 * If normal: loses 1 life, returns isDead = true if lives <= 0
 */
export function calculatePlayerDamage(
  lives: number,
  isSuper: boolean,
  isStar: boolean
): {
  newLives: number;
  newIsSuper: boolean;
  isDead: boolean;
  grantedInvincible: boolean;
} {
  if (isStar) {
    return {
      newLives: lives,
      newIsSuper: isSuper,
      isDead: false,
      grantedInvincible: false
    };
  }

  if (isSuper) {
    return {
      newLives: lives,
      newIsSuper: false,
      isDead: false,
      grantedInvincible: true
    };
  }

  const updatedLives = Math.max(0, lives - 1);
  return {
    newLives: updatedLives,
    newIsSuper: false,
    isDead: updatedLives <= 0,
    grantedInvincible: updatedLives > 0
  };
}

/**
 * Resolves player stomping or colliding with an enemy
 */
export function calculateEnemyStomp(
  player: Rect & { vy: number; isInvincible: boolean; isStar: boolean },
  enemy: Enemy
): {
  action: 'stomp_kill' | 'shell_kick' | 'shell_stop' | 'player_hurt' | 'star_kill';
  bounceVy: number;
} {
  if (player.isStar) {
    return { action: 'star_kill', bounceVy: -4.5 };
  }

  // Check if player is coming down from above the enemy
  const playerFeet = player.y + player.height;
  const enemyTop = enemy.y + (enemy.height * 0.4);
  const isFalling = player.vy > 0;

  if (isFalling && playerFeet <= enemyTop + 14) {
    if (enemy.type === 'clickbait_turtle') {
      if (enemy.shellState === 'walking') {
        return { action: 'stomp_kill', bounceVy: -7.5 }; // Turns to idle shell
      } else if (enemy.shellState === 'idle_shell') {
        return { action: 'shell_kick', bounceVy: -6.0 };
      } else if (enemy.shellState === 'sliding_shell') {
        return { action: 'shell_stop', bounceVy: -7.0 };
      }
    }
    // Normal stomp on hoax_bot or deepfake_drone
    return { action: 'stomp_kill', bounceVy: -8.0 };
  }

  // If turtle is idle shell and player touches from side, kick shell!
  if (enemy.type === 'clickbait_turtle' && enemy.shellState === 'idle_shell') {
    return { action: 'shell_kick', bounceVy: 0 };
  }

  return { action: 'player_hurt', bounceVy: 0 };
}

/**
 * Calculates end of stage completion bonus
 */
export function calculateLevelClearBonus(
  timeRemaining: number,
  coins: number,
  quizAccuracyRatio: number
): {
  timeBonus: number;
  coinBonus: number;
  accuracyBonus: number;
  totalScoreBonus: number;
} {
  const timeBonus = Math.max(0, Math.floor(timeRemaining * 50));
  const coinBonus = coins * 100;
  const accuracyBonus = Math.round(quizAccuracyRatio * 1000);
  return {
    timeBonus,
    coinBonus,
    accuracyBonus,
    totalScoreBonus: timeBonus + coinBonus + accuracyBonus
  };
}
