/**
 * Clean Neural Network Animation with Matter.js
 * Optimized, stable, floating particle system
 */

class CleanNeuralNetwork {
  constructor() {
    this.canvas = document.getElementById('neural-network');
    this.ctx = null;
    this.engine = null;
    this.world = null;
    this.particles = [];
    this.connections = [];
    this.mouse = { x: 0, y: 0, isActive: false };
    this.animationId = null;
    
    // Responsive configuration
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024;
    
    this.config = {
      particleCount: isMobile ? 25 : (isTablet ? 30 : 200), // Desktop 200 node
      particleRadius: isMobile ? 2 : 2.5,
      connectionDistance: isMobile ? 120 : 160, // Longer connections for better connectivity
      lineWidth: 1.2,
      connectionOpacity: 0.4, // More visible
      particleOpacity: 0.7,
      mouseRadius: isMobile ? 100 : 150,
      mouseForce: 0.0005, // Even more gentle
      floatSpeed: 0.1 // Much slower floating
    };
    
    this.init();
  }
  
  init() {
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
      
      if (this.engine) {
        this.repositionParticles();
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }
  
  setupPhysics() {
    // Create clean Matter.js setup
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    
    // Disable gravity completely
    this.engine.world.gravity.y = 0;
    this.engine.world.gravity.x = 0;
    
    // Optimize engine settings
    this.engine.timing.timeScale = 1;
    this.engine.constraintIterations = 1;
    this.engine.positionIterations = 3;
    this.engine.velocityIterations = 2;
  }
  
  createParticles() {
    this.particles = [];
    
    for (let i = 0; i < this.config.particleCount; i++) {
      // Random position with proper distribution
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      
      // Create simple circle body
      const body = Matter.Bodies.circle(x, y, this.config.particleRadius, {
        frictionAir: 0.05, // Much higher friction (slower movement)
        restitution: 0, // No bouncing
        friction: 0,
        density: 0.001,
        render: { visible: false }
      });
      
      // Add custom properties
      body.customData = {
        opacity: this.config.particleOpacity,
        pulsePhase: Math.random() * Math.PI * 2,
        floatDirection: {
          x: (Math.random() - 0.5) * this.config.floatSpeed,
          y: (Math.random() - 0.5) * this.config.floatSpeed
        }
      };
      
      this.particles.push(body);
    }
    
    Matter.World.add(this.world, this.particles);
  }
  
  repositionParticles() {
    // Redistribute particles when canvas resizes
    this.particles.forEach(particle => {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      Matter.Body.setPosition(particle, { x, y });
      Matter.Body.setVelocity(particle, { x: 0, y: 0 });
    });
  }
  
  setupEventListeners() {
    // Mouse event listeners kaldırıldı - sadece passive floating
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
  
  updateParticles() {
    this.particles.forEach(particle => {
      // Apply very gentle floating movement
      Matter.Body.applyForce(particle, particle.position, {
        x: particle.customData.floatDirection.x * 0.00003, // Much smaller force
        y: particle.customData.floatDirection.y * 0.00003
      });
      
      // Randomly change direction occasionally
      if (Math.random() < 0.01) {
        particle.customData.floatDirection = {
          x: (Math.random() - 0.5) * this.config.floatSpeed,
          y: (Math.random() - 0.5) * this.config.floatSpeed
        };
      }
      
      // Keep particles in bounds with gentle force
      const margin = 50;
      let forceX = 0, forceY = 0;
      
      if (particle.position.x < margin) {
        forceX = (margin - particle.position.x) * 0.00001;
      } else if (particle.position.x > this.canvas.width - margin) {
        forceX = (this.canvas.width - margin - particle.position.x) * 0.00001;
      }
      
      if (particle.position.y < margin) {
        forceY = (margin - particle.position.y) * 0.00001;
      } else if (particle.position.y > this.canvas.height - margin) {
        forceY = (this.canvas.height - margin - particle.position.y) * 0.00001;
      }
      
      if (forceX !== 0 || forceY !== 0) {
        Matter.Body.applyForce(particle, particle.position, { 
          x: forceX * 0.5, // Reduce boundary force 
          y: forceY * 0.5 
        });
      }
      
      // Mouse interaction kaldırıldı - sadece sakin floating
      
      // Update pulse (slower)
      particle.customData.pulsePhase += 0.005;
    });
  }
  
  updateConnections() {
    this.connections = [];
    const particleConnections = new Array(this.particles.length).fill(0);
    
    // First pass: normal connections
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        
        const dx = p2.position.x - p1.position.x;
        const dy = p2.position.y - p1.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.config.connectionDistance) {
          const opacity = (this.config.connectionDistance - distance) / this.config.connectionDistance;
          
          this.connections.push({
            x1: p1.position.x,
            y1: p1.position.y,
            x2: p2.position.x,
            y2: p2.position.y,
            opacity: opacity * this.config.connectionOpacity,
            distance: distance,
            particleIndices: [i, j]
          });
          
          particleConnections[i]++;
          particleConnections[j]++;
        }
      }
    }
    
