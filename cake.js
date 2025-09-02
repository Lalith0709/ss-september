const blowBtn = document.getElementById("blowBtn");
const cutBtn = document.getElementById("cutBtn");
const flame = document.querySelector(".flame");
const knife = document.getElementById("knife");
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Blow Candle
blowBtn.addEventListener("click", () => {
  flame.style.display = "none";
  blowBtn.style.display = "none";
  cutBtn.style.display = "inline-block";
});

// Cut Cake
cutBtn.addEventListener("click", () => {
  knife.style.display = "block";
  knife.animate([
    { left: "-150px", top: "50px" },
    { left: "50px", top: "120px" }
  ], {
    duration: 1000,
    fill: "forwards"
  });

  setTimeout(() => {
    knife.style.display = "none";
    cutBtn.style.display = "none";
    startFireworks();
  }, 1500);
});

// Fireworks animation
let particles = [];
function startFireworks() {
  setInterval(() => {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height / 2;
    for (let i = 0; i < 50; i++) {
      particles.push({
        x, y,
        dx: (Math.random() - 0.5) * 5,
        dy: (Math.random() - 0.5) * 5,
        life: 100
      });
    }
  }, 700);

  animate();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  });
  requestAnimationFrame(animate);
}