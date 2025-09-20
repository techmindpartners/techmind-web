/**
 * Neural Network Animation
 * Creates animated neural network background with dots and connecting lines
 */

class NeuralNetworkAnimation {
  constructor() {
    this.canvas = document.getElementById('neural-network');
    this.ctx = null;
    this.animationId = null;
    this.particles = [];
    this.connections = [];
    this.mouse = { x: 0, y: 0 };
    
    this.config = {
      particleCount: 30,        // Azaltıldı: 50 → 30
      particleRadius: 2.5,
      connectionDistance: 120,  // Azaltıldı: 150 → 120
      lineWidth: 1.5,
      particleSpeed: 0.3,       // Azaltıldı: 0.4 → 0.3
      connectionOpacity: 0.3,   // Azaltıldı: 0.4 → 0.3
      particleOpacity: 0.7,     // Azaltıldı: 0.8 → 0.7
      pulseSpeed: 0.015,        // Azaltıldı: 0.02 → 0.015
      pulseAmplitude: 0.2       // Azaltıldı: 0.3 → 0.2
    };
    
    this.init();
  }
  
  init() {
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.setupCanvas();
    this.createParticles();
    this.setupEventListeners();
    this.setupVisibilityHandler();
    this.startAnimation();
  }
  
  setupVisibilityHandler() {
    // Sayfa görünürlük değişikliklerini dinle
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopAnimation();
      } else {
        this.startAnimation();
      }
    });
  }
  
  setupCanvas() {
    const resizeCanvas = () => {
      const rect = this.canvas.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }
  
  createParticles() {
    this.particles = [];
    
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.config.particleSpeed,
        vy: (Math.random() - 0.5) * this.config.particleSpeed,
        radius: this.config.particleRadius,
        opacity: this.config.particleOpacity,
        pulsePhase: Math.random() * Math.PI * 2,
        connections: []
      });
    }
  }
  
  setupEventListeners() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
    
    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = 0;
      this.mouse.y = 0;
    });
  }
  
  updateParticles() {
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy *= -1;
      }
      
      // Keep particles within bounds
      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
      
      // Update pulse phase
      particle.pulsePhase += this.config.pulseSpeed;
      
      // Calculate pulsing opacity
      const pulse = Math.sin(particle.pulsePhase) * this.config.pulseAmplitude;
      particle.currentOpacity = this.config.particleOpacity + pulse;
      
      // Mouse interaction - stronger effect
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 200 && this.mouse.x > 0 && this.mouse.y > 0) {
        const force = (200 - distance) / 200;
        const mouseForce = force * 0.008; // Increased force
        particle.vx -= dx * mouseForce;
        particle.vy -= dy * mouseForce;
        
        // Add some attraction for particles very close to mouse
        if (distance < 50) {
          particle.vx += dx * 0.002;
          particle.vy += dy * 0.002;
        }
      }
      
      // Reset connections
      particle.connections = [];
    });
    
    // Create connections
    this.createConnections();
  }
  
  createConnections() {
    this.connections = [];
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const particle1 = this.particles[i];
        const particle2 = this.particles[j];
        
        const dx = particle2.x - particle1.x;
        const dy = particle2.y - particle1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.config.connectionDistance) {
          const opacity = (this.config.connectionDistance - distance) / this.config.connectionDistance;
          
          this.connections.push({
            x1: particle1.x,
            y1: particle1.y,
            x2: particle2.x,
            y2: particle2.y,
            opacity: opacity * this.config.connectionOpacity,
            distance: distance
          });
          
          particle1.connections.push(j);
          particle2.connections.push(i);
        }
      }
    }
  }
  
  drawConnections() {
    this.connections.forEach(connection => {
      this.ctx.save();
      // Make connections more visible with stronger color and glow
      this.ctx.strokeStyle = `rgba(1, 127, 228, ${connection.opacity * 1.5})`;
      this.ctx.lineWidth = this.config.lineWidth;
      this.ctx.lineCap = 'round';
      this.ctx.shadowColor = 'rgba(1, 127, 228, 0.3)';
      this.ctx.shadowBlur = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(connection.x1, connection.y1);
      this.ctx.lineTo(connection.x2, connection.y2);
      this.ctx.stroke();
      this.ctx.restore();
    });
  }
  
  drawParticles() {
    this.particles.forEach(particle => {
      this.ctx.save();
      // Make particles more visible with stronger color and glow
      this.ctx.fillStyle = `rgba(1, 127, 228, ${particle.currentOpacity})`;
      this.ctx.shadowColor = 'rgba(1, 127, 228, 0.5)';
      this.ctx.shadowBlur = 4;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }
  
  drawSynapses() {
    // Draw synapse-like pulses along connections - more visible
    this.connections.forEach(connection => {
      if (connection.opacity > 0.1) {
        const time = Date.now() * 0.001;
        const pulsePosition = (Math.sin(time * 2 + connection.distance * 0.008) + 1) / 2;
        
        const pulseX = connection.x1 + (connection.x2 - connection.x1) * pulsePosition;
        const pulseY = connection.y1 + (connection.y2 - connection.y1) * pulsePosition;
        
        this.ctx.save();
        // Make synapse pulses more visible
        this.ctx.fillStyle = `rgba(255, 255, 255, ${connection.opacity * 0.8})`;
        this.ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        this.ctx.shadowBlur = 3;
        this.ctx.beginPath();
        this.ctx.arc(pulseX, pulseY, 1.2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    });
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.updateParticles();
    this.drawConnections();
    this.drawSynapses();
    this.drawParticles();
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  startAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    // Sayfa görünür değilse animasyonu başlatma
    if (document.hidden) {
      return;
    }
    
    this.animate();
  }
  
  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  destroy() {
    this.stopAnimation();
    window.removeEventListener('resize', this.setupCanvas);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new NeuralNetworkAnimation();
});
