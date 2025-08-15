/* ===========================
   Srujana — Countdown + confetti (no external libs)
   =========================== */

/* CONFIG */
const TARGET = new Date(2025, 8, 7, 0, 0, 0); // Sep 7, 2025
const FAKE_DURATION = 5000; // ms
const FAKE_START = { days: 92, hours: 23, minutes: 59, seconds: 59 };

/* DOM */
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const statusLine = document.getElementById('statusLine');
const countdownScreen = document.getElementById('countdownScreen');
const celebrationScreen = document.getElementById('celebrationScreen');
const confettiCanvas = document.getElementById('confettiCanvas');

/* helpers */
const pad = n => String(n).padStart(2, '0');
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

/* ===========================
   Canvas confetti system
   =========================== */
let ctx = null, W = 0, H = 0, pieces = [], raf = null;

function resizeCanvas() {
  if (!confettiCanvas) return;
  const dpr = window.devicePixelRatio || 1;
  W = confettiCanvas.width = Math.floor(window.innerWidth * dpr);
  H = confettiCanvas.height = Math.floor(window.innerHeight * dpr);
  confettiCanvas.style.width = window.innerWidth + 'px';
  confettiCanvas.style.height = window.innerHeight + 'px';
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resizeCanvas);

function drawHeart(ctx, size) {
  const s = size / 30;
  ctx.beginPath();
  ctx.moveTo(0, -15 * s);
  ctx.bezierCurveTo(-15 * s, -35 * s, -40 * s, -15 * s, 0, 15 * s);
  ctx.bezierCurveTo(40 * s, -15 * s, 15 * s, -35 * s, 0, -15 * s);
  ctx.closePath();
  ctx.fill();
}

function Confetti(type = 'circle', x = 0, y = -10) {
  this.type = type;
  this.x = x;
  this.y = y;
  this.size = 6 + Math.random() * 16;
  this.vx = (Math.random() - 0.5) * 1.2;
  this.vy = 0.6 + Math.random() * 1.6;
  this.spin = (Math.random() - 0.5) * 0.06;
  this.rot = Math.random() * Math.PI * 2;
  this.birth = performance.now();
  this.ttl = 7000 + Math.random() * 7000;
  this.alpha = 1;
  this.front = Math.random() > 0.45;
  this.color = this.type === 'circle' ? '#ff69b4' : '#fbb6ce';
}
Confetti.prototype.update = function (dt) {
  this.vy += 0.0006 * dt;
  this.vx += Math.sin((this.y + this.x) * 0.001) * 0.0005 * dt;
  this.x += this.vx * dt * 0.06;
  this.y += this.vy * dt * 0.06;
  this.rot += this.spin * dt * 0.06;
  const age = performance.now() - this.birth;
  this.alpha = clamp(1 - (age / this.ttl), 0, 1);
};
Confetti.prototype.draw = function (c) {
  c.save();
  c.globalAlpha = this.alpha;
  c.translate(this.x, this.y);
  c.rotate(this.rot);
  if (this.type === 'circle') {
    c.beginPath();
    c.fillStyle = this.color;
    c.arc(0, 0, this.size / 2, 0, Math.PI * 2);
    c.fill();
  } else {
    c.fillStyle = this.color;
    drawHeart(c, this.size);
  }
  c.restore();
};

function step() {
  if (!ctx) ctx = confettiCanvas.getContext('2d');
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (let i = pieces.length - 1; i >= 0; i--) {
    const p = pieces[i];
    p.update(16);
    if (!p.front) p.draw(ctx);
    if (p.y > window.innerHeight + 40 || p.alpha <= 0.01) pieces.splice(i, 1);
  }
  for (let i = 0; i < pieces.length; i++) {
    const p = pieces[i];
    if (p.front) p.draw(ctx);
  }
  raf = requestAnimationFrame(step);
}
resizeCanvas();
step();

