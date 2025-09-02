const blowBtn = document.getElementById("blowBtn");
const cutBtn = document.getElementById("cutBtn");
const flames = document.querySelectorAll(".flame");
const fireworksCanvas = document.getElementById("fireworks");
const ctx = fireworksCanvas.getContext("2d");

fireworksCanvas.width = window.innerWidth;
fireworksCanvas.height = window.innerHeight;

// Blow candles
blowBtn.addEventListener("click", () => {
  flames.forEach(f => {
    f.style.animation = "fadeOut 1s forwards";
  });
});

const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeOut {
  to { opacity: 0; transform: scale(0); }
}`;
document.head.appendChild(style);

// Cut cake + fireworks
cutBtn.addEventListener("click", () => {
  const cake = document.querySelector(".cake");
  cake.classList.add("cut");

  // Fireworks start
  launchFireworks();
});

// Cake slice animation
document.head.insertAdjacentHTML("beforeend", `
<style>
.cake.cut .layer {
  animation: slice 1s forwards;
}
@keyframes slice {
  to { transform: translateY(20px) rotate(5deg); }
}
</style>
`);

// Fireworks animation
let particles = [];
function launchFireworks() {
  setInterval(() => {
    const x = Math.random() * fireworksCanvas.width;
    const y = Math.random() * fireworksCanvas.height / 2;
    for (let i = 0; i < 50; i++) {
      particles.push({
        x, y,
        angle: Math.random() * 2 * Math.PI,
        speed: Math.random() * 5 + 2,
        radius: Math.random() * 2 + 1,
        alpha: 1
      });
    }
  }, 500);

  animateFireworks();
}

function animateFireworks() {
  ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
  particles.forEach((p, i) => {
    p.x += Math.cos(p.angle) * p.speed;
    p.y += Math.sin(p.angle) * p.speed;
    p.alpha -= 0.01;

    ctx.fillStyle = `rgba(255, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
    ctx.fill();

    if (p.alpha <= 0) particles.splice(i, 1);
  });
  requestAnimationFrame(animateFireworks);
}