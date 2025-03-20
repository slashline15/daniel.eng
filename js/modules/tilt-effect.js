const TiltEffect = (function () {
    function init() {
        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', handleMouseMove);
            card.addEventListener('mouseleave', handleMouseLeave);
        });
    }

    function handleMouseMove(e) {
        const card = this;
        const rect = card.getBoundingClientRect();
        const rotateX = ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * -10;
        const rotateY = ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        const inner = card.querySelector('.tilt-card-inner');
        if (inner) inner.style.transform = 'translateZ(40px)';
    }

    function handleMouseLeave() {
        const card = this;
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';

        const inner = card.querySelector('.tilt-card-inner');
        if (inner) inner.style.transform = 'translateZ(20px)';
    }

    return {
        init
    };
})();