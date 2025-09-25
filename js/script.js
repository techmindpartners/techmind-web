// Simple directory-based routing - no complex scripts needed!
// With directory structure, URLs work naturally:
// /techmind-web/cloud-solutions/ -> /techmind-web/cloud-solutions/index.html

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
        // Responsive grid dimensions based on screen width
        let cols, rows;
        const screenWidth = window.innerWidth;
        
        if (screenWidth >= 1920) {
            cols = 30; rows = 15;
        } else if (screenWidth >= 1440) {
            cols = 24; rows = 12;
        } else if (screenWidth >= 1024) {
            cols = 20; rows = 10;
        } else if (screenWidth >= 768) {
            cols = 16; rows = 8;
        } else {
            cols = 12; rows = 8;
        }
        
        const totalBlocks = cols * rows;
        const centerCol = cols / 2;
        const centerRow = rows / 2;
        const maxDistance = Math.sqrt(Math.pow(centerCol, 2) + Math.pow(centerRow, 2));
        
        // Generate active blocks proportionally (about 20% of total blocks)
        const activeBlockCount = Math.floor(totalBlocks * 0.2);
        const activeBlocks = [];
        for (let i = 0; i < activeBlockCount; i++) {
            const randomIndex = Math.floor(Math.random() * totalBlocks);
            if (!activeBlocks.includes(randomIndex)) {
                activeBlocks.push(randomIndex);
            }
        }
        
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
        
        // Handle window resize to regenerate grid
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const newScreenWidth = window.innerWidth;
                let newCols, newRows;
                
                if (newScreenWidth >= 1920) {
                    newCols = 30; newRows = 15;
                } else if (newScreenWidth >= 1440) {
                    newCols = 24; newRows = 12;
                } else if (newScreenWidth >= 1024) {
                    newCols = 20; newRows = 10;
                } else if (newScreenWidth >= 768) {
                    newCols = 16; newRows = 8;
                } else {
                    newCols = 12; newRows = 8;
                }
                
                // Only regenerate if grid size changed significantly
                if (Math.abs(newCols - cols) > 2 || Math.abs(newRows - rows) > 1) {
                    location.reload();
                }
            }, 500); // Debounce resize events
        });
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

    // Check for cross-page navigation scroll target
    const scrollToSection = sessionStorage.getItem('scrollToSection');
    if (scrollToSection) {
        // Clear the stored section
        sessionStorage.removeItem('scrollToSection');
        
        // Wait a bit for page to fully load, then scroll
        setTimeout(() => {
            const targetSection = document.querySelector('#' + scrollToSection);
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
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

// Header scroll effect with throttling
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    let scrollTimeout;
    
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = requestAnimationFrame(function() {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
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
    
    // Throttle scroll event for better performance
    let activeLinkTimeout;
    window.addEventListener('scroll', function() {
        if (activeLinkTimeout) {
            cancelAnimationFrame(activeLinkTimeout);
        }
        activeLinkTimeout = requestAnimationFrame(updateActiveLink);
    });
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

// Team Testimonial Slider with Drag & Drop
document.addEventListener('DOMContentLoaded', function() {
    const testimonialData = [
        {
            title: "Meet Hakan, our Managing Partner & CEO. Leading the strategic vision and operations at Techmind Partners, Hakan is dedicated to delivering cutting-edge technology solutions that solve complex business challenges and drive sustainable growth. Under his leadership, we focus on optimizing technology costs to help organizations build efficient, future-ready infrastructures—an approach we call Cost-smart™ Technology. His visionary approach and commitment to excellence continue to drive our company forward.",
            name: "HAKAN ARICI",
            role: "Managing Partner & CEO",
            image: "assets/team/hakan_arici.webp"
        },
        {
            title: "Meet Cihan, our Executive Partner responsible for the Cloud Solutions Program. With deep expertise in cloud technologies, Cihan leads our cloud initiatives, ensuring scalable, secure, and high-performance solutions. His strategic approach to cloud architecture and infrastructure optimization helps businesses harness the full potential of the cloud. When he's not designing cutting-edge cloud solutions, Cihan enjoys diving into emerging tech trends and finding new ways to drive digital transformation.",
            name: "Cihan Tunalı",
            role: "Executive Partner, Cloud Solutions",
            image: "assets/team/cihan_tunali.webp"
        },
        {
            title: "Meet Ali, our Executive Partner responsible for Quality, Program & Project Management. With a wealth of experience in overseeing quality assurance, program execution, and project management, Ali ensures that every initiative runs smoothly and meets the highest standards. His strategic mindset and attention to detail keep our operations efficient and on track. When he's not optimizing workflows, Ali enjoys exploring new technologies and unwinding in nature, bringing a structured yet adventurous spirit to our team.",
            name: "Ali Oğuz",
            role: "Executive Partner, PMO",
            image: "assets/team/ali_oguz.webp"
        },
        {
            title: "Meet Gökhan, our Executive Partner responsible for the AI Solutions Program. A distinguished software architect, Gökhan leads our research and development efforts with a sharp focus on innovation and technical excellence. His deep expertise in system design, scalable architecture, and emerging technologies fuels the creation of cutting-edge solutions that drive real business impact. With a strategic mindset and a passion for experimentation, Gökhan continuously pushes the boundaries of what's possible.",
            name: "Gökhan Demir",
            role: "Executive Partner, AI Solutions",
            image: "assets/team/gokhan_demir.webp"
        },
        {
            title: "Meet Buğra, our Executive Partner responsible for the End User Solutions Program. With deep expertise in mobile development, Buğra leads our engineering efforts to build high-performance, user-friendly mobile applications. His passion for innovation and seamless user experiences ensures that our mobile solutions stay ahead of the curve. When he's not optimizing app performance, you'll find him exploring the latest tech trends or enjoying outdoor adventures, bringing both precision and creativity to our team.",
            name: "Buğra Güney",
            role: "Executive Partner, End User Solutions",
            image: "assets/team/bugra_guney.webp"
        }
    ];
    
    let currentTestimonial = 0;
    let autoAdvanceInterval;
    
    const testimonialTitle = document.querySelector('.testimonial-title');
    const testimonialName = document.querySelector('.testimonial-name');
    const testimonialRole = document.querySelector('.testimonial-role');
    const testimonialImg = document.querySelector('.testimonial-img');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const sliderContainer = document.getElementById('team-slider');
    
    
    if (testimonialTitle && testimonialName && testimonialRole && testimonialImg && prevBtn && nextBtn && sliderContainer) {
        let isDragging = false;
        let startX = 0;
        let currentX = 0;
        let startTime = 0;
        
        function updateTestimonial() {
            const data = testimonialData[currentTestimonial];
            
            // Add fade out effect
            sliderContainer.style.opacity = '0.7';
            
            setTimeout(() => {
                testimonialTitle.textContent = data.title;
                testimonialName.textContent = data.name;
                testimonialRole.textContent = data.role;
                
                // Update both WebP source and fallback image
                const picture = testimonialImg.closest('picture');
                if (picture) {
                    const source = picture.querySelector('source');
                    const img = picture.querySelector('img');
                    
                    // Update WebP source
                    if (source) {
                        source.srcset = data.image;
                    }
                    
                    // Update fallback image (remove .webp extension)
                    const fallbackImage = data.image.replace('.webp', '.jpg');
                    img.src = fallbackImage;
                    img.alt = data.name;
                } else {
                    // Fallback if no picture element
                    testimonialImg.src = data.image;
                    testimonialImg.alt = data.name;
                }
                
                // Fade back in
                sliderContainer.style.opacity = '1';
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
        
        function startAutoAdvance() {
            if (autoAdvanceInterval) {
                clearInterval(autoAdvanceInterval);
            }
            autoAdvanceInterval = setInterval(nextTestimonial, 8000);
        }
        
        function stopAutoAdvance() {
            if (autoAdvanceInterval) {
                clearInterval(autoAdvanceInterval);
                autoAdvanceInterval = null;
            }
        }
        
        function resetAutoAdvance() {
            stopAutoAdvance();
            setTimeout(startAutoAdvance, 3000); // Restart after 3 seconds
        }
        
        // Button event listeners
        nextBtn.addEventListener('click', () => {
            nextTestimonial();
            resetAutoAdvance();
        });
        
        prevBtn.addEventListener('click', () => {
            prevTestimonial();
            resetAutoAdvance();
        });
        
        // Touch/Mouse drag events
        function handleStart(e) {
            isDragging = true;
            startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
            startTime = Date.now();
            stopAutoAdvance();
            sliderContainer.style.cursor = 'grabbing';
            sliderContainer.style.userSelect = 'none';
        }
        
        function handleMove(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        }
        
        function handleEnd(e) {
            if (!isDragging) return;
            
            isDragging = false;
            sliderContainer.style.cursor = 'grab';
            sliderContainer.style.userSelect = '';
            
            const deltaX = currentX - startX;
            const deltaTime = Date.now() - startTime;
            const velocity = Math.abs(deltaX) / deltaTime;
            
            // Minimum swipe distance or velocity to trigger slide
            if (Math.abs(deltaX) > 50 || velocity > 0.5) {
                stopAutoAdvance(); // Stop current timer before changing
                if (deltaX > 0) {
                    prevTestimonial();
                } else {
                    nextTestimonial();
                }
                resetAutoAdvance();
            } else {
                // If no slide occurred, just restart auto-advance
                resetAutoAdvance();
            }
        }
        
        // Mouse events
        sliderContainer.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        
        // Touch events
        sliderContainer.addEventListener('touchstart', handleStart, { passive: false });
        sliderContainer.addEventListener('touchmove', handleMove, { passive: false });
        sliderContainer.addEventListener('touchend', handleEnd);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (sliderContainer.closest(':hover') || document.activeElement === prevBtn || document.activeElement === nextBtn) {
                if (e.key === 'ArrowLeft') {
                    stopAutoAdvance();
                    prevTestimonial();
                    resetAutoAdvance();
                } else if (e.key === 'ArrowRight') {
                    stopAutoAdvance();
                    nextTestimonial();
                    resetAutoAdvance();
                }
            }
        });
        
        // Initialize
        sliderContainer.style.transition = 'opacity 0.3s ease';
        sliderContainer.style.cursor = 'grab';
        startAutoAdvance();
    }
});

// Metrics Counter Animation
document.addEventListener('DOMContentLoaded', function() {
    const metricNumbers = document.querySelectorAll('.metric-number');
    
    if (metricNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = target.textContent;
                    
                    // Extract number and symbol
                    const match = finalValue.match(/([0-9,]+)\+?/);
                    if (match) {
                        const number = parseInt(match[1].replace(/,/g, ''));
                        const symbol = finalValue.includes('$') ? '$' : '';
                        const suffix = finalValue.includes('+') ? '+' : '';
                        
                        // Animate counter
                        animateCounter(target, 0, number, symbol, suffix, 2000);
                        
                        // Stop observing this element
                        observer.unobserve(target);
                    }
                }
            });
        }, {
            threshold: 0.3
        });
        
        metricNumbers.forEach(number => {
            observer.observe(number);
        });
        
        function animateCounter(element, start, end, symbol, suffix, duration) {
            const startTime = performance.now();
            const startValue = start;
            const endValue = end;
            
            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
                
                // Format number with commas
                const formattedValue = currentValue.toLocaleString();
                element.textContent = symbol + formattedValue + suffix;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }
            
            requestAnimationFrame(updateCounter);
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



// Typeform Modal Functions
function openTypeformModal() {
    const modal = document.getElementById('typeform-modal');
    const iframe = document.getElementById('typeform-iframe');
    
    // Set the Typeform URL
    iframe.src = 'https://form.typeform.com/to/x8fbWMoh';
    
    // Show the modal
    modal.style.display = 'block';
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Close modal when clicking outside the content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeTypeformModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeTypeformModal();
        }
    });
}

function closeTypeformModal() {
    const modal = document.getElementById('typeform-modal');
    const iframe = document.getElementById('typeform-iframe');
    
    // Hide the modal
    modal.style.display = 'none';
    
    // Clear the iframe source to stop the form
    iframe.src = '';
    
    // Restore body scrolling
    document.body.style.overflow = 'auto';
}

// Brain mouse interaction removed - no more brain movement animation

// Splide Slider Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Partners Slider
    if (document.getElementById('partners-slider')) {
        new Splide('#partners-slider', {
            type: 'loop',
            autoplay: true,
            pauseOnHover: true,
            pauseOnFocus: true,
            interval: 3000,
            speed: 1000,
            perPage: 5,
            perMove: 1,
            gap: '1.5rem',
            arrows: false,
            pagination: false,
            drag: true,
            wheel: true,
            wheelSleep: 100,
            breakpoints: {
                1200: { perPage: 4 },
                768: { perPage: 3 },
                480: { perPage: 2 }
            }
        }).mount();
    }

    // Clients Slider  
    if (document.getElementById('clients-slider')) {
        new Splide('#clients-slider', {
            type: 'loop',
            autoplay: true,
            pauseOnHover: true,
            pauseOnFocus: true,
            interval: 2500,
            speed: 800,
            perPage: 6,
            perMove: 1,
            gap: '1.5rem',
            arrows: false,
            pagination: false,
            drag: true,
            wheel: true,
            wheelSleep: 100,
            breakpoints: {
                1200: { perPage: 5 },
                768: { perPage: 4 },
                480: { perPage: 3 }
            }
        }).mount();
    }
});

