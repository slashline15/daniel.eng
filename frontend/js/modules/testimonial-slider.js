const TestimonialSlider = (function () {
    function init() {
        if (document.querySelector('.testimonial-slider')) {
            setupSlider();
            setupTiltEffect();
        }
    }

    function setupSlider() {
        const slides = document.querySelectorAll('.testimonial-item');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.testimonial-prev');
        const nextBtn = document.querySelector('.testimonial-next');
        let currentSlide = 0;
        let slideInterval;
        let touchStartX = 0;
        let touchEndX = 0;

        const showSlide = index => {
            // Hide all slides
            slides.forEach(slide => {
                slide.classList.remove('active');
                slide.style.opacity = 0;
                slide.style.transform = 'translateY(20px) scale(0.95)';
            });
            
            // Deactivate all dots
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Show selected slide with animation
            setTimeout(() => {
                slides[index].classList.add('active');
                slides[index].style.opacity = 1;
                slides[index].style.transform = 'translateY(0) scale(1)';
                dots[index].classList.add('active');
                currentSlide = index;
            }, 50);
        };

        // Set up click handlers for next/prev buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                showSlide((currentSlide - 1 + slides.length) % slides.length);
                resetInterval();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showSlide((currentSlide + 1) % slides.length);
                resetInterval();
            });
        }

        // Set up click handlers for dots
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                showSlide(i);
                resetInterval();
            });
        });

        // Setup swipe functionality for mobile
        const testimonialContainer = document.querySelector('.testimonial-container');
        if (testimonialContainer) {
            testimonialContainer.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            testimonialContainer.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });
        }

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left, go to next slide
                showSlide((currentSlide + 1) % slides.length);
                resetInterval();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right, go to previous slide
                showSlide((currentSlide - 1 + slides.length) % slides.length);
                resetInterval();
            }
        }

        // Start automatic sliding
        startInterval();

        function startInterval() {
            slideInterval = setInterval(() => {
                showSlide((currentSlide + 1) % slides.length);
            }, 5000);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }
    }

    function setupTiltEffect() {
        const tiltCards = document.querySelectorAll('.tilt-card');
        
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', handleTilt);
            card.addEventListener('mouseleave', resetTilt);
        });
        
        function handleTilt(e) {
            const card = this;
            const cardRect = card.getBoundingClientRect();
            const centerX = cardRect.left + cardRect.width / 2;
            const centerY = cardRect.top + cardRect.height / 2;
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // Calculate rotation based on mouse position relative to card center
            const rotateY = ((mouseX - centerX) / (cardRect.width / 2)) * 5;
            const rotateX = -((mouseY - centerY) / (cardRect.height / 2)) * 5;
            
            // Apply the rotation
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            // Add a slight glow effect on hover
            const intensity = Math.sqrt(Math.pow(rotateX, 2) + Math.pow(rotateY, 2)) / 5;
            card.style.boxShadow = `0 10px 30px rgba(0, 0, 0, 0.1), 
                                    ${rotateY / 2}px ${rotateX / 2}px 15px rgba(var(--primary-color-rgb), 0.2)`;
        }
        
        function resetTilt() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            this.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.1)';
        }
    }

    return {
        init
    };
})();