    // Second pass: ensure every particle has at least one connection
    for (let i = 0; i < this.particles.length; i++) {
      if (particleConnections[i] === 0) {
        // Find closest particle
        let closestIndex = -1;
        let closestDistance = Infinity;
        
        for (let j = 0; j < this.particles.length; j++) {
          if (i === j) continue;
          
          const p1 = this.particles[i];
          const p2 = this.particles[j];
          const dx = p2.position.x - p1.position.x;
          const dy = p2.position.y - p1.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = j;
          }
        }
        
        // Force connection to closest particle
        if (closestIndex !== -1) {
          const p1 = this.particles[i];
          const p2 = this.particles[closestIndex];
          const opacity = Math.max(0.1, (this.config.connectionDistance - closestDistance) / this.config.connectionDistance);
          
          this.connections.push({
            x1: p1.position.x,
            y1: p1.position.y,
            x2: p2.position.x,
            y2: p2.position.y,
            opacity: opacity * this.config.connectionOpacity,
            distance: closestDistance,
            particleIndices: [i, closestIndex],
            forced: true // Mark as forced connection
          });
        }
      }
    }
  }
  
  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw connections with glow effect
    this.connections.forEach(connection => {
      this.ctx.save();
      
      // Main line
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
    
    // Draw particles
    this.particles.forEach(particle => {
      const pulse = Math.sin(particle.customData.pulsePhase) * 0.1;
      const opacity = particle.customData.opacity + pulse;
      
      this.ctx.save();
      this.ctx.fillStyle = `rgba(1, 127, 228, ${opacity})`;
      this.ctx.shadowColor = 'rgba(1, 127, 228, 0.3)';
      this.ctx.shadowBlur = 2;
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
    
    // Draw synapses (pulse effects) - more visible
    this.connections.forEach(connection => {
      if (connection.opacity > 0.05) {
        const time = Date.now() * 0.001;
        const pulsePos = (Math.sin(time * 1.5 + connection.distance * 0.01) + 1) / 2;
        
        const pulseX = connection.x1 + (connection.x2 - connection.x1) * pulsePos;
        const pulseY = connection.y1 + (connection.y2 - connection.y1) * pulsePos;
        
        this.ctx.save();
        this.ctx.fillStyle = `rgba(255, 255, 255, ${connection.opacity * 0.8})`;
        this.ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        this.ctx.shadowBlur = 3;
        this.ctx.beginPath();
        this.ctx.arc(pulseX, pulseY, 1.2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    });
  }
  
  animate() {
    // Update physics (gentle)
    Matter.Engine.update(this.engine, 16.666); // 60 FPS
    
    // Update particles
    this.updateParticles();
    
    // Update connections
    this.updateConnections();
    
    // Draw everything
    this.draw();
    
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
    window.removeEventListener('resize', this.setupCanvas);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Matter !== 'undefined') {
    new CleanNeuralNetwork();
  } else {
    console.warn('Matter.js not loaded');
  }
});
