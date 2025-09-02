const blowBtn = document.getElementById("blowBtn");
const cutBtn = document.getElementById("cutBtn");
const flame = document.getElementById("flame");
const knife = document.getElementById("knife");
const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Blow Candle
blowBtn.addEventListener("click", () => {
  flame.style.display = "none";
  blowBtn.disabled = true;
  cutBtn.disabled = false;
});

// Cut Cake Animation
cutBtn.addEventListener("click", () => {
  knife.style.display = "block";
  knife.animate([
    { top: "-80px" },
    { top: "120px" }
  ], {
    duration: 1000,
    easing: "ease-in-out"
  }).onfinish = () => {
    knife.style.display = "none";
    launchFireworks();
  };
});

// Fireworks
function launchFireworks() {
  const particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      alpha: 1,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.02;
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (particles.some(p => p.alpha > 0)) requestAnimationFrame(animate);
  }
  animate();
}