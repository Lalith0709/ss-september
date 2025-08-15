/* ===========================
   Full site script — countdown + confetti + finale
   Author: tailored for Srujana
   =========================== */

/* CONFIG */
const TARGET = new Date(2025, 8, 7, 0, 0, 0); // Sep 7 2025 00:00 local
const FAKE_DURATION = 5000; // ms for fake roll
const FAKE_START = { days: 92, hours: 23, minutes: 59, seconds: 59 };

/* DOM */
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const statusLine = document.getElementById('statusLine');
const countdownScreen = document.getElementById('countdownScreen');
const celebrationScreen = document.getElementById('celebrationScreen');

/* FX canvas (single canvas for confetti + rocket + fireworks) */
const fxCanvas = document.getElementById('fxCanvas');
const ctx = fxCanvas.getContext('2d');
let DPR = window.devicePixelRatio || 1;
function resizeCanvas(){
  DPR = window.devicePixelRatio || 1;
  fxCanvas.width = Math.floor(window.innerWidth * DPR);
  fxCanvas.height = Math.floor(window.innerHeight * DPR);
  fxCanvas.style.width = window.innerWidth + 'px';
  fxCanvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

/* Helpers */
const pad = n => String(n).padStart(2,'0');
const clamp = (v,a,b) => Math.min(b, Math.max(a,v));
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
const randomRange = (a,b) => a + Math.random()*(b-a);

/* State */
let confettiPieces = [];    // confetti particles
let heartParticles = [];    // heart explosion particles
let fireParticles = [];     // fireworks particles
let rocketObjects = [];     // rocket objects
let intensityMultiplier = 1; // 1 normal, 10 fake
let softEmitterId = null;
let realTimer = null;
let fakeRunning = false;
let finaleActive = false;

/* COLORS */
const CIRCLE_COLOR = '#ff69b4';
const HEART_COLOR = '#fbb6ce';
const FIRE_COLORS = ['#ff6ad5','#ff99cc','#ffd1e8','#ff4d88','#ff1a75'];

/* ===========================
   Particle definitions
   =========================== */
function Confetti(type, x, y){
  this.type = type; // 'circle' or 'heart'
  this.x = x;
  this.y = y;
  this.size = randomRange(6,18);
  this.vx = randomRange(-0.6,0.6);
  this.vy = randomRange(0.4,1.6);
  this.spin = randomRange(-0.03,0.03);
  this.rot = Math.random()*Math.PI*2;
  this.birth = performance.now();
  this.ttl = randomRange(6000,12000);
  this.alpha = 1;
  this.color = (type==='circle') ? CIRCLE_COLOR : HEART_COLOR;
  this.front = Math.random()>0.45;
}
Confetti.prototype.update = function(dt){
  this.vy += 0.0008 * dt;
  this.x += this.vx * dt * 0.06 * intensityMultiplier;
  this.y += this.vy * dt * 0.06 * intensityMultiplier;
  this.rot += this.spin * dt * 0.06;
  const age = performance.now() - this.birth;
  this.alpha = clamp(1 - (age / this.ttl), 0, 1);
};
Confetti.prototype.draw = function(c){
  c.save();
  c.globalAlpha = this.alpha;
  c.translate(this.x, this.y);
  c.rotate(this.rot);
  if (this.type === 'circle'){
    c.beginPath();
    c.fillStyle = this.color;
    c.arc(0,0,this.size/2,0,Math.PI*2);
    c.fill();
  } else {
    c.fillStyle = this.color;
    drawHeart(c,this.size);
  }
  c.restore();
};

/* heart particle (for heart explosion) */
function HeartParticle(x,y,vx,vy,size,life){
  this.x=x; this.y=y; this.vx=vx; this.vy=vy;
  this.size=size; this.birth=performance.now(); this.life=life||2600;
  this.color = HEART_COLOR;
}
HeartParticle.prototype.update = function(dt){
  this.vy += 0.001*dt;
  this.x += this.vx * dt * 0.06;
  this.y += this.vy * dt * 0.06;
};
HeartParticle.prototype.draw = function(c){
  const age = performance.now() - this.birth;
  const t = clamp(age / this.life, 0, 1);
  // glow halo
  c.globalAlpha = clamp(0.9 * (1 - t), 0, 0.9);
  c.fillStyle = 'rgba(255,182,193,0.14)';
  c.beginPath(); c.arc(this.x, this.y, this.size*3, 0, Math.PI*2); c.fill();
  // heart
  c.globalAlpha = clamp(1 - t, 0, 1);
  c.fillStyle = this.color;
  drawHeart(c, this.size);
};

/* fire particle */
function FireParticle(x,y,vx,vy,size,life,color){
  this.x=x; this.y=y; this.vx=vx; this.vy=vy; this.size=size; this.birth=performance.now(); this.life=life||1800; this.color=color;
}
FireParticle.prototype.update = function(dt){
  this.vy += 0.002 * dt; // gravity
  this.x += this.vx * dt * 0.06;
  this.y += this.vy * dt * 0.06;
};
FireParticle.prototype.draw = function(c){
  const age = performance.now() - this.birth;
  const t = clamp(age / this.life, 0, 1);
  c.globalAlpha = clamp(1 - t, 0, 1);
  c.fillStyle = this.color;
  c.beginPath();
  c.arc(this.x, this.y, Math.max(0.6, this.size * (1 - t)), 0, Math.PI*2);
  c.fill();
};

/* draw heart helper (centered at 0,0) */
function drawHeart(c, size){
  const s = size / 30;
  c.beginPath();
  c.moveTo(0, -15 * s);
  c.bezierCurveTo(-15*s, -35*s, -40*s, -15*s, 0, 15*s);
  c.bezierCurveTo(40*s, -15*s, 15*s, -35*s, 0, -15*s);
  c.closePath();
  c.fill();
}

/* ===========================
   Spawning helpers
   =========================== */
function spawnConfettiBurst(count=20, xMin=0.05, xMax=0.95, yOrigin=-0.08){
  for (let i=0;i<count;i++){
    const rx = xMin + Math.random()*(xMax-xMin);
    const x = rx * window.innerWidth + (Math.random()-0.5) * 20;
    const y = yOrigin * window.innerHeight + Math.random()*30;
    const type = Math.random() > 0.45 ? 'circle' : 'heart';
    confettiPieces.push(new Confetti(type, x, y));
  }
}

/* soft emitter during normal operation */
let softEmitterTimer = null;
function startSoftEmitter(){
  if (softEmitterTimer) return;
  softEmitterTimer = setInterval(()=>{
    // base count, scaled by intensityMultiplier
    const base = 6 + Math.floor(Math.random()*6);
    spawnConfettiBurst(Math.floor(base * intensityMultiplier), 0.08, 0.92, -0.08);
  }, 420);
}
function stopSoftEmitter(){
  if (!softEmitterTimer) return;
  clearInterval(softEmitterTimer);
  softEmitterTimer = null;
}

/* ensure minimum confetti alive */
function ensureConfettiMinimum(){
  const min = Math.floor(40 * intensityMultiplier);
  if (confettiPieces.length < min){
    spawnConfettiBurst(min - confettiPieces.length, 0.02, 0.98, -0.08);
  }
}

/* ===========================
   Rocket -> Heart -> Fireworks sequence
   - rocket rises, explodes into heart-shaped burst, then fireworks
   =========================== */
function createHeartBurst(cx, cy, count = 220){
  for (let i=0;i<count;i++){
    const t = (i / count) * Math.PI * 2;
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = 13 * Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t);
    const scale = randomRange(6,10);
    const px = cx + hx * scale + randomRange(-6,6);
    const py = cy - hy * scale + randomRange(-6,6);
    const angle = Math.atan2(py - cy, px - cx);
    const sp = randomRange(1.6,4.4);
    heartParticles.push(new HeartParticle(cx, cy, Math.cos(angle)*sp, Math.sin(angle)*sp, randomRange(3.2,6), 2600 + Math.random()*1400));
  }
}

