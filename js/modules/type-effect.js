const TypeEffect = (function () {
    function init() {
        const typingElement = document.getElementById('typing-text');
        if (!typingElement) return;

        setTimeout(startTypeEffect, 1000);
    }

    function startTypeEffect() {
        const typingElement = document.getElementById('typing-text');
        const phrases = [
            'Engenheiro Civil',
            'Especialista em IA',
            'Gestor de Projetos',
            'Inovador em Construção'
        ];
        let phraseIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 100;

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
                typingSpeed = 1000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500;
            }
            setTimeout(type, typingSpeed);
        }
        type();
    }

    return {
        init
    };
})();