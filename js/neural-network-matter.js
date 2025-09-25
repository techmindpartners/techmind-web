/**
 * Neural Network Animation with Matter.js Physics Engine
 * Creates realistic physics-based neural network background
 */

// Matter.js kullanmak için CDN eklenmesi gerekir
// <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"></script>

class NeuralNetworkMatter {
  constructor() {
    this.canvas = document.getElementById('neural-network');
    this.ctx = null;
    this.engine = null;
    this.world = null;
    this.render = null;
    this.particles = [];
    this.connections = [];
    this.mouse = { x: 0, y: 0 };
    this.mouseConstraint = null;
    this.animationId = null;
    
    // Responsive config based on screen size
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024;
    
    this.config = {
      particleCount: isMobile ? 20 : (isTablet ? 35 : 50),
      particleRadius: isMobile ? 2.5 : 3,
      connectionDistance: isMobile ? 100 : (isTablet ? 125 : 150),
      lineWidth: isMobile ? 1 : 1.5,
      connectionOpacity: isMobile ? 0.3 : 0.4,
      particleOpacity: isMobile ? 0.6 : 0.8,
      gravity: 0, // Gravity'yi kapat - sadece float etsin
      airFriction: 0.008, // Daha yüksek friction
      restitution: 0.6, // Daha az bouncy
      mouseForce: 0.002, // Daha yumuşak mouse interaction
      mouseInfluenceRadius: isMobile ? 150 : 250,
      mouseAttractionRadius: isMobile ? 60 : 80,
      mouseDragForce: 0.8,
      mouseFollowSpeed: 0.015, // Daha yavaş
      maxVelocity: 2, // Maximum velocity limit
      dampingFactor: 0.98 // Velocity damping
    };
    
    this.init();
  }
  
  async init() {
    if (!this.canvas || typeof Matter === 'undefined') {
      console.warn('Canvas not found or Matter.js not loaded');
      return;
    }
    
    this.ctx = this.canvas.getContext('2d');
    this.setupCanvas();
    this.setupPhysics();
    this.createParticles();
    this.setupEventListeners();
    this.setupVisibilityHandler();
    this.startAnimation();
  }
  
