// Fruit Slice Drop - Upbeat Cheerful Audio & Cute Realistic Fruit Engine

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
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a cheerful, catchy polyphonic arcade melody (C - G - Am - F Progression)
  startBGM() {
    this.init();
    if (!this.ctx || this.isPlayingBgm) return;
    this.isPlayingBgm = true;
    this.stepIndex = 0;

    // Cheerful C Major Pentatonic & Diatonic Melody Notes (Hz)
    const melody = [
      523.25, 659.25, 783.99, 1046.50, 783.99, 659.25, 523.25, 659.25, // C Major
      493.88, 587.33, 783.99, 987.77,  783.99, 587.33, 493.88, 587.33, // G Major
      440.00, 523.25, 659.25, 880.00,  659.25, 523.25, 440.00, 523.25, // A Minor
      349.23, 440.00, 523.25, 698.46,  880.00, 698.46, 523.25, 440.00  // F Major
    ];

    const bass = [
      130.81, 130.81, 196.00, 130.81, // C
      98.00,  98.00,  146.83, 98.00,  // G
      110.00, 110.00, 164.81, 110.00, // Am
      87.31,  87.31,  130.81, 87.31   // F
    ];

    const playStep = () => {
      if (!this.isPlayingBgm || !this.ctx) return;

      const now = this.ctx.currentTime;
      const idx = this.stepIndex % melody.length;
      const bassIdx = Math.floor(this.stepIndex / 2) % bass.length;

      // 1. Bright Lead Marimba Synth
      const noteFreq = melody[idx];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(noteFreq, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.19);

      // 2. Secondary Harmony Chime (on quarter notes)
      if (idx % 2 === 0) {
        const harmOsc = this.ctx.createOscillator();
        const harmGain = this.ctx.createGain();
        harmOsc.type = 'sine';
        harmOsc.frequency.setValueAtTime(noteFreq * 1.5, now);

        harmGain.gain.setValueAtTime(0.03, now);
        harmGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        harmOsc.connect(harmGain);
        harmGain.connect(this.ctx.destination);

        harmOsc.start(now);
        harmOsc.stop(now + 0.23);
      }

      // 3. Bouncy Bassline (on beats)
      if (this.stepIndex % 2 === 0) {
        const bFreq = bass[bassIdx];
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();

        bOsc.type = 'sine';
        bOsc.frequency.setValueAtTime(bFreq, now);

        bGain.gain.setValueAtTime(0.08, now);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

        bOsc.connect(bGain);
        bGain.connect(this.ctx.destination);

        bOsc.start(now);
        bOsc.stop(now + 0.33);
      }

      // 4. Cheerful Percussive Pop Rhythm
      if (this.stepIndex % 4 === 2) {
        const popOsc = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();
        popOsc.type = 'sine';
        popOsc.frequency.setValueAtTime(800, now);
        popOsc.frequency.exponentialRampToValueAtTime(150, now + 0.05);

        popGain.gain.setValueAtTime(0.04, now);
        popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        popOsc.connect(popGain);
        popGain.connect(this.ctx.destination);

        popOsc.start(now);
        popOsc.stop(now + 0.06);
      }

      this.stepIndex++;
      this.bgmTimer = setTimeout(playStep, 170); // Upbeat 140 BPM tempo
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

  // Fruit slice tone
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

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.11);

    // Sweet chime
    const chime = this.ctx.createOscillator();
    const chimeGain = this.ctx.createGain();
    chime.type = 'triangle';
    chime.frequency.setValueAtTime(950 + combo * 120, now + 0.02);
    chimeGain.gain.setValueAtTime(0.12, now + 0.02);
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
      gain.gain.setValueAtTime(0.12, now + idx * 0.04);
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

      gain.gain.setValueAtTime(0.15, now + idx * 0.07);
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

      gain.gain.setValueAtTime(0.16, now + idx * 0.11);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.11 + 0.11);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.11);
      osc.stop(now + idx * 0.11 + 0.12);
    });
  }
}

const audio = new SoundEngine();

// --- Canvas & Core Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreElem = document.getElementById('scoreDisplay');
const comboElem = document.getElementById('comboDisplay');
const levelElem = document.getElementById('levelDisplay');

const popNotice = document.getElementById('popNotice');
const levelBanner = document.getElementById('levelBanner');

