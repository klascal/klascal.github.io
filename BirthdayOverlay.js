(function () {
  class BirthdayOverlay {
    constructor(options = {}) {
      this.canvas = document.createElement("canvas");
      this.ctx = this.canvas.getContext("2d");

      this.defaults = {
        zIndex: 999999,
        messages: [
          "🎉 2 jaar Klascal! 🎉",
          "🎂 Gefeliciteerd Klascal!",
          "✨ 13 april - Jarig! ✨",
          "🎈 Hoera! 🎈",
        ],
        floatSpeed: 0.5,
        spawnInterval: 1500,
        font: "bold 40px Arial",
        colors: ["#FFEB3B", "#FF4081", "#00E5FF", "#76FF03", "#FFC107"],
      };

      this.settings = { ...this.defaults, ...options };
      this.floatingItems = [];
      this.running = false;

      this.init();
    }

    init() {
      this.setupCanvas();
      this.resizeCanvas();
      this.bindResize();
    }

    setupCanvas() {
      this.canvas.style.position = "fixed";
      this.canvas.style.top = "0";
      this.canvas.style.left = "0";
      this.canvas.style.pointerEvents = "none";
      this.canvas.style.zIndex = this.settings.zIndex;
      document.body.appendChild(this.canvas);
    }

    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    bindResize() {
      window.addEventListener("resize", () => this.resizeCanvas());
    }

    spawnMessage() {
      const text =
        this.settings.messages[
          Math.floor(Math.random() * this.settings.messages.length)
        ];

      const color =
        this.settings.colors[
          Math.floor(Math.random() * this.settings.colors.length)
        ];

      const x = Math.random() * (this.canvas.width - 200);
      const y = this.canvas.height + 50;

      this.floatingItems.push({
        text,
        x,
        y,
        color,
        alpha: 1,
      });
    }

    update() {
      this.floatingItems.forEach((item, i) => {
        item.y -= this.settings.floatSpeed;
        item.alpha -= 0.002;

        if (item.alpha <= 0) {
          this.floatingItems.splice(i, 1);
        }
      });
    }

    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.font = this.settings.font;

      this.floatingItems.forEach((item) => {
        this.ctx.fillStyle = `${item.color}${Math.floor(item.alpha * 255)
          .toString(16)
          .padStart(2, "0")}`;
        this.ctx.fillText(item.text, item.x, item.y);
      });
    }

    start() {
      if (this.running) return;
      this.running = true;

      this.interval = setInterval(
        () => this.spawnMessage(),
        this.settings.spawnInterval
      );

      const animate = () => {
        if (!this.running) return;
        this.update();
        this.draw();
        this.frame = requestAnimationFrame(animate);
      };

      animate();
    }

    gracefulStop() {
      this.running = false;
      clearInterval(this.interval);

      const endInterval = setInterval(() => {
        this.update();
        this.draw();

        if (this.floatingItems.length === 0) {
          cancelAnimationFrame(this.frame);
          this.canvas.remove();
          clearInterval(endInterval);
        }
      }, 30);
    }

    stop() {
      this.running = false;
      clearInterval(this.interval);
      cancelAnimationFrame(this.frame);
      this.canvas.remove();
    }
  }

  window.BirthdayOverlay = BirthdayOverlay;
})();
