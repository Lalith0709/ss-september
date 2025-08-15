const birthdayDate = new Date("September 7, 2025 00:00:00").getTime();
const messageCard = document.getElementById("messageCard");
const rocketEl = document.getElementById("rocket");
const heartEl = document.getElementById("heart");

function updateRealCountdown() {
  const now = new Date().getTime();
  const distance = birthdayDate - now;

  if (distance < 0) {
    startFakeSequence();
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days;
  document.getElementById("hours").innerText = hours;
  document.getElementById("minutes").innerText = minutes;
  document.getElementById("seconds").innerText = seconds;
}

function startFakeSequence() {
  let days = 92, hours = 18, minutes = 7, seconds = 32;
  const fakeInterval = setInterval(() => {
    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;

    days = 0; hours = 0; minutes = 0; seconds = 0;

    clearInterval(fakeInterval);

    setTimeout(() => {
      rocketLaunch();
    }, 4000);
  }, 500);
}

function rocketLaunch() {
  rocketEl.style.display = "block";
  rocketEl.style.transition = "bottom 3s";
  rocketEl.style.bottom = "50%";
  setTimeout(() => {
    rocketEl.style.display = "none";
    showHeart();
  }, 3000);
}

function showHeart() {
  heartEl.style.display = "block";
  setTimeout(() => {
    heartEl.style.display = "none";
    startConfetti(true);
    showMessageCard();
  }, 5000);
}

function startConfetti(intense = false) {
  const duration = 3 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: intense ? 8 : 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#ffffff", "rgba(231, 21, 126, 0.92)"]
    });
    confetti({
      particleCount: intense ? 8 : 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#ffffff", "#ee1582e7"]
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

function showMessageCard() {
  messageCard.style.display = "block";
}

// Message Card Click
messageCard.addEventListener("click", () => {
    alert(`🎉💖 You are the most special person in my life, Srujana 💖🎉
You're finally 18!! Srujana 🎂🎊🎉

Happy birthday papa! Nek oche first wish na nundi ravali ani korukuntuna oka china selfishness 😋🥰
ela unnav?? bagunav anukuntuna... neetho asalu eppudu matlada le kani chala deep ga attach ipoya
maybe neelo unna charm chami emo idhi.. here are some heartfelt wishes to a person
who is incredibly smart and incredibly silly.. to a person who is beautiful, charming, and elegant
to a girl who is intelligent, and stupid (abit-koncham).. anyway wishing you a happy birthday alegala
ela chepkuntu povala okaa janma chalaadu emo...

Nee stories lo naku unblock cheiyachuga... see you soon in vizag... neku eppudiyina low unte remember
this guy is just a msg away just hit me up💖

You deserve so much more... regards your guy Lalith 🥰`);
});

setInterval(updateRealCountdown, 1000);
updateRealCountdown();