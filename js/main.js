/**
 * Script principal - Inicializa todos os módulos da aplicação
 */

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM carregado: main.js iniciado");
    
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
    console.log("Inicializando todos os módulos...");
    
    // 1. Primeiro inicializa o Dark Mode para que a aparência correta seja aplicada desde o início
    if (typeof DarkMode !== 'undefined') {
        console.log("Inicializando DarkMode...");
        DarkMode.init();
    } else {
        console.warn("Módulo DarkMode não encontrado!");
    }

    // 2. Inicializa o sistema de animações centralizado (substitui vários módulos antigos)
    if (typeof Animations !== 'undefined') {
        console.log("Inicializando Animations...");
        Animations.init();
    } else {
        console.warn("Módulo Animations não encontrado!");
    }

    // 3. Inicializa o módulo de galeria
    if (typeof ProjectGallery !== 'undefined') {
        console.log("Inicializando ProjectGallery...");
        ProjectGallery.init();
    } else {
        console.warn("Módulo ProjectGallery não encontrado!");
    }

    // 4. Inicializa outros módulos
    initializeModule('Navigation');
    initializeModule('SmoothScroll');
    initializeModule('ProjectFilter');
    initializeModule('TestimonialSlider');
    initializeModule('CreativeModal');
    initializeModule('ClippyAssistant');
    initializeModule('EconomySimulator');
    initializeModule('Particles');

    console.log('Todos os módulos inicializados com sucesso!');
    window.modulesInitialized = true;
    
    // Força um check de animações após tudo estar carregado
    setTimeout(function() {
        if (typeof Animations !== 'undefined') {
            Animations.checkAndAnimateElements();
        }
    }, 500);
}

/**
 * Função helper para inicializar um módulo com tratamento de erro
 */
function initializeModule(moduleName) {
    if (typeof window[moduleName] !== 'undefined') {
        console.log(`Inicializando ${moduleName}...`);
        try {
            window[moduleName].init();
        } catch(e) {
            console.error(`Erro ao inicializar ${moduleName}:`, e);
        }
    } else {
        console.warn(`Módulo ${moduleName} não encontrado!`);
    }
}

// Quando a página estiver completamente carregada
window.addEventListener('load', function () {
    console.log("Página totalmente carregada!");
    
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