// Fruit Slice Drop - Upbeat Cheerful Audio & Minimal Playfield-First Engine

// --- Upbeat Procedural BGM & Sound Engine (Web Audio API) ---
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isPlayingBgm = false;
    this.bgmTimer = null;
    this.stepIndex = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && (this.ctx.state === 'suspended' || this.ctx.state === 'interrupted')) {
      this.ctx.resume().catch(() => {});
    }
  }

  startBGM() {
    this.init();
    if (!this.ctx || this.isPlayingBgm) return;
    this.isPlayingBgm = true;
    this.stepIndex = 0;

    const melody = [
      523.25, 659.25, 783.99, 1046.50, 783.99, 659.25, 523.25, 659.25,
      493.88, 587.33, 783.99, 987.77,  783.99, 587.33, 493.88, 587.33,
      440.00, 523.25, 659.25, 880.00,  659.25, 523.25, 440.00, 523.25,
      349.23, 440.00, 523.25, 698.46,  880.00, 698.46, 523.25, 440.00
    ];

    const bass = [
      130.81, 130.81, 196.00, 130.81,
      98.00,  98.00,  146.83, 98.00,
      110.00, 110.00, 164.81, 110.00,
      87.31,  87.31,  130.81, 87.31
    ];

    const playStep = () => {
      if (!this.isPlayingBgm || !this.ctx) return;

      const now = this.ctx.currentTime;
      const idx = this.stepIndex % melody.length;
      const bassIdx = Math.floor(this.stepIndex / 2) % bass.length;

      const noteFreq = melody[idx];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(noteFreq, now);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.19);

      if (idx % 2 === 0) {
        const harmOsc = this.ctx.createOscillator();
        const harmGain = this.ctx.createGain();
        harmOsc.type = 'sine';
        harmOsc.frequency.setValueAtTime(noteFreq * 1.5, now);

        harmGain.gain.setValueAtTime(0.025, now);
        harmGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        harmOsc.connect(harmGain);
        harmGain.connect(this.ctx.destination);

        harmOsc.start(now);
        harmOsc.stop(now + 0.23);
      }

      if (this.stepIndex % 2 === 0) {
        const bFreq = bass[bassIdx];
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();

        bOsc.type = 'sine';
        bOsc.frequency.setValueAtTime(bFreq, now);

        bGain.gain.setValueAtTime(0.07, now);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

        bOsc.connect(bGain);
        bGain.connect(this.ctx.destination);

        bOsc.start(now);
        bOsc.stop(now + 0.33);
      }

      this.stepIndex++;
      this.bgmTimer = setTimeout(playStep, 170);
    };

    playStep();
  }

  stopBGM() {
    this.isPlayingBgm = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  playSwipeSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.06);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  playSliceSound(combo = 1) {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    const pitch = 500 + Math.min(combo * 70, 480);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.6, now + 0.09);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.11);

    const chime = this.ctx.createOscillator();
    const chimeGain = this.ctx.createGain();
    chime.type = 'triangle';
    chime.frequency.setValueAtTime(950 + combo * 120, now + 0.02);
    chimeGain.gain.setValueAtTime(0.1, now + 0.02);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    chime.connect(chimeGain);
    chimeGain.connect(this.ctx.destination);

    chime.start(now + 0.02);
    chime.stop(now + 0.2);
  }

  playComboSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      gain.gain.setValueAtTime(0.1, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.17);
    });
  }

  playLevelUpSound() {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51];

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.12, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.3);
    });
  }

  playGameOverSound() {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [340, 280, 220, 160];

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.11);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.8, now + idx * 0.11 + 0.1);

      gain.gain.setValueAtTime(0.14, now + idx * 0.11);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.11 + 0.11);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.11);
      osc.stop(now + idx * 0.11 + 0.12);
    });
  }
}

const audio = new SoundEngine();

