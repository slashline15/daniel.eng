/**
 * Script principal - Inicializa todos os módulos da aplicação
 */

document.addEventListener('DOMContentLoaded', function () {
    // Verificamos se o componentLoader está ativo
    if (typeof ComponentLoader !== 'undefined') {
        // Se o componentLoader estiver sendo usado, ele vai cuidar da inicialização
        // Vamos apenas configurar um backup caso algo dê errado
        setTimeout(function () {
            if (!window.modulesInitialized) {
                console.warn('Component Loader não inicializou os módulos. Inicializando manualmente...');
                initializeAllModules();
            }
        }, 2000); // Espera 2 segundos antes de verificar
    } else {
        // Inicialização tradicional se o ComponentLoader não estiver presente
        initializeAllModules();
    }
});

/**
 * Inicializa todos os módulos da aplicação
 * Ordem de inicialização importa aqui!
 */
function initializeAllModules() {
    // 1. Primeiro inicializa o Dark Mode para que a aparência correta seja aplicada desde o início
    if (typeof DarkMode !== 'undefined') DarkMode.init();

    // 2. Inicializa o sistema de animações centralizado (substitui vários módulos antigos)
    if (typeof Animations !== 'undefined') Animations.init();

    // 3. Inicializa outros módulos
    if (typeof Navigation !== 'undefined') Navigation.init();
    if (typeof SmoothScroll !== 'undefined') SmoothScroll.init();
    if (typeof ProjectGallery !== 'undefined') ProjectGallery.init();
    if (typeof TestimonialSlider !== 'undefined') TestimonialSlider.init();
    if (typeof CreativeModal !== 'undefined') CreativeModal.init();
    if (typeof ClippyAssistant !== 'undefined') ClippyAssistant.init();
    if (typeof EconomySimulator !== 'undefined') EconomySimulator.init();
    if (typeof Particles !== 'undefined') Particles.init();

    console.log('Todos os módulos inicializados com sucesso!');
    window.modulesInitialized = true;
    
    // Força um check de animações após tudo estar carregado
    setTimeout(function() {
        if (typeof Animations !== 'undefined') {
            Animations.checkAndAnimateElements();
        }
    }, 500);
}

// Quando a página estiver completamente carregada
window.addEventListener('load', function () {
    // Força a inicialização das partículas para garantir
    if (typeof Particles !== 'undefined') {
        setTimeout(function () {
            console.log("Forçando inicialização das partículas");
            Particles.init();
        }, 500);
    }
    
    // Força um check final de animações
    if (typeof Animations !== 'undefined') {
        Animations.checkAndAnimateElements();
    }
});