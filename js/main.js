/**
 * Script principal - page-modulos
 * Arquivo principal que inicializa todos os módulos da aplicação
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
 */
function initializeAllModules() {
    // Verifica se cada módulo existe antes de inicializá-lo
    if (typeof Navigation !== 'undefined') Navigation.init();
    if (typeof SmoothScroll !== 'undefined') SmoothScroll.init();
    if (typeof TypeEffect !== 'undefined') TypeEffect.init();
    if (typeof AnimationEffects !== 'undefined') AnimationEffects.init();
    if (typeof SkillBars !== 'undefined') SkillBars.init();
    if (typeof Particles !== 'undefined') Particles.init();
    if (typeof ScrollEffects !== 'undefined') ScrollEffects.init();
    if (typeof Counters !== 'undefined') Counters.init();
    if (typeof ProjectFilter !== 'undefined') ProjectFilter.init();
    if (typeof TestimonialSlider !== 'undefined') TestimonialSlider.init();
    if (typeof DarkMode !== 'undefined') DarkMode.init();
    if (typeof TiltEffect !== 'undefined') TiltEffect.init();
    if (typeof CreativeModal !== 'undefined') CreativeModal.init();
    if (typeof ClippyAssistant !== 'undefined') ClippyAssistant.init();
    if (typeof EconomySimulator !== 'undefined') EconomySimulator.init();

    console.log('Todos os módulos inicializados com sucesso!');
    window.modulesInitialized = true;
}
// Adicione ao final de main.js
window.addEventListener('load', function () {
    if (typeof Particles !== 'undefined') {
        setTimeout(function () {
            console.log("Forçando inicialização das partículas");
            Particles.init();
        }, 500);
    }
});