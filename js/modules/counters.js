const Counters = (function () {
    function init() {
        // Initial setup - actual counting triggered by scroll in AnimationEffects
    }

    function startCounters() {
        document.querySelectorAll('.counter').forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const increment = target / 200;
                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }

    return {
        init,
        startCounters
    };
})();