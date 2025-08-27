// Client-side routing for GitHub Pages
function initializeRouting() {
    // Detect the base path for GitHub Pages
    const pathSegments = window.location.pathname.split('/').filter(segment => segment);
    const basePath = pathSegments.length > 0 && pathSegments[0] === 'techmind-web' ? '/techmind-web' : '';
    
    // Simple client-side routing with base path support
    const routes = {
        [basePath + '/']: 'index.html',
        [basePath + '/engineering-solutions']: 'engineering-solutions.html',
        [basePath + '/cloud-solutions']: 'cloud-solutions.html',
        [basePath + '/ai-solutions']: 'ai-solutions.html',
        [basePath + '/end-user-solutions']: 'end-user-solutions.html',
        [basePath + '/contact']: 'contact.html'
    };

    function loadPage(path) {
        // Remove base path for route lookup
        const routePath = path.startsWith(basePath) ? path : basePath + path;
        const route = routes[routePath];
        
        if (route && route !== 'index.html') {
            // If the page exists, redirect to it with base path
            window.location.href = basePath + '/' + route;
        }
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(event) {
        const path = window.location.pathname;
        loadPage(path);
    });

    // Handle navigation clicks
    document.addEventListener('click', function(event) {
        const link = event.target.closest('a');
        if (link && link.hostname === window.location.hostname) {
            const linkPath = link.pathname;
            
            // Check if this is an internal route
            if (routes[linkPath] && routes[linkPath] !== 'index.html') {
                event.preventDefault();
                window.history.pushState(null, null, linkPath);
                loadPage(linkPath);
            }
        }
    });

    // Check current path on load
    const currentPath = window.location.pathname;
    if (currentPath !== basePath + '/' && routes[currentPath]) {
        loadPage(currentPath);
    }
}

// Initialize routing when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeRouting);

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Create hero background pattern
    const patternGrid = document.getElementById('patternGrid');
    if (patternGrid) {
        const totalBlocks = 20 * 15; // 20 columns x 15 rows
        const cols = 20;
        const rows = 15;
        const centerCol = cols / 2; // 10
        const centerRow = rows / 2; // 7.5
        const maxDistance = Math.sqrt(Math.pow(centerCol, 2) + Math.pow(centerRow, 2)); // Maksimum mesafe
        
        // Dağınık aktif kareler - 68 adet
        const activeBlocks = [2, 7, 13, 19, 24, 31, 38, 45, 52, 58, 65, 71, 78, 84, 91, 97, 104, 110, 117, 123, 130, 136, 143, 149, 156, 162, 169, 175, 182, 188, 195, 201, 208, 214, 221, 227, 234, 240, 247, 253, 260, 266, 273, 279, 286, 292, 299, 5, 12, 18, 25, 32, 39, 46, 53, 60, 67, 74, 81, 88, 95, 102, 109, 116, 123, 130, 137, 144, 151, 158, 165, 172, 179, 186, 193, 200, 207, 214, 221, 228, 235, 242, 249, 256, 263, 270, 277, 284, 291, 298];
        
        for (let i = 0; i < totalBlocks; i++) {
            const block = document.createElement('div');
            block.className = 'pattern-block';
            
            // Calculate position in grid
            const col = i % cols;
            const row = Math.floor(i / cols);
            
            // Calculate distance from center
            const distanceFromCenter = Math.sqrt(Math.pow(col - centerCol, 2) + Math.pow(row - centerRow, 2));
            
            // Calculate opacity based on distance (0 at center, 1 at edges)
            const normalizedDistance = distanceFromCenter / maxDistance;
            const opacity = Math.min(normalizedDistance * 1.2, 1); // 1.2 çarpanı ile daha hızlı opacity artışı
            
            // Set the opacity
            block.style.opacity = opacity;
            
            // Add active class to specific blocks to match the design
            if (activeBlocks.includes(i)) {
                block.classList.add('active');
            }
            
            // Add hover effect with delay
            block.addEventListener('mouseenter', function() {
                setTimeout(() => {
                    this.classList.add('active');
                }, Math.random() * 200);
            });
            
            block.addEventListener('mouseleave', function() {
                if (!activeBlocks.includes(i)) {
                    setTimeout(() => {
                        this.classList.remove('active');
                    }, Math.random() * 500 + 200);
                }
            });
            
            patternGrid.appendChild(block);
        }
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
        
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
});

