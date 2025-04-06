/**
 * Sistema de Carregamento de Componentes
 * Carrega os componentes HTML de forma assíncrona e controlada,
 * garantindo que eles sejam inicializados na ordem correta.
 */
const ComponentLoader = (function() {
    // Configuração: mapeamento de containerId para arquivo de componente
    const componentMap = {
        'header-container': 'header.html',
        'hero-container': 'hero-section.html',
        'about-container': 'about-section.html',
        'stats-container': 'stats-section.html',
        'skills-container': 'skills-section.html',
        'projects-container': 'project-section.html',
        'testimonials-container': 'testimonials-section.html',
        'economy-container': 'economy-simulator-section.html',
        'contact-container': 'contact-section.html',
        'creative-modal-container': 'creative-modal.html',
        'footer-container': 'footer.html',
        'clippy-container': 'clippy-assistant.html'
    };

    // Estado do carregador
    const state = {
        loaded: 0,
        total: Object.keys(componentMap).length,
        componentsLoaded: {},
        startTime: 0,
        loadComplete: false
    };

    /**
     * Inicializa o carregamento de componentes
     */
    function init() {
        console.log("ComponentLoader: Iniciando carregamento...");
        state.startTime = performance.now();
        state.loaded = 0;
        state.loadComplete = false;
        
        // Primeiro verificamos se os containers existem
        for (const containerId in componentMap) {
            if (!document.getElementById(containerId)) {
                console.warn(`Container #${containerId} não encontrado no DOM. Componente não será carregado.`);
                state.total--;
                state.componentsLoaded[containerId] = false;
            } else {
                state.componentsLoaded[containerId] = false;
            }
        }

        // Começamos a carregar componentes em paralelo
        loadAllComponents()
            .then(() => {
                state.loadComplete = true;
                const loadTime = (performance.now() - state.startTime).toFixed(2);
                console.log(`✅ Todos os componentes carregados em ${loadTime}ms`);
                
                // Inicializa módulos JS após carregar todos os componentes
                initializeAllModules();
            })
            .catch(error => {
                console.error('❌ Erro ao carregar componentes:', error);
                
                // Ainda assim tenta inicializar para que o site funcione parcialmente
                initializeAllModules();
            });
    }

    /**
     * Carrega todos os componentes em paralelo, mas mantém o controle da ordem
     */
    async function loadAllComponents() {
        const loadPromises = [];

        // Lançamos todas as requisições em paralelo
        for (const [containerId, filename] of Object.entries(componentMap)) {
            // Pulamos containers que não existem
            if (!state.componentsLoaded.hasOwnProperty(containerId) || 
                state.componentsLoaded[containerId] === false && 
                !document.getElementById(containerId)) {
                continue;
            }

            // Criamos uma promise para cada componente
            const promise = loadComponent(containerId, filename)
                .then(() => {
                    state.loaded++;
                    state.componentsLoaded[containerId] = true;
                    updateLoadProgress();
                })
                .catch(error => {
                    console.error(`❌ Erro ao carregar ${filename} para #${containerId}:`, error);
                    state.componentsLoaded[containerId] = false;
                });

            loadPromises.push(promise);
        }

        // Aguarda todas as promises serem resolvidas
        return Promise.all(loadPromises);
    }

    /**
     * Carrega um componente individual
     */
    async function loadComponent(containerId, filename) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                throw new Error(`Container #${containerId} não encontrado`);
            }

            console.log(`Carregando componente: ${filename} para #${containerId}`);
            const response = await fetch(`components/${filename}`);
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const html = await response.text();
            container.innerHTML = html;
            return true;
        } catch (error) {
            console.error(`❌ Erro ao carregar ${filename}:`, error);
            throw error;
        }
    }

    /**
     * Atualiza o progresso de carregamento (pode ser usado para uma barra de progresso)
     */
    function updateLoadProgress() {
        // Calcula a porcentagem de componentes carregados
        const progress = Math.floor((state.loaded / state.total) * 100);
        
        // Log de progresso a cada 25%
        if (progress % 25 === 0) {
            console.log(`📦 Componentes: ${progress}% carregados (${state.loaded}/${state.total})`);
        }
    }

    /**
     * Chama a função de inicialização de módulos definida no main.js
     */
    function initializeAllModules() {
        // Verifica se a função de inicialização existe no escopo global
        if (typeof window.initializeAllModules === 'function') {
            window.initializeAllModules();
        } else {
            console.warn('❓ Função initializeAllModules() não encontrada. Os módulos não serão inicializados automaticamente.');
        }
        
        // Define uma flag global para sinalizar que os módulos foram inicializados
        window.modulesInitialized = true;
    }

    /**
     * Recarrega um componente específico (útil para atualização dinâmica)
     */
    async function reloadComponent(containerId) {
        if (!componentMap[containerId]) {
            console.error(`❌ Componente não registrado para o container #${containerId}`);
            return false;
        }

        try {
            await loadComponent(containerId, componentMap[containerId]);
            console.log(`🔄 Componente #${containerId} recarregado com sucesso`);
            return true;
        } catch (error) {
            console.error(`❌ Falha ao recarregar componente #${containerId}:`, error);
            return false;
        }
    }

    /**
     * Registra um novo componente dinamicamente
     */
    function registerComponent(containerId, filename) {
        componentMap[containerId] = filename;
        state.total = Object.keys(componentMap).length;
        state.componentsLoaded[containerId] = false;
        
        console.log(`✨ Novo componente registrado: #${containerId} -> ${filename}`);
        return true;
    }

    // API pública
    return {
        init,
        reloadComponent,
        registerComponent,
        getLoadStatus: () => ({ 
            loaded: state.loaded, 
            total: state.total, 
            complete: state.loadComplete 
        })
    };
})();

// Auto-inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM carregado, iniciando ComponentLoader...");
    ComponentLoader.init();
});