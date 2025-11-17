(function () {
  class FireworksOverlay {
    constructor(options = {}) {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.fireworks = [];
      this.running = false;
      this.defaults = {
        colors: ['#FF5733', '#FFC300', '#DAF7A6', '#C70039', '#900C3F', '#581845'],
        particleCount: 50,
        gravity: 0.02,
        speed: { min: 2, max: 6 },
        radius: { min: 1, max: 3 },
        interval: 1000,
        zIndex: 9999,
        toggleButton: null,
      };
      this.settings = { ...this.defaults, ...options };
      this.init();
    }

    init() {
      this.setupCanvas();
      this.bindResize();
      this.bindToggleButton();
    }

    setupCanvas() {
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = this.settings.zIndex;
      document.body.appendChild(this.canvas);
      this.resizeCanvas();
    }

    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    bindResize() {
      window.addEventListener('resize', () => this.resizeCanvas());
    }

    bindToggleButton() {
      if (this.settings.toggleButton) {
        const button = document.querySelector(this.settings.toggleButton);
        if (button) button.addEventListener('click', () => this.toggle());
      }
    }

    createFirework() {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height * 0.5;
      const colors = this.settings.colors;
      const particleCount = this.settings.particleCount;

      this.fireworks.push({
        x,
        y,
        particles: Array.from({ length: particleCount }, () => ({
          x, y,
          dx: Math.cos(Math.random() * Math.PI * 2) * (Math.random() * (this.settings.speed.max - this.settings.speed.min) + this.settings.speed.min),
          dy: Math.sin(Math.random() * Math.PI * 2) * (Math.random() * (this.settings.speed.max - this.settings.speed.min) + this.settings.speed.min),
          radius: Math.random() * (this.settings.radius.max - this.settings.radius.min) + this.settings.radius.min,
          life: Math.random() * 80 + 50,
          color: colors[Math.floor(Math.random() * colors.length)],
        })),
      });
    }

    updateFireworks() {
      this.fireworks.forEach((firework, fIndex) => {
        firework.particles.forEach((p, pIndex) => {
          p.x += p.dx;
          p.y += p.dy;
          p.dy += this.settings.gravity;
          p.life--;
          if (p.life <= 0) firework.particles.splice(pIndex, 1);
        });
        if (firework.particles.length === 0) this.fireworks.splice(fIndex, 1);
      });
    }

    drawFireworks() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.fireworks.forEach(firework => {
        firework.particles.forEach(p => {
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          this.ctx.fillStyle = p.color;
          this.ctx.fill();
          this.ctx.closePath();
        });
      });
    }

    startAnimation() {
      if (this.running) return;
      this.running = true;
      this.fireworksInterval = setInterval(() => this.createFirework(), this.settings.interval);

      const animate = () => {
        if (!this.running) return;
        this.updateFireworks();
        this.drawFireworks();
        this.animationFrame = requestAnimationFrame(animate);
      };
      animate();
    }

    gracefulStop() {
      this.running = false;
      clearInterval(this.fireworksInterval);
      this.fireworksInterval = null;

      const checkEmpty = setInterval(() => {
        this.updateFireworks();
        this.drawFireworks();
        if (this.fireworks.length === 0) {
          cancelAnimationFrame(this.animationFrame);
          this.canvas.remove();
          clearInterval(checkEmpty);
        }
      }, 30);
    }

    stopAnimation() {
      this.running = false;
      clearInterval(this.fireworksInterval);
      cancelAnimationFrame(this.animationFrame);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    toggle() {
      this.running ? this.stopAnimation() : this.startAnimation();
    }

    destroy() {
      this.stopAnimation();
      this.canvas.remove();
      window.removeEventListener('resize', this.resizeCanvas);
    }
  }

  window.FireworksOverlay = FireworksOverlay;
})();
