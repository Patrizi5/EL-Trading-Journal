/**
 * Eternum Trading Journal - Tubes Background Animation
 * Performance-optimized animated background using HTML5 Canvas
 */

class TubesBackground {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.tubes = [];
    this.animationId = null;
    this.isInitialized = false;
    this.isVisible = true;

    // Performance settings
    this.settings = {
      tubeCount: 0,
      tubeSpeed: 0.5,
      tubeOpacity: 0.1,
      connectionDistance: 120,
      mouseInfluence: 100,
      color: { r: 59, g: 130, b: 246 }, // Eternum blue
    };

    // Responsive breakpoints
    this.breakpoints = {
      mobile: 768,
      tablet: 1024,
      desktop: 1440,
    };

    this.init();
  }

  init() {
    this.canvas = document.getElementById('background-canvas');
    if (!this.canvas) {
      console.warn('Background canvas not found');
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.createTubes();
    this.bindEvents();
    this.start();
    this.isInitialized = true;
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';

    this.ctx.scale(dpr, dpr);
    this.updateTubeCount();

    // Recreate tubes for new dimensions
    if (this.isInitialized) {
      this.createTubes();
    }
  }

  updateTubeCount() {
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    const area = width * height;

    // Adjust tube count based on screen size and performance
    if (width < this.breakpoints.mobile) {
      this.settings.tubeCount = Math.max(15, Math.floor(area / 30000));
      this.settings.tubeOpacity = 0.08;
    } else if (width < this.breakpoints.tablet) {
      this.settings.tubeCount = Math.max(25, Math.floor(area / 40000));
      this.settings.tubeOpacity = 0.1;
    } else if (width < this.breakpoints.desktop) {
      this.settings.tubeCount = Math.max(35, Math.floor(area / 50000));
      this.settings.tubeOpacity = 0.12;
    } else {
      this.settings.tubeCount = Math.max(45, Math.floor(area / 60000));
      this.settings.tubeOpacity = 0.15;
    }
  }

  createTubes() {
    this.tubes = [];
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    for (let i = 0; i < this.settings.tubeCount; i++) {
      this.tubes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * this.settings.tubeSpeed,
        vy: (Math.random() - 0.5) * this.settings.tubeSpeed,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.5,
        connections: [],
      });
    }
  }

  bindEvents() {
    // Resize handler
    window.addEventListener('resize', () => this.resize());

    // Visibility change handler
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      if (this.isVisible) {
        this.start();
      } else {
        this.stop();
      }
    });

    // Scroll handler for performance optimization
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const rect = this.canvas.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;

        if (isInView !== this.isVisible) {
          this.isVisible = isInView;
          if (this.isVisible) {
            this.start();
          } else {
            this.stop();
          }
        }
      }, 100);
    });
  }

  updateTubes() {
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    this.tubes.forEach((tube) => {
      // Update position
      tube.x += tube.vx;
      tube.y += tube.vy;

      // Bounce off edges
      if (tube.x < 0 || tube.x > width) {
        tube.vx *= -1;
        tube.x = Math.max(0, Math.min(width, tube.x));
      }

      if (tube.y < 0 || tube.y > height) {
        tube.vy *= -1;
        tube.y = Math.max(0, Math.min(height, tube.y));
      }

      // Reset connections
      tube.connections = [];
    });

    // Find connections
    for (let i = 0; i < this.tubes.length; i++) {
      for (let j = i + 1; j < this.tubes.length; j++) {
        const dx = this.tubes[i].x - this.tubes[j].x;
        const dy = this.tubes[i].y - this.tubes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.settings.connectionDistance) {
          this.tubes[i].connections.push({
            tube: this.tubes[j],
            distance: distance,
          });
          this.tubes[j].connections.push({
            tube: this.tubes[i],
            distance: distance,
          });
        }
      }
    }
  }

  draw() {
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);

    // Draw connections first (behind tubes)
    this.tubes.forEach((tube) => {
      tube.connections.forEach((connection) => {
        const opacity =
          (1 - connection.distance / this.settings.connectionDistance) *
          this.settings.tubeOpacity *
          tube.opacity *
          connection.tube.opacity;

        this.ctx.beginPath();
        this.ctx.moveTo(tube.x, tube.y);
        this.ctx.lineTo(connection.tube.x, connection.tube.y);
        this.ctx.strokeStyle = `rgba(${this.settings.color.r}, ${this.settings.color.g}, ${this.settings.color.b}, ${opacity})`;
        this.ctx.lineWidth = 0.5;
        this.ctx.stroke();
      });
    });

    // Draw tubes
    this.tubes.forEach((tube) => {
      const gradient = this.ctx.createRadialGradient(
        tube.x,
        tube.y,
        0,
        tube.x,
        tube.y,
        tube.radius * 2
      );

      gradient.addColorStop(
        0,
        `rgba(${this.settings.color.r}, ${this.settings.color.g}, ${this.settings.color.b}, ${
          this.settings.tubeOpacity * tube.opacity
        })`
      );
      gradient.addColorStop(
        1,
        `rgba(${this.settings.color.r}, ${this.settings.color.g}, ${this.settings.color.b}, 0)`
      );

      this.ctx.beginPath();
      this.ctx.arc(tube.x, tube.y, tube.radius * 2, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();

      // Inner core
      this.ctx.beginPath();
      this.ctx.arc(tube.x, tube.y, tube.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${this.settings.color.r}, ${this.settings.color.g}, ${
        this.settings.color.b
      }, ${this.settings.tubeOpacity * tube.opacity * 1.5})`;
      this.ctx.fill();
    });
  }

  animate() {
    if (!this.isVisible) return;

    this.updateTubes();
    this.draw();

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  start() {
    if (this.animationId) return;
    this.animate();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  destroy() {
    this.stop();
    this.tubes = [];
    this.isInitialized = false;
  }

  // Public methods for external control
  setIntensity(intensity) {
    // intensity: 0-1 (0 = minimal, 1 = maximum)
    this.settings.tubeOpacity = Math.max(0.05, intensity * 0.2);
    this.settings.tubeSpeed = Math.max(0.1, intensity * 1.0);
  }

  setColor(r, g, b) {
    this.settings.color = { r, g, b };
  }

  pause() {
    this.stop();
  }

  resume() {
    if (this.isInitialized && this.isVisible) {
      this.start();
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.tubesBackground = new TubesBackground();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
  if (window.tubesBackground) {
    window.tubesBackground.destroy();
  }
});
