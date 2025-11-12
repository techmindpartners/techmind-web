// Performance Optimization Script
console.log('🚀 Performance optimizations applied');

// 1. Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// 2. Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 3. Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 4. Preload critical resources
function preloadCriticalResources() {
    const criticalImages = [
        'assets/images/brain.webp',
        'assets/team/hakan-arici.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// 5. Optimize animations for reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable neural network animation for users who prefer reduced motion
    document.addEventListener('DOMContentLoaded', function() {
        const neuralNetwork = document.getElementById('neural-network');
        if (neuralNetwork) {
            neuralNetwork.style.display = 'none';
        }
    });
}

// 6. Initialize optimizations
document.addEventListener('DOMContentLoaded', function() {
    preloadCriticalResources();
    console.log('✅ Performance optimizations loaded');
});

// 7. Memory cleanup
window.addEventListener('beforeunload', function() {
    // Clean up any running animations or intervals
    const animations = document.querySelectorAll('[style*="animation"]');
    animations.forEach(el => el.style.animation = 'none');
});