function createFireworkBurst(cx, cy, count = 80){
  for (let i=0;i<count;i++){
    const ang = Math.random() * Math.PI * 2;
    const sp = randomRange(1.8,5.5);
    fireParticles.push(new FireParticle(cx, cy, Math.cos(ang)*sp, Math.sin(ang)*sp, randomRange(2.5,5.5), 1600 + Math.random()*1800, FIRE_COLORS[Math.floor(Math.random()*FIRE_COLORS.length)]));
  }
}

/* run finale: used on page load and after fake roll */
function runFinaleSequence(){
  if (finaleActive) return;
  finaleActive = true;
  const prevMultiplier = intensityMultiplier;
  intensityMultiplier = 10; // ramp confetti

  // Create a rocket object (simple)
  const rocket = { x: window.innerWidth/2, y: window.innerHeight + 60, vx: 0, vy: -10, trail: [], done:false };
  rocketObjects.push(rocket);

  // watch rocket; explosion happens in render loop when y < threshold
  // After explosion, create heart and initial fireworks, then continued fireworks for ~8s
  // Cleanup & reset intensity at end
  // We'll manage timings with timeouts triggered after explosion (handled in render loop)
  // Mark rocket with .finale true to ensure only one rocket from this runner
}

/* ===========================
   Render loop
   =========================== */
