// bubbles.js
function createBubble() {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");

  // random horizontal position
  bubble.style.left = Math.random() * 100 + "vw";
  // random size
  bubble.style.width = bubble.style.height = Math.random() * 40 + 20 + "px";
  // random animation duration
  bubble.style.animationDuration = Math.random() * 3 + 2 + "s";

  document.body.appendChild(bubble);

  setTimeout(() => {
    bubble.remove();
  }, 5000);
}

setInterval(createBubble, 300);