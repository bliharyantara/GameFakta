import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkAABBCollision,
  getCollisionSide,
  validateQuizAnswer,
  calculatePlayerDamage,
  calculateEnemyStomp,
  calculateLevelClearBonus
} from './rules.ts';
import type { QuizQuestion, Enemy } from './rules.ts';

test('checkAABBCollision correctly detects overlapping rects', () => {
  const a = { x: 10, y: 10, width: 20, height: 20 };
  const b = { x: 25, y: 25, width: 20, height: 20 };
  const c = { x: 100, y: 100, width: 20, height: 20 };

  assert.equal(checkAABBCollision(a, b), true);
  assert.equal(checkAABBCollision(a, c), false);
});

test('getCollisionSide detects top/bottom/left/right correctly', () => {
  // Player jumping onto block
  const fallingPlayer = { x: 50, y: 25, width: 20, height: 30, vx: 0, vy: 5 };
  const block = { x: 40, y: 50, width: 40, height: 40 };
  assert.equal(getCollisionSide(fallingPlayer, block), 'bottom');

  // Player hitting block from below
  const jumpingPlayer = { x: 50, y: 85, width: 20, height: 30, vx: 0, vy: -5 };
  assert.equal(getCollisionSide(jumpingPlayer, block), 'top');
});

test('validateQuizAnswer validates user answer and calculates score', () => {
  const sampleQuestion: QuizQuestion = {
    id: 'test-1',
    headline: 'Berita hoax berantai',
    sourceContext: 'WA grup',
    category: 'HOAKS',
    explanation: 'Karena palsu',
    tip: 'Waspada'
  };

  const correctResult = validateQuizAnswer(sampleQuestion, 'HOAKS');
  assert.equal(correctResult.isCorrect, true);
  assert.equal(correctResult.scoreDelta, 500);

  const incorrectResult = validateQuizAnswer(sampleQuestion, 'FAKTA');
  assert.equal(incorrectResult.isCorrect, false);
  assert.equal(incorrectResult.scoreDelta, 0);
});

test('calculatePlayerDamage handles star, super, and normal states', () => {
  // Star invincibility
  const starResult = calculatePlayerDamage(3, false, true);
  assert.equal(starResult.newLives, 3);
  assert.equal(starResult.isDead, false);

  // Super form (shrinks but retains lives)
  const superResult = calculatePlayerDamage(3, true, false);
  assert.equal(superResult.newLives, 3);
  assert.equal(superResult.newIsSuper, false);
  assert.equal(superResult.grantedInvincible, true);

  // Normal player losing a life
  const normalResult = calculatePlayerDamage(2, false, false);
  assert.equal(normalResult.newLives, 1);
  assert.equal(normalResult.isDead, false);

  // Last life lost
  const fatalResult = calculatePlayerDamage(1, false, false);
  assert.equal(fatalResult.newLives, 0);
  assert.equal(fatalResult.isDead, true);
});

test('calculateEnemyStomp differentiates falling stomp vs walking hit', () => {
  const dummyEnemy: Enemy = {
    id: 'e1',
    type: 'hoax_bot',
    x: 50,
    y: 100,
    width: 24,
    height: 24,
    vx: -1,
    vy: 0,
    isGrounded: true,
    isDefeated: false,
    defeatTimer: 0,
    direction: -1,
    initialY: 100
  };

  // Falling down onto enemy
  const stompingPlayer = {
    x: 52,
    y: 80,
    width: 20,
    height: 30,
    vy: 6,
    isInvincible: false,
    isStar: false
  };
  const stompResult = calculateEnemyStomp(stompingPlayer, dummyEnemy);
  assert.equal(stompResult.action, 'stomp_kill');
  assert.equal(stompResult.bounceVy < 0, true);

  // Walking horizontally into enemy
  const walkingPlayer = {
    x: 40,
    y: 100,
    width: 20,
    height: 30,
    vy: 0,
    isInvincible: false,
    isStar: false
  };
  const walkResult = calculateEnemyStomp(walkingPlayer, dummyEnemy);
  assert.equal(walkResult.action, 'player_hurt');
});

test('calculateLevelClearBonus computes time and accuracy bonus', () => {
  const bonus = calculateLevelClearBonus(100, 15, 1.0);
  assert.equal(bonus.timeBonus, 5000);
  assert.equal(bonus.coinBonus, 1500);
  assert.equal(bonus.accuracyBonus, 1000);
  assert.equal(bonus.totalScoreBonus, 7500);
});
