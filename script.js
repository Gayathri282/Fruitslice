// Fruit Slice Drop - Child-Friendly Audio & Game Engine

// --- Audio Synthesizer Engine (Web Audio API) ---
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.bgmOsc = null;
    this.bgmGain = null;
    this.isPlayingBgm = false;
    this.bgmTimer = null;
    this.bgmNoteIndex = 0;
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

  // Play upbeat procedural background melody
  startBGM() {
    this.init();
    if (!this.ctx || this.isPlayingBgm) return;
    this.isPlayingBgm = true;

    // Cheerful pentatonic melody notes (C Major scale)
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 440.00, 392.00];
    const bassNotes = [130.81, 146.83, 164.81, 196.00];

    const playStep = () => {
      if (!this.isPlayingBgm || !this.ctx) return;

      const now = this.ctx.currentTime;
      
      // Melody note
      const freq = notes[this.bgmNoteIndex % notes.length];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.23);

      // Bass beat on every 2nd note
      if (this.bgmNoteIndex % 2 === 0) {
        const bassFreq = bassNotes[(this.bgmNoteIndex / 2) % bassNotes.length];
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(bassFreq, now);
        bassGain.gain.setValueAtTime(0.05, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);

        bassOsc.start(now);
        bassOsc.stop(now + 0.36);
      }

      this.bgmNoteIndex++;
      this.bgmTimer = setTimeout(playStep, 260);
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

  // Fruit slice / Gaining Points Tone
  playSliceSound(combo = 1) {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Blade swoosh (white noise sweep)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Pitch scales slightly with combo
    const pitch = 440 + Math.min(combo * 60, 400);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.11);

    // Sweet chime pop
    const chime = this.ctx.createOscillator();
    const chimeGain = this.ctx.createGain();
    chime.type = 'triangle';
    chime.frequency.setValueAtTime(880 + combo * 100, now + 0.02);
    chimeGain.gain.setValueAtTime(0.1, now + 0.02);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    chime.connect(chimeGain);
    chimeGain.connect(this.ctx.destination);

    chime.start(now + 0.02);
    chime.stop(now + 0.2);
  }

  // Combo Sound Tone
  playComboSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.12, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.16);
    });
  }

  // Leveling Up Tone
  playLevelUpSound() {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6 fanfare

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.15, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.32);
    });
  }

  // Game Over Tone
  playGameOverSound() {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [300, 260, 220, 180];

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.8, now + idx * 0.12 + 0.11);

      gain.gain.setValueAtTime(0.15, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.13);
    });
  }
}

const audio = new SoundEngine();

// --- Game Constants & State ---
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
let gameTime = 0;

// Blade Sweeper position
let bladeX = W / 2;
let bladeDir = 1;
let bladeY = H * 0.72;

let gameObjects = [];
let particles = [];
let slashes = [];

// Fruit Character Configurations
const FRUIT_TYPES = [
  { name: 'apple', color: '#ef4444', score: 10, radius: 36, face: 'happy' },
  { name: 'watermelon', color: '#22c55e', score: 15, radius: 42, face: 'smile' },
  { name: 'orange', color: '#f97316', score: 10, radius: 35, face: 'joy' },
  { name: 'banana', color: '#eab308', score: 12, radius: 32, face: 'grin' },
  { name: 'strawberry', color: '#f43f5e', score: 20, radius: 30, face: 'cute' },
  { name: 'starfruit', color: '#fbbf24', score: 30, radius: 34, face: 'sparkle', bonus: true }
];

// Canvas Sizing
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

