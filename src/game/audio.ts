/**
 * Procedural Web Audio API sound effects and 8-bit chiptune music generator.
 * Zero external audio files required, guarantees instant load & reliable playback.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicInterval: any = null;
  private currentNoteIndex: number = 0;
  private masterGain: GainNode | null = null;

  constructor() {
    // Check saved mute preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('siber_bros_muted');
      this.isMuted = saved === 'true';
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('siber_bros_muted', muted ? 'true' : 'false');
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.35, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // --- SOUND EFFECTS ---

  public playJump(isSuper: boolean = false) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = isSuper ? 'triangle' : 'square';
    const startFreq = isSuper ? 180 : 150;
    const endFreq = isSuper ? 580 : 480;

    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + 0.16);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.16);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.16);
  }

  public playCoin() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Classic two-pitch ding B5 (987Hz) then E6 (1318Hz)
    osc.frequency.setValueAtTime(987, t);
    osc.frequency.setValueAtTime(1318, t + 0.08);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.35);
  }

  public playStomp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.12);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.12);
  }

  public playBlockBump() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.1);

    gain.gain.setValueAtTime(0.28, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  public playBlockBreak() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.linearRampToValueAtTime(120, t + 0.18);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.18);
  }

  public playPowerup() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const notes = [330, 392, 659, 523, 587, 784];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime + idx * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.08);
    });
  }

  public playHurt() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.linearRampToValueAtTime(70, t + 0.25);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.25);
  }

  public playQuizPrompt() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const notes = [440, 554, 659, 880];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.14);
    });
  }

  public playQuizCorrect() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    // Victory triad: C5, E5, G5, C6
    const freqs = [523.25, 659.25, 783.99, 1046.50];
    freqs.forEach((freq, i) => {
      if (!this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime + i * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.25);
    });
  }

  public playQuizWrong() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.setValueAtTime(110, t + 0.12);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  public playStageVictory() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    // Classic Mario flagpole finish fanfare: G3, C4, E4, G4, C5, E5, G5, E5...
    const notes = [
      { f: 392, d: 0.12 },
      { f: 523, d: 0.12 },
      { f: 659, d: 0.12 },
      { f: 784, d: 0.16 },
      { f: 1046, d: 0.28 }
    ];

    let currentT = this.ctx.currentTime;
    notes.forEach(n => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(n.f, currentT);
      gain.gain.setValueAtTime(0.25, currentT);
      gain.gain.exponentialRampToValueAtTime(0.01, currentT + n.d);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(currentT);
      osc.stop(currentT + n.d);

      currentT += n.d + 0.04;
    });
  }

  public playGameOver() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const notes = [
      { f: 523, d: 0.18 },
      { f: 392, d: 0.18 },
      { f: 330, d: 0.2 },
      { f: 293, d: 0.15 },
      { f: 261, d: 0.35 }
    ];

    let currentT = this.ctx.currentTime;
    notes.forEach(n => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, currentT);
      gain.gain.setValueAtTime(0.25, currentT);
      gain.gain.exponentialRampToValueAtTime(0.01, currentT + n.d);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(currentT);
      osc.stop(currentT + n.d);

      currentT += n.d + 0.04;
    });
  }

  // --- 8-BIT PROCEDURAL CHIPTUNE BGM LOOP ---

  public startMusic(theme: 'day' | 'underground' | 'cybercastle' = 'day') {
    if (this.musicInterval) return;
    this.initContext();

    const melodyDay = [
      { f: 659.25, d: 0.12 }, { f: 659.25, d: 0.12 }, { f: 0, d: 0.12 }, { f: 659.25, d: 0.12 },
      { f: 0, d: 0.12 }, { f: 523.25, d: 0.12 }, { f: 659.25, d: 0.12 }, { f: 0, d: 0.12 },
      { f: 783.99, d: 0.24 }, { f: 0, d: 0.24 }, { f: 392.00, d: 0.24 }, { f: 0, d: 0.24 },
      { f: 523.25, d: 0.16 }, { f: 0, d: 0.10 }, { f: 392.00, d: 0.16 }, { f: 0, d: 0.10 },
      { f: 329.63, d: 0.16 }, { f: 0, d: 0.10 }, { f: 440.00, d: 0.16 }, { f: 493.88, d: 0.16 },
      { f: 466.16, d: 0.12 }, { f: 440.00, d: 0.16 }, { f: 392.00, d: 0.16 }
    ];

    const melodyCyber = [
      { f: 440, d: 0.12 }, { f: 523.25, d: 0.12 }, { f: 659.25, d: 0.12 }, { f: 587.33, d: 0.12 },
      { f: 440, d: 0.12 }, { f: 392, d: 0.12 }, { f: 440, d: 0.16 }, { f: 0, d: 0.08 },
      { f: 523.25, d: 0.12 }, { f: 659.25, d: 0.12 }, { f: 784, d: 0.16 }, { f: 659.25, d: 0.12 },
      { f: 523.25, d: 0.12 }, { f: 440, d: 0.16 }, { f: 392, d: 0.12 }, { f: 440, d: 0.2 }
    ];

    const melody = theme === 'cybercastle' ? melodyCyber : melodyDay;
    this.currentNoteIndex = 0;

    const playNext = () => {
      if (this.isMuted || !this.ctx || !this.masterGain) return;
      const note = melody[this.currentNoteIndex];
      this.currentNoteIndex = (this.currentNoteIndex + 1) % melody.length;

      if (note.f > 0) {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(note.f * 0.75, t); // pleasant octave
        gain.gain.setValueAtTime(0.06, t);
        gain.gain.linearRampToValueAtTime(0.001, t + note.d);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + note.d);
      }
    };

    this.musicInterval = setInterval(playNext, 160);
  }

  public stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const audio = new SoundEngine();
