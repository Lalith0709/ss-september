// Show cake after clicking "Continue"
const showCakeBtn = document.getElementById('showCakeBtn');
const cakeContainer = document.getElementById('cake-container');

showCakeBtn.addEventListener('click', () => {
  document.getElementById('message-card').style.display = 'none';
  cakeContainer.style.display = 'flex';
});

// Cake cutting animation
const leftSlice = document.querySelector('.left');
const rightSlice = document.querySelector('.right');
const cutButton = document.getElementById('cutButton');
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let cutDone = false;

cutButton.addEventListener('click', () => {
  if (!cutDone) {
    leftSlice.style.transform = 'rotate(-30deg) translate(-50px, 50px)';
    rightSlice.style.transform = 'rotate(30deg) translate(50px, 50px)';
    cutDone = true;
    launchFireworks();
  }
});

function launchFireworks() {
  const particles = [];
  for (let i = 0; i < 200; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      alpha: 1,
      color: `hsl(${Math.random()*360}, 100%, 50%)`
    });
  }

  function animate() {
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.02;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (particles.some(p => p.alpha > 0)) requestAnimationFrame(animate);
  }
  animate();
}