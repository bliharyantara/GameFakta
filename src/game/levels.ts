import { Block, Enemy, Item, LevelConfig } from './types';
import { DIGITAL_LITERACY_QUESTIONS } from './questions';

export function createWorldLevel(levelIndex: number): LevelConfig {
  const TILE = 32;

  if (levelIndex === 1) {
    // --- DUNIA 1-2: GUA NETIZEN (Underground Cyber Cave) ---
    const blocks: Block[] = [];
    const enemies: Enemy[] = [];
    const items: Item[] = [];
    const levelWidth = 3200;
    const groundY = 416;

    // Continuous ground with a few gaps
    for (let x = 0; x < levelWidth; x += TILE) {
      if ((x >= 640 && x <= 736) || (x >= 1400 && x <= 1500) || (x >= 2200 && x <= 2320)) {
        continue; // Gaps
      }
      blocks.push({
        id: `g_${x}`,
        type: 'ground',
        x,
        y: groundY,
        width: TILE,
        height: 64,
        bounceOffset: 0,
        bounceSpeed: 0,
        content: 'none'
      });
    }

    // Overhead cave ceiling
    for (let x = 0; x < levelWidth - 300; x += TILE) {
      blocks.push({
        id: `ceil_${x}`,
        type: 'brick',
        x,
        y: 0,
        width: TILE,
        height: TILE,
        bounceOffset: 0,
        bounceSpeed: 0,
        content: 'none'
      });
    }

    // Pipes
    const pipeXs = [400, 950, 1750, 2550];
    pipeXs.forEach((px, i) => {
      const height = (2 + (i % 2)) * TILE;
      blocks.push({
        id: `pipe_top_${px}`,
        type: 'pipe_top',
        x: px,
        y: groundY - height,
        width: TILE * 2,
        height: TILE,
        bounceOffset: 0,
        bounceSpeed: 0,
        content: 'none'
      });
      blocks.push({
        id: `pipe_body_${px}`,
        type: 'pipe_body',
        x: px,
        y: groundY - height + TILE,
        width: TILE * 2,
        height: height - TILE,
        bounceOffset: 0,
        bounceSpeed: 0,
        content: 'none'
      });
    });

    // Elevated platforms & Quiz question blocks
    const questionBlocksConfig = [
      { x: 300, y: groundY - 110, content: 'quiz' as const, qId: 'q12' },
      { x: 332, y: groundY - 110, content: 'coin' as const },
      { x: 364, y: groundY - 110, content: 'quiz' as const, qId: 'q13' },
      { x: 800, y: groundY - 120, content: 'powerup' as const },
      { x: 1100, y: groundY - 130, content: 'quiz' as const, qId: 'q14' },
      { x: 1250, y: groundY - 110, content: 'coin' as const },
      { x: 1600, y: groundY - 120, content: 'quiz' as const, qId: 'q15' },
      { x: 1950, y: groundY - 130, content: 'powerup' as const },
      { x: 2100, y: groundY - 120, content: 'quiz' as const, qId: 'q16' }
    ];

    questionBlocksConfig.forEach((qb, idx) => {
      blocks.push({
        id: `qb_${idx}`,
        type: 'question',
        x: qb.x,
        y: qb.y,
        width: TILE,
        height: TILE,
        bounceOffset: 0,
        bounceSpeed: 0,
        content: qb.content,
        quizId: qb.qId
      });
    });

    // Brick formations
    const brickPositions = [
      { x: 268, y: groundY - 110 },
      { x: 396, y: groundY - 110 },
      { x: 1068, y: groundY - 130 },
      { x: 1132, y: groundY - 130 },
      { x: 1568, y: groundY - 120 },
      { x: 1632, y: groundY - 120 },
      { x: 2068, y: groundY - 120 },
      { x: 2132, y: groundY - 120 }
    ];
    brickPositions.forEach((bp, i) => {
      blocks.push({
        id: `brick_${i}`,
        type: 'brick',
        x: bp.x,
        y: bp.y,
        width: TILE,
        height: TILE,
        bounceOffset: 0,
        bounceSpeed: 0,
        content: 'none'
      });
    });

    // Enemies
    enemies.push(
      { id: 'e1', type: 'hoax_bot', x: 500, y: groundY - 24, width: 24, height: 24, vx: -1.2, vy: 0, isGrounded: true, isDefeated: false, defeatTimer: 0, direction: -1, initialY: groundY - 24 },
      { id: 'e2', type: 'clickbait_turtle', x: 850, y: groundY - 32, width: 24, height: 32, vx: -1.0, vy: 0, isGrounded: true, isDefeated: false, defeatTimer: 0, direction: -1, shellState: 'walking', initialY: groundY - 32 },
      { id: 'e3', type: 'deepfake_drone', x: 1200, y: groundY - 140, width: 26, height: 20, vx: -1.2, vy: 0, isGrounded: false, isDefeated: false, defeatTimer: 0, direction: -1, initialY: groundY - 140, oscillationTimer: 0 },
      { id: 'e4', type: 'hoax_bot', x: 1650, y: groundY - 24, width: 24, height: 24, vx: -1.2, vy: 0, isGrounded: true, isDefeated: false, defeatTimer: 0, direction: -1, initialY: groundY - 24 },
      { id: 'e5', type: 'clickbait_turtle', x: 2000, y: groundY - 32, width: 24, height: 32, vx: -1.0, vy: 0, isGrounded: true, isDefeated: false, defeatTimer: 0, direction: -1, shellState: 'walking', initialY: groundY - 32 },
      { id: 'e6', type: 'deepfake_drone', x: 2400, y: groundY - 150, width: 26, height: 20, vx: -1.2, vy: 0, isGrounded: false, isDefeated: false, defeatTimer: 0, direction: -1, initialY: groundY - 150, oscillationTimer: 1.5 }
    );

    const flagPoleX = 2850;
    const flagPoleY = groundY - 280;

    return {
      id: 'world-1-2',
      worldName: 'DUNIA 1-2',
      title: 'Gua Komentar Netizen',
      subtitle: 'Tantangan: Memilah Opini Subjektif dari Fakta Objektif',
      theme: 'underground',
      width: levelWidth,
      height: 480,
      timeLimit: 360,
      flagPoleX,
      castleX: flagPoleX + 160,
      blocks,
      enemies,
      items
    };
  }

  if (levelIndex === 2) {
    // --- DUNIA 1-3: MENARA DEEPFAKE & INFODEMI (Castle Theme) ---
    const blocks: Block[] = [];
    const enemies: Enemy[] = [];
    const items: Item[] = [];
    const levelWidth = 3400;
    const groundY = 416;

    for (let x = 0; x < levelWidth; x += TILE) {
      if ((x >= 800 && x <= 920) || (x >= 1500 && x <= 1640) || (x >= 2300 && x <= 2440)) {
        continue; // Lava / Cyber pit
      }
      blocks.push({
        id: `g_${x}`,
        type: 'ground',
        x,
        y: groundY,
        width: TILE,
        height: 64,
        bounceOffset: 0,
        bounceSpeed: 0,
        content: 'none'
      });
    }

    // Stepping stone platforms
    const castleSteps = [
      { x: 830, y: groundY - 60, w: 64 },
      { x: 1530, y: groundY - 70, w: 80 },
      { x: 2330, y: groundY - 70, w: 80 }
    ];
    castleSteps.forEach((s, idx) => {
      blocks.push({
        id: `step_${idx}`,
        type: 'brick',
        x: s.x,
        y: s.y,
        width: s.w,
        height: TILE,
        bounceOffset: 0,
        bounceSpeed: 0,
        content: 'none'
      });
    });

    // High question blocks
    const qbList = [
      { x: 350, y: groundY - 110, content: 'quiz' as const, qId: 'q2' },
      { x: 382, y: groundY - 110, content: 'powerup' as const },
      { x: 650, y: groundY - 120, content: 'coin' as const },
      { x: 1050, y: groundY - 130, content: 'quiz' as const, qId: 'q8' },
      { x: 1300, y: groundY - 120, content: 'quiz' as const, qId: 'q10' },
      { x: 1750, y: groundY - 130, content: 'powerup' as const },
      { x: 1950, y: groundY - 110, content: 'quiz' as const, qId: 'q5' },
      { x: 2150, y: groundY - 130, content: 'quiz' as const, qId: 'q6' }
    ];
    qbList.forEach((qb, i) => {
      blocks.push({
        id: `cqb_${i}`,
        type: 'question',
        x: qb.x,
        y: qb.y,
        width: TILE,
        height: TILE,
        bounceOffset: 0,
        bounceSpeed: 0,
        content: qb.content,
        quizId: qb.qId
      });
    });

    // Enemies in castle
    enemies.push(
      { id: 'ce1', type: 'hoax_bot', x: 450, y: groundY - 24, width: 24, height: 24, vx: -1.3, vy: 0, isGrounded: true, isDefeated: false, defeatTimer: 0, direction: -1, initialY: groundY - 24 },
      { id: 'ce2', type: 'deepfake_drone', x: 700, y: groundY - 160, width: 26, height: 20, vx: -1.4, vy: 0, isGrounded: false, isDefeated: false, defeatTimer: 0, direction: -1, initialY: groundY - 160, oscillationTimer: 0 },
      { id: 'ce3', type: 'clickbait_turtle', x: 1100, y: groundY - 32, width: 24, height: 32, vx: -1.1, vy: 0, isGrounded: true, isDefeated: false, defeatTimer: 0, direction: -1, shellState: 'walking', initialY: groundY - 32 },
      { id: 'ce4', type: 'deepfake_drone', x: 1400, y: groundY - 150, width: 26, height: 20, vx: -1.4, vy: 0, isGrounded: false, isDefeated: false, defeatTimer: 0, direction: -1, initialY: groundY - 150, oscillationTimer: 1.0 },
      { id: 'ce5', type: 'clickbait_turtle', x: 1850, y: groundY - 32, width: 24, height: 32, vx: -1.1, vy: 0, isGrounded: true, isDefeated: false, defeatTimer: 0, direction: -1, shellState: 'walking', initialY: groundY - 32 },
      { id: 'ce6', type: 'hoax_bot', x: 2200, y: groundY - 24, width: 24, height: 24, vx: -1.4, vy: 0, isGrounded: true, isDefeated: false, defeatTimer: 0, direction: -1, initialY: groundY - 24 },
      { id: 'ce7', type: 'deepfake_drone', x: 2600, y: groundY - 160, width: 26, height: 20, vx: -1.5, vy: 0, isGrounded: false, isDefeated: false, defeatTimer: 0, direction: -1, initialY: groundY - 160, oscillationTimer: 2.2 }
    );

    const flagPoleX = 2950;
    return {
      id: 'world-1-3',
      worldName: 'DUNIA 1-3',
      title: 'Menara Deepfake & Infodemi',
      subtitle: 'Tantangan Pamungkas: Melawan Virus Misinformasi Tingkat Tinggi',
      theme: 'cybercastle',
      width: levelWidth,
      height: 480,
      timeLimit: 300,
      flagPoleX,
      castleX: flagPoleX + 160,
      blocks,
      enemies,
      items
    };
  }

  // --- DEFAULT: DUNIA 1-1: TAMAN ALGORITMA (Classic Day Theme) ---
  const blocks: Block[] = [];
  const enemies: Enemy[] = [];
  const items: Item[] = [];
  const levelWidth = 3200;
  const groundY = 416;

  // Solid ground with classic gap at 1200
  for (let x = 0; x < levelWidth; x += TILE) {
    if ((x >= 1200 && x <= 1296) || (x >= 2100 && x <= 2200)) {
      continue; // Jump gaps
    }
    blocks.push({
      id: `g_${x}`,
      type: 'ground',
      x,
      y: groundY,
      width: TILE,
      height: 64,
      bounceOffset: 0,
      bounceSpeed: 0,
      content: 'none'
    });
  }

  // Classic Mario Pipes
  const pipes = [
    { x: 380, h: 2 },
    { x: 620, h: 3 },
    { x: 920, h: 4 },
    { x: 1550, h: 2 },
    { x: 1850, h: 3 },
    { x: 2450, h: 2 }
  ];

  pipes.forEach(p => {
    const pipeHeight = p.h * TILE;
    blocks.push({
      id: `pipe_top_${p.x}`,
      type: 'pipe_top',
      x: p.x,
      y: groundY - pipeHeight,
      width: TILE * 2,
      height: TILE,
      bounceOffset: 0,
      bounceSpeed: 0,
      content: 'none'
    });
    blocks.push({
      id: `pipe_body_${p.x}`,
      type: 'pipe_body',
      x: p.x,
      y: groundY - pipeHeight + TILE,
      width: TILE * 2,
      height: pipeHeight - TILE,
      bounceOffset: 0,
      bounceSpeed: 0,
      content: 'none'
    });
  });

  // Question blocks & Bricks cluster (classic ? # ? # ? style)
  // Cluster 1
  const cluster1 = [
    { x: 220, type: 'question' as const, content: 'coin' as const },
    { x: 252, type: 'brick' as const, content: 'none' as const },
    { x: 284, type: 'question' as const, content: 'quiz' as const, qId: 'q1' },
    { x: 316, type: 'brick' as const, content: 'none' as const },
    { x: 348, type: 'question' as const, content: 'coin' as const }
  ];
  cluster1.forEach((b, i) => {
    blocks.push({
      id: `c1_${i}`,
      type: b.type,
      x: b.x,
      y: groundY - 110,
      width: TILE,
      height: TILE,
      bounceOffset: 0,
      bounceSpeed: 0,
      content: b.content,
      quizId: b.qId
    });
  });

  // Powerup block early on
  blocks.push({
    id: `mush_block`,
    type: 'question',
    x: 480,
    y: groundY - 110,
    width: TILE,
    height: TILE,
    bounceOffset: 0,
    bounceSpeed: 0,
    content: 'powerup'
  });

  // High quiz block
  blocks.push({
    id: `quiz_high_1`,
    type: 'question',
    x: 750,
    y: groundY - 140,
    width: TILE,
    height: TILE,
    bounceOffset: 0,
    bounceSpeed: 0,
    content: 'quiz',
    quizId: 'q7'
  });

  // Cluster 2 around 1050
  const cluster2 = [
    { x: 1020, type: 'brick' as const, content: 'none' as const },
    { x: 1052, type: 'question' as const, content: 'quiz' as const, qId: 'q3' },
    { x: 1084, type: 'brick' as const, content: 'none' as const },
    { x: 1116, type: 'question' as const, content: 'coin' as const },
    { x: 1148, type: 'brick' as const, content: 'none' as const }
  ];
  cluster2.forEach((b, i) => {
    blocks.push({
      id: `c2_${i}`,
      type: b.type,
      x: b.x,
      y: groundY - 110,
      width: TILE,
      height: TILE,
      bounceOffset: 0,
      bounceSpeed: 0,
      content: b.content,
      quizId: b.qId
    });
  });

  // Cluster 3 after gap
  const cluster3 = [
    { x: 1350, type: 'brick' as const, content: 'none' as const },
    { x: 1382, type: 'question' as const, content: 'quiz' as const, qId: 'q4' },
    { x: 1414, type: 'brick' as const, content: 'none' as const },
    { x: 1446, type: 'question' as const, content: 'powerup' as const },
    { x: 1680, type: 'question' as const, content: 'quiz' as const, qId: 'q9' },
    { x: 1712, type: 'coin' as const, content: 'coin' as const },
    { x: 1980, type: 'question' as const, content: 'quiz' as const, qId: 'q11' }
  ];
  cluster3.forEach((b, i) => {
    blocks.push({
      id: `c3_${i}`,
      type: b.type === 'coin' ? 'question' : b.type,
      x: b.x,
      y: groundY - 110,
      width: TILE,
      height: TILE,
      bounceOffset: 0,
      bounceSpeed: 0,
      content: b.content,
      quizId: b.qId
    });
  });

  // Staircase to Flagpole
  const stairBaseX = 2550;
  const stairSteps = 7;
  for (let step = 0; step < stairSteps; step++) {
    for (let h = 0; h <= step; h++) {
      blocks.push({
        id: `stair_${step}_${h}`,
        type: 'brick',
        x: stairBaseX + step * TILE,
        y: groundY - (h + 1) * TILE,
        width: TILE,
        height: TILE,
        bounceOffset: 0,
        bounceSpeed: 0,
        content: 'none'
      });
    }
  }

  // Enemies
  enemies.push(
    { id: 'e1', type: 'hoax_bot', x: 450, y: groundY - 24, width: 24, height: 24, vx: -1.0, vy: 0, isGrounded: true, isDefeated: false, defeatTimer: 0, direction: -1, initialY: groundY - 24 },
    { id: 'e2', type: 'hoax_bot', x: 700, y: groundY - 24, width: 24, height: 24, vx: -1.0, vy: 0, isGrounded: true, isDefeated: false, defeatTimer: 0, direction: -1, initialY: groundY - 24 },
    { id: 'e3', type: 'clickbait_turtle', x: 800, y: groundY - 32, width: 24, height: 32, vx: -1.0, vy: 0, isGrounded: true, isDefeated: false, defeatTimer: 0, direction: -1, shellState: 'walking', initialY: groundY - 32 },
    { id: 'e4', type: 'deepfake_drone', x: 1080, y: groundY - 150, width: 26, height: 20, vx: -1.1, vy: 0, isGrounded: false, isDefeated: false, defeatTimer: 0, direction: -1, initialY: groundY - 150, oscillationTimer: 0 },
    { id: 'e5', type: 'hoax_bot', x: 1450, y: groundY - 24, width: 24, height: 24, vx: -1.0, vy: 0, isGrounded: true, isDefeated: false, defeatTimer: 0, direction: -1, initialY: groundY - 24 },
    { id: 'e6', type: 'clickbait_turtle', x: 1750, y: groundY - 32, width: 24, height: 32, vx: -1.0, vy: 0, isGrounded: true, isDefeated: false, defeatTimer: 0, direction: -1, shellState: 'walking', initialY: groundY - 32 },
    { id: 'e7', type: 'deepfake_drone', x: 2020, y: groundY - 140, width: 26, height: 20, vx: -1.2, vy: 0, isGrounded: false, isDefeated: false, defeatTimer: 0, direction: -1, initialY: groundY - 140, oscillationTimer: 1.2 },
    { id: 'e8', type: 'hoax_bot', x: 2350, y: groundY - 24, width: 24, height: 24, vx: -1.0, vy: 0, isGrounded: true, isDefeated: false, defeatTimer: 0, direction: -1, initialY: groundY - 24 }
  );

  const flagPoleX = 2850;

  return {
    id: 'world-1-1',
    worldName: 'DUNIA 1-1',
    title: 'Taman Algoritma',
    subtitle: 'Tantangan: Mengenal Berita Fakta vs Hoaks Berantai',
    theme: 'day',
    width: levelWidth,
    height: 480,
    timeLimit: 400,
    flagPoleX,
    castleX: flagPoleX + 160,
    blocks,
    enemies,
    items
  };
}