const startOverlay = document.getElementById('startOverlay');
const pauseOverlay = document.getElementById('pauseOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');

const btnStart = document.getElementById('btnStart');
const btnPause = document.getElementById('btnPause');
const btnResume = document.getElementById('btnResume');
const btnRestart = document.getElementById('btnRestart');

const finalScoreElem = document.getElementById('finalScore');
const finalLevelElem = document.getElementById('finalLevel');
const gameOverDesc = document.getElementById('gameOverDesc');

let W = window.innerWidth;
let H = window.innerHeight;
let DPR = Math.min(window.devicePixelRatio || 1, 2);

let isRunning = false;
let isPaused = false;
let score = 0;
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

// Realistic + Cute Fruit Definitions
const FRUIT_TYPES = [
  { name: 'apple', score: 10, radius: 36, fleshColor: '#fef08a', skinColor: '#dc2626', face: 'happy' },
  { name: 'watermelon', score: 15, radius: 44, fleshColor: '#e11d48', skinColor: '#15803d', face: 'smile' },
  { name: 'orange', score: 10, radius: 36, fleshColor: '#f97316', skinColor: '#ea580c', face: 'joy' },
  { name: 'banana', score: 12, radius: 34, fleshColor: '#fef9c3', skinColor: '#eab308', face: 'grin' },
  { name: 'strawberry', score: 20, radius: 32, fleshColor: '#f43f5e', skinColor: '#be123c', face: 'cute' },
  { name: 'starfruit', score: 30, radius: 36, fleshColor: '#fde047', skinColor: '#f59e0b', face: 'sparkle', bonus: true }
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

// --- Cute Cute Face Renderer ---
function drawCuteFace(r, expression = 'happy') {
  ctx.save();
  const eyeOffset = r * 0.32;
  const eyeY = -r * 0.12;

  if (expression === 'surprised') {
    // >_< or Open Mouth Face
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

  // Shiny Kawaii Eyes
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(-eyeOffset, eyeY, 5.5, 0, Math.PI * 2);
  ctx.arc(eyeOffset, eyeY, 5.5, 0, Math.PI * 2);
  ctx.fill();

  // White Pupil Catchlight
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-eyeOffset - 1.8, eyeY - 1.8, 2.2, 0, Math.PI * 2);
  ctx.arc(eyeOffset - 1.8, eyeY - 1.8, 2.2, 0, Math.PI * 2);
  ctx.fill();

  // Rosy Blushing Cheeks
  ctx.fillStyle = 'rgba(244, 114, 182, 0.75)';
  ctx.beginPath();
  ctx.arc(-eyeOffset - 5, r * 0.15, 6.5, 0, Math.PI * 2);
  ctx.arc(eyeOffset + 5, r * 0.15, 6.5, 0, Math.PI * 2);
  ctx.fill();

  // Sweet Curved Smile
  ctx.beginPath();
  ctx.arc(0, r * 0.08, 7.5, 0.15, Math.PI - 0.15);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.restore();
}

// --- Combined Realistic + Cute Fruit Renderer ---
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
    // Gunmetal Metallic Bomb with Cheeky Face & Sparks
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

    // Metallic Cap & Fuse
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-6, -r - 4, 12, 6);

    ctx.beginPath();
    ctx.moveTo(0, -r - 4);
    ctx.quadraticCurveTo(12, -r - 16, 18, -r - 22);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Sparkle top
    const sparkGrad = ctx.createRadialGradient(18, -r - 22, 1, 18, -r - 22, 10);
    sparkGrad.addColorStop(0, '#ffffff');
    sparkGrad.addColorStop(0.4, '#fde047');
    sparkGrad.addColorStop(0.8, '#ef4444');
    sparkGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

    ctx.beginPath();
    ctx.arc(18, -r - 22, 8 + Math.sin(Date.now() * 0.02) * 3, 0, Math.PI * 2);
    ctx.fillStyle = sparkGrad;
    ctx.fill();

    // Winking Cheeky Bomb Face
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-9, -4, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-9, -4, 2.8, 0, Math.PI * 2);
    ctx.fill();

    // Wink eye right
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

  // Fruit Main Body with Realistic 3D Shading
  if (type.name === 'watermelon') {
    const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    grad.addColorStop(0, '#4ade80');
    grad.addColorStop(0.5, '#16a34a');
    grad.addColorStop(1, '#14532d');

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Dark Wavy Stripes
    ctx.strokeStyle = '#052e16';
    ctx.lineWidth = 5;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 12 - 10, -r + 4);
      ctx.quadraticCurveTo(i * 16 + 10, 0, i * 12 - 10, r - 4);
      ctx.stroke();
    }
  } else if (type.name === 'apple') {
    const grad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r);
    grad.addColorStop(0, '#fca5a5');
    grad.addColorStop(0.3, '#ef4444');
    grad.addColorStop(0.85, '#991b1b');
    grad.addColorStop(1, '#450a0a');

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Stem & Leaf
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
    grad.addColorStop(0, '#ffedd5');
    grad.addColorStop(0.35, '#fb923c');
    grad.addColorStop(0.85, '#c2410c');
    grad.addColorStop(1, '#7c2d12');

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Dimple Pores
    ctx.fillStyle = 'rgba(124, 45, 18, 0.25)';
    for (let i = 0; i < 12; i++) {
      const px = (Math.sin(i * 1.7) * r * 0.68);
      const py = (Math.cos(i * 2.3) * r * 0.68);
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type.name === 'banana') {
    const grad = ctx.createLinearGradient(-r, -r, r, r);
    grad.addColorStop(0, '#fef9c3');
    grad.addColorStop(0.4, '#eab308');
    grad.addColorStop(0.9, '#ca8a04');
    grad.addColorStop(1, '#854d0e');

    ctx.beginPath();
    ctx.moveTo(-r * 0.8, -r * 0.4);
    ctx.quadraticCurveTo(0, -r * 0.9, r * 0.8, -r * 0.2);
    ctx.quadraticCurveTo(r * 0.4, r * 0.9, -r * 0.8, r * 0.5);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(-r * 0.8, r * 0.45, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (type.name === 'strawberry') {
    const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.4, r * 0.1, 0, 0, r * 1.1);
    grad.addColorStop(0, '#fca5a5');
    grad.addColorStop(0.3, '#f43f5e');
    grad.addColorStop(0.85, '#be123c');
    grad.addColorStop(1, '#4c0519');

    ctx.beginPath();
    ctx.moveTo(0, r);
    ctx.quadraticCurveTo(r * 1.1, -r * 0.2, 0, -r);
    ctx.quadraticCurveTo(-r * 1.1, -r * 0.2, 0, r);
    ctx.fillStyle = grad;
    ctx.fill();

    // Seeds
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

    // Leafy Top Cap
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

  // Specular Glossy Highlight Curve
  ctx.beginPath();
  ctx.ellipse(-r * 0.35, -r * 0.35, r * 0.3, r * 0.15, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fill();

  // Render Cute Expressive Face!
  if (halfSide === 0) {
    drawCuteFace(r, type.face || 'happy');
  } else {
    // Sliced Half Interior Flesh
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(0, r);
    ctx.strokeStyle = type.fleshColor;
    ctx.lineWidth = r * 0.85;
    ctx.stroke();

    // Draw surprised expression on cut half!
    drawCuteFace(r * 0.85, 'surprised');
  }

  ctx.restore();
}

// --- Game Loop Logic ---
function updateHUD() {
  scoreElem.textContent = score;
  comboElem.textContent = combo;
  levelElem.textContent = level;
}

function resetGame() {
  score = 0;
  combo = 0;
  level = 1;
  gameObjects = [];
  slicedHalves = [];
  particles = [];
  slashes = [];
  spawnTimer = 0.2;
  bladeX = W / 2;
  bladeDir = 1;
  updateHUD();
}

function startGame() {
  resetGame();
  isRunning = true;
  isPaused = false;
  startOverlay.classList.add('hidden');
  pauseOverlay.classList.add('hidden');
  gameOverOverlay.classList.add('hidden');
  audio.startBGM();
  lastTime = performance.now();
  requestAnimationFrame(gameLoop);
}

function pauseGame() {
  if (!isRunning) return;
  isPaused = true;
  audio.stopBGM();
  pauseOverlay.classList.remove('hidden');
}

function resumeGame() {
  if (!isRunning) return;
  isPaused = false;
  pauseOverlay.classList.add('hidden');
  audio.startBGM();
  lastTime = performance.now();
  requestAnimationFrame(gameLoop);
}

function checkLevelUp() {
  const newLevel = Math.floor(score / 200) + 1;
  if (newLevel > level) {
    level = newLevel;
    audio.playLevelUpSound();
    
    levelBanner.textContent = `⭐ LEVEL ${level}! ⭐`;
    levelBanner.classList.add('show');
    setTimeout(() => levelBanner.classList.remove('show'), 1200);

    for (let i = 0; i < 35; i++) {
      particles.push({
        x: W / 2,
        y: H / 3,
        vx: -220 + Math.random() * 440,
        vy: -320 + Math.random() * 220,
        life: 1.2,
        color: ['#f43f5e', '#3b82f6', '#eab308', '#a855f7', '#22c55e'][Math.floor(Math.random() * 5)],
        char: '⭐'
      });
    }
  }
}

function triggerPop(text) {
  popNotice.textContent = text;
  popNotice.classList.remove('show');
  void popNotice.offsetWidth;
  popNotice.classList.add('show');
  setTimeout(() => popNotice.classList.remove('show'), 350);
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
  for (let i = 0; i < 20; i++) {
    particles.push({
      x: px,
      y: py,
      vx: -220 + Math.random() * 440,
      vy: -240 + Math.random() * 300,
      life: 0.75,
      color: Math.random() < 0.5 ? fleshColor : color,
      char: Math.random() < 0.3 ? '💦' : '•'
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

      triggerPop(combo > 1 ? `${combo}x COMBO! 🎉` : 'NICE SLICE! 🍉');

      // Create Sliced Halves splitting away
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

  if (hitCount === 0 && customX === undefined) {
    combo = 0;
  }
  updateHUD();
}

function gameOver(title, desc) {
  isRunning = false;
  audio.stopBGM();

  finalScoreElem.textContent = score;
  finalLevelElem.textContent = level;
  gameOverDesc.textContent = desc;

  gameOverOverlay.classList.remove('hidden');
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

  updateHUD();
}

function drawBackground() {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(0.5, '#1e1b4b');
  grad.addColorStop(1, '#311b92');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 8; i++) {
    const bubbleX = (i * 220 + Date.now() * 0.02) % (W + 100) - 50;
    const bubbleY = (150 + i * 140) % H;
    ctx.beginPath();
    ctx.arc(bubbleX, bubbleY, 70, 0, Math.PI * 2);
    ctx.fill();
  }
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

  const bladeGrad = ctx.createLinearGradient(bladeX - 80, bladeY + 35, bladeX + 80, bladeY - 35);
  bladeGrad.addColorStop(0, 'rgba(255,255,255,0)');
  bladeGrad.addColorStop(0.5, '#fef08a');
  bladeGrad.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.strokeStyle = bladeGrad;
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(bladeX - 75, bladeY + 32);
  ctx.lineTo(bladeX + 75, bladeY - 32);
  ctx.stroke();

  for (const s of slashes) {
    ctx.save();
    ctx.globalAlpha = s.life / 0.18;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
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
}

function gameLoop(timestamp) {
  if (!isRunning || isPaused) return;

  const dt = Math.min(0.033, (timestamp - lastTime) / 1000);
  lastTime = timestamp;

  update(dt);
  draw();

  requestAnimationFrame(gameLoop);
}

// Input Listeners
canvas.addEventListener('pointerdown', e => {
  e.preventDefault();
  audio.init();
  sliceAction(e.clientX, e.clientY);
});

canvas.addEventListener('pointermove', e => {
  if (e.buttons === 1) {
    sliceAction(e.clientX, e.clientY);
  }
});

window.addEventListener('keydown', e => {
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
  if (document.hidden && isRunning && !isPaused) {
    pauseGame();
  }
});

window.addEventListener('blur', () => {
  if (isRunning && !isPaused) {
    pauseGame();
  }
});

btnStart.addEventListener('click', () => {
  audio.init();
  startGame();
});

btnPause.addEventListener('click', () => {
  pauseGame();
});

btnResume.addEventListener('click', () => {
  resumeGame();
});

btnRestart.addEventListener('click', () => {
  audio.init();
  startGame();
});

draw();
