const birthdayDate = new Date("September 7, 2025 00:00:00").getTime();

function startCountdown(targetDate, callback) {
  let timer = setInterval(() => {
    let now = new Date().getTime();
    let distance = targetDate - now;

    if (distance < 0) {
      clearInterval(timer);
      callback();
      return;
    }

    document.getElementById("days").innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
    document.getElementById("hours").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    document.getElementById("minutes").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    document.getElementById("seconds").innerText = Math.floor((distance % (1000 * 60)) / 1000);
  }, 1000);
}

function fakeCountdown(callback) {
  let days = 0, hrs = 0, min = 0, sec = 5; // short fake countdown for demo
  let interval = setInterval(() => {
    if (days <= 0 && hrs <= 0 && min <= 0 && sec <= 0) {
      clearInterval(interval);
      callback();
    } else {
      sec--;
    }
    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hrs;
    document.getElementById("minutes").innerText = min;
    document.getElementById("seconds").innerText = sec;
  }, 1000);
}

function showHeart(callback) {
  const heart = document.getElementById("heart");
  heart.style.animation = "scaleUp 1s forwards";
  setTimeout(() => {
    heart.style.animation = "fadeOut 0.4s forwards";
    setTimeout(callback, 500);
  }, 300);
}

function showMessageCard() {
  document.getElementById("message-card").classList.remove("hidden");
}

function startConfetti() {
  setInterval(() => {
    confetti({
      particleCount: 50,
      spread: 200,
      origin: { y: 0 }
    });
  }, 650);
}

function startFireworks() {
  let duration = 2 * 1000;
  let end = Date.now() + duration;
  (function frame() {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 200,
      origin: { x: 0 },
      emojis: ["❤️"], //insted of circles, use heart emoji
      scalar: 2         //size multiplier for emoji
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 200,
      origin: { x: 1 },
      emojis:["❤️"],
      scalar: 2
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

let now = new Date().getTime();
if (now < birthdayDate) {
  startConfetti();
  startCountdown(birthdayDate, () => {
    startFireworks();
    fakeCountdown(() => {
      showHeart(() => {
        showMessageCard();
      });
    });
  });
} else {
  startConfetti();
  fakeCountdown(() => {
    startFireworks();
    showHeart(() => {
      showMessageCard();
    });
  });
}