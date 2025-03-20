const CreativeModal = (function () {
    function init() {
        setupModal();
    }

    function setupModal() {
        // Check if device is mobile
        const isMobile = window.innerWidth <= 768;

        // Longer timeout on mobile devices
        const timeout = isMobile ? 15000 : 10000;

        // Show modal after defined timeout
        setTimeout(showModal, timeout);

        // Close modal when clicking the X
        const closeBtn = document.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        // Close modal when clicking outside content
        window.addEventListener('click', function (event) {
            const modal = document.getElementById('creativeModal');
            if (event.target === modal) closeModal();
        });

        // Close modal when pressing ESC
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });
    }

    function showModal() {
        const modal = document.getElementById('creativeModal');
        const hasSeenModal = sessionStorage.getItem('hasSeenModal');

        // Only show if user hasn't seen it in this session
        if (modal && !hasSeenModal) {
            modal.style.display = 'flex';
            // Mark that user has seen the modal in this session
            sessionStorage.setItem('hasSeenModal', 'true');
        }
    }

    function closeModal() {
        const modal = document.getElementById('creativeModal');
        if (modal && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    }

    return {
        init
    };
})();