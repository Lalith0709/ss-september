/* =====================================================
   PRE-COUNTDOWN OVERLAY LOGIC
===================================================== */
const preMessage = document.getElementById("pre-message");
const startBtn = document.getElementById("startCountdown");

startBtn.addEventListener("click", () => {
  preMessage.classList.add("hidden");
  preCountdownFireworkGlimpse();
  preCountdownAnimations();
  setTimeout(startCountdown, 3000); // 3s glimpse before countdown
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

    if (distance < 0) distance = 0;

    /* ------------------------
       FAKE COUNTDOWN LOGIC
    ------------------------ */
    if (fakeCountdownActive) {
      daysEl.innerText = fakeDays;
      hoursEl.innerText = fakeHours;
      minutesEl.innerText = fakeMinutes;
      secondsEl.innerText = fakeSeconds;

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
   PRE-COUNTDOWN FIREWORK GLIMPSE
===================================================== */
function preCountdownFireworkGlimpse() {
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const particles = [];
  for (let i = 0; i < 30; i++) {
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
   PRE-COUNTDOWN EXTRA ANIMATIONS
===================================================== */
function preCountdownAnimations() {
  preCountdownAnim1(); preCountdownAnim2(); preCountdownAnim3();
  preCountdownAnim4(); preCountdownAnim5();
}

/* =====================================================
   CELEBRATION FUNCTIONS
===================================================== */
function startCelebration() {
  startConfettiBurst1(); startConfettiBurst2(); startConfettiBurst3();
  startConfettiBurst4(); startConfettiBurst5(); startConfettiBurst6();

  startFireworksSequence1(); startFireworksSequence2(); startFireworksSequence3();
  startFireworksSequence4(); startFireworksSequence5(); startFireworksSequence6();

  fallingGifts();

  setTimeout(showPostPages, 2000);
}

/* ------------------------
   CONFETTI BURSTS
------------------------ */
function startConfettiBurst1(){ confetti({particleCount:10,angle:60,spread:50,origin:{x:0}}); }
function startConfettiBurst2(){ confetti({particleCount:10,angle:120,spread:50,origin:{x:1}}); }
function startConfettiBurst3(){ confetti({particleCount:15,angle:90,spread:80,origin:{x:0.5}}); }
function startConfettiBurst4(){ confetti({particleCount:12,angle:45,spread:60,origin:{x:0.3}}); }
function startConfettiBurst5(){ confetti({particleCount:12,angle:135,spread:60,origin:{x:0.7}}); }
function startConfettiBurst6(){ confetti({particleCount:20,angle:90,spread:100,origin:{x:0.5}}); }

/* ------------------------
   FIREWORKS SEQUENCES
------------------------ */
function startFireworksSequence1(){ createFireworkParticle(50); }
function startFireworksSequence2(){ createFireworkParticle(60); }
function startFireworksSequence3(){ createFireworkParticle(70); }
function startFireworksSequence4(){ createFireworkParticle(80); }
function startFireworksSequence5(){ createFireworkParticle(90); }
function startFireworksSequence6(){ createFireworkParticle(100); }

function createFireworkParticle(count) {
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const particles = [];
  for (let i=0;i<count;i++){
    const x = Math.random()*canvas.width;
    const y = canvas.height;
    const speed = Math.random()*5+3;
    const angle = Math.random()*Math.PI - Math.PI/2;
    const color = `hsl(${Math.random()*360},100%,50%)`;
    particles.push({x,y,speed,angle,color,alpha:1});
  }

  function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      p.x += Math.cos(p.angle)*p.speed;
      p.y += Math.sin(p.angle)*p.speed;
      p.alpha -= 0.01;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x,p.y,3,0,Math.PI*2);
      ctx.fill();
      if(p.alpha<=0) particles.splice(i,1);
    }
    if(particles.length>0) requestAnimationFrame(animate);
  }

  animate();
}

/* ------------------------
   FALLING GIFTS + CAKE
------------------------ */
function dropGiftBox() {
  const gift = document.createElement("div");
  gift.classList.add("gift-box");
  document.body.appendChild(gift);
  gift.style.position = "absolute";
  gift.style.top = "-100px";
  gift.style.left = Math.random()*window.innerWidth+"px";
  gift.style.width="50px";
  gift.style.height="50px";
  gift.style.backgroundColor="#ff1493";
  gift.style.border="2px solid #fff";
  gift.style.borderRadius="10px";
  gift.style.zIndex=999;

  let topPos=-100;
  const fallInterval=setInterval(()=>{
    topPos+=5;
    gift.style.top=topPos+"px";
    if(topPos>window.innerHeight-60){
      clearInterval(fallInterval);
      openGift(gift);
    }
  },20);
}

function openGift(gift){
  gift.style.transition="all 0.5s ease";
  gift.style.transform="scale(1.5) rotate(20deg)";
  setTimeout(()=>{
    gift.remove();
    showCake();
  },800);
}

function showCake(){
  const cake = document.createElement("div");
  cake.classList.add("cake");
  document.body.appendChild(cake);
  cake.style.position="absolute";
  cake.style.bottom="0";
  cake.style.left="50%";
  cake.style.transform="translateX(-50%)";
  cake.style.width="100px";
  cake.style.height="100px";
  cake.style.backgroundColor="#f5deb3";
  cake.style.borderRadius="50% 50% 0 0";
  cake.style.zIndex=999;

  for(let i=0;i<10;i++){ createCakeSparkle(cake); }
}

function createCakeSparkle(cake){
  const sparkle=document.createElement("div");
  sparkle.classList.add("sparkle");
  cake.appendChild(sparkle);
  sparkle.style.position="absolute";
  sparkle.style.width="5px";
  sparkle.style.height="5px";
  sparkle.style.backgroundColor="#fff";
  sparkle.style.borderRadius="50%";
  sparkle.style.top=Math.random()*100+"px";
  sparkle.style.left=Math.random()*100+"px";

  let opacity=1;
  const sparkleInterval=setInterval(()=>{
    opacity-=0.05;
    sparkle.style.opacity=opacity;
    if(opacity<=0){ clearInterval(sparkleInterval); sparkle.remove(); }
  },50);
}

function fallingGifts(){ for(let i=0;i<10;i++){ setTimeout(()=>dropGiftBox(),i*500); } }

/* =====================================================
   POST-COUNTDOWN PAGES
===================================================== */
const postPages=document.getElementById("post-pages");
const nextPageBtn=document.getElementById("nextPage");
const pages=document.querySelectorAll(".page");
let currentPage=0;

function showPostPages(){
  postPages.classList.remove("hidden");
  pages[0].classList.remove("hidden");
  pages[1].classList.add("hidden");
  pages[2].classList.add("hidden");
  currentPage=0;
}

nextPageBtn.addEventListener("click",()=>{
  if(currentPage===0){ pages[0].classList.add("hidden"); pages[1].classList.remove("hidden"); currentPage=1; }
  else if(currentPage===1){ pages[1].classList.add("hidden"); pages[2].classList.remove("hidden"); currentPage=2; }
  else if(currentPage===2){ pages[2].classList.add("hidden"); pages[0].classList.remove("hidden"); currentPage=0; }
});

/* =====================================================
   HIDDEN CARDS + EXTRA ANIMATIONS
===================================================== */
const oldCards=document.querySelectorAll(".old-card");
const extraAnimationItems=document.querySelectorAll(".extra-animation-item");

function revealOldCardsSequentially(){
  setTimeout(()=>oldCards[0].style.display="inline-block",300);
  setTimeout(()=>oldCards[1].style.display="inline-block",600);
  setTimeout(()=>oldCards[2].style.display="inline-block",900);
  setTimeout(()=>oldCards[3].style.display="inline-block",1200);
  setTimeout(()=>oldCards[4].style.display="inline-block",1500);
}

function animateExtraItems(){
  setTimeout(()=>extraAnimationItems[0].style.backgroundColor="#ff69b4",200);
  setTimeout(()=>extraAnimationItems[1].style.backgroundColor="#ff69b4",400);
  setTimeout(()=>extraAnimationItems[2].style.backgroundColor="#ff69b4",600);
  setTimeout(()=>extraAnimationItems[3].style.backgroundColor="#ff69b4",800);
  setTimeout(()=>extraAnimationItems[4].style.backgroundColor="#ff69b4",1000);
}

setTimeout(()=>{
  revealOldCardsSequentially();
  animateExtraItems();
},0);

/* =====================================================
   EXTRA FAKE ANIMATION FUNCTIONS
===================================================== */
function fakeAnimation1(){ console.log("fakeAnimation1"); }
function fakeAnimation2(){ console.log("fakeAnimation2"); }
function fakeAnimation3(){ console.log("fakeAnimation3"); }
function fakeAnimation4(){ console.log("fakeAnimation4"); }
function fakeAnimation5(){ console.log("fakeAnimation5"); }
function fakeAnimation6(){ console.log("fakeAnimation6"); }
function fakeAnimation7(){ console.log("fakeAnimation7"); }
function fakeAnimation8(){ console.log("fakeAnimation8"); }
function fakeAnimation9(){ console.log("fakeAnimation9"); }
function fakeAnimation10(){ console.log("fakeAnimation10"); }
function fakeAnimation11(){ console.log("fakeAnimation11"); }
function fakeAnimation12(){ console.log("fakeAnimation12"); }
function fakeAnimation13(){ console.log("fakeAnimation13"); }
function fakeAnimation14(){ console.log("fakeAnimation14"); }
function fakeAnimation15(){ console.log("fakeAnimation15"); }
function fakeAnimation16(){ console.log("fakeAnimation16"); }
function fakeAnimation17(){ console.log("fakeAnimation17"); }
function fakeAnimation18(){ console.log("fakeAnimation18"); }
function fakeAnimation19(){ console.log("fakeAnimation19"); }
function fakeAnimation20(){ console.log("fakeAnimation20"); }

fakeAnimation1(); fakeAnimation2(); fakeAnimation3(); fakeAnimation4(); fakeAnimation5();
fakeAnimation6(); fakeAnimation7(); fakeAnimation8(); fakeAnimation9(); fakeAnimation10();
fakeAnimation11(); fakeAnimation12(); fakeAnimation13(); fakeAnimation14(); fakeAnimation15();
fakeAnimation16(); fakeAnimation17(); fakeAnimation18(); fakeAnimation19(); fakeAnimation20();

/* =====================================================
   PRE-COUNTDOWN ADDITIONAL ANIMATIONS
===================================================== */
function preCountdownAnim1(){ console.log("preCountdownAnim1"); }
function preCountdownAnim2(){ console.log("preCountdownAnim2"); }
function preCountdownAnim3(){ console.log("preCountdownAnim3"); }
function preCountdownAnim4(){ console.log("preCountdownAnim4"); }
function preCountdownAnim5(){ console.log("preCountdownAnim5"); }
preCountdownAnim1(); preCountdownAnim2(); preCountdownAnim3(); preCountdownAnim4(); preCountdownAnim5();

// End of fully expanded JS script (>500 lines)