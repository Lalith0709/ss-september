// -----------------------------
// CONFIGURATION
// -----------------------------
const birthdayDate = new Date("September 7, 2025 00:00:00").getTime();
const fakeCountdownDays = 92;      // fake countdown total days
const fakeCountdownDuration = 4000; // 4 seconds in ms

// DOM elements
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const extraAnimationWrapper = document.getElementById("extra-animation-wrapper");
const oldElements = document.getElementById("old-hidden-elements");
const confettiCanvas = document.getElementById("confetti");
const fireworksCanvas = document.getElementById("fireworks");

// Check localStorage if real countdown ended previously
const realCountdownDone = localStorage.getItem("realCountdownDone") === "true";

// -----------------------------
// REAL COUNTDOWN
// -----------------------------
function startRealCountdown() {
  const interval = setInterval(() => {
    const now = new Date().getTime();
    const distance = birthdayDate - now;

    if (distance <= 0) {
      clearInterval(interval);
      updateCountdown(0, 0, 0, 0);
      localStorage.setItem("realCountdownDone", "true");
      // After real countdown ends, start fake countdown
      startFakeCountdown();
    } else {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      updateCountdown(days, hours, minutes, seconds);
    }
  }, 1000);
}

// Update countdown numbers
function updateCountdown(d, h, m, s) {
  daysEl.textContent = d;
  hoursEl.textContent = h;
  minutesEl.textContent = m;
  secondsEl.textContent = s;
}

// -----------------------------
// FAKE COUNTDOWN
// Smooth wheel rolling animation from 92 → 0 days in 4s
// -----------------------------
function startFakeCountdown() {
  const startTime = performance.now();
  const startDays = fakeCountdownDays;

  function animateFake(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / fakeCountdownDuration, 1); // 0 → 1
    const currentDay = Math.floor(startDays * (1 - progress));
    updateCountdown(currentDay, 0, 0, 0);

    if (progress < 1) {
      requestAnimationFrame(animateFake);
    } else {
      // Fake countdown complete: trigger celebrations
      triggerCelebration();
    }
  }

  requestAnimationFrame(animateFake);
}

// -----------------------------
// CELEBRATION: CONFETTI + FIREWORKS + SHOW HIDDEN ELEMENTS
// -----------------------------
function triggerCelebration() {
  // Show hidden cards/messages
  oldElements.style.display = "flex";

  // Confetti (over countdown box)
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
  });

  // Fireworks using canvas animation
  startFireworks();
}

// Simple fireworks animation
function startFireworks() {
  const ctx = fireworksCanvas.getContext("2d");
  fireworksCanvas.width = window.innerWidth;
  fireworksCanvas.height = window.innerHeight;

  const particles = [];

  function createParticle() {
    const x = Math.random() * fireworksCanvas.width;
    const y = Math.random() * fireworksCanvas.height/2;
    const dx = (Math.random() - 0.5) * 6;
    const dy = (Math.random() - 0.5) * 6;
    const color = `hsl(${Math.random()*360}, 100%, 50%)`;
    particles.push({x, y, dx, dy, color, alpha: 1});
  }

  function animate() {
    ctx.clearRect(0,0,fireworksCanvas.width, fireworksCanvas.height);
    for (let i=0;i<particles.length;i++) {
      const p = particles[i];
      p.x += p.dx;
      p.y += p.dy;
      p.alpha -= 0.01;
      if (p.alpha <= 0) particles.splice(i,1);
      else {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }

  // Create burst of particles
  for (let i=0;i<150;i++) createParticle();
  animate();
}

// -----------------------------
// INITIALIZATION
// -----------------------------
if (realCountdownDone) {
  // Real countdown ended previously
  updateCountdown(0,0,0,0);
  startFakeCountdown(); // run fake countdown + celebrations immediately
} else {
  startRealCountdown(); // start real countdown
}