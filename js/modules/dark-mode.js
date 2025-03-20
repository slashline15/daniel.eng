const DarkMode = (function () {
    function init() {
        const themeSwitch = document.getElementById('theme-switch');
        if (!themeSwitch) return;

        // Set initial state based on localStorage
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            themeSwitch.checked = true;
        }

        // Handle theme toggle
        themeSwitch.addEventListener('change', function () {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    return {
        init
    };
})();