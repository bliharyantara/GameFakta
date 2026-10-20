import { Block, Enemy, FloatingText, Item, LevelConfig, Particle, Player } from './types';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private animTimer: number = 0;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public render(
    player: Player,
    level: LevelConfig,
    cameraX: number,
    particles: Particle[],
    floatingTexts: FloatingText[],
    dt: number
  ) {
    this.animTimer += dt;
    const ctx = this.ctx;
    ctx.imageSmoothingEnabled = false;

    // 1. Draw Background
    this.drawBackground(level, cameraX);

    // Save context for camera translation
    ctx.save();
    ctx.translate(-Math.round(cameraX), 0);

    // 2. Draw Level Structure (Castle, Flag, Blocks)
    this.drawCastle(level.castleX, 416);
    this.drawFlagPole(level.flagPoleX, 416);

    for (const block of level.blocks) {
      // Frustum culling: only draw visible blocks
      if (block.x + block.width >= cameraX - 32 && block.x <= cameraX + this.width + 32) {
        this.drawBlock(block, level.theme);
      }
    }

    // 3. Draw Items
    for (const item of level.items) {
      if (!item.collected && item.x + item.width >= cameraX - 32 && item.x <= cameraX + this.width + 32) {
        this.drawItem(item);
      }
    }

    // 4. Draw Enemies
    for (const enemy of level.enemies) {
      if (enemy.x + enemy.width >= cameraX - 48 && enemy.x <= cameraX + this.width + 48) {
        this.drawEnemy(enemy);
      }
    }

    // 5. Draw Player
    this.drawPlayer(player);

    // 6. Draw Particles
    this.drawParticles(particles);

    // 7. Draw Floating Texts
    this.drawFloatingTexts(floatingTexts);

    ctx.restore();
  }

  // --- BACKGROUND RENDERING ---
  private drawBackground(level: LevelConfig, cameraX: number) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    if (level.theme === 'day') {
      // Classic Mario Cyan Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#5c94fc');
      skyGrad.addColorStop(1, '#92b5ff');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Distant Parallax Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      const cloudOffset = (cameraX * 0.15) % 800;
      for (let cx = -cloudOffset - 100; cx < w + 200; cx += 260) {
        this.drawCloud(cx, 60);
        this.drawCloud(cx + 120, 110);
      }

      // Parallax Green Cyber Hills
      ctx.fillStyle = '#10b981';
      const hillOffset = (cameraX * 0.35) % 600;
      for (let hx = -hillOffset - 200; hx < w + 200; hx += 350) {
        this.drawHill(hx, 416, 120, 70);
        this.drawHill(hx + 170, 416, 70, 45);
      }
    } else if (level.theme === 'underground') {
      // Underground Cyber Indigo Cave
      const caveGrad = ctx.createLinearGradient(0, 0, 0, h);
      caveGrad.addColorStop(0, '#0f172a');
      caveGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = caveGrad;
      ctx.fillRect(0, 0, w, h);

      // Matrix/Circuit digital lines
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.lineWidth = 1;
      const gridOffset = (cameraX * 0.2) % 40;
      for (let x = -gridOffset; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
    } else {
      // Cyber Castle / Crimson Infodemi
      const castleSky = ctx.createLinearGradient(0, 0, 0, h);
      castleSky.addColorStop(0, '#310b1a');
      castleSky.addColorStop(1, '#11050a');
      ctx.fillStyle = castleSky;
      ctx.fillRect(0, 0, w, h);

      // Glowing circuit tracks in background
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.lineWidth = 2;
      const circuitOffset = (cameraX * 0.25) % 60;
      for (let x = -circuitOffset; x < w; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 80);
        ctx.lineTo(x + 30, 160);
        ctx.lineTo(x + 30, 416);
        ctx.stroke();
      }
    }
  }

  private drawCloud(x: number, y: number) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.arc(x + 16, y - 6, 20, 0, Math.PI * 2);
    ctx.arc(x + 36, y - 2, 18, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawHill(x: number, groundY: number, radiusX: number, radiusY: number) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.ellipse(x, groundY, radiusX, radiusY, 0, Math.PI, 0, false);
    ctx.fill();
    // Hill border
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  // --- BLOCKS RENDERING ---
  private drawBlock(block: Block, theme: 'day' | 'underground' | 'cybercastle') {
    const ctx = this.ctx;
    const y = block.y - block.bounceOffset;

    if (block.type === 'ground') {
      const topColor = theme === 'day' ? '#10b981' : theme === 'underground' ? '#6366f1' : '#ef4444';
      const bodyColor = theme === 'day' ? '#92400e' : theme === 'underground' ? '#1e293b' : '#3f1118';
      const detailColor = theme === 'day' ? '#78350f' : theme === 'underground' ? '#0f172a' : '#230910';

      // Ground block body extending down to bottom of viewport
      ctx.fillStyle = bodyColor;
      ctx.fillRect(block.x, y, block.width, 600);

      // Top grass / cyber edge
      ctx.fillStyle = topColor;
      ctx.fillRect(block.x, y, block.width, 5);

      // Brick pattern lines across ground depth
      ctx.strokeStyle = detailColor;
      ctx.lineWidth = 2;
      for (let gy = y; gy < y + 600; gy += 32) {
        ctx.strokeRect(block.x + 1, gy + 1, block.width - 2, 30);
      }
    } else if (block.type === 'brick') {
      const brickColor = theme === 'underground' ? '#334155' : theme === 'cybercastle' ? '#581c87' : '#b45309';
      const mortarColor = theme === 'underground' ? '#1e293b' : theme === 'cybercastle' ? '#2e1065' : '#78350f';

      ctx.fillStyle = brickColor;
      ctx.fillRect(block.x, y, block.width, block.height);

      // Bevel effect
      ctx.strokeStyle = mortarColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(block.x + 1, y + 1, block.width - 2, block.height - 2);

      // Brick divider
      ctx.beginPath();
      ctx.moveTo(block.x, y + 16);
      ctx.lineTo(block.x + block.width, y + 16);
      ctx.moveTo(block.x + 16, y);
      ctx.lineTo(block.x + 16, y + 16);
      ctx.moveTo(block.x + 8, y + 16);
      ctx.lineTo(block.x + 8, y + block.height);
      ctx.moveTo(block.x + 24, y + 16);
      ctx.lineTo(block.x + 24, y + block.height);
      ctx.stroke();
    } else if (block.type === 'question') {
      // Golden Question Mark Block
      const pulse = Math.sin(this.animTimer * 6) * 0.15;
      const baseColor = block.content === 'quiz' ? '#f59e0b' : '#eab308';

      ctx.fillStyle = baseColor;
      ctx.fillRect(block.x, y, block.width, block.height);

      // 3D border
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(block.x, y, block.width, 3);
      ctx.fillRect(block.x, y, 3, block.height);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(block.x + block.width - 3, y, 3, block.height);
      ctx.fillRect(block.x, y + block.height - 3, block.width, 3);

      // Question mark or Quiz symbol
      ctx.fillStyle = '#451a03';
      ctx.font = 'bold 16px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (block.content === 'quiz') {
        // Glowing Quiz "?" icon
        ctx.fillStyle = '#ffffff';
        ctx.fillText('?', block.x + 16, y + 16);
        ctx.fillStyle = '#78350f';
        ctx.fillText('?', block.x + 15, y + 15);
      } else {
        ctx.fillText('?', block.x + 16, y + 16);
      }
    } else if (block.type === 'empty_question') {
      // Empty used block (Brown inactive)
      ctx.fillStyle = '#78350f';
      ctx.fillRect(block.x, y, block.width, block.height);
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2;
      ctx.strokeRect(block.x + 2, y + 2, block.width - 4, block.height - 4);
    } else if (block.type === 'pipe_top') {
      // Green Warp Pipe Rim
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(block.x, y, block.width, block.height);

      // Specular highlight
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(block.x + 6, y, 6, block.height);

      // Shadow border
      ctx.strokeStyle = '#14532d';
      ctx.lineWidth = 2;
      ctx.strokeRect(block.x + 1, y + 1, block.width - 2, block.height - 2);
    } else if (block.type === 'pipe_body') {
      // Pipe Shaft
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(block.x + 3, y, block.width - 6, block.height);

      ctx.fillStyle = '#4ade80';
      ctx.fillRect(block.x + 8, y, 6, block.height);

      ctx.strokeStyle = '#14532d';
      ctx.lineWidth = 2;
      ctx.strokeRect(block.x + 3, y, block.width - 6, block.height);
    }
  }

  // --- CASTLE & FLAGPOLE ---
  private drawFlagPole(x: number, groundY: number) {
    const ctx = this.ctx;
    const poleHeight = 240;
    const poleTopY = groundY - poleHeight;

    // Pole sphere top
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(x, poleTopY, 7, 0, Math.PI * 2);
    ctx.fill();

    // Pole rod
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(x - 2, poleTopY, 4, poleHeight);

    // Green verification flag
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(x - 2, poleTopY + 12);
    ctx.lineTo(x - 36, poleTopY + 28);
    ctx.lineTo(x - 2, poleTopY + 44);
    ctx.closePath();
    ctx.fill();

    // Checkmark on flag
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px monospace';
    ctx.fillText('✓', x - 22, poleTopY + 31);
  }

  private drawCastle(x: number, groundY: number) {
    const ctx = this.ctx;
    const w = 120;
    const h = 140;
    const y = groundY - h;

    // Castle Base
    ctx.fillStyle = '#475569';
    ctx.fillRect(x, y + 40, w, h - 40);

    // Battlements
    for (let bx = 0; bx < w; bx += 24) {
      ctx.fillRect(x + bx, y + 20, 16, 20);
    }

    // Doorway
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h - 35, 20, Math.PI, 0, false);
    ctx.rect(x + w / 2 - 20, y + h - 35, 40, 35);
    ctx.fill();

    // Flag atop castle
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w / 2 + 16, y + 8);
    ctx.lineTo(x + w / 2, y + 16);
    ctx.closePath();
    ctx.fill();
  }

  // --- PLAYER RENDERING ---
  private drawPlayer(player: Player) {
    const ctx = this.ctx;
    const w = player.width;
    const h = player.height;
    const x = player.x + (player.isFacingRight ? 0 : w);

    ctx.save();
    ctx.translate(player.x + w / 2, player.y + h / 2);

    // Squash & Stretch
    ctx.scale(player.squashX, player.squashY);

    if (!player.isFacingRight) {
      ctx.scale(-1, 1);
    }

    const rx = -w / 2;
    const ry = -h / 2;

    // Flashing when invincible or star mode
    if (player.invincibleTimer > 0 && Math.floor(player.invincibleTimer * 20) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    // Rainbow star mode
    let capColor = '#dc2626';
    let overallColor = '#2563eb';
    let skinColor = '#fed7aa';

    if (player.isStar) {
      const hue = Math.floor((this.animTimer * 720) % 360);
      capColor = `hsl(${hue}, 90%, 55%)`;
      overallColor = `hsl(${(hue + 120) % 360}, 90%, 50%)`;
    } else if (player.isSuper) {
      capColor = '#f59e0b'; // Gold super fact-checker cap
      overallColor = '#0284c7';
    }

    // 1. Hat / Cap
    ctx.fillStyle = capColor;
    ctx.fillRect(rx + 2, ry, w - 4, 7);
    ctx.fillRect(rx + w - 8, ry + 4, 8, 4); // Cap visor

    // 2. Face / Head
    ctx.fillStyle = skinColor;
    ctx.fillRect(rx + 4, ry + 7, w - 8, 9);

    // Eye
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(rx + w - 8, ry + 9, 2, 3);

    // Mustache
    ctx.fillStyle = '#451a03';
    ctx.fillRect(rx + w - 10, ry + 12, 6, 3);

    // 3. Shirt & Overalls Body
    ctx.fillStyle = capColor; // Shirt sleeve color matches cap
    ctx.fillRect(rx + 2, ry + 16, w - 4, 8);

    // Blue overalls
    ctx.fillStyle = overallColor;
    ctx.fillRect(rx + 4, ry + 18, w - 8, h - 24);

    // Overall straps & Yellow buttons
    ctx.fillStyle = '#facc15';
    ctx.fillRect(rx + 6, ry + 19, 2, 2);
    ctx.fillRect(rx + w - 8, ry + 19, 2, 2);

    // 4. Legs / Feet (Animated running)
    ctx.fillStyle = '#78350f'; // Shoes
    if (player.state === 'jump') {
      // Jump pose with extended legs
      ctx.fillRect(rx + 2, ry + h - 6, 6, 6);
      ctx.fillRect(rx + w - 7, ry + h - 8, 7, 6);
    } else if (player.state === 'run') {
      const legOffset = Math.sin(this.animTimer * 18) * 4;
      ctx.fillRect(rx + 2 + legOffset, ry + h - 6, 6, 6);
      ctx.fillRect(rx + w - 8 - legOffset, ry + h - 6, 6, 6);
    } else if (player.state === 'skid') {
      // Skid pose
      ctx.fillRect(rx + 1, ry + h - 5, 8, 5);
      ctx.fillRect(rx + w - 7, ry + h - 5, 7, 5);
    } else {
      // Idle
      ctx.fillRect(rx + 3, ry + h - 5, 6, 5);
      ctx.fillRect(rx + w - 9, ry + h - 5, 6, 5);
    }

    // Super Magnifier Fact Icon on back
    if (player.isSuper) {
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(rx + 5, ry + 12, 4, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  // --- ENEMIES RENDERING ---
  private drawEnemy(enemy: Enemy) {
    const ctx = this.ctx;
    const x = enemy.x;
    const y = enemy.y;
    const w = enemy.width;
    const h = enemy.height;

    if (enemy.isDefeated) {
      // Squashed or tumbling out
      ctx.save();
      ctx.translate(x + w / 2, y + h / 2);
      ctx.scale(1, 0.3);
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.restore();
      return;
    }

    if (enemy.type === 'hoax_bot') {
      // Goomba-style Cyber Hoax Bot (Malware Bug)
      const walkBob = Math.sin(this.animTimer * 14) * 2;
      ctx.fillStyle = '#991b1b'; // Deep malware red
      ctx.beginPath();
      ctx.arc(x + w / 2, y + 10 + walkBob, 11, Math.PI, 0, false);
      ctx.lineTo(x + w - 1, y + h - 4);
      ctx.lineTo(x + 1, y + h - 4);
      ctx.closePath();
      ctx.fill();

      // Antenna with "!"
      ctx.strokeStyle = '#f87171';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + w / 2, y - 4);
      ctx.lineTo(x + w / 2, y + 4);
      ctx.stroke();
      ctx.fillStyle = '#facc15';
      ctx.fillRect(x + w / 2 - 2, y - 7, 4, 4);

      // Angled Angry Eyes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 4, y + 8 + walkBob, 5, 5);
      ctx.fillRect(x + w - 9, y + 8 + walkBob, 5, 5);
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + 6, y + 9 + walkBob, 3, 3);
      ctx.fillRect(x + w - 7, y + 9 + walkBob, 3, 3);

      // Little robot feet
      ctx.fillStyle = '#450a0a';
      const footSwing = Math.cos(this.animTimer * 14) * 3;
      ctx.fillRect(x + 1 + footSwing, y + h - 4, 8, 4);
      ctx.fillRect(x + w - 9 - footSwing, y + h - 4, 8, 4);
    } else if (enemy.type === 'clickbait_turtle') {
      // Koopa-style Clickbait Turtle
      if (enemy.shellState === 'idle_shell' || enemy.shellState === 'sliding_shell') {
        // Spiky exclamation shell
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Big "!" on shell
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('!', x + w / 2, y + h / 2 + 4);
      } else {
        // Walking turtle
        ctx.fillStyle = '#d97706'; // Orange shell
        ctx.fillRect(x + 4, y + 8, w - 8, h - 14);

        // Green reptilian head
        ctx.fillStyle = '#16a34a';
        const headX = enemy.direction < 0 ? x : x + w - 8;
        ctx.fillRect(headX, y + 2, 10, 10);

        // Eye
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(headX + 2, y + 4, 3, 3);

        // Feet
        ctx.fillStyle = '#facc15';
        ctx.fillRect(x + 2, y + h - 5, 6, 5);
        ctx.fillRect(x + w - 8, y + h - 5, 6, 5);
      }
    } else if (enemy.type === 'deepfake_drone') {
      // Flying camera drone
      const bobY = y + Math.sin((enemy.oscillationTimer || 0) * 3) * 6;

      // Drone body
      ctx.fillStyle = '#475569';
      ctx.fillRect(x + 2, bobY + 4, w - 4, h - 8);

      // Spinning rotor
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      const bladeW = Math.abs(Math.sin(this.animTimer * 30)) * 14;
      ctx.beginPath();
      ctx.moveTo(x + w / 2 - bladeW, bobY);
      ctx.lineTo(x + w / 2 + bladeW, bobY);
      ctx.stroke();

      // Glowing lens
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(x + w / 2, bobY + h / 2, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- ITEMS RENDERING ---
  private drawItem(item: Item) {
    const ctx = this.ctx;
    const x = item.x;
    const y = item.y;

    if (item.type === 'coin') {
      // Spinning Coin
      const spinScale = Math.abs(Math.cos(this.animTimer * 8));
      ctx.save();
      ctx.translate(x + item.width / 2, y + item.height / 2);
      ctx.scale(spinScale, 1);
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    } else if (item.type === 'mushroom') {
      // Fact Magnifier Mushroom (Super Mushroom)
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(x + 12, y + 10, 11, Math.PI, 0, false);
      ctx.fill();

      // White spots
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x + 12, y + 6, 4, 0, Math.PI * 2);
      ctx.fill();

      // Stem
      ctx.fillStyle = '#fde047';
      ctx.fillRect(x + 6, y + 10, 12, 10);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 8, y + 12, 2, 4);
      ctx.fillRect(x + 14, y + 12, 2, 4);
    } else if (item.type === 'star') {
      // Verification Star
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(x + 12, y + 12, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 8, y + 9, 2, 4);
      ctx.fillRect(x + 14, y + 9, 2, 4);
    }
  }

  // --- PARTICLES & FLOATING TEXTS ---
  private drawParticles(particles: Particle[]) {
    const ctx = this.ctx;
    for (const p of particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      if (p.shape === 'spark') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
    }
    ctx.globalAlpha = 1.0;
  }

  private drawFloatingTexts(floatingTexts: FloatingText[]) {
    const ctx = this.ctx;
    ctx.font = 'bold 12px "Press Start 2P", monospace';
    ctx.textAlign = 'center';

    for (const ft of floatingTexts) {
      const alpha = Math.max(0, ft.life / ft.maxLife);
      ctx.globalAlpha = alpha;
      // Outline for readability
      ctx.fillStyle = '#000000';
      ctx.fillText(ft.text, ft.x - 1, ft.y);
      ctx.fillText(ft.text, ft.x + 1, ft.y);
      ctx.fillText(ft.text, ft.x, ft.y - 1);
      ctx.fillText(ft.text, ft.x, ft.y + 1);

      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.globalAlpha = 1.0;
  }
}
