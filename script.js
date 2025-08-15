// ========== CONFIG ==========
const realCountdownDate = new Date('September 7, 2025 00:00:00').getTime();
const fakeCountdownStart = { days: 92, hours: 18, minutes: 7, seconds: 1 };
const fakeCountdownDuration = 4000; // 4 seconds

// ========== ELEMENTS ==========
const container = document.getElementById('countdown-container');
const countdownEl = document.getElementById('countdown');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

// ========== REAL COUNTDOWN ==========
function startRealCountdown() {
  const interval = setInterval(() => {
    const now = new Date().getTime();
    const distance = realCountdownDate - now;

    if(distance <= 0){
      clearInterval(interval);
      container.style.display = "none"; // hide real countdown
      startFakeCountdown();
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000*60*60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000*60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.innerText = d;
    hoursEl.innerText = h;
    minutesEl.innerText = m;
    secondsEl.innerText = s;
  },1000);
}

startRealCountdown();

// ========== FAKE COUNTDOWN ==========
function startFakeCountdown() {
  container.style.display = "block"; // show container again
  const startTime = performance.now();
  function animateFake(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / fakeCountdownDuration, 1);

    const days = Math.floor(fakeCountdownStart.days * (1 - progress));
    const hours = Math.floor(fakeCountdownStart.hours * (1 - progress));
    const minutes = Math.floor(fakeCountdownStart.minutes * (1 - progress));
    const seconds = Math.floor(fakeCountdownStart.seconds * (1 - progress));

    daysEl.innerText = days;
    hoursEl.innerText = hours;
    minutesEl.innerText = minutes;
    secondsEl.innerText = seconds;

    if(progress < 1){
      requestAnimationFrame(animateFake);
    } else {
      countdownEl.innerHTML = "🎉 Happy 18th Birthday! 🎉";
      startHeartFirework();
    }
  }
  requestAnimationFrame(animateFake);
  startConfetti();
}

// ========== CONFETTI ==========
function startConfetti() {
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiCount = 200;
  const confettis = [];

  for(let i=0;i<confettiCount;i++){
    confettis.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*6+4,
      d: Math.random()*confettiCount,
      color: hsl(${Math.random()*360}, 100%, 50%),
      tilt: Math.random()*10-10
    });
  }

  function drawConfetti(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    confettis.forEach(c => {
      ctx.beginPath();
      ctx.lineWidth = c.r;
      ctx.strokeStyle = c.color;
      ctx.moveTo(c.x + c.tilt + c.r/2, c.y);
      ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r/2);
      ctx.stroke();

      c.y += Math.cos(c.d) + 1 + c.r/2;
      if(c.y > canvas.height){ c.y = 0; c.x = Math.random()*canvas.width; }
    });
    requestAnimationFrame(drawConfetti);
  }

  drawConfetti();
}

// ========== NORMAL FIREWORKS ==========
function startFireworks() {
  const canvas = document.getElementById('fireworks');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const fireworksArr = [];

  function random(min,max){ return Math.random()*(max-min)+min; }

  class Particle {
    constructor(x,y,color){
      this.x = x;
      this.y = y;
      this.color = color;
      this.velX = random(-5,5);
      this.velY = random(-5,5);
      this.alpha = 1;
      this.size = 2;
    }
    update(){
      this.x += this.velX;
      this.y += this.velY;
      this.alpha -= 0.02;
    }
    draw(){
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function explode(x,y){
    const color = hsl(${Math.random()*360},100%,50%);
    for(let i=0;i<50;i++){
      fireworksArr.push(new Particle(x,y,color));
    }
  }

  function animate(){
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    fireworksArr.forEach((p,i)=>{
      p.update();
      p.draw();
      if(p.alpha <=0) fireworksArr.splice(i,1);
    });

    if(Math.random()<0.05){
      explode(random(0,canvas.width),random(0,canvas.height/2));
    }

    requestAnimationFrame(animate);
  }

  animate();
}

// ========== HEART FIREWORK ==========
function startHeartFirework(){
  const canvas = document.getElementById('fireworks');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let rocketY = canvas.height;
  const rocketX = canvas.width/2;
  const middleY = canvas.height/2;
  let heartAlpha = 1;

  function drawHeart(x, y, scale=1){
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.beginPath();
    const size = 15;
    ctx.moveTo(0,0);
    ctx.bezierCurveTo(-size,-size, -size,-3*size, 0,-4*size);
    ctx.bezierCurveTo(size,-3*size, size,-size, 0,0);
    ctx.strokeStyle = rgba(255,0,0,${heartAlpha});
    ctx.lineWidth = 3;
    ctx.setLineDash([5,5]);
    ctx.shadowColor = "red";
    ctx.shadowBlur = 20 * heartAlpha;
    ctx.stroke();
    ctx.restore();
  }

  function animateHeart(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(rocketY > middleY){
      // draw rocket
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(rocketX, rocketY, 5,0,Math.PI*2);
      ctx.fill();
      rocketY -= 10;
      requestAnimationFrame(animateHeart);
    } else if(heartAlpha>0){
      // draw heart
      drawHeart(rocketX, rocketY, 10);
      heartAlpha -= 0.01;
      requestAnimationFrame(animateHeart);
    } else{
      // start normal fireworks after heart
      startFireworks();
    }
  }

  animateHeart();
}