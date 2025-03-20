const EconomySimulator = (function () {
    let economyChartInstance = null;

    function init() {
        setupSimulator();
    }

    function setupSimulator() {
        const projectValueSlider = document.getElementById('projectValueSlider');
        const projectValueInput = document.getElementById('projectValue');
        const economyForm = document.getElementById('economyForm');
        const economyChart = document.getElementById('economyChart');

        // Verify elements exist
        if (!projectValueSlider || !projectValueInput || !economyForm) return;

        // Sync slider with input field
        setupInputSync(projectValueSlider, projectValueInput);

        // Handle form submission
        economyForm.addEventListener('submit', function (e) {
            e.preventDefault();
            processSimulation(economyChart);
        });
    }

    function setupInputSync(slider, input) {
        // Sync slider to input
        slider.addEventListener('input', function () {
            input.value = this.value;
        });

        // Sync input to slider
        input.addEventListener('input', function () {
            const value = parseInt(this.value);
            if (!isNaN(value) && value >= 50000 && value <= 10000000) {
                slider.value = value;
            }
        });

        // Format value on blur
        input.addEventListener('blur', function () {
            const value = parseInt(this.value);
            if (!isNaN(value)) {
                if (value < 50000) this.value = 50000;
                if (value > 10000000) this.value = 10000000;
            } else {
                this.value = 500000;
            }
        });
    }

    function processSimulation(chartElement) {
        // Get form values
        const projectValue = parseInt(document.getElementById('projectValue').value);
        const automationLevel = document.querySelector('input[name="automationLevel"]:checked').value;

        // Calculate savings based on automation level
        let savingsPercent, roiMultiplier, implementationTime;

        switch (automationLevel) {
            case 'low':
                savingsPercent = 0.12; // 12% savings
                roiMultiplier = 2.5;   // 2.5x ROI
                implementationTime = '2-3 meses';
                break;
            case 'medium':
                savingsPercent = 0.20; // 20% savings
                roiMultiplier = 3.2;   // 3.2x ROI
                implementationTime = '4-6 meses';
                break;
            case 'high':
                savingsPercent = 0.35; // 35% savings
                roiMultiplier = 4.5;   // 4.5x ROI
                implementationTime = '6-8 meses';
                break;
        }

        // Calculate values
        const savings = projectValue * savingsPercent;
        const roi = roiMultiplier;

        // Update results
        updateSimulationResults(projectValue, savings, roi, implementationTime, automationLevel);

        // Remove placeholder when results are displayed
        const chartPlaceholder = document.querySelector('.chart-placeholder');
        if (chartPlaceholder) {
            chartPlaceholder.style.display = 'none';
        }

        // Create or update chart
        createEconomyChart(chartElement, projectValue, savings, automationLevel);
    }

    function updateSimulationResults(projectValue, savings, roi, implementationTime, automationLevel) {
        document.getElementById('savingsValue').textContent = 'R$ ' + savings.toLocaleString('pt-BR');
        document.getElementById('roiValue').textContent = roi.toFixed(1) + 'x';
        document.getElementById('timeValue').textContent = implementationTime;

        // Add analysis based on automation level
        const analysisElement = document.getElementById('economyAnalysis');
        if (analysisElement) {
            let analysisText = '';

            switch (automationLevel) {
                case 'low':
                    analysisText = `Com automações básicas em seu projeto de R$ ${projectValue.toLocaleString('pt-BR')}, você pode economizar aproximadamente <strong>R$ ${savings.toLocaleString('pt-BR')}</strong>. O nível básico inclui automação de processos repetitivos e sistemas de monitoramento simples.`;
                    break;
                case 'medium':
                    analysisText = `Implementando automações intermediárias em seu projeto de R$ ${projectValue.toLocaleString('pt-BR')}, a economia estimada é de <strong>R$ ${savings.toLocaleString('pt-BR')}</strong>. Este nível inclui IA para otimização de processos e sistemas preditivos de gerenciamento de recursos.`;
                    break;
                case 'high':
                    analysisText = `Com automação completa usando IA avançada em seu projeto de R$ ${projectValue.toLocaleString('pt-BR')}, você pode economizar até <strong>R$ ${savings.toLocaleString('pt-BR')}</strong>. Este nível inclui sistemas inteligentes integrados, análise preditiva e otimização contínua de processos construtivos.`;
                    break;
            }

            analysisElement.innerHTML = analysisText;
        }
    }

    function createEconomyChart(chartElement, projectValue, savings, automationLevel) {
        if (!chartElement) return;

        // Destroy existing chart if it exists
        if (economyChartInstance) {
            economyChartInstance.destroy();
        }

        // Data for comparing traditional methods vs. AI
        const traditionalData = [];
        const iaData = [];
        const months = ['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5', 'Mês 6', 'Mês 7', 'Mês 8', 'Mês 9', 'Mês 10', 'Mês 11', 'Mês 12'];

        // Calculate data for different months based on automation level
        let iaFactor, traditionalFactor;

        switch (automationLevel) {
            case 'low':
                iaFactor = [0.92, 0.89, 0.87, 0.85, 0.84, 0.83, 0.82, 0.81, 0.80, 0.80, 0.79, 0.78];
                traditionalFactor = [1, 0.99, 0.98, 0.97, 0.96, 0.95, 0.94, 0.93, 0.92, 0.91, 0.90, 0.89];
                break;
            case 'medium':
                iaFactor = [0.95, 0.88, 0.83, 0.79, 0.76, 0.74, 0.72, 0.71, 0.70, 0.69, 0.68, 0.67];
                traditionalFactor = [1, 0.99, 0.98, 0.97, 0.96, 0.95, 0.94, 0.93, 0.92, 0.91, 0.90, 0.89];
                break;
            case 'high':
                iaFactor = [0.98, 0.85, 0.75, 0.68, 0.63, 0.60, 0.58, 0.57, 0.56, 0.55, 0.54, 0.53];
                traditionalFactor = [1, 0.99, 0.98, 0.97, 0.96, 0.95, 0.94, 0.93, 0.92, 0.91, 0.90, 0.89];
                break;
        }

        // Generate data for each month
        for (let i = 0; i < months.length; i++) {
            traditionalData.push(projectValue * traditionalFactor[i] / 12);
            iaData.push(projectValue * iaFactor[i] / 12);
        }

        // Create chart
        const ctx = chartElement.getContext('2d');
        economyChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Método Tradicional',
                        data: traditionalData,
                        backgroundColor: 'rgba(234, 67, 53, 0.2)',
                        borderColor: 'rgba(234, 67, 53, 1)',
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 3
                    },
                    {
                        label: 'Com Automação IA',
                        data: iaData,
                        backgroundColor: 'rgba(66, 133, 244, 0.2)',
                        borderColor: 'rgba(66, 133, 244, 1)',
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 3
                    }
                ]
            },
            options: getChartOptions()
        });

        // Update chart colors when theme changes
        setupChartThemeSync();
    }

    function getChartOptions() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const textColor = isDarkMode ? '#f5f5f5' : '#333333';
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const ticksColor = isDarkMode ? '#aaaaaa' : '#666666';

        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Comparação de Custos: Tradicional vs. Automação com IA',
                    color: textColor,
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += 'R$ ' + context.parsed.y.toLocaleString('pt-BR', {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                });
                            }
                            return label;
                        }
                    }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        color: textColor,
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return 'R$ ' + value.toLocaleString('pt-BR', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            });
                        },
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

    function setupChartThemeSync() {
        const themeSwitch = document.getElementById('theme-switch');
        if (themeSwitch && economyChartInstance) {
            themeSwitch.addEventListener('change', function () {
                const options = getChartOptions();

                economyChartInstance.options.plugins.title.color = options.plugins.title.color;
                economyChartInstance.options.plugins.legend.labels.color = options.plugins.legend.labels.color;
                economyChartInstance.options.scales.y.ticks.color = options.scales.y.ticks.color;
                economyChartInstance.options.scales.x.ticks.color = options.scales.x.ticks.color;
                economyChartInstance.options.scales.y.grid.color = options.scales.y.grid.color;
                economyChartInstance.options.scales.x.grid.color = options.scales.x.grid.color;

                economyChartInstance.update();
            });
        }
    }

    return {
        init
    };
})();