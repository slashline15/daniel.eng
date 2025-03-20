const AnimationEffects = (function () {
    function init() {
        checkFade();
        window.addEventListener('scroll', checkFade);
    }

    function checkFade() {
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                el.classList.add('appear');
                const animation = el.getAttribute('data-animation');
                if (animation) el.classList.add(animation);
            }
        });

        const statsSection = document.querySelector('.stats-section');
        if (statsSection && statsSection.getBoundingClientRect().top < window.innerHeight - 100) {
            Counters.startCounters();
        }
    }

    return {
        init,
        checkFade
    };
})();