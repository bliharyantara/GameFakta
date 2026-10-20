import { Block, Enemy, FloatingText, Item, LevelConfig, Particle, Player, QuizQuestion } from './types';
import { checkAABBCollision, calculatePlayerDamage, calculateEnemyStomp } from './rules';
import { audio } from './audio';
import { DIGITAL_LITERACY_QUESTIONS } from './questions';

export interface GameEngineCallbacks {
  onScoreUpdate: (score: number, coins: number, lives: number, time: number) => void;
  onTriggerQuiz: (question: QuizQuestion) => void;
  onVictory: (stats: { score: number; coins: number; timeRemaining: number; worldIndex: number }) => void;
  onGameOver: (stats: { score: number; coins: number; worldName: string }) => void;
}

export class GameEngine {
  public player: Player;
  public level: LevelConfig;
  public cameraX: number = 0;
  public particles: Particle[] = [];
  public floatingTexts: FloatingText[] = [];

  private callbacks: GameEngineCallbacks;
  private isRunning: boolean = false;
  private isQuizPaused: boolean = false;
  private isVictoryAnimating: boolean = false;
  private victoryStep: number = 0;

  public score: number = 0;
  public coins: number = 0;
  public lives: number = 3;
  public timeRemaining: number = 400;
  public worldIndex: number = 0;

  // Input state
  private keysHeld: Set<string> = new Set();
  private justPressedKeys: Set<string> = new Set();

  // Physics constants
  private readonly GRAVITY = 0.42;
  private readonly ACCEL = 0.28;
  private readonly FRICTION = 0.85;
  private readonly MAX_WALK = 3.2;
  private readonly MAX_RUN = 5.2;

  // Timers
  private hitstopTimer: number = 0;
  private secondAccumulator: number = 0;
  private activeQuizBlock: Block | null = null;

  constructor(level: LevelConfig, worldIndex: number, callbacks: GameEngineCallbacks) {
    this.level = level;
    this.worldIndex = worldIndex;
    this.callbacks = callbacks;
    this.timeRemaining = level.timeLimit;

    this.player = this.createInitialPlayer();
  }

  private createInitialPlayer(): Player {
    return {
      x: 80,
      y: 350,
      width: 24,
      height: 32,
      vx: 0,
      vy: 0,
      isGrounded: true,
      isFacingRight: true,
      isCrouching: false,
      isSuper: false,
      isInvincible: false,
      invincibleTimer: 0,
      starTimer: 0,
      state: 'idle',
      squashX: 1,
      squashY: 1,
      coyoteTimer: 0,
      jumpBufferTimer: 0,
      runFrame: 0,
      runFrameTimer: 0
    };
  }

  public setInput(key: string, isDown: boolean) {
    const k = key.toLowerCase();
    if (isDown) {
      if (!this.keysHeld.has(k)) {
        this.justPressedKeys.add(k);
      }
      this.keysHeld.add(k);
    } else {
      this.keysHeld.delete(k);
    }
  }

  public clearInputs() {
    this.keysHeld.clear();
    this.justPressedKeys.clear();
  }

  public pauseForQuiz() {
    this.isQuizPaused = true;
  }

  public resumeFromQuiz(isCorrect: boolean, question: QuizQuestion) {
    this.isQuizPaused = false;
    if (isCorrect) {
      this.score += 500;
      this.addFloatingText(this.player.x, this.player.y - 20, '+500 FAKTA!', '#4ade80');
      // Spawn extra coin or star reward
      this.spawnItem(this.player.x, this.player.y - 40, 'star');
      audio.playQuizCorrect();
    } else {
      audio.playQuizWrong();
    }
    this.callbacks.onScoreUpdate(this.score, this.coins, this.lives, Math.floor(this.timeRemaining));
  }

