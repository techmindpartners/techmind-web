/**
 * Optimized JavaScript for Techmind Website
 * Performance-focused implementation with modern ES6+ features
 */

'use strict';

// Performance monitoring
const performanceMonitor = {
  startTime: performance.now(),
  metrics: {
    loadTime: 0,
    interactionTime: 0,
    memoryUsage: 0
  },
  
  measureLoadTime() {
    this.metrics.loadTime = performance.now() - this.startTime;
    console.log(`🚀 Page loaded in ${this.metrics.loadTime.toFixed(2)}ms`);
  },
  
  measureMemoryUsage() {
    if (performance.memory) {
      this.metrics.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024;
      console.log(`💾 Memory usage: ${this.metrics.memoryUsage.toFixed(2)}MB`);
    }
  }
};

// Event delegation utility
const eventDelegate = {
  add(selector, event, handler, useCapture = false) {
    document.addEventListener(event, (e) => {
      if (e.target.matches(selector) || e.target.closest(selector)) {
        handler.call(e.target.closest(selector) || e.target, e);
      }
    }, useCapture);
  }
};

// Debounce utility for performance
const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
};

// Throttle utility for scroll events
const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Mobile Menu Handler
class MobileMenu {
  constructor() {
    this.navToggle = document.getElementById('nav-toggle');
    this.navMenu = document.getElementById('nav-menu');
    this.isOpen = false;
    
    this.init();
  }
  
  init() {
    if (!this.navToggle || !this.navMenu) return;
    
    // Use event delegation for better performance
    eventDelegate.add('#nav-toggle', 'click', this.toggle.bind(this));
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
        this.close();
      }
    });
  }
  
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  
  open() {
    this.navMenu.classList.add('active');
    this.navToggle.classList.add('active');
    this.navToggle.setAttribute('aria-expanded', 'true');
    this.isOpen = true;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }
  
  close() {
    this.navMenu.classList.remove('active');
    this.navToggle.classList.remove('active');
    this.navToggle.setAttribute('aria-expanded', 'false');
    this.isOpen = false;
    
    // Restore body scroll
    document.body.style.overflow = '';
  }
}

// Hero Background Pattern Generator
class HeroPattern {
  constructor() {
    this.patternGrid = document.getElementById('patternGrid');
    this.activeBlocks = new Set();
    this.animationFrame = null;
    
    this.init();
  }
  
  init() {
    if (!this.patternGrid) return;
    
    this.createPattern();
    this.startAnimation();
    
    // Optimize for resize
    window.addEventListener('resize', debounce(() => {
      this.createPattern();
    }, 250));
  }
  
  createPattern() {
    const { cols, rows } = this.getGridDimensions();
    const totalBlocks = cols * rows;
    
    // Clear existing pattern
    this.patternGrid.innerHTML = '';
    this.activeBlocks.clear();
    
    // Set CSS grid
    this.patternGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    this.patternGrid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    
    // Generate blocks
    const activeCount = Math.floor(totalBlocks * 0.2);
    const blockIndices = Array.from({ length: totalBlocks }, (_, i) => i);
    
    // Shuffle and select active blocks
    const shuffled = this.shuffleArray(blockIndices);
    const activeIndices = shuffled.slice(0, activeCount);
    
    activeIndices.forEach(index => {
      this.activeBlocks.add(index);
    });
    
    // Create DOM elements
    for (let i = 0; i < totalBlocks; i++) {
      const block = document.createElement('div');
      block.className = 'pattern-block';
      block.setAttribute('data-index', i);
      
      if (this.activeBlocks.has(i)) {
        block.classList.add('active');
      }
      
      this.patternGrid.appendChild(block);
    }
  }
  