// --- Draw Child-Friendly Character Fruits ---
function drawCuteFruit(x, y, r, type, isBomb, angle = 0, cutSplit = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  if (isBomb) {
    // Cute Cheeky Bomb Monster
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = '#312e81';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#6366f1';
    ctx.stroke();

    // Fuse & Spark
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(15, -r - 15, 20, -r - 20);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Sparkle star at top of fuse
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(20, -r - 20, 6 + Math.sin(Date.now() * 0.02) * 2, 0, Math.PI * 2);
    ctx.fill();

    // Eyes (winking bomb)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-10, -5, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-10, -5, 3, 0, Math.PI * 2);
    ctx.fill();

    // Wink eye
    ctx.beginPath();
    ctx.moveTo(6, -8);
    ctx.lineTo(14, -2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Cheeky mouth
    ctx.beginPath();
    ctx.arc(0, 8, 8, 0.2, Math.PI - 0.2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
    return;
  }

  // Sliced Half Offset Handling
  if (cutSplit !== 0) {
    ctx.translate(cutSplit * 18, 0);
  }

  // Fruit Main Body
  ctx.beginPath();
  if (type.name === 'banana') {
    ctx.ellipse(0, 0, r * 0.7, r * 1.2, 0.3, 0, Math.PI * 2);
  } else if (type.name === 'watermelon') {
    ctx.arc(0, 0, r, 0, Math.PI * 2);
  } else {
    ctx.arc(0, 0, r, 0, Math.PI * 2);
  }

  ctx.fillStyle = type.color;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();

  // Leaf for Apple / Orange / Strawberry
  if (type.name === 'apple' || type.name === 'orange' || type.name === 'strawberry') {
    ctx.beginPath();
    ctx.ellipse(0, -r + 2, 8, 14, 0.4, 0, Math.PI * 2);
    ctx.fillStyle = '#4ade80';
    ctx.fill();
  }

  // Watermelon rind detail
  if (type.name === 'watermelon') {
    ctx.beginPath();
    ctx.arc(0, 0, r - 6, 0, Math.PI * 2);
    ctx.fillStyle = '#f43f5e';
    ctx.fill();
  }

  // Cute Big Shine Highlight
  ctx.beginPath();
  ctx.arc(-r * 0.35, -r * 0.35, r * 0.25, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fill();

  // Cute Facial Features (Anime Eyes & Blush)
  const eyeOffset = r * 0.3;
  ctx.fillStyle = '#1e293b';

  // Left Eye
  ctx.beginPath();
  ctx.arc(-eyeOffset, -r * 0.1, 5, 0, Math.PI * 2);
  ctx.fill();
  // Left Eye Pupil Catchlight
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-eyeOffset - 1.5, -r * 0.1 - 1.5, 2, 0, Math.PI * 2);
  ctx.fill();

  // Right Eye
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(eyeOffset, -r * 0.1, 5, 0, Math.PI * 2);
  ctx.fill();
  // Right Eye Pupil Catchlight
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(eyeOffset - 1.5, -r * 0.1 - 1.5, 2, 0, Math.PI * 2);
  ctx.fill();

  // Rosy Cheeks
  ctx.fillStyle = 'rgba(244, 114, 182, 0.6)';
  ctx.beginPath();
  ctx.arc(-eyeOffset - 4, r * 0.15, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(eyeOffset + 4, r * 0.15, 6, 0, Math.PI * 2);
  ctx.fill();

  // Happy Smile
  ctx.beginPath();
  ctx.arc(0, r * 0.1, 7, 0.1, Math.PI - 0.1);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 3;
  ctx.stroke();

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
  particles = [];
  slashes = [];
  spawnTimer = 0.2;
  gameTime = 0;
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
    
    // Level Up Banner & Confetti
    levelBanner.textContent = `⭐ LEVEL ${level}! ⭐`;
    levelBanner.classList.add('show');
    setTimeout(() => levelBanner.classList.remove('show'), 1200);

    // Confetti particles
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: W / 2,
        y: H / 3,
        vx: -200 + Math.random() * 400,
        vy: -300 + Math.random() * 200,
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
  void popNotice.offsetWidth; // Reflow
  popNotice.classList.add('show');
  setTimeout(() => popNotice.classList.remove('show'), 350);
}

function spawnFruit() {
  const isBomb = Math.random() < Math.min(0.12 + level * 0.02, 0.25);
  const type = FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)];

  gameObjects.push({
    x: 40 + Math.random() * (W - 80),
    y: -60,
    r: isBomb ? 34 : type.radius,
    vy: 200 + Math.random() * 70 + level * 15,
    vx: -35 + Math.random() * 70,
    angle: Math.random() * 6.28,
    rotSpeed: -2.5 + Math.random() * 5,
    isBomb,
    type,
    cut: false
  });
}

function createJuiceSplatter(px, py, color) {
  for (let i = 0; i < 16; i++) {
    particles.push({
      x: px,
      y: py,
      vx: -180 + Math.random() * 360,
      vy: -200 + Math.random() * 260,
      life: 0.65,
      color: Math.random() < 0.4 ? '#ffffff' : color,
      char: Math.random() < 0.3 ? '✨' : '•'
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
        gameOver('💣 OH NO! BOMB HIT!', 'Be careful! Watch out for bombs next time!');
        return;
      }

      combo++;
      const earned = obj.type.score + combo * 3;
      score += earned;

      audio.playSliceSound(combo);
      if (combo > 2) audio.playComboSound();

      triggerPop(combo > 1 ? `${combo}x COMBO! 🎉` : 'NICE SLICE! 🍉');
      createJuiceSplatter(obj.x, obj.y, obj.type.color);
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
  gameTime += dt;

  // Blade automatic sweeper back and forth across playgrid
  bladeX += bladeDir * (240 + level * 20) * dt;
  if (bladeX > W - 60) {
    bladeX = W - 60;
    bladeDir = -1;
  }
  if (bladeX < 60) {
    bladeX = 60;
    bladeDir = 1;
  }

  // Fruit Spawning
  spawnTimer -= dt;
  if (spawnTimer <= 0) {
    spawnFruit();
    if (Math.random() < Math.min(0.4, level * 0.08)) {
      spawnFruit();
    }
    spawnTimer = Math.max(0.4, 0.9 - level * 0.05);
  }

  // Update Game Objects
  for (const obj of gameObjects) {
    obj.vy += (220 + level * 10) * dt;
    obj.y += obj.vy * dt;
    obj.x += obj.vx * dt;
    obj.angle += obj.rotSpeed * dt;
  }

  // Clean objects offscreen
  for (const obj of gameObjects) {
    if (!obj.cut && obj.y > H + 60) {
      obj.cut = true;
      combo = 0;
    }
  }
  gameObjects = gameObjects.filter(o => o.y < H + 100 && !o.cut);

  // Update Slashes & Particles
  for (const s of slashes) s.life -= dt;
  slashes = slashes.filter(s => s.life > 0);

  for (const p of particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 320 * dt;
    p.life -= dt;
  }
  particles = particles.filter(p => p.life > 0);

  updateHUD();
}

function drawBackground() {
  // Vibrant colorful gradient
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#1e1b4b');
  grad.addColorStop(0.5, '#312e81');
  grad.addColorStop(1, '#4c1d95');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Floating playful background bubbles
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 8; i++) {
    const bubbleX = (i * 220 + Date.now() * 0.02) % (W + 100) - 50;
    const bubbleY = (150 + i * 140) % H;
    ctx.beginPath();
    ctx.arc(bubbleX, bubbleY, 65, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function draw() {
  drawBackground();

  // Draw Game Objects
  for (const obj of gameObjects) {
    drawCuteFruit(obj.x, obj.y, obj.r, obj.type, obj.isBomb, obj.angle);
  }

  // Draw Blade Sweeper Line
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

  // Draw Active Slashes
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

  // Draw Splash Particles
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life / 0.65);
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

// --- Inputs & Event Listeners ---

// Canvas Touch / Mouse Swipe & Tap
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

// Spacebar Key Action
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

// Auto-pause game when window/tab is hidden or loses focus
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

// Button Click Event Bindings
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

// Initial canvas render
draw();
