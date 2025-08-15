// 🎯 SETTINGS
const birthdayDate = new Date("September 7, 2025 00:00:00").getTime();
const fakeCountdownStart = { days: 92, hours: 18, minutes: 7, seconds: 32 };
const messageCard = document.getElementById("messageCard");
const rocketEl = document.getElementById("rocket");

let firstVisit = !localStorage.getItem("visitedBefore");

// 🎆 Start Confetti & Fireworks
function startConfetti() {
    const duration = 15 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ["#ffffff", "#ff69b4"]
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ["#ffffff", "#ff69b4"]
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

// 🎆 Start Fireworks
function startFireworks() {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.pointerEvents = "none";
    document.body.appendChild(container);

    const fireworks = new Fireworks.default(container, {
        autoresize: true,
        opacity: 0.5,
        acceleration: 1.05,
        friction: 0.97,
        gravity: 1.5,
        particles: 50,
        traceLength: 3,
        traceSpeed: 10,
        explosion: 5,
        intensity: 20,
        flickering: 50,
        hue: { min: 0, max: 360 },
        delay: { min: 30, max: 60 },
    });

    fireworks.start();
    return fireworks;
}

// 🎯 Update Countdown
function updateCountdown(days, hours, minutes, seconds) {
    document.getElementById("days").innerText = days.toString().padStart(2, "0");
    document.getElementById("hours").innerText = hours.toString().padStart(2, "0");
    document.getElementById("minutes").innerText = minutes.toString().padStart(2, "0");
    document.getElementById("seconds").innerText = seconds.toString().padStart(2, "0");
}

// 🎯 Fake Countdown Animation
function startFakeCountdown() {
    let d = fakeCountdownStart.days;
    let h = fakeCountdownStart.hours;
    let m = fakeCountdownStart.minutes;
    let s = fakeCountdownStart.seconds;
    const totalFrames = 60; // 4 seconds @ 15fps
    let frame = 0;

    const interval = setInterval(() => {
        let progress = frame / totalFrames;
        updateCountdown(
            Math.max(0, Math.floor(d * (1 - progress))),
            Math.max(0, Math.floor(h * (1 - progress))),
            Math.max(0, Math.floor(m * (1 - progress))),
            Math.max(0, Math.floor(s * (1 - progress)))
        );

        frame++;
        if (frame > totalFrames) {
            clearInterval(interval);
            setTimeout(startRocketAnimation, 1000);
        }
    }, 66); // ~15fps
}

// 🚀 Rocket → Heart Animation
function startRocketAnimation() {
    rocketEl.style.opacity = "1";
    rocketEl.style.transition = "bottom 3s ease-in";
    rocketEl.style.bottom = "50%";

    setTimeout(() => {
        rocketEl.style.opacity = "0";
        showHeart();
    }, 3000);
}

// 💖 Show Sparkling Heart
function showHeart() {
    const heart = document.createElement("div");
    heart.className = "heart-shape";
    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
        setTimeout(() => {
            startConfetti();
            startFireworks();
            messageCard.style.display = "block";
        }, 1000);
    }, 5000);
}

// 📅 Main Logic
if (firstVisit) {
    // Show real countdown briefly
    const realCountdown = setInterval(() => {
        const now = Date.now();
        const diff = birthdayDate - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        updateCountdown(days, hours, minutes, seconds);
    }, 1000);

    setTimeout(() => {
        clearInterval(realCountdown);
        startFakeCountdown();
        localStorage.setItem("visitedBefore", "true");
    }, 3000);

} else {
    startFakeCountdown();
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
