/**
 * Módulo AI Assistant
 * Gerencia o chatbot com IA integrada
 */
const AIAssistant = (function() {
    'use strict';
    
    // Estado do módulo
    const state = {
        isOpen: false,
        messages: [],
        isTyping: false
    };
    
    // Configurações
    const config = {
        typingDelay: 1000,
        welcomeMessage: 'Olá! 👋 Sou seu assistente virtual. Como posso ajudar você hoje?',
        apiEndpoint: null // Configurar com sua API de IA
    };
    
    // Respostas locais (fallback)
    const localResponses = {
        'oi': 'Olá! Como vai? 😊',
        'olá': 'Oi! Prazer em falar com você!',
        'projetos': 'Tenho experiência com Revit, Navisworks e desenvolvimento de soluções com IA. Qual área te interessa mais?',
        'revit': 'Trabalho com modelagem BIM avançada no Revit, incluindo famílias paramétricas e coordenação 3D.',
        'navisworks': 'Uso o Navisworks para coordenação de projetos, detecção de conflitos e criação de animações 4D.',
        'ia': 'Desenvolvo soluções com IA para automação de processos e análise de dados. Posso criar chatbots, sistemas de recomendação e muito mais!',
        'contato': 'Você pode me contatar através do formulário no site ou pelo WhatsApp. Ficarei feliz em conversar sobre seu projeto!',
        'preço': 'Os valores variam conforme a complexidade do projeto. Que tal conversarmos sobre suas necessidades específicas?',
        'default': 'Interessante! Pode me contar mais sobre isso? Ou se preferir, posso falar sobre meus projetos, experiência com Revit/BIM ou desenvolvimento com IA.'
    };
    
    /**
     * Inicializa o módulo
     */
    function init() {
        const chatElement = document.getElementById('aiChat');
        if (!chatElement) {
            console.warn('AI Assistant: Elemento #aiChat não encontrado');
            return;
        }
        
        setupEventListeners();
        addMessage(config.welcomeMessage, 'bot');
    }
    
    /**
     * Configura os event listeners
     */
    function setupEventListeners() {
        const toggleBtn = document.getElementById('chatToggle');
        const closeBtn = document.getElementById('closeChat');
        const sendBtn = document.getElementById('sendMessage');
        const input = document.getElementById('messageInput');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggleChat);
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeChat);
        }
        
        if (sendBtn) {
            sendBtn.addEventListener('click', handleSendMessage);
        }
        
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                }
            });
        }
    }
    
    /**
     * Alterna visibilidade do chat
     */
    function toggleChat() {
        state.isOpen = !state.isOpen;
        const chatWindow = document.getElementById('chatWindow');
        
        if (chatWindow) {
            if (state.isOpen) {
                chatWindow.classList.add('active');
                document.getElementById('messageInput')?.focus();
            } else {
                chatWindow.classList.remove('active');
            }
        }
    }
    
    /**
     * Fecha o chat
     */
    function closeChat() {
        state.isOpen = false;
        const chatWindow = document.getElementById('chatWindow');
        if (chatWindow) {
            chatWindow.classList.remove('active');
        }
    }
    
    /**
     * Processa envio de mensagem
     */
    async function handleSendMessage() {
        const input = document.getElementById('messageInput');
        const message = input?.value.trim();
        
        if (!message || state.isTyping) return;
        
        // Adiciona mensagem do usuário
        addMessage(message, 'user');
        input.value = '';
        
        // Mostra indicador de digitação
        showTypingIndicator();
        
        // Obtém resposta
        const response = await getResponse(message);
        
        // Remove indicador e adiciona resposta
        hideTypingIndicator();
        addMessage(response, 'bot');
    }
    
    /**
     * Obtém resposta da IA ou fallback local
     */
    async function getResponse(message) {
        // Se tiver API configurada, tenta usar
        if (config.apiEndpoint) {
            try {
                const response = await fetch(config.apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    return data.response || data.message || localResponses.default;
                }
            } catch (error) {
                console.error('AI Assistant: Erro na API', error);
            }
        }
        
        // Fallback para respostas locais
        return getLocalResponse(message);
    }
    
    /**
     * Obtém resposta local baseada em palavras-chave
     */
    function getLocalResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Procura por palavras-chave
        for (const [key, response] of Object.entries(localResponses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }
        
        return localResponses.default;
    }
    
    /**
     * Adiciona mensagem ao chat
     */
    function addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = text;
        
        messageDiv.appendChild(bubble);
        messagesContainer.appendChild(messageDiv);
        
        // Anima entrada
        requestAnimationFrame(() => {
            messageDiv.classList.add('fade-in');
        });
        
        // Scroll para última mensagem
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Adiciona ao estado
        state.messages.push({ text, sender, timestamp: Date.now() });
    }
    
    /**
     * Mostra indicador de digitação
     */
    function showTypingIndicator() {
        state.isTyping = true;
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing-indicator';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-bubble">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    /**
     * Remove indicador de digitação
     */
    function hideTypingIndicator() {
        state.isTyping = false;
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    /**
     * API pública do módulo
     */
    return {
        init,
        toggle: toggleChat,
        close: closeChat,
        sendMessage: handleSendMessage,
        setApiEndpoint: (endpoint) => { config.apiEndpoint = endpoint; },
        getMessages: () => [...state.messages]
    };
})();