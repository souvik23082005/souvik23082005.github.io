/* ==========================================
   PARTICLE SYSTEM (Canvas 2D)
   ========================================== */

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.maxParticles = 80;
        this.animationId = null;

        this.resize();
        this.init();
        this.animate();
        this.bindEvents();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }

    connectParticles() {
        const maxDist = 120;
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a + 1; b < this.particles.length; b++) {
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const opacity = (1 - dist / maxDist) * 0.15;
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
                    this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            particle.update(this.mouse, this.canvas);
            particle.draw(this.ctx);
        });

        this.connectParticles();

        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(canvas) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.baseSpeedX = (Math.random() - 0.5) * 0.5;
        this.baseSpeedY = (Math.random() - 0.5) * 0.5;
        this.speedX = this.baseSpeedX;
        this.speedY = this.baseSpeedY;
        this.hue = Math.random() > 0.5 ? 190 : 270; // cyan or purple
        this.alpha = Math.random() * 0.5 + 0.2;
    }

    update(mouse, canvas) {
        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
                const force = (mouse.radius - dist) / mouse.radius;
                this.speedX -= (dx / dist) * force * 0.5;
                this.speedY -= (dy / dist) * force * 0.5;
            }
        }

        // Apply damping
        this.speedX += (this.baseSpeedX - this.speedX) * 0.02;
        this.speedY += (this.baseSpeedY - this.speedY) * 0.02;

        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around
        if (this.x > canvas.width + 10) this.x = -10;
        if (this.x < -10) this.x = canvas.width + 10;
        if (this.y > canvas.height + 10) this.y = -10;
        if (this.y < -10) this.y = canvas.height + 10;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${this.hue}, 100%, 60%, 0.3)`;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
});