  public update(rawDt: number) {
    if (this.isQuizPaused) return;

    // Clamp dt to 0.05 to avoid tunneling
    const dt = Math.min(rawDt, 0.05);

    // Hitstop freeze handling
    if (this.hitstopTimer > 0) {
      this.hitstopTimer -= dt;
      return;
    }

    // Time countdown
    if (!this.isVictoryAnimating) {
      this.secondAccumulator += dt;
      if (this.secondAccumulator >= 1.0) {
        this.secondAccumulator -= 1.0;
        this.timeRemaining = Math.max(0, this.timeRemaining - 1);
        this.callbacks.onScoreUpdate(this.score, this.coins, this.lives, Math.floor(this.timeRemaining));

        if (this.timeRemaining <= 0) {
          this.handlePlayerDeath();
          return;
        }
      }
    }

    // Victory sequence handling
    if (this.isVictoryAnimating) {
      this.updateVictorySequence(dt);
      return;
    }

    // Update Player Timers
    if (this.player.invincibleTimer > 0) {
      this.player.invincibleTimer -= dt;
    }
    if (this.player.starTimer > 0) {
      this.player.starTimer -= dt;
      this.player.isStar = this.player.starTimer > 0;
    }

    // Squash & Stretch decay back to 1.0
    this.player.squashX += (1 - this.player.squashX) * 0.15;
    this.player.squashY += (1 - this.player.squashY) * 0.15;

    // Input checks
    const moveLeft = this.keysHeld.has('arrowleft') || this.keysHeld.has('a');
    const moveRight = this.keysHeld.has('arrowright') || this.keysHeld.has('d');
    const jumpPressed = this.justPressedKeys.has('arrowup') || this.keysHeld.has('w') || this.justPressedKeys.has(' ');
    const isRunningFast = this.keysHeld.has('shift');

    if (jumpPressed) {
      this.player.jumpBufferTimer = 0.12;
    } else if (this.player.jumpBufferTimer > 0) {
      this.player.jumpBufferTimer -= dt;
    }

    // Coyote time update
    if (this.player.isGrounded) {
      this.player.coyoteTimer = 0.12;
    } else if (this.player.coyoteTimer > 0) {
      this.player.coyoteTimer -= dt;
    }

    // Horizontal Movement & Acceleration
    const maxSpeed = isRunningFast ? this.MAX_RUN : this.MAX_WALK;
    if (moveLeft && !moveRight) {
      this.player.vx -= this.ACCEL;
      if (this.player.vx < -maxSpeed) this.player.vx = -maxSpeed;
      this.player.isFacingRight = false;
      if (this.player.vx > 1.0 && this.player.isGrounded) {
        this.player.state = 'skid';
        if (Math.random() < 0.3) this.spawnDust(this.player.x + 18, this.player.y + this.player.height);
      } else {
        this.player.state = this.player.isGrounded ? 'run' : 'jump';
      }
    } else if (moveRight && !moveLeft) {
      this.player.vx += this.ACCEL;
      if (this.player.vx > maxSpeed) this.player.vx = maxSpeed;
      this.player.isFacingRight = true;
      if (this.player.vx < -1.0 && this.player.isGrounded) {
        this.player.state = 'skid';
        if (Math.random() < 0.3) this.spawnDust(this.player.x + 4, this.player.y + this.player.height);
      } else {
        this.player.state = this.player.isGrounded ? 'run' : 'jump';
      }
    } else {
      this.player.vx *= this.FRICTION;
      if (Math.abs(this.player.vx) < 0.1) this.player.vx = 0;
      this.player.state = this.player.isGrounded ? (Math.abs(this.player.vx) > 0.3 ? 'run' : 'idle') : 'jump';
    }

    // Jump execution (Buffered jump + Coyote time)
    if (this.player.jumpBufferTimer > 0 && this.player.coyoteTimer > 0) {
      this.player.vy = this.player.isSuper ? -9.8 : -9.0;
      this.player.isGrounded = false;
      this.player.coyoteTimer = 0;
      this.player.jumpBufferTimer = 0;
      this.player.squashX = 0.82;
      this.player.squashY = 1.25;
      audio.playJump(this.player.isSuper);
      this.spawnDust(this.player.x + this.player.width / 2, this.player.y + this.player.height);
    }

    // Variable jump cut: if jump key released while ascending, truncate vertical speed
    const isHoldingJump = this.keysHeld.has('arrowup') || this.keysHeld.has('w') || this.keysHeld.has(' ');
    if (!isHoldingJump && this.player.vy < -2.5) {
      this.player.vy *= 0.55;
    }

    // Apply gravity
    this.player.vy += this.GRAVITY;
    if (this.player.vy > 10.0) this.player.vy = 10.0;

    // Move player horizontally & check collisions
    this.player.x += this.player.vx;
    this.resolvePlayerCollisions(true);

    // Move player vertically & check collisions
    this.player.y += this.player.vy;
    this.player.isGrounded = false;
    this.resolvePlayerCollisions(false);

    // Screen left boundary
    if (this.player.x < 0) {
      this.player.x = 0;
      this.player.vx = 0;
    }

    // Check bottom death pit
    if (this.player.y > this.level.height + 40) {
      this.handlePlayerDeath();
      return;
    }

    // Update Level Blocks (Bounce animation)
    for (const block of this.level.blocks) {
      if (block.bounceOffset > 0) {
        block.bounceOffset += block.bounceSpeed;
        block.bounceSpeed += 0.8;
        if (block.bounceOffset <= 0) {
          block.bounceOffset = 0;
          block.bounceSpeed = 0;
        }
      }
    }

    // Update Enemies
    this.updateEnemies(dt);

    // Update Items
    this.updateItems();

    // Update Particles & Floating Text
    this.updateParticles(dt);

    // Check Flagpole Collision (Victory)
    if (this.player.x >= this.level.flagPoleX && !this.isVictoryAnimating) {
      this.startVictorySequence();
    }

    // Camera follow player with smooth lerp
    const targetCameraX = Math.max(0, Math.min(this.player.x - 280, this.level.width - 640));
    this.cameraX += (targetCameraX - this.cameraX) * 0.12;

    // Reset single frame presses
    this.justPressedKeys.clear();
  }

