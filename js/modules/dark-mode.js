/**
 * Módulo Dark Mode - Gerencia a troca entre tema claro e escuro
 * Arquivo único e centralizado para toda a funcionalidade de troca de tema
 */

const DarkMode = (function() {
    // Estado para acompanhar se o modo escuro está ativo
    let isDarkMode = false;
    
    // Eventos personalizados para notificar outros componentes
    const THEME_CHANGE_EVENT = 'themeChanged';
    
    // Inicializa o módulo
    function init() {
        // Pega referência ao switch de tema
        const themeSwitch = document.getElementById('theme-switch');
        if (!themeSwitch) return;
        
        // Define o estado inicial com base no localStorage
        if (localStorage.getItem('theme') === 'dark') {
            enableDarkMode();
            themeSwitch.checked = true;
        } else {
            disableDarkMode();
            themeSwitch.checked = false;
        }
        
        // Configura o listener para o toggle
        themeSwitch.addEventListener('change', function() {
            if (this.checked) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        });
        
        // Adiciona opção para detectar preferências do sistema
        setupSystemPreference();
    }
    
    // Ativa o modo escuro
    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        isDarkMode = true;
        notifyThemeChange();
    }
    
    // Desativa o modo escuro
    function disableDarkMode() {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        isDarkMode = false;
        notifyThemeChange();
    }
    
    // Alterna entre os temas
    function toggleDarkMode() {
        if (isDarkMode) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
        
        // Também atualiza o estado do switch se ele existir
        const themeSwitch = document.getElementById('theme-switch');
        if (themeSwitch) {
            themeSwitch.checked = isDarkMode;
        }
    }
    
    // Notifica outros componentes sobre a mudança de tema
    function notifyThemeChange() {
        // Dispara um evento personalizado que outros módulos podem escutar
        const event = new CustomEvent(THEME_CHANGE_EVENT, { 
            detail: { isDarkMode: isDarkMode } 
        });
        document.dispatchEvent(event);
        
        // Atualiza componentes específicos que precisam saber do tema
        updateCharts();
    }
    
    // Atualiza os gráficos Chart.js quando o tema muda
    function updateCharts() {
        // Se existir qualquer instância do Chart.js, isso irá atualizá-la
        if (window.economyChartInstance) {
            // Obter as opções de cores baseadas no tema atual
            const options = getChartOptions();
            
            // Atualizar as cores do gráfico
            window.economyChartInstance.options.plugins.title.color = options.plugins.title.color;
            window.economyChartInstance.options.plugins.legend.labels.color = options.plugins.legend.labels.color;
            window.economyChartInstance.options.scales.y.ticks.color = options.scales.y.ticks.color;
            window.economyChartInstance.options.scales.x.ticks.color = options.scales.x.ticks.color;
            window.economyChartInstance.options.scales.y.grid.color = options.scales.y.grid.color;
            window.economyChartInstance.options.scales.x.grid.color = options.scales.x.grid.color;
            
            // Renderizar o gráfico novamente
            window.economyChartInstance.update();
        }
    }
    
    // Função auxiliar para obter opções de cores para gráficos baseadas no tema atual
    function getChartOptions() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const textColor = isDarkMode ? '#f5f5f5' : '#333333';
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const ticksColor = isDarkMode ? '#aaaaaa' : '#666666';
        
        return {
            plugins: {
                title: {
                    color: textColor
                },
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        color: ticksColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: ticksColor
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        };
    }
    
    // Detecta e usa preferência do sistema (light/dark)
    function setupSystemPreference() {
        // Verifica se o navegador suporta matchMedia
        if (window.matchMedia) {
            // Detecta preferência do sistema
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Se não houver preferência salva, usa a do sistema
            if (!localStorage.getItem('theme')) {
                if (prefersDarkMode.matches) {
                    enableDarkMode();
                    const themeSwitch = document.getElementById('theme-switch');
                    if (themeSwitch) themeSwitch.checked = true;
                }
            }
            
            // Monitora mudanças na preferência do sistema
            prefersDarkMode.addEventListener('change', (e) => {
                // Só altera se o usuário não tiver definido uma preferência explícita
                if (!localStorage.getItem('theme')) {
                    if (e.matches) {
                        enableDarkMode();
                    } else {
                        disableDarkMode();
                    }
                    
                    // Atualiza o switch
                    const themeSwitch = document.getElementById('theme-switch');
                    if (themeSwitch) themeSwitch.checked = e.matches;
                }
            });
        }
    }
    
    // API pública do módulo
    return {
        init,
        enableDarkMode,
        disableDarkMode,
        toggleDarkMode,
        // Constantes expostas para outros módulos
        THEME_CHANGE_EVENT,
        // Helper para outros módulos que precisam saber o estado atual
        isDark: () => isDarkMode,
        // Helper para obter cores baseadas no tema atual (útil para gráficos)
        getThemeColors: getChartOptions
    };
})();