/* =====================================================
   PRE-COUNTDOWN FIREWORK GLIMPSE
===================================================== */
function preCountdownFireworkGlimpse() {
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const particles = [];
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: canvas.height,
      speed: Math.random() * 5 + 2,
      angle: Math.random() * Math.PI - Math.PI / 2,
      color: `hsl(${Math.random() * 360},100%,50%)`,
      alpha: 1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      p.alpha -= 0.02;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
      if (p.alpha <= 0) particles.splice(i, 1);
    }
    if (particles.length > 0) requestAnimationFrame(animate);
  }

  animate();
}

/* =====================================================
   REAL COUNTDOWN LOGIC
===================================================== */
const countdownElements = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds")
};

const birthdayDate = new Date("September 7, 2025 00:00:00").getTime();
let countdownInterval;

function startRealCountdown() {
  countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    let distance = birthdayDate - now;
    if (distance < 0) distance = 0;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownElements.days.innerText = days;
    countdownElements.hours.innerText = hours;
    countdownElements.minutes.innerText = minutes;
    countdownElements.seconds.innerText = seconds;

    if (distance === 0) {
      clearInterval(countdownInterval);
      startCelebration();
      startFakeCountdownAfterReal();
    }
  }, 1000);
}

/* =====================================================
   FAKE COUNTDOWN “WHEEL ROLL” AFTER REAL END
===================================================== */
function startFakeCountdownAfterReal() {
  const start = 92; // starting fake days
  const end = 0; // end
  const duration = 3000; // 3 sec
  const steps = 60;
  let currentStep = 0;

  const interval = setInterval(() => {
    currentStep++;
    const value = Math.floor(start - ((start - end) * currentStep / steps));
    countdownElements.days.innerText = value;
    countdownElements.hours.innerText = Math.floor(Math.random() * 24);
    countdownElements.minutes.innerText = Math.floor(Math.random() * 60);
    countdownElements.seconds.innerText = Math.floor(Math.random() * 60);
    if (currentStep >= steps) clearInterval(interval);
  }, duration / steps);
}

/* =====================================================
   CONFETTI & FIREWORKS
===================================================== */
function fireConfetti() {
  const bursts = [
    {count: 10, angle: 60, originX: 0},
    {count: 12, angle: 120, originX: 1},
    {count: 15, angle: 90, originX: 0.5},
    {count: 12, angle: 45, originX: 0.3},
    {count: 12, angle: 135, originX: 0.7},
    {count: 20, angle: 90, originX: 0.5},
  ];
  bursts.forEach(b => confetti({particleCount: b.count, angle: b.angle, spread: 60, origin: {x: b.originX}}));
}

function fireFireworks() {
  for (let i = 0; i < 6; i++) {
    createFireworkParticle(50 + i * 10);
  }
}

function createFireworkParticle(count) {
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: canvas.height,
      speed: Math.random() * 5 + 3,
      angle: Math.random() * Math.PI - Math.PI / 2,
      color: `hsl(${Math.random() * 360},100%,50%)`,
      alpha: 1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      p.alpha -= 0.01;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
      if (p.alpha <= 0) particles.splice(i, 1);
    }
    if (particles.length > 0) requestAnimationFrame(animate);
  }

  animate();
}

/* =====================================================
   GIFT BOX + CAKE ANIMATIONS
===================================================== */
function dropGiftBox() {
  const gift = document.createElement("div");
  gift.classList.add("gift-box");
  document.body.appendChild(gift);
  gift.style.position = "absolute";
  gift.style.top = "-100px";
  gift.style.left = Math.random() * window.innerWidth + "px";
  gift.style.width = "50px";
  gift.style.height = "50px";
  gift.style.backgroundColor = "#ff1493";
  gift.style.border = "2px solid #fff";
  gift.style.borderRadius = "10px";
  gift.style.zIndex = 999;

  let topPos = -100;
  const fallInterval = setInterval(() => {
    topPos += 5;
    gift.style.top = topPos + "px";
    if (topPos > window.innerHeight - 60) {
      clearInterval(fallInterval);
      openGift(gift);
    }
  }, 20);
}

function openGift(gift) {
  gift.style.transition = "all 0.5s ease";
  gift.style.transform = "scale(1.5) rotate(20deg)";
  setTimeout(() => {
    gift.remove();
    showCake();
  }, 800);
}

function showCake() {
  const cake = document.createElement("div");
  cake.classList.add("cake");
  document.body.appendChild(cake);
  cake.style.position = "absolute";
  cake.style.bottom = "0";
  cake.style.left = "50%";
  cake.style.transform = "translateX(-50%)";
  cake.style.width = "100px";
  cake.style.height = "100px";
  cake.style.backgroundColor = "#f5deb3";
  cake.style.borderRadius = "50% 50% 0 0";
  cake.style.zIndex = 999;

  for (let i = 0; i < 10; i++) createCakeSparkle(cake);
}

function createCakeSparkle(cake) {
  const sparkle = document.createElement("div");
  sparkle.classList.add("sparkle");
  cake.appendChild(sparkle);
  sparkle.style.position = "absolute";
  sparkle.style.width = "5px";
  sparkle.style.height = "5px";
  sparkle.style.backgroundColor = "#fff";
  sparkle.style.borderRadius = "50%";
  sparkle.style.top = Math.random() * 100 + "px";
  sparkle.style.left = Math.random() * 100 + "px";

  let opacity = 1;
  const sparkleInterval = setInterval(() => {
    opacity -= 0.05;
    sparkle.style.opacity = opacity;
    if (opacity <= 0) {
      clearInterval(sparkleInterval);
      sparkle.remove();
    }
  }, 50);
}

function fallingGifts() {
  for (let i = 0; i < 10; i++) setTimeout(() => dropGiftBox(), i * 500);
}

/* =====================================================
   POST-COUNTDOWN PAGES
===================================================== */
const postPages = document.getElementById("post-pages");
const nextPageBtn = document.getElementById("nextPage");
const pages = document.querySelectorAll(".page");
let currentPage = 0;

function showPostPages() {
  postPages.classList.remove("hidden");
  pages[0].classList.remove("hidden");
  pages[1].classList.add("hidden");
  pages[2].classList.add("hidden");
  currentPage = 0;
}

nextPageBtn.addEventListener("click", () => {
  pages[currentPage].classList.add("hidden");
  currentPage = (currentPage + 1) % pages.length;
  pages[currentPage].classList.remove("hidden");
});

/* =====================================================
   HIDDEN CARDS + EXTRA ANIMATIONS
===================================================== */
const oldCards = document.querySelectorAll(".old-card");
const extraAnimationItems = document.querySelectorAll(".extra-animation-item");

function revealOldCardsSequentially() {
  oldCards.forEach((card, i) => setTimeout(() => card.style.display = "inline-block", i * 300));
}

function animateExtraItems() {
  extraAnimationItems.forEach((item, i) => setTimeout(() => item.style.backgroundColor = "#ff69b4", i * 200));
}

function startCelebration() {
  fireConfetti();
  fireFireworks();
  fallingGifts();
  revealOldCardsSequentially();
  animateExtraItems();
  showPostPages();
}

/* =====================================================
   INITIALIZATION
===================================================== */
window.addEventListener("load", () => {
  preCountdownFireworkGlimpse();
  startRealCountdown();
});