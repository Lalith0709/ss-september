const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

// Get current date
const today = new Date();
const targetDate = new Date(today.getFullYear(), 8, 7); // September 7 (month is 0-indexed)

// Only run fireworks if today is Sept 7 or later
if (today >= targetDate) {

    function Particle(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = 3;
        this.color = color;
        this.speedX = (Math.random() - 0.5) * 6;
        this.speedY = (Math.random() - 0.5) * 6;
        this.alpha = 1;

        this.update = function() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.alpha -= 0.02;
        }

        this.draw = function() {
            ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
            ctx.shadowColor = `rgba(${this.color},${this.alpha})`;
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function heartShape(t) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
        return {x: x * 15 + canvas.width/2, y: -y * 15 + canvas.height/2};
    }

    function createHeartFirework() {
        for (let t = 0; t < Math.PI * 2; t += 0.1) {
            const pos = heartShape(t);
            particles.push(new Particle(pos.x, pos.y, '255,20,147')); // glowing pink
        }
    }

    function animate() {
        ctx.fillStyle = '#f2c4e0c7';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].alpha <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animate);
    }

    // Launch fireworks every 2 seconds
    setInterval(createHeartFirework, 2000);
    animate();

} else {
    // Message before September 7
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Wait until September 7 for the surprise!', canvas.width/2, canvas.height/2);
}