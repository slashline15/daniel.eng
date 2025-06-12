// ===== ATUALIZAÇÃO 1: component-loader.js =====
// Adicionar ao array de componentes:

{
    containerId: 'ai-assistant-container',
    componentPath: 'components/ai-assistant.html'
}

// ===== ATUALIZAÇÃO 2: index.html =====
// Adicionar antes do fechamento do body:

<!-- Container para AI Assistant -->
<div id="ai-assistant-container"></div>

// ===== ATUALIZAÇÃO 3: main.js =====
// Adicionar após os outros módulos:

// AI Assistant
if (typeof AIAssistant !== 'undefined') {
    AIAssistant.init();
}

// ===== ATUALIZAÇÃO 4: main.css =====
// Adicionar imports no início do arquivo:

/* Novos efeitos visuais */
@import url('effects/glassmorphism.css');
@import url('effects/background.css');

/* AI Assistant */
@import url('components/ai-assistant.css');

// ===== ATUALIZAÇÃO 5: Criar background-effects.js =====

/**
 * Módulo de Efeitos de Background
 * Cria gradientes animados e partículas
 */
const BackgroundEffects = (function() {
    'use strict';
    
    const config = {
        particleCount: 30, // Menos partículas para melhor performance
        animationDuration: 20
    };
    
    function init() {
        // Verifica se já existe para evitar duplicação
        if (document.querySelector('.background-effect')) return;
        
        createBackgroundContainer();
        createParticles();
        
        // Reduz partículas em mobile
        if (window.innerWidth < 768) {
            config.particleCount = 15;
        }
    }
    
    function createBackgroundContainer() {
        const container = document.createElement('div');
        container.className = 'background-effect';
        
        // Gradiente animado
        const gradientLayer = document.createElement('div');
        gradientLayer.className = 'gradient-layer';
        
        // Container de partículas
        const particlesLayer = document.createElement('div');
        particlesLayer.className = 'particles-layer';
        particlesLayer.id = 'particles';
        
        container.appendChild(gradientLayer);
        container.appendChild(particlesLayer);
        
        // Inserir como primeiro elemento do body
        document.body.insertBefore(container, document.body.firstChild);
    }
    
    function createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        
        for (let i = 0; i < config.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Posição aleatória
            particle.style.left = Math.random() * 100 + '%';
            
            // Delay e duração aleatórios
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            
            // Tamanho variado
            const size = 2 + Math.random() * 4;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            container.appendChild(particle);
        }
    }
    
    // API pública
    return { init };
})();

// ===== PASSO A PASSO DE IMPLEMENTAÇÃO =====

/**
 * 1. BACKUP
 * ----------
 * cp -r css css_backup_$(date +%Y%m%d)
 * cp -r js js_backup_$(date +%Y%m%d)
 * cp index.html index_backup_$(date +%Y%m%d).html
 */

/**
 * 2. CRIAR ESTRUTURA DE PASTAS
 * -----------------------------
 * mkdir -p css/effects
 * mkdir -p js/modules
 */

/**
 * 3. ORDEM DE IMPLEMENTAÇÃO
 * -------------------------
 * 
 * FASE 1 - CSS Base (10 min):
 * [ ] Atualizar variables.css com novas cores
 * [ ] Criar effects/glassmorphism.css
 * [ ] Criar effects/background.css
 * [ ] Atualizar dark-mode.css
 * 
 * FASE 2 - Componente AI (15 min):
 * [ ] Criar components/ai-assistant.html
 * [ ] Criar css/components/ai-assistant.css  
 * [ ] Criar js/modules/ai-assistant.js
 * [ ] Adicionar ao component-loader.js
 * 
 * FASE 3 - Efeitos Visuais (10 min):
 * [ ] Criar js/modules/background-effects.js
 * [ ] Atualizar main.js com novos módulos
 * [ ] Adicionar container no index.html
 * 
 * FASE 4 - Testes (5 min):
 * [ ] Verificar console por erros
 * [ ] Testar chat AI
 * [ ] Verificar responsividade
 * [ ] Checar performance
 */

/**
 * 4. CHECKLIST DE VERIFICAÇÃO
 * ---------------------------
 * [ ] Site carrega sem erros?
 * [ ] Dark mode continua funcionando?
 * [ ] Navegação está ok?
 * [ ] Chat AI abre/fecha corretamente?
 * [ ] Efeitos visuais aparecem?
 * [ ] Performance aceitável?
 * [ ] Mobile responsivo?
 */