// ========== COUNTDOWN SETUP ==========
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const countdownCard = document.querySelector(".wrap");
const celebrationScreen = document.querySelector(".celebration");

const targetDate = new Date("2025-09-07T00:00:00");
let fakeCountdownTriggered = false;

// ========== REAL COUNTDOWN ==========
function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0 && !fakeCountdownTriggered) {
        startFakeCountdown();
        fakeCountdownTriggered = true;
        return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    daysEl.textContent = d;
    hoursEl.textContent = h;
    minutesEl.textContent = m;
    secondsEl.textContent = s;
}

// ========== FAKE FAST COUNTDOWN ==========
function startFakeCountdown() {
    let fakeDays = 92;
    let fakeHours = 23;
    let fakeMinutes = 59;
    let fakeSeconds = 59;

    const interval = setInterval(() => {
        // Make numbers roll smoothly
        fakeDays -= 1;
        if (fakeDays < 0) fakeDays = 0;

        fakeHours = Math.floor(Math.random() * 24);
        fakeMinutes = Math.floor(Math.random() * 60);
        fakeSeconds = Math.floor(Math.random() * 60);

        daysEl.textContent = fakeDays;
        hoursEl.textContent = fakeHours;
        minutesEl.textContent = fakeMinutes;
        secondsEl.textContent = fakeSeconds;

        if (fakeDays <= 0) {
            clearInterval(interval);
            showCelebration();
        }
    }, 50); // Fast rolling speed
}

// ========== SHOW CELEBRATION ==========
function showCelebration() {
    countdownCard.style.display = "none";
    celebrationScreen.hidden = false;
    launchConfetti();
}

// ========== CONFETTI ==========
function launchConfetti() {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Heart shape path
    const heartShape = confetti.shapeFromPath({
        path: "M0 -15 C-15 -35, -40 -15, 0 15 C40 -15, 15 -35, 0 -15 Z"
    });

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 5 * (timeLeft / duration);

        // Pink circles
        confetti(Object.assign({}, defaults, {
            particleCount,
            shapes: ['circle'],
            colors: ['#ff69b4'], // opaque pink
            origin: { x: randomInRange(0, 1), y: Math.random() - 0.2 }
        }));

        // Light pink hearts
        confetti(Object.assign({}, defaults, {
            particleCount,
            shapes: [heartShape],
            colors: ['#fbb6ce'], // light pink
            origin: { x: randomInRange(0, 1), y: Math.random() - 0.2 }
        }));
    }, 250);
}

// ========== INIT ==========
setInterval(updateCountdown, 1000);
updateCountdown();