function spawn({ type = 'mixed', count = 20, xMin = 0.05, xMax = 0.95, y = -0.12 }) {
  for (let i = 0; i < count; i++) {
    const rx = xMin + Math.random() * (xMax - xMin);
    const x = rx * window.innerWidth + (Math.random() - 0.5) * 20;
    const yPos = y * window.innerHeight + Math.random() * 30;
    let t = type;
    if (type === 'mixed') t = Math.random() > 0.5 ? 'circle' : 'heart';
    pieces.push(new Confetti(t, x, yPos));
  }
}

/* Soft emitter */
let softEmitter = null;
function startSoftEmitter() {
  if (softEmitter) return;
  softEmitter = setInterval(() => {
    const cnt = 20 + Math.floor(Math.random() * 10);
    const x = Math.random() * 0.7 + 0.15;
    spawn({ type: 'mixed', count: cnt, xMin: x - 0.08, xMax: x + 0.08, y: -0.08 });
  }, 350);
}
function stopSoftEmitter() {
  if (!softEmitter) return;
  clearInterval(softEmitter);
  softEmitter = null;
}

/* Countdown logic */
let realTimer = null;
startSoftEmitter(); //start confetti during real countdown is live
realTimer = setInterval(paintReal,1000)
function paintReal() {
  const now = new Date();
  const diffSec = Math.floor((TARGET - now) / 1000);
  if (diffSec <= 0) {
    clearInterval(realTimer);
    statusLine.textContent = "It's time — rolling to zero…";
    stopSoftEmitter();
    setTimeout(() => {
      startFakeRoll().then(showCelebration);
    }, 250);
    return;
  }
  const d = Math.floor(diffSec / 86400);
  let rem = diffSec - d * 86400;
  const h = Math.floor(rem / 3600); rem -= h * 3600;
  const m = Math.floor(rem / 60);
  const s = rem - m * 60;
  daysEl.textContent = d;
  hoursEl.textContent = pad(h);
  minutesEl.textContent = pad(m);
  secondsEl.textContent = pad(s);
}
function startReal() {
  paintReal();
  startSoftEmitter();
  realTimer = setInterval(paintReal, 1000);
}

/* Fake roll */
function startFakeRoll() {
  return new Promise(resolve => {
    const start = performance.now();
    function frame(now) {
      const elapsed = now - start;
      const t = clamp(elapsed / FAKE_DURATION, 0, 1);
      const e = easeOutCubic(t);
      const d = Math.round((1 - e) * FAKE_START.days);
      const spinFactor = 6;
      const hVal = Math.round(Math.abs(Math.sin((1 - e) * Math.PI * spinFactor)) * FAKE_START.hours * (1 - e));
      const mVal = Math.round(Math.abs(Math.sin((1 - e) * Math.PI * spinFactor * 1.6)) * FAKE_START.minutes * (1 - e));
      const sVal = Math.round(Math.abs(Math.sin((1 - e) * Math.PI * spinFactor * 2.2)) * FAKE_START.seconds * (1 - e));

      daysEl.textContent = d;
      hoursEl.textContent = pad(hVal);
      minutesEl.textContent = pad(mVal);
      secondsEl.textContent = pad(sVal);

      const wobble = Math.sin(now / 70) * 0.6;
      [daysEl, hoursEl, minutesEl, secondsEl].forEach(el => el.style.transform = `translateY(${wobble}px)`);

      if (elapsed < FAKE_DURATION) {
        requestAnimationFrame(frame);
      } else {
        daysEl.textContent = 0;
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        [daysEl, hoursEl, minutesEl, secondsEl].forEach(el => el.style.transform = '');
        resolve();
      }
    }
    requestAnimationFrame(frame);
  });
}

/* Celebration */
function showCelebration() {
  countdownScreen.style.display = 'none';
  celebrationScreen.hidden = false;

  // staged bursts
  const bursts = [0, 600, 1200, 2000, 3000];
  bursts.forEach(delay => {
    setTimeout(() => {
      spawn({ type: 'mixed', count: 50, xMin: 0.1, xMax: 0.9, y: -0.1 });
    }, delay);
  });
}

/* Start */
startReal();