// Alternativa para component-loader.js
document.addEventListener('DOMContentLoaded', function() {
    // Carrega cada componente de forma síncrona para garantir ordem
    const componentMap = {
        'header-container': 'header.html',
        'hero-container': 'hero-section.html',
        'about-container': 'about-section.html',
        'stats-container': 'stats-section.html',
        'skills-container': 'skills-section.html',
        'projects-container': 'projects-section.html',
        'testimonials-container': 'testimonials-section.html',
        'economy-container': 'economy-simulator-section.html',
        'contact-container': 'contact-section.html',
        'creative-modal-container': 'creative-modal.html',
        'footer-container': 'footer.html',
        'clippy-container': 'clippy-assistant.html'
    };

    // Carrega os componentes sequencialmente
    const loadComponentsInOrder = async () => {
        for (const [containerId, filename] of Object.entries(componentMap)) {
            try {
                const response = await fetch(`components/${filename}`);
                if (!response.ok) throw new Error(`Falha ao carregar ${filename}`);
                const html = await response.text();
                
                const container = document.getElementById(containerId);
                if (container) container.innerHTML = html;
            } catch (error) {
                console.error(error);
            }
        }

        // Inicializa os módulos após carregar todos os componentes
        console.log('Todos os componentes carregados, inicializando módulos...');
        initializeAllModules();
        
        // Força inicialização das partículas
        if (typeof Particles !== 'undefined') {
            setTimeout(() => Particles.init(), 100);
        }
    };

    loadComponentsInOrder();
});