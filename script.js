/* =====================================================
   PRE-COUNTDOWN OVERLAY LOGIC
===================================================== */
const preMessage = document.getElementById("pre-message");
const startBtn = document.getElementById("startCountdown");

startBtn.addEventListener("click", () => {
  preMessage.classList.add("hidden");
  startCountdown();
});

/* =====================================================
   COUNTDOWN VARIABLES
===================================================== */
const birthdayDate = new Date("September 7, 2025 00:00:00").getTime();
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

// Fake countdown start values
let fakeDays = 10;
let fakeHours = 23;
let fakeMinutes = 59;
let fakeSeconds = 59;

let countdownInterval;
let fakeCountdownActive = true;

/* =====================================================
   START COUNTDOWN FUNCTION
===================================================== */
function startCountdown() {
  countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    let distance = birthdayDate - now;

    // Ensure countdown never goes negative
    if (distance < 0) distance = 0;

    /* ------------------------
       FAKE COUNTDOWN LOGIC
    ------------------------ */
    if (fakeCountdownActive) {
      daysEl.innerText = fakeDays;
      hoursEl.innerText = fakeHours;
      minutesEl.innerText = fakeMinutes;
      secondsEl.innerText = fakeSeconds;

      // Decrement fake countdown explicitly
      fakeSeconds--;
      if (fakeSeconds < 0) {
        fakeSeconds = 59;
        fakeMinutes--;
        if (fakeMinutes < 0) {
          fakeMinutes = 59;
          fakeHours--;
          if (fakeHours < 0) {
            fakeHours = 23;
            fakeDays--;
            if (fakeDays < 0) {
              fakeCountdownActive = false;
            }
          }
        }
      }
    }

    /* ------------------------
       REAL COUNTDOWN LOGIC
    ------------------------ */
    if (!fakeCountdownActive) {
      const realDays = Math.floor(distance / (1000 * 60 * 60 * 24));
      const realHours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const realMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const realSeconds = Math.floor((distance % (1000 * 60)) / 1000);

      daysEl.innerText = realDays;
      hoursEl.innerText = realHours;
      minutesEl.innerText = realMinutes;
      secondsEl.innerText = realSeconds;
    }

    /* ------------------------
       CHECK COUNTDOWN END
    ------------------------ */
    if (distance === 0) {
      clearInterval(countdownInterval);
      startCelebration();
    }

  }, 1000);
}

/* =====================================================
   CELEBRATION FUNCTIONS
===================================================== */
function startCelebration() {
  startConfetti();
  startFireworks();
  showPostPages();
}

/* ------------------------
   CONFETTI LOGIC
------------------------ */
function startConfetti() {
  const duration = 10000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

/* ------------------------
   FIREWORKS LOGIC
------------------------ */
function startFireworks() {
  const fireworksCanvas = document.getElementById("fireworks");
  const ctx = fireworksCanvas.getContext("2d");
  fireworksCanvas.width = fireworksCanvas.offsetWidth;
  fireworksCanvas.height = fireworksCanvas.offsetHeight;

  const particles = [];

  function createParticle() {
    const x = Math.random() * fireworksCanvas.width;
    const y = fireworksCanvas.height;
    const speed = Math.random() * 5 + 3;
    const angle = Math.random() * Math.PI - Math.PI / 2;
    const color = `hsl(${Math.random()*360},100%,50%)`;
    particles.push({x, y, speed, angle, color, alpha:1});
  }

  function animate() {
    ctx.clearRect(0,0,fireworksCanvas.width, fireworksCanvas.height);
    for (let i = particles.length-1; i>=0; i--){
      const p = particles[i];
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      p.alpha -= 0.01;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3,0,Math.PI*2);
      ctx.fill();
      if(p.alpha <=0) particles.splice(i,1);
    }
    if(particles.length>0) requestAnimationFrame(animate);
  }

  const fireworkInterval = setInterval(createParticle, 200);
  setTimeout(() => clearInterval(fireworkInterval), 5000);
  animate();
}

/* =====================================================
   POST-COUNTDOWN PAGES LOGIC
===================================================== */
const postPages = document.getElementById("post-pages");
const nextPageBtn = document.getElementById("nextPage");
const pages = document.querySelectorAll(".page");
let currentPage = 0;

function showPostPages() {
  postPages.classList.remove("hidden");
  pages.forEach((p,i)=>p.classList.add("hidden"));
  pages[0].classList.remove("hidden");
  currentPage = 0;
}

nextPageBtn.addEventListener("click", ()=>{
  pages[currentPage].classList.add("hidden");
  currentPage++;
  if(currentPage >= pages.length){
    currentPage = 0; // loop back if needed
  }
  pages[currentPage].classList.remove("hidden");
});

/* =====================================================
   OLD HIDDEN CARDS / EXTRA ANIMATIONS
===================================================== */
const oldCards = document.querySelectorAll(".old-card");
const extraAnimationItems = document.querySelectorAll(".extra-animation-item");

// Example explicit animation logic for old cards
function revealOldCardsSequentially() {
  oldCards.forEach((card, index)=>{
    setTimeout(()=>{
      card.style.display = "inline-block";
    }, index * 500); // reveal one by one
  });
}

// Example explicit animation for extra placeholders
function animateExtraItems() {
  extraAnimationItems.forEach((item, index)=>{
    setTimeout(()=>{
      item.style.backgroundColor = "#ff69b4";
    }, index * 300);
  });
}

// Trigger old animations after countdown ends
countdownInterval && setTimeout(()=>{
  revealOldCardsSequentially();
  animateExtraItems();
}, 0);