let last = performance.now();
function render(now){
  const dt = clamp(now - last, 8, 48);
  last = now;

  // clear
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  // update/draw back confetti
  for (let i = confettiPieces.length - 1; i >= 0; i--){
    const p = confettiPieces[i];
    p.update(dt);
    if (!p.front) p.draw(ctx);
    if (p.y > window.innerHeight + 60 || p.alpha <= 0.01) confettiPieces.splice(i,1);
  }

  // rockets (trail + head)
  for (let ri = rocketObjects.length - 1; ri >= 0; ri--){
    const r = rocketObjects[ri];
    if (r.done) { rocketObjects.splice(ri,1); continue; }
    // move
    r.x += r.vx;
    r.y += r.vy;
    // trail
    r.trail.push({ x: r.x + randomRange(-3,3), y: r.y + randomRange(8,16), birth: performance.now(), life: 380 });
    // draw trail
    for (let ti = r.trail.length - 1; ti >=0; ti--){
      const t = r.trail[ti];
      const age = performance.now() - t.birth;
      const a = clamp(1 - age / t.life, 0, 1);
      ctx.globalAlpha = a * 0.9;
      ctx.fillStyle = '#ffd1e8';
      ctx.fillRect(t.x, t.y, 2, 2);
      if (age > t.life) r.trail.splice(ti,1);
    }
    // draw rocket head
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff6fb';
    ctx.beginPath(); ctx.ellipse(r.x, r.y, 6, 12, 0, 0, Math.PI*2); ctx.fill();

    // if rocket reaches threshold -> explode
    if (!r.exploded && r.y < window.innerHeight * 0.38){
      r.exploded = true;
      // create heart + fireworks at r.x,r.y
      createHeartBurst(r.x, r.y, 220);
      createFireworkBurst(r.x, r.y, 120);
      // after 4s start repeated fireworks for ~8s
      setTimeout(() => {
        let bursts = 0;
        const fwInt = setInterval(()=>{
          const cx = randomRange(window.innerWidth * 0.15, window.innerWidth * 0.85);
          const cy = randomRange(window.innerHeight * 0.12, window.innerHeight * 0.5);
          createFireworkBurst(cx, cy, 80 + Math.floor(Math.random()*80));
          bursts++;
          if (bursts >= 12) {
            clearInterval(fwInt);
            // small buffer then reset intensity
            setTimeout(()=> {
              intensityMultiplier = 1;
              finaleActive = false;
            }, 900);
          }
        }, 700);
      }, 4000);
      // mark rocket done after explosion
      r.done = true;
    }
  }

  // heart particles
  for (let i = heartParticles.length - 1; i >= 0; i--){
    const h = heartParticles[i];
    const age = performance.now() - h.birth;
    h.update(dt);
    h.draw(ctx);
    if (age > h.life) heartParticles.splice(i,1);
  }

  // fireworks
  for (let i = fireParticles.length - 1; i >= 0; i--){
    const f = fireParticles[i];
    const age = performance.now() - f.birth;
    f.update(dt);
    f.draw(ctx);
    if (age > f.life) fireParticles.splice(i,1);
  }

  // draw front confetti
  for (let i = 0; i < confettiPieces.length; i++){
    const p = confettiPieces[i];
    if (p.front) p.draw(ctx);
  }

  // ensure enough confetti
  ensureConfettiMinimum();

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

/* ===========================
   Countdown: real -> fake -> finale
   =========================== */
function paintReal(){
  const now = new Date();
  const diff = Math.floor((TARGET - now) / 1000);
  if (diff <= 0 && !fakeRunning){
    fakeRunning = true;
    statusLine.textContent = "It's time — rolling to zero…";
    // set intensity x10
    intensityMultiplier = 10;
    // run fake roll
    startFakeRoll().then(() => {
      // after fake roll, run finale (rocket->heart->fireworks)
      // finale will reset intensity later
      runFinaleSequence();
    });
    return;
  }
  if (diff <= 0) return; // already running

  const d = Math.floor(diff / 86400);
  let rem = diff - d*86400;
  const h = Math.floor(rem / 3600); rem -= h*3600;
  const m = Math.floor(rem / 60);
  const s = rem - m*60;

  daysEl.textContent = d;
  hoursEl.textContent = pad(h);
  minutesEl.textContent = pad(m);
  secondsEl.textContent = pad(s);
}

function startRealCountdown(){
  paintReal();
  startSoftEmitter();
  realTimer = setInterval(paintReal, 1000);
}

/* Fake roll: smooth slot-like animation */
function startFakeRoll(){
  return new Promise((resolve) => {
    const t0 = performance.now();
    function stepRoll(now){
      const elapsed = now - t0;
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

      // subtle wobble
      const wobble = Math.sin(now/70) * 0.6;
      [daysEl, hoursEl, minutesEl, secondsEl].forEach(el => el.style.transform = translateY(${wobble}px));

      if (elapsed < FAKE_DURATION) requestAnimationFrame(stepRoll);
      else {
        daysEl.textContent = 0;
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        [daysEl, hoursEl, minutesEl, secondsEl].forEach(el => el.style.transform = '');
        resolve();
      }
    }
    requestAnimationFrame(stepRoll);
  });
}

/* runFinaleSequence wrapper: launches rocket object to be handled in render loop */
function runFinaleSequence(){
  if (finaleActive) return;
  finaleActive = true;
  // ramp intensity (already set to 10 by caller)
  const rocket = { x: window.innerWidth/2, y: window.innerHeight + 60, vx: 0, vy: -10, trail: [], done:false, exploded:false };
  rocketObjects.push(rocket);
}

/* helper to run initial opener finale once on load */
function runOpenerThenStart(){
  // run opener finale shortly after page paints
  intensityMultiplier = 10;
  runFinaleSequence();
  // start countdown after a slight delay to allow opener to run
  setTimeout(()=> {
    // ensure intensity returns to normal by finale's end
    startRealCountdown();
  }, 900);
}

/* Start on load */
window.addEventListener('load', ()=>{
  // ensure canvas sized right
  resizeCanvas();
  // start light confetti & opener finale
  startRealCountdown();         // starts confetti and countdown
  setTimeout(()=>{              // run opener finale after page load
    intensityMultiplier = 10;
    runFinaleSequence();
  }, 700);
});