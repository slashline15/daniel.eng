/**
 * Módulo de Animações Centralizado
 * Controla todas as animações do site de forma coordenada.
 */

const Animations = (function() {
    // Configurações
    const config = {
        // Threshold para animações baseadas em scroll (0-1)
        // 0 = ativa assim que qualquer parte do elemento entra na viewport
        // 1 = só ativa quando o elemento está 100% visível
        scrollThreshold: 0.2,
        
        // Quanto tempo (ms) esperar antes de executar scroll handlers
        scrollDebounce: 10,
        
        // Por padrão, animar elementos on-load ou só on-scroll?
        animateOnLoad: true,
        
        // Classe aplicada aos elementos quando devem aparecer
        appearClass: 'appear',
        
        // Seletores de elementos que serão animados
        animatedElementSelectors: '.fade-in, .slide-in-left, .slide-in-right, .zoom-in'
    };
    
    // Estado interno
    let state = {
        initialized: false,
        scrollY: 0,
        viewportHeight: 0,
        elements: [],
        scrollTimeout: null,
        isScrolling: false
    };
    
    /**
     * Inicializa o módulo de animações
     */
    function init() {
        if (state.initialized) return;
        
        // Atualiza dimensões
        updateDimensions();
        
        // Coleta todos os elementos animáveis
        collectAnimatableElements();
        
        // Inicia os listeners
        setupEventListeners();
        
        // Aplica animações iniciais (se configurado)
        if (config.animateOnLoad) {
            setTimeout(checkAndAnimateElements, 100);
        }
        
        // Inicializa os sub-módulos de animação
        initTypeEffect();
        initParallaxEffect();
        initTiltEffect();
        initScrollProgress();
        
        state.initialized = true;
        console.log('Módulo de animações inicializado');
    }
    
    /**
     * Coleta todos os elementos que devem receber animações
     */
    function collectAnimatableElements() {
        const elements = document.querySelectorAll(config.animatedElementSelectors);
        state.elements = Array.from(elements);
        
        // Adiciona data attributes úteis para as animações
        state.elements.forEach(el => {
            // Se não tiver data-animation, tenta inferir do nome da classe
            if (!el.dataset.animation) {
                if (el.classList.contains('slide-in-left')) {
                    el.dataset.animation = 'slide-in-left';
                } else if (el.classList.contains('slide-in-right')) {
                    el.dataset.animation = 'slide-in-right';
                } else if (el.classList.contains('zoom-in')) {
                    el.dataset.animation = 'zoom-in';
                } else {
                    el.dataset.animation = 'fade-in';
                }
            }
            
            // Define se já foi animado
            if (!el.dataset.animated) {
                el.dataset.animated = "false";
            }
        });
    }
    
    /**
     * Configura os event listeners
     */
    function setupEventListeners() {
        // Scroll handler com debounce para melhor performance
        window.addEventListener('scroll', handleScroll);
        
        // Atualiza dimensões quando a janela é redimensionada
        window.addEventListener('resize', function() {
            updateDimensions();
            checkAndAnimateElements();
        });
        
        // Também verifica quando o dark mode é toggled,
        // já que isso pode causar mudanças de layout
        document.addEventListener('themeChanged', checkAndAnimateElements);
    }
    
    /**
     * Atualiza dimensões da viewport
     */
    function updateDimensions() {
        state.viewportHeight = window.innerHeight;
        state.scrollY = window.scrollY;
    }
    
    /**
     * Manipula evento de scroll com debounce para performance
     */
    function handleScroll() {
        state.scrollY = window.scrollY;
        
        if (!state.isScrolling) {
            window.requestAnimationFrame(function() {
                checkAndAnimateElements();
                state.isScrolling = false;
            });
            
            state.isScrolling = true;
        }
    }
    
    /**
     * Verifica quais elementos estão visíveis e aplica animações
     */
    function checkAndAnimateElements() {
        if (!state.elements.length) return;
        
        state.elements.forEach(el => {
            // Pula elementos que já foram animados
            if (el.dataset.animated === "true") return;
            
            if (isElementInViewport(el)) {
                animateElement(el);
                
                // Se for uma seção de estatísticas, também inicia os contadores
                if (el.closest('.stats-section')) {
                    startCounters();
                }
            }
        });
    }
    
    /**
     * Verifica se um elemento está visível na viewport
     */
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        const verticalVisible = 
            rect.top <= (state.viewportHeight * (1 - config.scrollThreshold)) &&
            rect.bottom >= (state.viewportHeight * config.scrollThreshold);
            
        return verticalVisible;
    }
    
    /**
     * Anima um elemento específico
     */
    function animateElement(el) {
        // Marca como animado para não repetir
        el.dataset.animated = "true";
        
        // Aplica classe de aparecimento
        el.classList.add(config.appearClass);
        
        // Aplica animação específica, se definida
        const animation = el.dataset.animation;
        if (animation && !el.classList.contains(animation)) {
            el.classList.add(animation);
        }
    }
    
    /**
     * Reinicia as animações (útil para mudanças de página SPA)
     */
    function resetAnimations() {
        state.elements.forEach(el => {
            el.classList.remove(config.appearClass);
            el.dataset.animated = "false";
        });
        
        collectAnimatableElements();
        checkAndAnimateElements();
    }
    
    // ======== SUB-MÓDULOS DE ANIMAÇÃO ========
    
    /**
     * Animação de digitação para textos
     */
    function initTypeEffect() {
        const typingElement = document.getElementById('typing-text');
        if (!typingElement) return;
        
        const phrases = [
            'Engenheiro Civil',
            'Especialista em IA',
            'Gestor de Projetos',
            'Inovador em Construção'
        ];
        
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        
        function type() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }
            
            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 1000; // Pausa antes de começar a deletar
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500; // Pausa antes da próxima frase
            }
            
            setTimeout(type, typingSpeed);
        }
        
        // Adiciona cursor de digitação
        const cursorSpan = document.createElement('span');
        cursorSpan.className = 'typing-cursor';
        typingElement.parentNode.insertBefore(cursorSpan, typingElement.nextSibling);
        
        // Inicia a animação
        setTimeout(type, 1000);
    }
    
    /**
     * Efeito de parallax em fundos
     */
    function initParallaxEffect() {
        const parallaxBgs = document.querySelectorAll('.parallax-bg');
        if (!parallaxBgs.length) return;
        
        function updateParallax() {
            parallaxBgs.forEach(bg => {
                const section = bg.closest('.parallax-section');
                if (!section) return;
                
                const sectionTop = section.getBoundingClientRect().top;
                const offset = sectionTop * 0.4;
                bg.style.transform = `translateY(${offset}px)`;
            });
        }
        
        // Adiciona ao handler de scroll
        window.addEventListener('scroll', updateParallax);
        // Executa uma vez no início
        updateParallax();
    }
    
    /**
     * Efeito tilt em cartões
     */
    function initTiltEffect() {
        const tiltCards = document.querySelectorAll('.tilt-card');
        if (!tiltCards.length) return;
        
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
            
            // Calcular rotação baseada na posição do mouse
            const rotateY = ((mouseX - centerX) / (cardRect.width / 2)) * 5;
            const rotateX = -((mouseY - centerY) / (cardRect.height / 2)) * 5;
            
            // Aplicar a rotação
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            // Adicionar um leve efeito de brilho
            const intensity = Math.sqrt(Math.pow(rotateX, 2) + Math.pow(rotateY, 2)) / 5;
            card.style.boxShadow = `0 10px 30px rgba(0, 0, 0, 0.1), 
                                ${rotateY / 2}px ${rotateX / 2}px 15px rgba(var(--primary-color-rgb), 0.2)`;
            
            // Se houver um elemento interno, eleva-o um pouco
            const inner = card.querySelector('.tilt-card-inner');
            if (inner) {
                inner.style.transform = 'translateZ(40px)';
            }
        }
        
        function resetTilt() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            this.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.1)';
            
            const inner = this.querySelector('.tilt-card-inner');
            if (inner) {
                inner.style.transform = 'translateZ(20px)';
            }
        }
    }
    
    /**
     * Barra de progresso de scroll
     */
    function initScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress-bar');
        if (!progressBar) return;
        
        function updateScrollProgress() {
            const scrollPercent = (window.scrollY / (document.body.offsetHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrollPercent + '%';
        }
        
        window.addEventListener('scroll', updateScrollProgress);
        updateScrollProgress(); // Atualiza uma vez no início
    }
    
    /**
     * Inicia animação de contadores
     */
    function startCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            // Pula se já foi animado
            if (counter.dataset.animated === "true") return;
            
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 segundos
            const stepTime = 20; // 20ms entre passos
            const totalSteps = duration / stepTime;
            
            let current = 0;
            let step = target / totalSteps;
            
            const updateCounter = () => {
                current += step;
                
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    setTimeout(updateCounter, stepTime);
                } else {
                    counter.textContent = target;
                    counter.dataset.animated = "true";
                }
            };
            
            updateCounter();
        });
    }
    
    // API pública
    return {
        init,
        resetAnimations,
        checkAndAnimateElements,
        startCounters
    };
})();