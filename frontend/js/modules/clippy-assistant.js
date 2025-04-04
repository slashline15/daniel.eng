const ClippyAssistant = (function () {
    function init() {
        const clippy = document.getElementById('clippy');
        const chatBox = document.getElementById('clippy-chat');
        const input = document.getElementById('clippy-input');
        const closeChat = document.querySelector('.close-chat');

        if (!clippy || !chatBox || !input) return;

        setupResponsiveness();
        setupClippyInteraction(clippy, chatBox, input);
        
        if (closeChat) {
            closeChat.addEventListener('click', function() {
                chatBox.style.display = 'none';
            });
        }
    }

    function setupResponsiveness() {
        // Ajusta o tamanho dos ícones em dispositivos móveis
        function adjustSize() {
            const isMobile = window.innerWidth <= 768;
            const clippy = document.getElementById('clippy');
            const whatsappIcon = document.getElementById('whatsapp-icon');
            
            if (clippy) {
                clippy.style.width = isMobile ? '50px' : '60px';
                clippy.style.height = isMobile ? '50px' : '60px';
            }
            
            if (whatsappIcon) {
                whatsappIcon.style.width = isMobile ? '50px' : '60px';
                whatsappIcon.style.height = isMobile ? '50px' : '60px';
            }
        }
        
        // Verifica tamanho na inicialização e redimensionamento
        adjustSize();
        window.addEventListener('resize', adjustSize);
    }

    function setupClippyInteraction(clippy, chatBox, input) {
        // Alterna a exibição do chat ao clicar no assistente
        clippy.addEventListener('click', function () {
            if (chatBox.style.display === 'none' || chatBox.style.display === '') {
                chatBox.style.display = 'block';
                
                // Animação suave de entrada
                chatBox.style.opacity = '0';
                chatBox.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    chatBox.style.opacity = '1';
                    chatBox.style.transform = 'translateY(0)';
                    input.focus();
                }, 10);
            } else {
                // Animação suave de saída
                chatBox.style.opacity = '0';
                chatBox.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    chatBox.style.display = 'none';
                }, 300);
            }
        });

        // Processa mensagens quando o usuário pressiona Enter
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const userMsg = input.value.trim();
                if (userMsg !== '') {
                    handleUserMessage(userMsg, chatBox, input);
                }
            }
        });
    }

    function handleUserMessage(userMsg, chatBox, input) {
        // Cria a bolha de mensagem do usuário
        const userBubble = document.createElement('div');
        userBubble.classList.add('chat-bubble', 'user-bubble');
        userBubble.textContent = userMsg;
        chatBox.insertBefore(userBubble, input);

        // Limpa o campo de entrada
        input.value = '';

        // Simula digitação com indicador visual
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('chat-bubble', 'typing-indicator');
        typingIndicator.innerHTML = '<span>.</span><span>.</span><span>.</span>';
        chatBox.insertBefore(typingIndicator, input);

        // Rolagem para mostrar o indicador de digitação
        chatBox.scrollTop = chatBox.scrollHeight;

        // Envia a mensagem para a API do backend
        fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMsg }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na comunicação com o servidor');
            }
            return response.json();
        })
        .then(data => {
            // Remove o indicador de digitação
            chatBox.removeChild(typingIndicator);
            
            // Cria a bolha de resposta com a resposta da API
            const responseBubble = document.createElement('div');
            responseBubble.classList.add('chat-bubble');
            responseBubble.textContent = data.response;
            chatBox.insertBefore(responseBubble, input);

            // Rolagem para mostrar a mensagem mais recente
            chatBox.scrollTop = chatBox.scrollHeight;
        })
        .catch(error => {
            console.error('Erro:', error);
            
            // Remove o indicador de digitação
            chatBox.removeChild(typingIndicator);
            
            // Fallback para o modo offline se a API não responder
            let response = "Desculpe, estou com dificuldades de conexão. Tente novamente mais tarde ou entre em contato pelo WhatsApp.";
            
            // Cria a bolha de resposta com a mensagem de fallback
            const responseBubble = document.createElement('div');
            responseBubble.classList.add('chat-bubble');
            responseBubble.textContent = response;
            chatBox.insertBefore(responseBubble, input);

            // Rolagem para mostrar a mensagem mais recente
            chatBox.scrollTop = chatBox.scrollHeight;
        });
    }

    return {
        init
    };
})();