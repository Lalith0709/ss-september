window.onload = function () {
  // 🎯 Target birthday date
  const birthdayDate = new Date("2025-09-07T00:00:00").getTime();

  // 🎉 Real countdown
  function startCountdown(targetDate, callback) {
    let timer = setInterval(() => {
      let now = new Date().getTime();
      let distance = targetDate - now;

      // countdown finished
      if (distance < 0) {
        clearInterval(timer);
        callback();
        return;
      }

      // update UI
      document.getElementById("days").innerText =
        Math.floor(distance / (1000 * 60 * 60 * 24));
      document.getElementById("hours").innerText =
        Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      document.getElementById("minutes").innerText =
        Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      document.getElementById("seconds").innerText =
        Math.floor((distance % (1000 * 60)) / 1000);
    }, 1000);
  }

  // 🎭 Fake short countdown (demo after real one ends)
  function fakeCountdown(callback) {
    let days = 0, hrs = 0, min = 0, sec = 5;
    let interval = setInterval(() => {
      if (days <= 0 && hrs <= 0 && min <= 0 && sec <= 0) {
        clearInterval(interval);
        callback();
        return; // stop here
      }
      sec--;

      // update UI
      document.getElementById("days").innerText = days;
      document.getElementById("hours").innerText = hrs;
      document.getElementById("minutes").innerText = min;
      document.getElementById("seconds").innerText = sec;
    }, 1000);
  }

  // ❤️ Heart animation
  function showHeart(callback) {
    const heart = document.getElementById("heart");
    heart.style.animation = "scaleUp 1s forwards";
    setTimeout(() => {
      heart.style.animation = "fadeOut 0.4s forwards";
      setTimeout(callback, 500);
    }, 300);
  }

  // 🎁 Show final card
  function showMessageCard() {
    document.getElementById("message-card").classList.remove("hidden");
  }

  // 🎊 Confetti rain
  function startConfetti() {
    setInterval(() => {
      confetti({
        particleCount: 50,
        spread: 200,
        origin: { y: 0 }
      });
    }, 650);
  }

  // 🎆 Firework hearts
  function startFireworks() {
    let duration = 1000;
    let end = Date.now() + duration;
    (function frame() {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 200,
        origin: { x: 0 },
        emojis: ["❤️"],
        scalar: 2
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 200,
        origin: { x: 1 },
        emojis: ["❤️"],
        scalar: 2
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

  // 🕒 Decide which countdown to run
  let now = new Date().getTime();
  startConfetti();
  if (now < birthdayDate) {
    // before birthday → run real countdown
    startCountdown(birthdayDate, () => {
      startFireworks();
      fakeCountdown(() => {
        showHeart(() => {
          showMessageCard();
        });
      });
    });
  } else {
    // after birthday → directly run fake demo
    fakeCountdown(() => {
      startFireworks();
      showHeart(() => {
        showMessageCard();
      });
    });
  }
};