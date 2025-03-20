const Navigation = (function () {
    function init() {
        setupMobileMenu();
        handleWindowResize();
    }

    function setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const body = document.body;

        if (!hamburger || !navLinks) return;

        hamburger.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            document.querySelectorAll('.bar').forEach(bar => bar.classList.toggle('active'));

            // Prevent body scrolling when menu is open
            if (navLinks.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function () {
                navLinks.classList.remove('active');
                document.querySelectorAll('.bar').forEach(bar => bar.classList.remove('active'));
                body.style.overflow = '';
            });
        });
    }

    function handleWindowResize() {
        window.addEventListener('resize', function () {
            const navLinks = document.querySelector('.nav-links');
            if (window.innerWidth > 768 && navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                document.querySelectorAll('.bar').forEach(bar => bar.classList.remove('active'));
                document.body.style.overflow = '';
            }
        });
    }

    return {
        init
    };
})();