  getGridDimensions() {
    const screenWidth = window.innerWidth;
    
    if (screenWidth >= 1920) return { cols: 30, rows: 15 };
    if (screenWidth >= 1440) return { cols: 24, rows: 12 };
    if (screenWidth >= 1024) return { cols: 20, rows: 10 };
    if (screenWidth >= 768) return { cols: 16, rows: 8 };
    return { cols: 12, rows: 8 };
  }
  
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  startAnimation() {
    const animate = () => {
      // Randomly toggle some blocks
      const blocks = this.patternGrid.querySelectorAll('.pattern-block');
      const toggleCount = Math.floor(blocks.length * 0.05); // 5% of blocks
      
      for (let i = 0; i < toggleCount; i++) {
        const randomIndex = Math.floor(Math.random() * blocks.length);
        const block = blocks[randomIndex];
        block.classList.toggle('active');
      }
      
      this.animationFrame = requestAnimationFrame(animate);
    };
    
    this.animationFrame = requestAnimationFrame(animate);
  }
  
  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}

// Smooth Scrolling Handler
class SmoothScrolling {
  constructor() {
    this.init();
  }
  
  init() {
    // Use event delegation for anchor links
    eventDelegate.add('a[href^="#"]', 'click', this.handleClick.bind(this));
  }
  
  handleClick(e) {
    e.preventDefault();
    
    const href = e.target.getAttribute('href');
    if (!href || href === '#') return;
    
    const target = document.querySelector(href);
    if (!target) return;
    
    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
    const targetPosition = target.offsetTop - headerHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
    
    // Update URL without jumping
    history.pushState(null, null, href);
  }
}

// Header Scroll Effect
class HeaderScrollEffect {
  constructor() {
    this.header = document.querySelector('.header');
    this.lastScrollY = window.scrollY;
    this.isScrollingUp = false;
    
    this.init();
  }
  
  init() {
    if (!this.header) return;
    
    // Throttled scroll handler
    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY;
      this.isScrollingUp = currentScrollY < this.lastScrollY;
      
      // Add/remove shadow based on scroll position
      if (currentScrollY > 10) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }
      
      this.lastScrollY = currentScrollY;
    }, 16); // ~60fps
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
}

// Intersection Observer for Animations
class IntersectionAnimations {
  constructor() {
    this.observer = null;
    this.init();
  }
  
  init() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      this.fallbackAnimation();
      return;
    }
    
    const options = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };
    
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), options);
    this.observeElements();
  }
  
  observeElements() {
    const elementsToObserve = [
      '.service-card',
      '.partner-item',
      '.client-logo',
      '.metric-card',
      '.testimonial__card',
      '.team-member'
    ];
    
    elementsToObserve.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.classList.add('fade-in');
        this.observer.observe(el);
      });
    });
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after animation to improve performance
        this.observer.unobserve(entry.target);
      }
    });
  }
  
  fallbackAnimation() {
    // Fallback for browsers without IntersectionObserver
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(el => {
      el.classList.add('visible');
    });
  }
  
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Metrics Counter Animation
class MetricsCounter {
  constructor() {
    this.metricElements = document.querySelectorAll('.metric-number');
    this.observer = null;
    this.init();
  }
  
  init() {
    if (!this.metricElements.length) return;
    
    const options = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.5
    };
    
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), options);
    this.metricElements.forEach(el => {
      this.observer.observe(el);
    });
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        this.animateCounter(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }
  
  animateCounter(element) {
    const targetValue = parseInt(element.textContent.replace(/\D/g, ''));
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(targetValue * easeOutCubic);
      
      element.textContent = currentValue + '+';
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = targetValue + '+';
        element.classList.add('animated');
      }
    };
    
    requestAnimationFrame(animate);
  }
}

// Team Testimonial Slider
class TeamTestimonialSlider {
  constructor() {
    this.slider = document.querySelector('.team-testimonial__slider');
    this.slides = document.querySelectorAll('.team-testimonial__slide');
    this.currentSlide = 0;
    this.autoSlideInterval = null;
    this.isAutoSliding = true;
    
    this.init();
  }
  
  init() {
    if (!this.slider || !this.slides.length) return;
    
    this.startAutoSlide();
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Pause auto-slide on hover
    this.slider.addEventListener('mouseenter', () => {
      this.pauseAutoSlide();
    });
    
    this.slider.addEventListener('mouseleave', () => {
      if (this.isAutoSliding) {
        this.startAutoSlide();
      }
    });
    
    // Touch/swipe support
    this.addSwipeSupport();
  }
  
