/**
 * Brain Physics Animation with Matter.js
 * Creates dynamic particle system within brain shape
 */

class BrainPhysics {
  constructor() {
    this.brainContainer = document.querySelector('.brain-container');
    this.brainImage = document.querySelector('.brain-image');
    this.canvas = null;
    this.ctx = null;
    this.engine = null;
    this.world = null;
    this.particles = [];
    this.synapses = [];
    this.animationId = null;
    this.brainPath = null;
    
    // Responsive config for brain physics
    const isMobile = window.innerWidth <= 768;
    
    this.config = {
      particleCount: isMobile ? 20 : 30,
      particleRadius: isMobile ? 1.5 : 2,
      synapseSpeed: 0.8, // Synapse pulse hızı
      synapseOpacity: isMobile ? 0.5 : 0.6,
      particleOpacity: isMobile ? 0.7 : 0.8,
      connectionDistance: isMobile ? 60 : 80, // Bağlantı mesafesi
      pulseSpeed: 0.005 // Particle pulse (çok yavaş)
    };
    
    this.init();
  }
  
  init() {
    // Mobile check kaldırıldı - artık her yerde aktif
    
    if (!this.brainContainer || typeof Matter === 'undefined') {
      console.warn('Brain container not found or Matter.js not loaded');
      return;
    }
    
    this.createCanvas();
    this.setupPhysics();
    this.createBrainPath();
    this.createParticles();
    this.setupEventListeners();
    this.startAnimation();
  }
  
  createCanvas() {
    // Brain container'ın üzerine canvas ekle
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '10';
    
    this.brainContainer.style.position = 'relative';
    this.brainContainer.appendChild(this.canvas);
    
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
  }
  
  resizeCanvas() {
    const rect = this.brainContainer.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }
  
  setupPhysics() {
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    
    // Gravity'yi kapat - sadece floating
    this.engine.world.gravity.y = this.config.gravity;
    this.engine.world.gravity.x = 0;
    
    // Timing'i yavaşlat
    this.engine.timing.timeScale = 0.6;
  }
  
  createBrainPath() {
    // Beyin şeklinde basit path (gerçek projede brain.svg path'i kullanılabilir)
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const width = this.canvas.width * 0.8;
    const height = this.canvas.height * 0.7;
    
    // Beyin şeklini approxime eden path
    this.brainPath = new Path2D();
    this.brainPath.ellipse(centerX, centerY, width/2, height/2, 0, 0, Math.PI * 2);
  }
  
  isInsideBrain(x, y) {
    // Basit elips check (gerçek projede SVG path kullanılabilir)
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const width = this.canvas.width * 0.8;
    const height = this.canvas.height * 0.7;
    
    const dx = (x - centerX) / (width / 2);
    const dy = (y - centerY) / (height / 2);
    
    return (dx * dx + dy * dy) <= 1;
  }
  
