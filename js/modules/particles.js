const Particles = (function () {
    let particles = [];
    let resizeTimer;

    function init() {
        const heroContainer = document.querySelector('.hero .particle-background');
        const testimonialContainer = document.querySelector('#testimonials .particle-background');
        
        if (heroContainer) {
            createParticles(heroContainer, 'hero');
        }
        
        if (testimonialContainer) {
            createParticles(testimonialContainer, 'testimonials');
        }
        
        animateParticles();
        handleWindowResize();
    }

    function createParticles(container, section) {
        if (!container) return;

        // Remove existing particles (useful when resizing)
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // Adjust particle count and styles based on section and screen size
        const isMobile = window.innerWidth <= 768;
        const particleCount = isMobile ? 8 : 15;
        const colors = section === 'testimonials' 
            ? ['rgba(66, 133, 244, 0.2)', 'rgba(52, 168, 83, 0.2)', 'rgba(251, 188, 5, 0.2)']
            : ['rgba(66, 133, 244, 0.2)'];

        // Create new particles
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Smaller size on mobile devices
            const maxSize = isMobile ? 30 : 50;
            const minSize = isMobile ? 5 : 10;
            const size = Math.random() * (maxSize - minSize) + minSize;
            
            // Randomly select color for testimonials section
            if (section === 'testimonials') {
                const colorIndex = Math.floor(Math.random() * colors.length);
                particle.style.backgroundColor = colors[colorIndex];
            }

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            // Add a subtle pulse animation for some particles
            if (Math.random() > 0.7) {
                particle.style.animation = `float ${Math.random() * 10 + 10}s infinite ease-in-out, pulse 3s infinite alternate`;
            }
            
            container.appendChild(particle);
            
            // Store particle reference
            particles.push({
                element: particle,
                // Add random movement values
                xMovement: Math.random() * 0.5 - 0.25,
                yMovement: Math.random() * 0.5 - 0.25,
                section: section,
                container: container
            });
        }
        
        // Add pulse animation to CSS if it doesn't exist
        if (!document.querySelector('#pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'pulse-animation';
            style.textContent = `
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.7; }
                    100% { transform: scale(1.1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function animateParticles() {
        // Only apply direct JS animation if CSS animations aren't working properly
        // This function ensures particles are moving even if CSS animations fail
        function updateParticles() {
            particles.forEach(particle => {
                const rect = particle.container.getBoundingClientRect();
                const currentLeft = parseFloat(particle.element.style.left);
                const currentTop = parseFloat(particle.element.style.top);
                
                // Update positions
                let newLeft = currentLeft + particle.xMovement;
                let newTop = currentTop + particle.yMovement;
                
                // Boundary checks and reverse direction if needed
                if (newLeft <= 0 || newLeft >= 100) {
                    particle.xMovement *= -1;
                    newLeft = currentLeft;
                }
                
                if (newTop <= 0 || newTop >= 100) {
                    particle.yMovement *= -1;
                    newTop = currentTop;
                }
                
                // Apply new position
                particle.element.style.left = `${newLeft}%`;
                particle.element.style.top = `${newTop}%`;
            });
            
            requestAnimationFrame(updateParticles);
        }
        
        // Start the animation loop
        updateParticles();
    }

    function handleWindowResize() {
        window.addEventListener('resize', function () {
            // Use debounce to prevent too many calls during resizing
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                particles = []; // Clear particles array
                
                const heroContainer = document.querySelector('.hero .particle-background');
                const testimonialContainer = document.querySelector('#testimonials .particle-background');
                
                if (heroContainer) {
                    createParticles(heroContainer, 'hero');
                }
                
                if (testimonialContainer) {
                    createParticles(testimonialContainer, 'testimonials');
                }
            }, 200);
        });
    }

    return {
        init
    };
})();