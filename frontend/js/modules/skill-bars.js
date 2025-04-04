const SkillBars = (function () {
    function init() {
        animateSkillBars();
    }

    function animateSkillBars() {
        document.querySelectorAll('.skill-progress').forEach(bar => {
            bar.style.width = bar.getAttribute('data-progress') + '%';
        });
    }

    return {
        init
    };
})();