// --- Canvas & Core Elements ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreElem = document.getElementById('scoreDisplay');
const bestScoreElem = document.getElementById('bestScoreDisplay');
const comboElem = document.getElementById('comboDisplay');
const comboContainer = document.getElementById('comboContainer');
const levelElem = document.getElementById('levelDisplay');

const levelToast = document.getElementById('levelToast');

const helpOverlay = document.getElementById('helpOverlay');
const pauseOverlay = document.getElementById('pauseOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');

const btnHelp = document.getElementById('btnHelp');
const btnCloseHelp = document.getElementById('btnCloseHelp');
const btnGotIt = document.getElementById('btnGotIt');
const btnPause = document.getElementById('btnPause');
const btnResume = document.getElementById('btnResume');
const btnRestart = document.getElementById('btnRestart');

const finalScoreElem = document.getElementById('finalScore');
const finalBestElem = document.getElementById('finalBest');
const finalLevelElem = document.getElementById('finalLevel');
const gameOverDesc = document.getElementById('gameOverDesc');
const gameOverTitle = document.getElementById('gameOverTitle');

let W = window.innerWidth;
let H = window.innerHeight;
let DPR = Math.min(window.devicePixelRatio || 1, 2);

let isRunning = false;
let isPaused = false;
let score = 0;
let bestScore = parseInt(localStorage.getItem('fruit_slice_best') || '0', 10);
let combo = 0;
let level = 1;
let lastTime = 0;
let spawnTimer = 0;

let bladeX = W / 2;
let bladeDir = 1;
let bladeY = H * 0.72;

let gameObjects = [];
let slicedHalves = [];
let particles = [];
let slashes = [];
let floatingNotices = [];

const FRUIT_TYPES = [
  { name: 'apple', score: 10, radius: 38, fleshColor: '#fef08a', skinColor: '#ff2e4d', face: 'happy' },
  { name: 'watermelon', score: 15, radius: 46, fleshColor: '#e11d48', skinColor: '#15803d', face: 'smile' },
  { name: 'orange', score: 10, radius: 38, fleshColor: '#ffaa00', skinColor: '#ff9100', face: 'joy' },
  { name: 'strawberry', score: 20, radius: 34, fleshColor: '#f43f5e', skinColor: '#ff2a55', face: 'cute' },
  { name: 'pineapple', score: 25, radius: 42, fleshColor: '#fde047', skinColor: '#eab308', face: 'happy' },
  { name: 'kiwi', score: 18, radius: 33, fleshColor: '#84cc16', skinColor: '#78350f', face: 'cute' },
  { name: 'starfruit', score: 30, radius: 38, fleshColor: '#fde047', skinColor: '#f59e0b', face: 'sparkle', bonus: true }
];