  private resolvePlayerCollisions(horizontal: boolean) {
    for (const block of this.level.blocks) {
      if (block.type === 'flag_pole') continue;

      if (checkAABBCollision(this.player, block)) {
        if (horizontal) {
          if (this.player.vx > 0) {
            this.player.x = block.x - this.player.width;
            this.player.vx = 0;
          } else if (this.player.vx < 0) {
            this.player.x = block.x + block.width;
            this.player.vx = 0;
          }
        } else {
          if (this.player.vy > 0) {
            // Landing on top of block
            this.player.y = block.y - this.player.height;
            this.player.vy = 0;
            if (!this.player.isGrounded) {
              this.player.squashX = 1.2;
              this.player.squashY = 0.8;
            }
            this.player.isGrounded = true;
          } else if (this.player.vy < 0) {
            // Hitting bottom of block with head
            this.player.y = block.y + block.height;
            this.player.vy = 0.5;
            this.handleBlockHit(block);
          }
        }
      }
    }
  }

  private handleBlockHit(block: Block) {
    if (block.type === 'empty_question') {
      audio.playBlockBump();
      return;
    }

    if (block.type === 'question') {
      block.type = 'empty_question';
      block.bounceOffset = 10;
      block.bounceSpeed = -4;

      if (block.content === 'coin') {
        this.coins += 1;
        this.score += 200;
        audio.playCoin();
        this.spawnCoinParticle(block.x + 8, block.y - 20);
        this.addFloatingText(block.x + 8, block.y - 14, '+200', '#facc15');
      } else if (block.content === 'powerup') {
        audio.playPowerup();
        this.spawnItem(block.x, block.y - 32, this.player.isSuper ? 'star' : 'mushroom');
      } else if (block.content === 'quiz' && block.quizId) {
        audio.playQuizPrompt();
        const question = DIGITAL_LITERACY_QUESTIONS.find(q => q.id === block.quizId) || DIGITAL_LITERACY_QUESTIONS[0];
        this.activeQuizBlock = block;
        this.pauseForQuiz();
        this.callbacks.onTriggerQuiz(question);
      }
    } else if (block.type === 'brick') {
      if (this.player.isSuper) {
        // Break brick block!
        audio.playBlockBreak();
        this.score += 50;
        this.level.blocks = this.level.blocks.filter(b => b.id !== block.id);
        this.spawnBrickDebris(block.x + 16, block.y + 16);
      } else {
        block.bounceOffset = 8;
        block.bounceSpeed = -3;
        audio.playBlockBump();
      }
    }
    this.callbacks.onScoreUpdate(this.score, this.coins, this.lives, Math.floor(this.timeRemaining));
  }

