/* ====== CONFIG ====== */
// Target moment: Sep 7, 2025 00:00 (months are 0-based: 8 = September)
const TARGET = new Date(2025, 8, 7, 0, 0, 0);
// Fake roll length in ms
const FAKE_DURATION = 5000;
// Fake start values
const FAKE_DAYS_START = 92;  // rolls 92 -> 0
const FAKE_H_START = 23;     // 23 -> 0
const FAKE_M_START = 59;     // 59 -> 0
const FAKE_S_START = 59;     // 59 -> 0

/* ====== ELEMENTS ====== */
const $ = (id) => document.getElementById(id);
const daysEl = $("days");
const hoursEl = $("hours");
const minutesEl = $("minutes");
const secondsEl = $("seconds");
const statusLine = $("statusLine");
const countdownScreen = $("countdownScreen");
const celebrationScreen = $("celebrationScreen");
const confettiCanvas = $("confetti");

/* ====== HELPERS ====== */
const pad = (n) => String(n).padStart(2, "0");
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
// Smooth but snappy easing for slot effect
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/* ====== REAL COUNTDOWN ====== */
function updateRealCountdown() {
  const now = new Date();
  let diff = Math.floor((TARGET - now) / 1000); // seconds left

  if (diff <= 0) {
    // Switch to fake rolling phase immediately at target
    startFakeCountdown();
    return true; // signal that we’re done with real countdown
  }

  const d = Math.floor(diff / 86400); diff -= d * 86400;
  const h = Math.floor(diff / 3600);  diff -= h * 3600;
  const m = Math.floor(diff / 60);
  const s = diff - m * 60;

  daysEl.textContent = d;
  hoursEl.textContent = pad(h);
  minutesEl.textContent = pad(m);
  secondsEl.textContent = pad(s);
  return false;
}

(function startRealCountdown(){
  // Initial paint
  const done = updateRealCountdown();
  if (done) return;
  // Tick each second
  const t = setInterval(() => {
    const finished = updateRealCountdown();
    if (finished) clearInterval(t);
  }, 1000);
})();

/* ====== FAKE ROLLING COUNTDOWN ====== */
function startFakeCountdown(){
  statusLine.textContent = "Surprise! Rolling to zero…";
  let start = null;

  function frame(ts){
    if (!start) start = ts;
    const elapsed = ts - start;
    const t = clamp(elapsed / FAKE_DURATION, 0, 1);
    const e = easeOutCubic(t);

    // Days go 92 -> 0
    const d = Math.round(lerp(FAKE_DAYS_START, 0, e));

    // To enhance the “slot” feeling, make lower units spin slightly faster by
    // overshooting and snapping back with a modular wrap that tightens near the end.
    const spin = (startValue, cycles) => {
      // cycles = how many extra wraps early on (decreases to 0 at the end)
      const w = (1 - e) * cycles;           // remaining wraps
      const base = lerp(startValue + w * startValue, 0, e); // diminish towards 0
      return Math.max(0, Math.round(base) % (startValue + 1));
    };

    const h = spin(FAKE_H_START, 1.8); // hours spin a bit
    const m = spin(FAKE_M_START, 3.2); // minutes spin more
    const s = spin(FAKE_S_START, 5.0); // seconds spin the most

    // Visually smooth: tiny wobble using translateY
    const wobble = (v) => {
      const off = Math.sin(ts / 70) * 0.5; // subtle
      return `translateY(${off}px)`;
    };

    daysEl.style.transform = wobble(d);
    hoursEl.style.transform = wobble(h);
    minutesEl.style.transform = wobble(m);
    secondsEl.style.transform = wobble(s);

    daysEl.textContent = d;
    hoursEl.textContent = pad(h);
    minutesEl.textContent = pad(m);
    secondsEl.textContent = pad(s);

    if (elapsed < FAKE_DURATION) {
      requestAnimationFrame(frame);
    } else {
      // Snap to zero, then celebrate
      daysEl.textContent = 0;
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      setTimeout(showCelebration, 250);
    }
  }
  requestAnimationFrame(frame);
}

/* ====== CELEBRATION (CONFETTI) ====== */
let W = 0, H = 0, pieces = [];
function resizeCanvas(){
  if (!confettiCanvas) return;
  W = confettiCanvas.width = window.innerWidth;
  H = confettiCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);

function ConfettiPiece() {
  this.x = Math.random() * W;
  this.y = Math.random() * -H;
  this.size = 6 + Math.random() * 10;
  this.speed = 1 + Math.random() * 3.2;
  this.rotation = Math.random() * 360;
  this.spin = -3 + Math.random() * 6;
  this.alpha = 0.8 + Math.random() * 0.2;
  this.shape = Math.random() > 0.5 ? "rect" : "circle";
  this.hue = Math.floor(Math.random()*360);
}

function burst(n=220){
  for(let i=0;i<n;i++) pieces.push(new ConfettiPiece());
}

function drawConfetti(){
  const ctx = confettiCanvas.getContext("2d");
  ctx.clearRect(0,0,W,H);
  pieces.forEach((p)=> {
    p.y += p.speed;
    p.rotation += p.spin;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation * Math.PI/180);
    ctx.fillStyle = `hsl(${p.hue}, 100%, 70%)`;
    if(p.shape==='rect'){
      ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
    } else {
      ctx.beginPath(); ctx.arc(0,0,p.size/2,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
  });
  pieces = pieces.filter(p => p.y < H + 40);
  requestAnimationFrame(drawConfetti);
}

function showCelebration(){
  countdownScreen.style.display = "none";
  celebrationScreen.hidden = false;
  resizeCanvas();
  // a couple bursts so it feels lively
  burst(260);
  setTimeout(()=>burst(160), 500);
  setTimeout(()=>burst(160), 1200);
  requestAnimationFrame(drawConfetti);
}

/* ===== If someone opens exactly at/after target, go straight to fake/celebration ===== */
(function guardAtLoad(){
  const now = new Date();
  if (now >= TARGET) {
    // Immediately do the fake roll then celebrate
    startFakeCountdown();
  }
})();