  createParticles() {
    this.particles = [];
    
    for (let i = 0; i < this.config.particleCount; i++) {
      let x, y;
      let attempts = 0;
      
      // Beyin şekli içinde random pozisyon bul
      do {
        x = Math.random() * this.canvas.width;
        y = Math.random() * this.canvas.height;
        attempts++;
      } while (!this.isInsideBrain(x, y) && attempts < 100);
      
      if (attempts >= 100) {
        // Fallback to center area
        x = this.canvas.width / 2 + (Math.random() - 0.5) * 100;
        y = this.canvas.height / 2 + (Math.random() - 0.5) * 100;
      }
      
      const body = Matter.Bodies.circle(x, y, this.config.particleRadius, {
        restitution: 0.8,
        friction: 0.001,
        frictionAir: this.config.airFriction,
        density: 0.001,
        render: { visible: false }
      });
      
      // Custom properties
      body.customProperties = {
        opacity: this.config.particleOpacity,
        pulsePhase: Math.random() * Math.PI * 2,
        synapseConnections: []
      };
      
      // Static body - no velocity needed
      
      this.particles.push(body);
    }
    
    Matter.World.add(this.world, this.particles);
  }
  
  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createBrainPath();
    });
  }
  
  constrainToBrain() {
    // Particle'lar artık static - hareket etmiyorlar
    // Sadece synapse ışıkları hareket edecek
  }
  
  updateSynapses() {
    this.synapses = [];
    
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].customProperties.synapseConnections = [];
      
      for (let j = i + 1; j < this.particles.length; j++) {
        const particle1 = this.particles[i];
        const particle2 = this.particles[j];
        
        const dx = particle2.position.x - particle1.position.x;
        const dy = particle2.position.y - particle1.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Yakın particle'lar arasında synapse oluştur
        if (distance < this.config.connectionDistance) {
          const opacity = (this.config.connectionDistance - distance) / this.config.connectionDistance;
          
          this.synapses.push({
            x1: particle1.position.x,
            y1: particle1.position.y,
            x2: particle2.position.x,
            y2: particle2.position.y,
            opacity: opacity * this.config.synapseOpacity,
            distance: distance
          });
          
          particle1.customProperties.synapseConnections.push(j);
          particle2.customProperties.synapseConnections.push(i);
        }
      }
    }
  }
  
  drawSynapses() {
    this.synapses.forEach(synapse => {
      this.ctx.save();
      this.ctx.strokeStyle = `rgba(1, 127, 228, ${synapse.opacity})`;
      this.ctx.lineWidth = 1;
      this.ctx.lineCap = 'round';
      this.ctx.shadowColor = 'rgba(1, 127, 228, 0.3)';
      this.ctx.shadowBlur = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(synapse.x1, synapse.y1);
      this.ctx.lineTo(synapse.x2, synapse.y2);
      this.ctx.stroke();
      this.ctx.restore();
    });
  }
  
  drawSynapsePulses() {
    this.synapses.forEach((synapse, index) => {
      if (synapse.opacity > 0.1) {
        const time = Date.now() * 0.001;
        
        // Her synapse için farklı hız ve yön
        const speed = this.config.synapseSpeed + (index % 3) * 0.5; // Farklı hızlar
        const offset = (index % 7) * 0.8; // Farklı başlangıç offsetleri
        
        // İki yönlü pulse (gidip geliyor)
        const pulsePosition1 = (Math.sin(time * speed + offset) + 1) / 2;
        const pulsePosition2 = (Math.sin(time * speed + offset + Math.PI) + 1) / 2;
        
        // İlk pulse
        const pulseX1 = synapse.x1 + (synapse.x2 - synapse.x1) * pulsePosition1;
        const pulseY1 = synapse.y1 + (synapse.y2 - synapse.y1) * pulsePosition1;
        
        // İkinci pulse (ters yön)
        const pulseX2 = synapse.x1 + (synapse.x2 - synapse.x1) * pulsePosition2;
        const pulseY2 = synapse.y1 + (synapse.y2 - synapse.y1) * pulsePosition2;
        
        this.ctx.save();
        
        // İlk pulse - beyaz
        this.ctx.fillStyle = `rgba(255, 255, 255, ${synapse.opacity * 0.8})`;
        this.ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
        this.ctx.shadowBlur = 4;
        this.ctx.beginPath();
        this.ctx.arc(pulseX1, pulseY1, 1.8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // İkinci pulse - mavi
        this.ctx.fillStyle = `rgba(1, 127, 228, ${synapse.opacity * 0.6})`;
        this.ctx.shadowColor = 'rgba(1, 127, 228, 0.4)';
        this.ctx.shadowBlur = 3;
        this.ctx.beginPath();
        this.ctx.arc(pulseX2, pulseY2, 1.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
      }
    });
  }
  
  drawParticles() {
    this.particles.forEach(particle => {
      // Pulse effect
      particle.customProperties.pulsePhase += this.config.pulseSpeed;
      const pulse = Math.sin(particle.customProperties.pulsePhase) * 0.2;
      const currentOpacity = particle.customProperties.opacity + pulse;
      
      this.ctx.save();
      this.ctx.fillStyle = `rgba(1, 127, 228, ${currentOpacity})`;
      this.ctx.shadowColor = 'rgba(1, 127, 228, 0.5)';
      this.ctx.shadowBlur = 3;
      this.ctx.beginPath();
      this.ctx.arc(
        particle.position.x, 
        particle.position.y, 
        this.config.particleRadius, 
        0, 
        Math.PI * 2
      );
      this.ctx.fill();
      this.ctx.restore();
    });
  }
  
  animate() {
    // Physics engine artık gerekli değil - static particles
    
    // Synapses güncelle
    this.updateSynapses();
    
    // Canvas'ı temizle
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Çiz
    this.drawSynapses();
    this.drawSynapsePulses();
    this.drawParticles();
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  startAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
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
    if (this.engine) {
      Matter.Engine.clear(this.engine);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    window.removeEventListener('resize', this.resizeCanvas);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Biraz gecikme ile başlat (brain image yüklendikten sonra)
  setTimeout(() => {
    if (typeof Matter !== 'undefined') {
      new BrainPhysics();
    }
  }, 1000);
});
