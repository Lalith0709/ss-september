// ------------------------
// Real countdown logic with celebration
// ------------------------
const realDate = new Date("September 7, 2025 00:00:00").getTime();
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

startConfetti(); // start confetti immediately
startFireworks(); // start fireworks immediately

let realInterval = setInterval(updateRealCountdown, 1000);

function updateRealCountdown() {
  const now = new Date().getTime();
  let distance = realDate - now;

  if(distance < 0) distance = 0;

  const days = Math.floor(distance / (1000*60*60*24));
  const hours = Math.floor((distance % (1000*60*60*24)) / (1000*60*60));
  const minutes = Math.floor((distance % (1000*60*60)) / (1000*60));
  const seconds = Math.floor((distance % (1000*60)) / 1000);

  daysEl.innerText = days;
  hoursEl.innerText = hours;
  minutesEl.innerText = minutes;
  secondsEl.innerText = seconds;

  if(distance === 0) {
    clearInterval(realInterval);
    startFakeCountdown(); // start fake countdown after real ends
  }
}

// ------------------------
// Fake countdown logic with rolling wheels
// ------------------------
function startFakeCountdown() {
  const fakeStartDays = 92;
  const fakeStartHours = 23;
  const fakeStartMinutes = 59;
  const fakeStartSeconds = 59;
  const duration = 3000; // 3 seconds
  const startTime = performance.now();

  function animateFake(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const days = Math.floor(fakeStartDays * (1 - progress));
    const hours = Math.floor(fakeStartHours * (1 - progress));
    const minutes = Math.floor(fakeStartMinutes * (1 - progress));
    const seconds = Math.floor(fakeStartSeconds * (1 - progress));

    daysEl.innerText = days;
    hoursEl.innerText = hours;
    minutesEl.innerText = minutes;
    secondsEl.innerText = seconds;

    if(progress < 1) {
      requestAnimationFrame(animateFake);
    }
  }

  requestAnimationFrame(animateFake);
}

// ------------------------
// Confetti (continuous)
// ------------------------
function startConfetti() {
  const confettiCanvas = document.getElementById("confetti-canvas") || document.body;
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
    requestAnimationFrame(frame); // continuous
  })();
}

// ------------------------
// Fireworks (continuous)
// ------------------------
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
    const angle = Math.random() * Math.PI - Math.PI/2;
    const color = hsl(${Math.random()*360},100%,50%);
    particles.push({x, y, speed, angle, color, alpha:1});
  }

  function animate() {
    ctx.clearRect(0,0,fireworksCanvas.width,fireworksCanvas.height);
    for(let i=particles.length-1;i>=0;i--){
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
    requestAnimationFrame(animate);
  }

  setInterval(createParticle, 200); // keep creating particles continuously
  animate();
}