// Smooth Scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Basic validation
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Here you would typically send the data to a server
            // For now, we'll just show a success message
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            this.reset();
        });
    }
});

// Header scroll effect
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
});

// Active navigation link highlighting
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveLink() {
        let current = '';
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial call
});

// Intersection Observer for animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe cards and sections
    const animatedElements = document.querySelectorAll('.about-card, .service-card, .hero-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // Services Flow Line Animation Observer
    const servicesSection = document.querySelector('.our-services');
    if (servicesSection) {
        const servicesObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-50px 0px -50px 0px'
        });

        servicesObserver.observe(servicesSection);
    }
});

// Team Testimonial Slider
document.addEventListener('DOMContentLoaded', function() {
    const testimonialData = [
        {
            title: "Meet Hakan, our Managing Partner & CEO. Leading the strategic vision and operations at Techmind Partners.",
            name: "HAKAN ARICI",
            role: "Managing Partner & CEO",
            image: "assets/team/hakan_arici.jpg"
        },
        {
            title: "Meet Cihan, our Executive Partner responsible for the Cloud Solutions Program.",
            name: "Cihan Tunalı",
            role: "Executive Partner, Cloud Solutions",
            image: "assets/team/cihan_tunali.jpg"
        },
        {
            title: "Meet Ali, our Executive Partner responsible for Quality, Program & Project Management. ",
            name: "Ali Oğuz",
            role: "Executive Partner, PMO",
            image: "assets/team/ali_oguz.jpg"
        },
        {
            title: "Meet Gökhan, our Executive Partner responsible for the AI Solutions Program.",
            name: "Gökhan Demir",
            role: "Executive Partner, AI Solutions",
            image: "assets/team/gokhan_demir.jpg"
        },
        {
            title: "Meet Buğra, our Executive Partner responsible for the End User Solutions Program.",
            name: "Buğra Güney",
            role: "Executive Partner, End User Solutions",
            image: "assets/team/bugra_guney.jpg"
        }
    ];
    
    let currentTestimonial = 0;
    
    const testimonialTitle = document.querySelector('.testimonial-title');
    const testimonialName = document.querySelector('.testimonial-name');
    const testimonialRole = document.querySelector('.testimonial-role');
    const testimonialImg = document.querySelector('.testimonial-img');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    if (testimonialTitle && testimonialName && testimonialRole && testimonialImg && prevBtn && nextBtn) {
        function updateTestimonial() {
            const data = testimonialData[currentTestimonial];
            
            // Add fade out effect
            const testimonialContent = document.querySelector('.testimonial-content');
            testimonialContent.style.opacity = '0.7';
            
            setTimeout(() => {
                testimonialTitle.textContent = data.title;
                testimonialName.textContent = data.name;
                testimonialRole.textContent = data.role;
                testimonialImg.src = data.image;
                testimonialImg.alt = data.name;
                
                // Fade back in
                testimonialContent.style.opacity = '1';
            }, 200);
        }
        
        function nextTestimonial() {
            currentTestimonial = (currentTestimonial + 1) % testimonialData.length;
            updateTestimonial();
        }
        
        function prevTestimonial() {
            currentTestimonial = (currentTestimonial - 1 + testimonialData.length) % testimonialData.length;
            updateTestimonial();
        }
        
        // Event listeners
        nextBtn.addEventListener('click', nextTestimonial);
        prevBtn.addEventListener('click', prevTestimonial);
        
        // Auto-advance testimonials every 8 seconds
        setInterval(nextTestimonial, 8000);
        
        // Add smooth transition
        const testimonialContent = document.querySelector('.testimonial-content');
        if (testimonialContent) {
            testimonialContent.style.transition = 'opacity 0.3s ease';
        }
    }
});