function resizeCanvas() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  bladeY = H * 0.72;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawCuteFace(r, expression = 'happy') {
  ctx.save();
  const eyeOffset = r * 0.32;
  const eyeY = -r * 0.12;

  if (expression === 'surprised') {
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(-eyeOffset, eyeY, 5, 0, Math.PI * 2);
    ctx.arc(eyeOffset, eyeY, 5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, r * 0.15, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.restore();
    return;
  }

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(-eyeOffset, eyeY, 5.5, 0, Math.PI * 2);
  ctx.arc(eyeOffset, eyeY, 5.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-eyeOffset - 1.8, eyeY - 1.8, 2.2, 0, Math.PI * 2);
  ctx.arc(eyeOffset - 1.8, eyeY - 1.8, 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(244, 114, 182, 0.75)';
  ctx.beginPath();
  ctx.arc(-eyeOffset - 5, r * 0.15, 6.5, 0, Math.PI * 2);
  ctx.arc(eyeOffset + 5, r * 0.15, 6.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, r * 0.08, 7.5, 0.15, Math.PI - 0.15);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.restore();
}

function drawCuteRealisticFruit(x, y, r, type, isBomb, angle = 0, halfSide = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  if (halfSide !== 0) {
    ctx.beginPath();
    ctx.rect(halfSide === -1 ? -r * 2 : 0, -r * 2, r * 2, r * 4);
    ctx.clip();
  }

  if (isBomb) {
    const bGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    bGrad.addColorStop(0, '#94a3b8');
    bGrad.addColorStop(0.3, '#334155');
    bGrad.addColorStop(0.85, '#0f172a');
    bGrad.addColorStop(1, '#020617');

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = bGrad;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#64748b';
    ctx.stroke();

    ctx.fillStyle = '#d97706';
    ctx.fillRect(-6, -r - 4, 12, 6);

    ctx.beginPath();
    ctx.moveTo(0, -r - 4);
    ctx.quadraticCurveTo(12, -r - 16, 18, -r - 22);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    const sparkGrad = ctx.createRadialGradient(18, -r - 22, 1, 18, -r - 22, 10);
    sparkGrad.addColorStop(0, '#ffffff');
    sparkGrad.addColorStop(0.4, '#fde047');
    sparkGrad.addColorStop(0.8, '#ef4444');
    sparkGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

    ctx.beginPath();
    ctx.arc(18, -r - 22, 8 + Math.sin(Date.now() * 0.02) * 3, 0, Math.PI * 2);
    ctx.fillStyle = sparkGrad;
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-9, -4, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-9, -4, 2.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(5, -7);
    ctx.lineTo(13, -1);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 7, 7, 0.2, Math.PI - 0.2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
    return;
  }

  if (type.name === 'watermelon') {
    const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    grad.addColorStop(0, '#4ade80');
    grad.addColorStop(0.5, '#16a34a');
    grad.addColorStop(1, '#0b4d24');

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = '#042911';
    ctx.lineWidth = 5;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 12 - 10, -r + 4);
      ctx.quadraticCurveTo(i * 16 + 10, 0, i * 12 - 10, r - 4);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(0, -r + 4);
    ctx.quadraticCurveTo(6, -r - 12, 12, -r - 8);
    ctx.quadraticCurveTo(16, -r - 4, 10, -r - 2);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.stroke();
  } else if (type.name === 'apple') {
    const grad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r);
    grad.addColorStop(0, '#ff7388');
    grad.addColorStop(0.35, '#ff2e4d');
    grad.addColorStop(0.85, '#b80024');
    grad.addColorStop(1, '#52000e');

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -r + 6);
    ctx.quadraticCurveTo(4, -r - 8, 8, -r - 12);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(8, -r - 8, 6, 12, 0.6, 0, Math.PI * 2);
    ctx.fillStyle = '#22c55e';
    ctx.fill();
  } else if (type.name === 'orange') {
    const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    grad.addColorStop(0, '#ffe17d');
    grad.addColorStop(0.35, '#ff9100');
    grad.addColorStop(0.85, '#c2410c');
    grad.addColorStop(1, '#6e2500');

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(6, -r - 4, 5, 10, 0.5, 0, Math.PI * 2);
    ctx.fillStyle = '#22c55e';
    ctx.fill();

    ctx.fillStyle = 'rgba(110, 37, 0, 0.22)';
    for (let i = 0; i < 12; i++) {
      const px = (Math.sin(i * 1.7) * r * 0.68);
      const py = (Math.cos(i * 2.3) * r * 0.68);
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type.name === 'pineapple') {
    const bodyGrad = ctx.createRadialGradient(-r * 0.25, -r * 0.3, r * 0.1, 0, 0, r * 1.15);
    bodyGrad.addColorStop(0, '#fffa96');
    bodyGrad.addColorStop(0.35, '#ffba00');
    bodyGrad.addColorStop(0.8, '#e06b00');
    bodyGrad.addColorStop(1, '#733400');

    ctx.beginPath();
    ctx.ellipse(0, 4, r * 0.94, r * 1.14, 0, 0, Math.PI * 2);
    ctx.fillStyle = bodyGrad;
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, 4, r * 0.94, r * 1.14, 0, 0, Math.PI * 2);
    ctx.clip();

    ctx.strokeStyle = 'rgba(115, 52, 0, 0.25)';
    ctx.lineWidth = 2.5;
    for (let i = -4; i <= 4; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 14 - r, -r * 1.3);
      ctx.lineTo(i * 14 + r, r * 1.3);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(i * 14 + r, -r * 1.3);
      ctx.lineTo(i * 14 - r, r * 1.3);
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(255, 245, 150, 0.55)';
    for (let row = -2; row <= 2; row++) {
      for (let col = -2; col <= 2; col++) {
        const sx = col * 14 + (row % 2 === 0 ? 0 : 7);
        const sy = row * 14 + 4;
        if (Math.hypot(sx, sy) < r * 0.82) {
          ctx.beginPath();
          ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();

    const leafColors = ['#14532d', '#15803d', '#22c55e', '#4ade80'];
    const leaves = [
      { x: -16, y: -r - 12, angle: -0.45, len: 26, w: 7.5, col: 0 },
      { x: 16, y: -r - 12, angle: 0.45, len: 26, w: 7.5, col: 0 },
      { x: -9, y: -r - 17, angle: -0.25, len: 30, w: 8.5, col: 1 },
      { x: 9, y: -r - 17, angle: 0.25, len: 30, w: 8.5, col: 1 },
      { x: 0, y: -r - 22, angle: 0, len: 35, w: 9.5, col: 2 }
    ];

    leaves.forEach(leaf => {
      ctx.save();
      ctx.translate(leaf.x, -r + 4);
      ctx.rotate(leaf.angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-leaf.w, -leaf.len * 0.5, 0, -leaf.len);
      ctx.quadraticCurveTo(leaf.w, -leaf.len * 0.5, 0, 0);
      ctx.fillStyle = leafColors[leaf.col];
      ctx.fill();
      ctx.strokeStyle = '#052e16';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(leaf.w * 0.4, -leaf.len * 0.5, 0, -leaf.len * 0.8);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();
    });
  } else if (type.name === 'kiwi') {
    const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.3, r * 0.1, 0, 0, r);
    grad.addColorStop(0, '#a16207');
    grad.addColorStop(0.6, '#78350f');
    grad.addColorStop(1, '#451a03');

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.fillStyle = 'rgba(69, 26, 3, 0.4)';
    for (let i = 0; i < 15; i++) {
      const kx = (Math.sin(i * 2.1) * r * 0.75);
      const ky = (Math.cos(i * 1.9) * r * 0.75);
      ctx.beginPath();
      ctx.arc(kx, ky, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type.name === 'strawberry') {
    const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.4, r * 0.1, 0, 0, r * 1.1);
    grad.addColorStop(0, '#ff7388');
    grad.addColorStop(0.3, '#ff2a55');
    grad.addColorStop(0.85, '#be123c');
    grad.addColorStop(1, '#4c0519');

    ctx.beginPath();
    ctx.moveTo(0, r);
    ctx.quadraticCurveTo(r * 1.1, -r * 0.2, 0, -r);
    ctx.quadraticCurveTo(-r * 1.1, -r * 0.2, 0, r);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.fillStyle = '#fde047';
    for (let row = -2; row <= 2; row++) {
      for (let col = -2; col <= 2; col++) {
        if (Math.abs(row) + Math.abs(col) < 4) {
          ctx.beginPath();
          ctx.ellipse(col * 7, row * 8, 1.2, 2.2, 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.fillStyle = '#16a34a';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.ellipse(Math.cos(i * 1.25) * 8, -r + 2, 4, 10, i * 1.25, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type.name === 'starfruit') {
    const grad = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.5, '#f59e0b');
    grad.addColorStop(1, '#b45309');

    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const ai = a + Math.PI / 5;
      const x1 = Math.cos(a) * r;
      const y1 = Math.sin(a) * r;
      const x2 = Math.cos(ai) * (r * 0.45);
      const y2 = Math.sin(ai) * (r * 0.45);

      if (i === 0) ctx.moveTo(x1, y1);
      else ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#d97706';
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.ellipse(-r * 0.35, -r * 0.35, r * 0.3, r * 0.15, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.48)';
  ctx.fill();

  if (halfSide === 0) {
    drawCuteFace(r, type.face || 'happy');
  } else {
    if (type.name === 'orange') {
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.88, 0, Math.PI * 2);
      ctx.fillStyle = '#ffaa00';
      ctx.fill();

      ctx.strokeStyle = '#fff2b2';
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const segAngle = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(segAngle) * r * 0.85, Math.sin(segAngle) * r * 0.85);
        ctx.stroke();
      }
    } else if (type.name === 'kiwi') {
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.88, 0, Math.PI * 2);
      ctx.fillStyle = '#84cc16';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
      ctx.fillStyle = '#fef08a';
      ctx.fill();
    } else if (type.name === 'pineapple') {
      ctx.beginPath();
      ctx.ellipse(0, 4, r * 0.88, r * 1.05, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#ffe600';
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(0, 4, r * 0.3, r * 0.38, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#fff9a6';
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.8;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(0, r);
      ctx.strokeStyle = type.fleshColor;
      ctx.lineWidth = r * 0.85;
      ctx.stroke();
    }

    drawCuteFace(r * 0.85, 'surprised');
  }

  ctx.restore();
}

// --- Floating Small Action Notifications ---
function addFloatingNotice(text, x, y, color = '#ffe600') {
  floatingNotices.push({
    text,
    x,
    y,
    color,
    vy: -70,
    life: 0.65,
    maxLife: 0.65
  });
}

// --- Game Loop Logic ---
function updateHUD() {
  scoreElem.textContent = score;
  bestScoreElem.textContent = bestScore;
  levelElem.textContent = level;
  if (combo > 1) {
    comboElem.textContent = `${combo}x`;
    comboContainer.classList.remove('hidden');
  } else {
    comboContainer.classList.add('hidden');
  }
}

function resetGame() {
  score = 0;
  combo = 0;
  level = 1;
  gameObjects = [];
  slicedHalves = [];
  particles = [];
  slashes = [];
  floatingNotices = [];
  spawnTimer = 0.2;
  bladeX = W / 2;
  bladeDir = 1;
  updateHUD();
}

function startGame() {
  resetGame();
  isRunning = true;
  isPaused = false;
  if (helpOverlay) helpOverlay.classList.add('hidden');
  if (pauseOverlay) pauseOverlay.classList.add('hidden');
  if (gameOverOverlay) gameOverOverlay.classList.add('hidden');
  audio.startBGM();
  lastTime = performance.now();
  requestAnimationFrame(gameLoop);
}

function openHelp() {
  if (!isRunning) return;
  isPaused = true;
  audio.stopBGM();
  if (helpOverlay) helpOverlay.classList.remove('hidden');
}

function closeHelp() {
  if (helpOverlay) helpOverlay.classList.add('hidden');
  if (isRunning) {
    isPaused = false;
    audio.startBGM();
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
  }
}

function pauseGame() {
  if (!isRunning) return;
  isPaused = true;
  audio.stopBGM();
  if (pauseOverlay) pauseOverlay.classList.remove('hidden');
}

function resumeGame() {
  if (!isRunning) return;
  isPaused = false;
  if (pauseOverlay) pauseOverlay.classList.add('hidden');
  audio.startBGM();
  lastTime = performance.now();
  requestAnimationFrame(gameLoop);
}

function checkLevelUp() {
  const newLevel = Math.floor(score / 200) + 1;
  if (newLevel > level) {
    level = newLevel;
    audio.playLevelUpSound();
    
    if (levelToast) {
      levelToast.textContent = `⭐ LEVEL ${level}!`;
      levelToast.classList.remove('hidden');
      setTimeout(() => levelToast.classList.add('hidden'), 1600);
    }

    addFloatingNotice(`⭐ LEVEL ${level}!`, W / 2, H * 0.35, '#38bdf8');

    for (let i = 0; i < 25; i++) {
      particles.push({
        x: W / 2,
        y: H / 3,
        vx: -200 + Math.random() * 400,
        vy: -300 + Math.random() * 200,
        life: 1.0,
        color: ['#f43f5e', '#3b82f6', '#eab308', '#a855f7', '#22c55e'][Math.floor(Math.random() * 5)],
        char: '⭐'
      });
    }
  }
}

function spawnFruit() {
  const isBomb = Math.random() < Math.min(0.12 + level * 0.02, 0.25);
  const type = FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)];

  gameObjects.push({
    x: 50 + Math.random() * (W - 100),
    y: -60,
    r: isBomb ? 34 : type.radius,
    vy: 210 + Math.random() * 70 + level * 15,
    vx: -40 + Math.random() * 80,
    angle: Math.random() * 6.28,
    rotSpeed: -3 + Math.random() * 6,
    isBomb,
    type,
    cut: false
  });
}

function createJuiceSplatter(px, py, color, fleshColor) {
  for (let i = 0; i < 22; i++) {
    particles.push({
      x: px,
      y: py,
      vx: -240 + Math.random() * 480,
      vy: -260 + Math.random() * 340,
      life: 0.85,
      color: Math.random() < 0.4 ? '#ffb700' : (Math.random() < 0.7 ? fleshColor : color),
      char: Math.random() < 0.25 ? '💦' : (Math.random() < 0.45 ? '⭐' : '•')
    });
  }
}

function sliceAction(customX, customY) {
  if (!isRunning || isPaused) return;

  const sliceX = customX !== undefined ? customX : bladeX;
  const sliceY = customY !== undefined ? customY : bladeY;

  slashes.push({
    x1: sliceX - 70,
    y1: sliceY + 30,
    x2: sliceX + 70,
    y2: sliceY - 30,
    life: 0.18
  });

  let hitCount = 0;

  for (const obj of gameObjects) {
    if (obj.cut) continue;
    const dist = Math.hypot(obj.x - sliceX, obj.y - sliceY);

    if (dist < obj.r + 55) {
      obj.cut = true;
      hitCount++;

      if (obj.isBomb) {
        audio.playGameOverSound();
        gameOver('💣 OH NO! BOMB HIT!', 'Be careful of sneaky bombs!');
        return;
      }

      combo++;
      const earned = obj.type.score + combo * 3;
      score += earned;

      audio.playSliceSound(combo);
      if (combo > 2) audio.playComboSound();

      // Temporary Small Floating Action Feedback
      addFloatingNotice(`+${earned}`, obj.x, obj.y, obj.type.skinColor || '#ffe600');
      if (combo > 1) {
        addFloatingNotice(`${combo}x COMBO!`, obj.x, obj.y - 25, '#ec4899');
      }

      slicedHalves.push({
        x: obj.x,
        y: obj.y,
        r: obj.r,
        type: obj.type,
        angle: obj.angle,
        vx: obj.vx - 140,
        vy: obj.vy - 60,
        rotSpeed: -5,
        halfSide: -1,
        life: 1.0
      });

      slicedHalves.push({
        x: obj.x,
        y: obj.y,
        r: obj.r,
        type: obj.type,
        angle: obj.angle,
        vx: obj.vx + 140,
        vy: obj.vy - 60,
        rotSpeed: 5,
        halfSide: 1,
        life: 1.0
      });

      createJuiceSplatter(obj.x, obj.y, obj.type.skinColor, obj.type.fleshColor);
      checkLevelUp();
    }
  }

  if (hitCount === 0) {
    audio.playSwipeSound();
    if (customX === undefined) {
      combo = 0;
    }
  }
  updateHUD();
}

function gameOver(title, desc) {
  isRunning = false;
  audio.stopBGM();

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('fruit_slice_best', bestScore);
  }

  if (finalScoreElem) finalScoreElem.textContent = score;
  if (finalBestElem) finalBestElem.textContent = bestScore;
  if (finalLevelElem) finalLevelElem.textContent = level;
  if (gameOverTitle) gameOverTitle.textContent = title;
  if (gameOverDesc) gameOverDesc.textContent = desc;

  if (gameOverOverlay) gameOverOverlay.classList.remove('hidden');
}

function update(dt) {
  bladeX += bladeDir * (250 + level * 20) * dt;
  if (bladeX > W - 60) {
    bladeX = W - 60;
    bladeDir = -1;
  }
  if (bladeX < 60) {
    bladeX = 60;
    bladeDir = 1;
  }

  spawnTimer -= dt;
  if (spawnTimer <= 0) {
    spawnFruit();
    if (Math.random() < Math.min(0.4, level * 0.08)) {
      spawnFruit();
    }
    spawnTimer = Math.max(0.4, 0.9 - level * 0.05);
  }

  for (const obj of gameObjects) {
    obj.vy += (230 + level * 10) * dt;
    obj.y += obj.vy * dt;
    obj.x += obj.vx * dt;
    obj.angle += obj.rotSpeed * dt;
  }

  for (const obj of gameObjects) {
    if (!obj.cut && obj.y > H + 60) {
      obj.cut = true;
      combo = 0;
    }
  }
  gameObjects = gameObjects.filter(o => o.y < H + 100 && !o.cut);

  for (const h of slicedHalves) {
    h.vy += 450 * dt;
    h.x += h.vx * dt;
    h.y += h.vy * dt;
    h.angle += h.rotSpeed * dt;
    h.life -= dt;
  }
  slicedHalves = slicedHalves.filter(h => h.life > 0 && h.y < H + 120);

  for (const s of slashes) s.life -= dt;
  slashes = slashes.filter(s => s.life > 0);

  for (const p of particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 350 * dt;
    p.life -= dt;
  }
  particles = particles.filter(p => p.life > 0);

  for (const n of floatingNotices) {
    n.y += n.vy * dt;
    n.life -= dt;
  }
  floatingNotices = floatingNotices.filter(n => n.life > 0);

  updateHUD();
}

function drawBackground() {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#15062c');
  grad.addColorStop(0.5, '#290e50');
  grad.addColorStop(1, '#120427');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.fillStyle = 'rgba(168, 85, 247, 0.11)';
  for (let i = 0; i < 10; i++) {
    const bubbleX = (i * 190 + Date.now() * 0.015) % (W + 160) - 80;
    const bubbleY = (120 + i * 130) % H;
    const bubbleR = 50 + (i % 4) * 35;
    ctx.beginPath();
    ctx.arc(bubbleX, bubbleY, bubbleR, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(253, 224, 71, 0.35)';
  for (let i = 0; i < 6; i++) {
    const starX = (i * 260 + 60) % W;
    const starY = (100 + i * 150 + Math.sin(Date.now() * 0.001 + i) * 15) % H;
    ctx.font = '16px sans-serif';
    ctx.fillText('⭐', starX, starY);
  }

  ctx.fillStyle = '#0f0222';
  ctx.beginPath();
  ctx.moveTo(-100, H);
  ctx.quadraticCurveTo(W / 2, H - 45, W + 100, H);
  ctx.lineTo(W + 100, H + 100);
  ctx.lineTo(-100, H + 100);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function draw() {
  drawBackground();

  for (const obj of gameObjects) {
    drawCuteRealisticFruit(obj.x, obj.y, obj.r, obj.type, obj.isBomb, obj.angle);
  }

  for (const h of slicedHalves) {
    drawCuteRealisticFruit(h.x, h.y, h.r, h.type, false, h.angle, h.halfSide);
  }

  for (const s of slashes) {
    ctx.save();
    const alpha = s.life / 0.18;
    ctx.globalAlpha = alpha;

    ctx.strokeStyle = 'rgba(255, 140, 0, 0.85)';
    ctx.lineWidth = 22;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(s.x1, s.y1);
    ctx.lineTo(s.x2, s.y2);
    ctx.stroke();

    ctx.strokeStyle = '#fff044';
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.moveTo(s.x1, s.y1);
    ctx.lineTo(s.x2, s.y2);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(s.x1, s.y1);
    ctx.lineTo(s.x2, s.y2);
    ctx.stroke();

    ctx.restore();
  }

  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life / 0.75);
    ctx.fillStyle = p.color;
    ctx.font = '20px "Fredoka", sans-serif';
    ctx.fillText(p.char, p.x, p.y);
    ctx.restore();
  }

  // Draw Small Floating Action Notifications
  for (const n of floatingNotices) {
    ctx.save();
    const alpha = Math.max(0, n.life / n.maxLife);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = n.color;
    ctx.strokeStyle = '#0f0224';
    ctx.lineWidth = 3.5;
    ctx.font = 'bold 21px "Lilita One", "Fredoka", sans-serif';
    ctx.textAlign = 'center';
    ctx.strokeText(n.text, n.x, n.y);
    ctx.fillText(n.text, n.x, n.y);
    ctx.restore();
  }
}

function gameLoop(timestamp) {
  if (!isRunning || isPaused) return;

  const dt = Math.min(0.033, (timestamp - lastTime) / 1000);
  lastTime = timestamp;

  update(dt);
  draw();

  requestAnimationFrame(gameLoop);
}

// --- Interaction & Event Listeners ---
function handleUserInteraction() {
  audio.init();
  if (isRunning && !isPaused && !audio.isPlayingBgm) {
    audio.startBGM();
  }
}

['pointerdown', 'touchstart', 'touchend', 'keydown', 'click'].forEach(eventType => {
  window.addEventListener(eventType, handleUserInteraction, { passive: true });
});

canvas.addEventListener('pointerdown', e => {
  e.preventDefault();
  handleUserInteraction();
  sliceAction(e.clientX, e.clientY);
});

canvas.addEventListener('pointermove', e => {
  if (e.buttons === 1) {
    sliceAction(e.clientX, e.clientY);
  }
});

window.addEventListener('keydown', e => {
  handleUserInteraction();
  if (e.code === 'Space') {
    e.preventDefault();
    sliceAction();
  } else if (e.code === 'KeyP' || e.code === 'Escape') {
    if (isRunning) {
      if (isPaused) resumeGame();
      else pauseGame();
    }
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (isRunning && !isPaused) {
      pauseGame();
    }
  } else {
    handleUserInteraction();
  }
});

window.addEventListener('blur', () => {
  if (isRunning && !isPaused) {
    pauseGame();
  }
});

window.addEventListener('focus', () => {
  handleUserInteraction();
});

if (btnHelp) {
  btnHelp.addEventListener('click', (e) => {
    e.stopPropagation();
    openHelp();
  });
}

if (btnCloseHelp) {
  btnCloseHelp.addEventListener('click', (e) => {
    e.stopPropagation();
    closeHelp();
  });
}

if (btnGotIt) {
  btnGotIt.addEventListener('click', (e) => {
    e.stopPropagation();
    closeHelp();
  });
}

if (btnPause) {
  btnPause.addEventListener('click', (e) => {
    e.stopPropagation();
    pauseGame();
  });
}

if (btnResume) {
  btnResume.addEventListener('click', (e) => {
    e.stopPropagation();
    handleUserInteraction();
    resumeGame();
  });
}

if (btnRestart) {
  btnRestart.addEventListener('click', (e) => {
    e.stopPropagation();
    handleUserInteraction();
    startGame();
  });
}

// Start game directly on load (Playfield First Hyper-Casual Design)
startGame();