  private updateEnemies(dt: number) {
    for (const enemy of this.level.enemies) {
      if (enemy.isDefeated) {
        enemy.defeatTimer += dt;
        continue;
      }

      // Drone oscillation
      if (enemy.type === 'deepfake_drone') {
        enemy.oscillationTimer = (enemy.oscillationTimer || 0) + dt;
        enemy.x += enemy.vx;
        // Turn around after certain distance
        if (Math.abs(enemy.x - enemy.initialY) > 160) {
          enemy.vx *= -1;
        }
      } else if (enemy.type === 'clickbait_turtle' && enemy.shellState === 'sliding_shell') {
        // Sliding shell moves fast & bowls over other enemies
        enemy.x += enemy.vx;
        // Bounce against walls/pipes
        for (const block of this.level.blocks) {
          if (block.type === 'pipe_top' || block.type === 'pipe_body' || block.type === 'brick') {
            if (checkAABBCollision(enemy, block)) {
              enemy.vx *= -1;
              audio.playBlockBump();
            }
          }
        }
      } else {
        // Normal ground walking enemies
        enemy.vy += this.GRAVITY;
        enemy.x += enemy.vx;

        // Check horizontal block collision (turn around)
        for (const block of this.level.blocks) {
          if (checkAABBCollision(enemy, block)) {
            if (enemy.vx > 0) {
              enemy.x = block.x - enemy.width;
              enemy.vx *= -1;
              enemy.direction = -1;
            } else if (enemy.vx < 0) {
              enemy.x = block.x + block.width;
              enemy.vx *= -1;
              enemy.direction = 1;
            }
          }
        }

        enemy.y += enemy.vy;
        // Ground collision
        for (const block of this.level.blocks) {
          if (checkAABBCollision(enemy, block)) {
            if (enemy.vy > 0) {
              enemy.y = block.y - enemy.height;
              enemy.vy = 0;
              enemy.isGrounded = true;
            }
          }
        }
      }

      // Check collision with Player
      if (checkAABBCollision(this.player, enemy)) {
        this.resolvePlayerEnemyCollision(enemy);
      }
    }

    // Clean up long defeated enemies
    this.level.enemies = this.level.enemies.filter(e => !e.isDefeated || e.defeatTimer < 0.5);
  }

  private resolvePlayerEnemyCollision(enemy: Enemy) {
    if (this.player.invincibleTimer > 0 && !this.player.isStar) return;

    const stompResult = calculateEnemyStomp(this.player, enemy);

    if (stompResult.action === 'stomp_kill' || stompResult.action === 'star_kill') {
      this.hitstopTimer = 0.05; // 50ms hitstop
      audio.playStomp();
      this.player.vy = stompResult.bounceVy;
      this.score += 300;
      this.addFloatingText(enemy.x, enemy.y - 10, '+300 DIBERSIHKAN!', '#38bdf8');

      if (enemy.type === 'clickbait_turtle') {
        enemy.shellState = 'idle_shell';
        enemy.vx = 0;
      } else {
        enemy.isDefeated = true;
      }
      this.callbacks.onScoreUpdate(this.score, this.coins, this.lives, Math.floor(this.timeRemaining));
    } else if (stompResult.action === 'shell_kick') {
      audio.playBlockBump();
      enemy.shellState = 'sliding_shell';
      enemy.vx = this.player.isFacingRight ? 7.5 : -7.5;
      this.score += 400;
      this.addFloatingText(enemy.x, enemy.y - 10, '+400 TENDANG!', '#f59e0b');
    } else if (stompResult.action === 'shell_stop') {
      audio.playStomp();
      enemy.shellState = 'idle_shell';
      enemy.vx = 0;
      this.player.vy = stompResult.bounceVy;
    } else if (stompResult.action === 'player_hurt') {
      const damage = calculatePlayerDamage(this.lives, this.player.isSuper, this.player.isStar);
      if (damage.isDead) {
        this.handlePlayerDeath();
      } else {
        audio.playHurt();
        this.lives = damage.newLives;
        this.player.isSuper = damage.newIsSuper;
        if (damage.grantedInvincible) {
          this.player.invincibleTimer = 1.8;
        }
        // Squash player down
        this.player.squashX = 1.3;
        this.player.squashY = 0.7;
        this.callbacks.onScoreUpdate(this.score, this.coins, this.lives, Math.floor(this.timeRemaining));
      }
    }
  }