// Success Stories Testimonials Slider
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.testimonials-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (slider && prevBtn && nextBtn) {
        const cardWidth = 332; // 300px card + 32px gap
        let currentPosition = 0;
        const maxCards = document.querySelectorAll('.testimonial-card').length;
        const visibleCards = Math.floor(slider.offsetWidth / cardWidth);
        const maxPosition = Math.max(0, (maxCards - visibleCards) * cardWidth);
        
        function updateButtonStates() {
            prevBtn.disabled = currentPosition <= 0;
            nextBtn.disabled = currentPosition >= maxPosition;
        }
        
        function slideNext() {
            if (currentPosition < maxPosition) {
                currentPosition += cardWidth;
                slider.scrollTo({
                    left: currentPosition,
                    behavior: 'smooth'
                });
            }
            updateButtonStates();
        }
        
        function slidePrev() {
            if (currentPosition > 0) {
                currentPosition -= cardWidth;
                slider.scrollTo({
                    left: currentPosition,
                    behavior: 'smooth'
                });
            }
            updateButtonStates();
        }
        
        // Event listeners
        nextBtn.addEventListener('click', slideNext);
        prevBtn.addEventListener('click', slidePrev);
        
        // Handle scroll events to update current position
        slider.addEventListener('scroll', function() {
            currentPosition = slider.scrollLeft;
            updateButtonStates();
        });
        
        // Initialize button states
        updateButtonStates();
        
        // Handle window resize
        window.addEventListener('resize', function() {
            const newVisibleCards = Math.floor(slider.offsetWidth / cardWidth);
            const newMaxPosition = Math.max(0, (maxCards - newVisibleCards) * cardWidth);
            
            if (currentPosition > newMaxPosition) {
                currentPosition = newMaxPosition;
                slider.scrollTo({
                    left: currentPosition,
                    behavior: 'smooth'
                });
            }
            updateButtonStates();
        });
    }
});

// FAQ Toggle Functionality
function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');
    
    // Close all other FAQ items
    const allFaqItems = document.querySelectorAll('.faq-item');
    allFaqItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Toggle current item
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Service Card Background Patterns
document.addEventListener('DOMContentLoaded', function() {
    const servicePatternGrids = document.querySelectorAll('.service-pattern-grid');
    servicePatternGrids.forEach((grid, cardIndex) => {
        const totalBlocks = 8 * 6; // 8 columns x 6 rows for service cards
        // Daha az aktif kare - sadece bazıları koyu olsun
        const activeBlocks = [3, 7, 12, 16, 21, 25, 30, 34, 39, 43];
        
        for (let i = 0; i < totalBlocks; i++) {
            const block = document.createElement('div');
            block.className = 'service-pattern-block';
            if (activeBlocks.includes(i + 1)) {
                block.classList.add('active');
            }
            grid.appendChild(block);
        }

        // Add hover effects for service card patterns
        const blocks = grid.querySelectorAll('.service-pattern-block');
        blocks.forEach((block, index) => {
            block.addEventListener('mouseenter', () => {
                if (!block.classList.contains('active')) {
                    block.classList.add('active');
                    setTimeout(() => {
                        block.classList.remove('active');
                    }, 800 + Math.random() * 1500);
                }
            });
        });
    });
});

// Footer Pattern Blocks
document.addEventListener('DOMContentLoaded', function() {
    const footerPatternGrids = document.querySelectorAll('.footer-pattern-grid');
    footerPatternGrids.forEach((grid) => {
        const totalBlocks = 20 * 8; // 20 columns x 8 rows
        // Footer için aktif bloklar - dağınık pattern
        const activeBlocks = [12, 28, 35, 51, 67, 83, 94, 112, 127, 145, 158, 176, 189, 203, 219, 235, 248, 264, 277, 293, 308, 324, 337, 353, 366, 382, 395, 411, 424, 440, 453, 469, 482, 498];
        
        for (let i = 0; i < totalBlocks; i++) {
            const block = document.createElement('div');
            block.className = 'footer-pattern-block';
            
            // Add active class to specific blocks
            if (activeBlocks.includes(i)) {
                block.classList.add('active');
            }
            
            // Add hover effect with delay
            block.addEventListener('mouseenter', function() {
                setTimeout(() => {
                    this.classList.add('active');
                }, Math.random() * 200);
            });
            
            block.addEventListener('mouseleave', function() {
                if (!activeBlocks.includes(i)) {
                    setTimeout(() => {
                        this.classList.remove('active');
                    }, Math.random() * 400 + 200);
                }
            });
            
            grid.appendChild(block);
        }
    });
});

