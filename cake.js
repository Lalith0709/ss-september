// Flame blowing and cake cutting logic
const blowBtn = document.getElementById("blowBtn");
const cutBtn = document.getElementById("cutBtn");
const flame = document.querySelector(".flame");
const cake = document.querySelector(".cake");

blowBtn.addEventListener("click", () => {
  flame.style.animation = "fadeOut 1s forwards";
  setTimeout(() => {
    flame.style.display = "none";
    blowBtn.disabled = true;
    cutBtn.disabled = false;
  }, 1000);
});

// Cake cutting + feeding slice
cutBtn.addEventListener("click", () => {
  const slice = document.createElement("div");
  slice.classList.add("slice");
  cake.appendChild(slice);
  slice.style.display = "block";

  // Animate slice coming forward (feeding you)
  slice.animate(
    [
      { transform: "translateY(0) scale(1)" },
      { transform: "translateY(-150px) scale(1.2)" },
      { transform: "translateY(-200px) scale(1.5)" }
    ],
    { duration: 2000, fill: "forwards" }
  );

  cutBtn.disabled = true;
});

// Add candle flame fade out keyframes
const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}`;
document.head.appendChild(style);

// Confetti effect (continuous)
const confettiCanvas = document.getElementById("confetti");
const ctx = confettiCanvas.getContext("2d");
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

const confetti = [];
for (let i = 0; i < 200; i++) {
  confetti.push({
    x: Math.random() * confettiCanvas.width,
    y: Math.random() * confettiCanvas.height,
    r: Math.random() * 6 + 2,
    d: Math.random() * 200 + 10,
    color:`hsl(${Math.random() * 360}, 100%, 50%)`,
    tilt: Math.random() * 10 - 10
  });
}

function drawConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confetti.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2, false);
    ctx.fillStyle = c.color;
    ctx.fill();
  });
  updateConfetti();
}

function updateConfetti() {
  confetti.forEach(c => {
    c.y += Math.cos(c.d) + 1 + c.r / 2;
    c.x += Math.sin(c.d);

    if (c.y > confettiCanvas.height) {
      c.x = Math.random() * confettiCanvas.width;
      c.y = -10;
    }
  });
}

function loop() {
  drawConfetti();
  requestAnimationFrame(loop);
}
loop();