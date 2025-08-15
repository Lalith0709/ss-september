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

/* ====== HELPER…
const countdownDate = new Date("Sep 7, 2025 00:00:00").getTime();
const celebrationScreen = document.querySelector(".celebration");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function updateCountdown() {
  const now = new Date().getTime();
  const distance = countdownDate - now;

  if (distance <= 0) {
    startFakeCountdown();
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  daysEl.textContent = days;
  hoursEl.textContent = hours;
  minutesEl.textContent = minutes;
  secondsEl.textContent = seconds;
}

function startFakeCountdown() {
  let fakeDays = 92;
  let fakeHours = 0;
  let fakeMinutes = 0;
  let fakeSeconds = 0;

  const interval = setInterval(() => {
    fakeDays--;
    if (fakeDays < 0) {
      clearInterval(interval);
      showCelebration();
    } else {
      daysEl.textContent = fakeDays;
    }
  }, 50); // Fast roll
}

function showCelebration() {
  celebrationScreen.hidden = false;
  launchConfetti();
}

function launchConfetti() {
  const duration = 8000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const heartShape = confetti.shapeFromPath({
    path: "M0 -15 C-15 -35, -40 -15, 0 15 C40 -15, 15 -35, 0 -15 Z"
  });

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    const particleCount = 5 * (timeLeft / duration);

    confetti(Object.assign({}, defaults, {
      particleCount,
      shapes: ['circle'],
      colors: ['#ff69b4'], // opaque pink
      origin: { x: randomInRange(0, 1), y: Math.random() - 0.2 }
    }));

    confetti(Object.assign({}, defaults, {
      particleCount,
      shapes: [heartShape],
      colors: ['#fbb6ce'], // light pink hearts
      origin: { x: randomInRange(0, 1), y: Math.random() - 0.2 }
    }));
  }, 250);
}

setInterval(updateCountdown, 1000);
updateCountdown();