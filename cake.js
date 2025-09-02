// 🎉 Confetti Effect
const confetti = document.getElementById("confetti");
const ctx = confetti.getContext("2d");
confetti.width = window.innerWidth;
confetti.height = window.innerHeight;

const particles = [];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticle() {
  return {
    x: random(0, confetti.width),
    y: random(-confetti.height, 0),
    size: random(5, 10),
    color: `hsl(${random(0, 360)}, 100%, 50%)`,
    speed: random(2, 5),
    drift: random(-1, 1),
  };
}

for (let i = 0; i < 150; i++) {
  particles.push(createParticle());
}

function drawParticles() {
  ctx.clearRect(0, 0, confetti.width, confetti.height);
  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();

    p.y += p.speed;
    p.x += p.drift;

    if (p.y > confetti.height) {
      p.y = -10;
      p.x = random(0, confetti.width);
    }
  }
}

function animate() {
  drawParticles();
  requestAnimationFrame(animate);
}

animate();