const ScrollEffects = (function () {
    function init() {
        window.addEventListener('scroll', handleScroll);
    }

    function handleScroll() {
        updateParallax();
        updateScrollProgress();
        updateStickyHeader();
        AnimationEffects.checkFade();
    }

    function updateParallax() {
        const parallaxBg = document.querySelector('.parallax-bg');
        if (parallaxBg) {
            parallaxBg.style.transform = `translateY(${window.pageYOffset * 0.4}px)`;
        }
    }

    function updateScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress-bar');
        if (progressBar) {
            const scrollPercent = (window.scrollY / (document.body.offsetHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrollPercent + '%';
        }
    }

    function updateStickyHeader() {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) header.classList.add('sticky');
            else header.classList.remove('sticky');
        }
    }

    return {
        init
    };
})();