  addSwipeSupport() {
    let startX = 0;
    let startY = 0;
    
    this.slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });
    
    this.slider.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;
      
      // Only trigger if horizontal swipe is greater than vertical
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
    }, { passive: true });
  }
  
  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }
  
  pauseAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }
  
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.updateSlider();
  }
  
  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.updateSlider();
  }
  
  updateSlider() {
    const translateX = -this.currentSlide * 100;
    this.slider.style.transform = `translateX(${translateX}%)`;
  }
  
  destroy() {
    this.pauseAutoSlide();
  }
}

// Success Stories Slider
class SuccessStoriesSlider {
  constructor() {
    this.slider = document.querySelector('.success-stories__slider');
    this.slides = document.querySelectorAll('.testimonial__card');
    this.prevBtn = document.querySelector('.testimonial__arrow--prev');
    this.nextBtn = document.querySelector('.testimonial__arrow--next');
    this.currentSlide = 0;
    this.slidesPerView = this.getSlidesPerView();
    
    this.init();
  }
  
  init() {
    if (!this.slider || !this.slides.length) return;
    
    this.setupEventListeners();
    this.updateSlider();
  }
  
  getSlidesPerView() {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1200) return 3;
    if (screenWidth >= 768) return 2;
    return 1;
  }
  
  setupEventListeners() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSlide());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }
    
    // Responsive handling
    window.addEventListener('resize', debounce(() => {
      this.slidesPerView = this.getSlidesPerView();
      this.updateSlider();
    }, 250));
  }
  
  nextSlide() {
    const maxSlide = Math.max(0, this.slides.length - this.slidesPerView);
    this.currentSlide = Math.min(this.currentSlide + 1, maxSlide);
    this.updateSlider();
  }
  
  prevSlide() {
    this.currentSlide = Math.max(this.currentSlide - 1, 0);
    this.updateSlider();
  }
  
  updateSlider() {
    const translateX = -this.currentSlide * (100 / this.slidesPerView);
    this.slider.style.transform = `translateX(${translateX}%)`;
    
    // Update button states
    const maxSlide = Math.max(0, this.slides.length - this.slidesPerView);
    
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentSlide === 0;
    }
    
    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentSlide >= maxSlide;
    }
  }
}

// Typeform Modal Handler
class TypeformModal {
  constructor() {
    this.modal = document.getElementById('typeform-modal');
    this.closeBtn = document.querySelector('.typeform-close-btn');
    this.isOpen = false;
    
    this.init();
  }
  
  init() {
    if (!this.modal) return;
    
    // Open modal on partner button click
    eventDelegate.add('.btn--partner', 'click', this.open.bind(this));
    
    // Close modal handlers
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', this.close.bind(this));
    }
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
    
    // Close on backdrop click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });
  }
  
  open() {
    this.modal.style.display = 'flex';
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
    
    // Focus management
    this.closeBtn?.focus();
  }
  
  close() {
    this.modal.style.display = 'none';
    this.isOpen = false;
    document.body.style.overflow = '';
  }
}

// Performance Optimized Initialization
class App {
  constructor() {
    this.components = [];
    this.init();
  }
  
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }
  
  initializeComponents() {
    try {
      // Initialize all components
      this.components = [
        new MobileMenu(),
        new HeroPattern(),
        new SmoothScrolling(),
        new HeaderScrollEffect(),
        new IntersectionAnimations(),
        new MetricsCounter(),
        new TeamTestimonialSlider(),
        new SuccessStoriesSlider(),
        new TypeformModal()
      ];
      
      // Measure performance
      performanceMonitor.measureLoadTime();
      performanceMonitor.measureMemoryUsage();
      
      console.log('✅ All components initialized successfully');
      
    } catch (error) {
      console.error('❌ Error initializing components:', error);
    }
  }
  
  destroy() {
    // Clean up all components
    this.components.forEach(component => {
      if (component.destroy) {
        component.destroy();
      }
    });
    this.components = [];
  }
}

// Initialize the application
const app = new App();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  app.destroy();
});

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { App, performanceMonitor };
}
