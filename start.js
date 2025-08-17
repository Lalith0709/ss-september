// Start button click
const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const mainSite = document.getElementById('main-site');

startBtn.addEventListener('click', () => {
  startScreen.style.display = 'none';
  mainSite.classList.remove('hidden');
});

// Floating hearts effect in start screen
function createFloatingHearts() {
  for (let i = 0; i < 30; i++) {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.animationDelay = Math.random() * 5 + 's';
    heart.style.width = heart.style.height = (10 + Math.random()*15) + 'px';
    startScreen.appendChild(heart);
  }
}

createFloatingHearts();