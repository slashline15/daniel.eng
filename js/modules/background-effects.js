const BackgroundEffects = (function() {
    'use strict';
    
    let particles = [];
    const config = {
        particleCount: 50,
        particleSpeed: 15
    };
    
    function init() {
        createBackgroundLayers();
        createParticles();
        startAnimation();
    }
    
    function createBackgroundLayers() {
        // Criar container para efeitos
        const bgEffect = document.createElement('div');
        bgEffect.className = 'background-effect';
        bgEffect.innerHTML = `
            <div class="gradient-layer"></div>
            <div class="particles-layer" id="particles"></div>
        `;
        
        // Inserir como primeiro elemento do body
        document.body.insertBefore(bgEffect, document.body.firstChild);
    }
    
    function createParticles() {
        const container = document.getElementById('particles');
        
        for (let i = 0; i < config.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * config.particleSpeed + 's';
            container.appendChild(particle);
            particles.push(particle);
        }
    }
    
    return { init };
})();