  setupCanvas() {
    const resizeCanvas = () => {
      const rect = this.canvas.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
      
      // Physics engine bounds'ları güncelle
      if (this.engine) {
        this.updatePhysicsBounds();
        
        // Responsive değişikliklerde particle'ları yeniden dağıt
        this.redistributeParticles();
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }
  
  redistributeParticles() {
    // Ekran boyutu değiştiğinde particle'ları yeniden dağıt
    const isMobile = window.innerWidth <= 768;
    const margin = isMobile ? 20 : 50;
    
    this.particles.forEach(particle => {
      let x, y;
      
      if (isMobile) {
        x = Math.random() * (this.canvas.width - margin * 2) + margin;
        y = Math.random() * (this.canvas.height - margin * 2) + margin;
      } else {
        x = Math.random() * (this.canvas.width - 100) + 50;
        y = Math.random() * (this.canvas.height - 100) + 50;
      }
      
      Matter.Body.setPosition(particle, { x, y });
      Matter.Body.setVelocity(particle, {
        x: (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 0.5
      });
    });
  }
  
  setupPhysics() {
    // Engine oluştur
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    
    // Gravity'yi kapat - floating effect
    this.engine.world.gravity.y = this.config.gravity;
    this.engine.world.gravity.x = 0;
    
    // Timing'i optimize et
    this.engine.timing.timeScale = 0.8;
    
    // Mouse constraint oluştur - daha yumuşak etkileşim için
    this.mouseConstraint = Matter.MouseConstraint.create(this.engine, {
      mouse: Matter.Mouse.create(this.canvas),
      constraint: {
        stiffness: 0.1,
        render: {
          visible: false
        }
      }
    });
    
    Matter.World.add(this.world, this.mouseConstraint);
    
    // Invisible walls (boundaries)
    this.createBoundaries();
  }
  
  createBoundaries() {
    const wallThickness = 10;
    const walls = [
      // Top
      Matter.Bodies.rectangle(
        this.canvas.width / 2, 
        -wallThickness / 2, 
        this.canvas.width, 
        wallThickness, 
        { isStatic: true, render: { visible: false } }
      ),
      // Bottom
      Matter.Bodies.rectangle(
        this.canvas.width / 2, 
        this.canvas.height + wallThickness / 2, 
        this.canvas.width, 
        wallThickness, 
        { isStatic: true, render: { visible: false } }
      ),
      // Left
      Matter.Bodies.rectangle(
        -wallThickness / 2, 
        this.canvas.height / 2, 
        wallThickness, 
        this.canvas.height, 
        { isStatic: true, render: { visible: false } }
      ),
      // Right
      Matter.Bodies.rectangle(
        this.canvas.width + wallThickness / 2, 
        this.canvas.height / 2, 
        wallThickness, 
        this.canvas.height, 
        { isStatic: true, render: { visible: false } }
      )
    ];
    
    Matter.World.add(this.world, walls);
  }
  
  updatePhysicsBounds() {
    // Mevcut boundaries'leri temizle ve yenilerini oluştur
    const bodiesToRemove = Matter.Composite.allBodies(this.world).filter(body => body.isStatic);
    Matter.World.remove(this.world, bodiesToRemove);
    this.createBoundaries();
  }
  
  createParticles() {
    this.particles = [];
    
    // Mobile için daha iyi dağılım
    const isMobile = window.innerWidth <= 768;
    const margin = isMobile ? 20 : 50;
    
    for (let i = 0; i < this.config.particleCount; i++) {
      let x, y;
      
      if (isMobile) {
        // Mobile'da tüm ekrana dağıt (sadece text area'da değil)
        x = Math.random() * (this.canvas.width - margin * 2) + margin;
        y = Math.random() * (this.canvas.height - margin * 2) + margin;
      } else {
        x = Math.random() * (this.canvas.width - 100) + 50;
        y = Math.random() * (this.canvas.height - 100) + 50;
      }
      
      // Matter.js body oluştur
      const body = Matter.Bodies.circle(x, y, this.config.particleRadius, {
        restitution: this.config.restitution,
        friction: 0.001,
        frictionAir: this.config.airFriction,
        density: 0.001,
        render: { visible: false }
      });
      
      // Custom properties ekle
      body.customProperties = {
        opacity: this.config.particleOpacity,
        pulsePhase: Math.random() * Math.PI * 2,
        connections: []
      };
      
      // Daha yavaş initial velocity
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 0.5
      });
      
      this.particles.push(body);
    }
    
    Matter.World.add(this.world, this.particles);
  }
  
  setupEventListeners() {
    let lastMouseX = 0;
    let lastMouseY = 0;
    let lastTime = Date.now();
    
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;
      const currentTime = Date.now();
      
      // Mouse velocity hesapla (smooth interaction için)
      const deltaTime = currentTime - lastTime;
      if (deltaTime > 0) {
        const deltaX = newX - lastMouseX;
        const deltaY = newY - lastMouseY;
        this.mouse.velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime;
      }
      
      this.mouse.x = newX;
      this.mouse.y = newY;
      
      lastMouseX = newX;
      lastMouseY = newY;
      lastTime = currentTime;
    });
    
    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = 0;
      this.mouse.y = 0;
      this.mouse.velocity = 0;
    });
    
    // Touch events için de destek ekle (mobile)
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const touch = e.touches[0];
      this.mouse.x = touch.clientX - rect.left;
      this.mouse.y = touch.clientY - rect.top;
    });
    
    this.canvas.addEventListener('touchend', () => {
      this.mouse.x = 0;
      this.mouse.y = 0;
      this.mouse.velocity = 0;
    });
  }
  
  setupVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopAnimation();
      } else {
        this.startAnimation();
      }
    });
  }
  
  updateConnections() {
    this.connections = [];
    
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].customProperties.connections = [];
      
      for (let j = i + 1; j < this.particles.length; j++) {
        const particle1 = this.particles[i];
        const particle2 = this.particles[j];
        
        const dx = particle2.position.x - particle1.position.x;
        const dy = particle2.position.y - particle1.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.config.connectionDistance) {
          const opacity = (this.config.connectionDistance - distance) / this.config.connectionDistance;
          
          this.connections.push({
            x1: particle1.position.x,
            y1: particle1.position.y,
            x2: particle2.position.x,
            y2: particle2.position.y,
            opacity: opacity * this.config.connectionOpacity,
            distance: distance
          });
          
          particle1.customProperties.connections.push(j);
          particle2.customProperties.connections.push(i);
        }
      }
    }
  }
  
  applyMouseForces() {
    if (this.mouse.x === 0 && this.mouse.y === 0) return;
    
    this.particles.forEach(particle => {
      const dx = this.mouse.x - particle.position.x;
      const dy = this.mouse.y - particle.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Geniş etki alanı - mouse yakınındaki tüm particle'ları etkile
      if (distance < this.config.mouseInfluenceRadius) {
        const force = (this.config.mouseInfluenceRadius - distance) / this.config.mouseInfluenceRadius;
        const mouseForce = force * this.config.mouseForce;
        
        // Uzak mesafe: Hafif çekim (gentle attraction)
        if (distance > this.config.mouseAttractionRadius) {
          const attractionForce = mouseForce * 0.3;
          Matter.Body.applyForce(particle, particle.position, {
            x: dx * attractionForce,
            y: dy * attractionForce
          });
        }
        
        // Orta mesafe: Smooth following (yumuşak takip)
        else if (distance > 30) {
          const followForce = mouseForce * this.config.mouseFollowSpeed * 0.5; // Daha yumuşak
          
          // Mouse yönünde hafif itme
          Matter.Body.applyForce(particle, particle.position, {
            x: dx * followForce,
            y: dy * followForce
          });
        }
        
        // Yakın mesafe: Hafif itme (gentle repulsion)
        else {
          const repulsionForce = mouseForce * 0.4; // Daha yumuşak repulsion
          Matter.Body.applyForce(particle, particle.position, {
            x: -dx * repulsionForce,
            y: -dy * repulsionForce
          });
        }
        
        // Mouse hızına göre ek force (daha yumuşak)
        if (this.mouse.velocity && this.mouse.velocity > 0) {
          const velocityForce = Math.min(this.mouse.velocity * 0.0005, 0.002); // Daha düşük
          Matter.Body.applyForce(particle, particle.position, {
            x: this.mouse.velocity * velocityForce * (dx / distance),
            y: this.mouse.velocity * velocityForce * (dy / distance)
          });
        }
      }
    });
  }
  
  drawConnections() {
    this.connections.forEach(connection => {
      this.ctx.save();
      this.ctx.strokeStyle = `rgba(1, 127, 228, ${connection.opacity})`;
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
      // Update pulse
      particle.customProperties.pulsePhase += 0.015;
      const pulse = Math.sin(particle.customProperties.pulsePhase) * 0.2;
      const currentOpacity = particle.customProperties.opacity + pulse;
      
      this.ctx.save();
      this.ctx.fillStyle = `rgba(1, 127, 228, ${currentOpacity})`;
      this.ctx.shadowColor = 'rgba(1, 127, 228, 0.5)';
      this.ctx.shadowBlur = 4;
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
  
  drawSynapses() {
    this.connections.forEach(connection => {
      if (connection.opacity > 0.1) {
        const time = Date.now() * 0.001;
        const pulsePosition = (Math.sin(time * 2 + connection.distance * 0.008) + 1) / 2;
        
        const pulseX = connection.x1 + (connection.x2 - connection.x1) * pulsePosition;
        const pulseY = connection.y1 + (connection.y2 - connection.y1) * pulsePosition;
        
        this.ctx.save();
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
    // Physics engine'i güncelle
    Matter.Engine.update(this.engine);
    
    // Velocity kontrolü ve damping
    this.controlVelocities();
    
    // Mouse forces uygula
    this.applyMouseForces();
    
    // Connections güncelle
    this.updateConnections();
    
    // Canvas'ı temizle
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Çiz
    this.drawConnections();
    this.drawSynapses();
    this.drawParticles();
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  controlVelocities() {
    // Particle'ların velocity'lerini kontrol et ve limit uygula
    this.particles.forEach(particle => {
      const velocity = particle.velocity;
      const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
      
      // Maximum velocity kontrolü
      if (speed > this.config.maxVelocity) {
        const ratio = this.config.maxVelocity / speed;
        Matter.Body.setVelocity(particle, {
          x: velocity.x * ratio,
          y: velocity.y * ratio
        });
      }
      
      // Velocity damping (yavaşlatma)
      Matter.Body.setVelocity(particle, {
        x: velocity.x * this.config.dampingFactor,
        y: velocity.y * this.config.dampingFactor
      });
      
      // Center force (particles dışarı çıkmasın)
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;
      const dx = centerX - particle.position.x;
      const dy = centerY - particle.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = Math.min(this.canvas.width, this.canvas.height) * 0.4;
      
      if (distance > maxDistance) {
        const force = (distance - maxDistance) / distance * 0.0001;
        Matter.Body.applyForce(particle, particle.position, {
          x: dx * force,
          y: dy * force
        });
      }
    });
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
    window.removeEventListener('resize', this.setupCanvas);
  }
}

// Initialize when DOM is ready and Matter.js is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Matter !== 'undefined') {
    new NeuralNetworkMatter();
  } else {
    console.warn('Matter.js not loaded, falling back to original implementation');
    // Fallback to original implementation
    if (typeof NeuralNetworkAnimation !== 'undefined') {
      new NeuralNetworkAnimation();
    }
  }
});