  private updateItems() {
    for (const item of this.level.items) {
      if (item.collected) continue;

      // Item physics
      item.vy += this.GRAVITY * 0.7;
      item.x += item.vx;
      item.y += item.vy;

      // Block collision
      for (const block of this.level.blocks) {
        if (checkAABBCollision(item, block)) {
          if (item.vy > 0) {
            item.y = block.y - item.height;
            item.vy = item.type === 'star' ? -4.5 : 0; // Star bounces!
          }
        }
      }

      // Player touches item
      if (checkAABBCollision(this.player, item)) {
        item.collected = true;
        if (item.type === 'coin') {
          this.coins += 1;
          this.score += 200;
          audio.playCoin();
          this.addFloatingText(item.x, item.y, '+200', '#facc15');
        } else if (item.type === 'mushroom') {
          this.player.isSuper = true;
          this.player.height = 36;
          this.score += 1000;
          audio.playPowerup();
          this.addFloatingText(item.x, item.y, 'SUPER FAKTA!', '#38bdf8');
        } else if (item.type === 'star') {
          this.player.isStar = true;
          this.player.starTimer = 10.0;
          this.score += 1000;
          audio.playPowerup();
          this.addFloatingText(item.x, item.y, 'BINTANG VERIFIKASI!', '#facc15');
        }
        this.callbacks.onScoreUpdate(this.score, this.coins, this.lives, Math.floor(this.timeRemaining));
      }
    }
  }

  private spawnItem(x: number, y: number, type: 'coin' | 'mushroom' | 'star') {
    this.level.items.push({
      id: `item_${Date.now()}_${Math.random()}`,
      type,
      x,
      y,
      width: 24,
      height: 24,
      vx: type === 'coin' ? 0 : 1.5,
      vy: -4,
      isGrounded: false,
      collected: false
    });
  }

  private handlePlayerDeath() {
    this.lives = Math.max(0, this.lives - 1);
    audio.playGameOver();
    if (this.lives <= 0) {
      this.callbacks.onGameOver({
        score: this.score,
        coins: this.coins,
        worldName: this.level.worldName
      });
    } else {
      // Respawn at beginning of level
      this.player = this.createInitialPlayer();
      this.timeRemaining = this.level.timeLimit;
      this.cameraX = 0;
      this.callbacks.onScoreUpdate(this.score, this.coins, this.lives, Math.floor(this.timeRemaining));
    }
  }

  private startVictorySequence() {
    this.isVictoryAnimating = true;
    this.victoryStep = 0;
    this.player.vx = 0;
    this.player.vy = 0;
    audio.stopMusic();
    audio.playStageVictory();
  }

  private updateVictorySequence(dt: number) {
    if (this.victoryStep === 0) {
      // Slide down flagpole
      this.player.y += 3.5;
      if (this.player.y >= 384) {
        this.player.y = 384;
        this.victoryStep = 1;
      }
    } else if (this.victoryStep === 1) {
      // Walk into castle
      this.player.isFacingRight = true;
      this.player.state = 'run';
      this.player.x += 2.0;

      if (this.player.x >= this.level.castleX + 40) {
        this.victoryStep = 2;
        // Trigger Victory Modal
        this.callbacks.onVictory({
          score: this.score,
          coins: this.coins,
          timeRemaining: Math.floor(this.timeRemaining),
          worldIndex: this.worldIndex
        });
      }
    }
  }

  // --- PARTICLES & JUICE ---
  private spawnDust(x: number, y: number) {
    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x,
        y: y - 2,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 1.2,
        color: '#e2e8f0',
        size: 3,
        life: 0.3,
        maxLife: 0.3,
        shape: 'rect'
      });
    }
  }

  private spawnCoinParticle(x: number, y: number) {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 4 - 2,
        color: '#fde047',
        size: 3,
        life: 0.5,
        maxLife: 0.5,
        shape: 'spark'
      });
    }
  }

  private spawnBrickDebris(x: number, y: number) {
    const velocities = [
      { vx: -2.5, vy: -5 },
      { vx: 2.5, vy: -5 },
      { vx: -2, vy: -2 },
      { vx: 2, vy: -2 }
    ];
    for (const v of velocities) {
      this.particles.push({
        x,
        y,
        vx: v.vx,
        vy: v.vy,
        color: '#b45309',
        size: 6,
        life: 0.8,
        maxLife: 0.8,
        shape: 'rect'
      });
    }
  }

  private addFloatingText(x: number, y: number, text: string, color: string) {
    this.floatingTexts.push({
      id: `ft_${Date.now()}_${Math.random()}`,
      x,
      y,
      vy: -1.2,
      text,
      color,
      life: 0.9,
      maxLife: 0.9
    });
  }

  private updateParticles(dt: number) {
    // Update particles
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // Gravity
      p.life -= dt;
    }
    this.particles = this.particles.filter(p => p.life > 0);

    // Update floating texts
    for (const ft of this.floatingTexts) {
      ft.y += ft.vy;
      ft.life -= dt;
    }
    this.floatingTexts = this.floatingTexts.filter(ft => ft.life > 0);
  }
}
