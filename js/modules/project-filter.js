const ProjectFilter = (function () {
    let projectData = [
        {
            id: 0,
            title: "Sistema de Automação Predial",
            description: "Um sistema completo de automação predial que utiliza inteligência artificial para otimizar o consumo de energia e recursos. A solução monitora em tempo real temperatura, iluminação, consumo de energia e presença de pessoas, ajustando automaticamente os sistemas para máxima eficiência.",
            category: "automation",
            date: "Março 2023",
            location: "Manaus, AM",
            technologies: ["IA", "IoT", "Automação", "Cloud Computing"],
            results: [
                "Redução de 30% nos custos operacionais",
                "Aumento de 25% na eficiência energética",
                "Implementação em 45 dias",
                "ROI positivo em 8 meses"
            ],
            image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 1,
            title: "Projeto Residencial Inteligente",
            description: "Implementação de um sistema integrado de automação residencial que controla iluminação, segurança, climatização e entretenimento. O projeto combina dispositivos IoT com uma interface intuitiva para o morador controlar todos os aspectos da casa através de um aplicativo móvel ou comandos de voz.",
            category: "construction",
            date: "Janeiro 2023",
            location: "São Paulo, SP",
            technologies: ["IoT", "UX/UI", "Aplicativo Mobile", "Assistentes Virtuais"],
            results: [
                "Economia de 35% em energia elétrica",
                "Sistema integrado com mais de 50 dispositivos",
                "Controle total via smartphone ou voz",
                "Maior conforto e segurança para os moradores"
            ],
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            title: "Sistema de Planejamento de Recursos",
            description: "Software especializado para planejamento e gestão de recursos em projetos de construção civil. Utiliza algoritmos avançados para otimizar a alocação de mão de obra, materiais e equipamentos, reduzindo desperdícios e atrasos. A ferramenta permite visualização em tempo real do progresso das obras.",
            category: "planning",
            date: "Outubro 2022",
            location: "Rio de Janeiro, RJ",
            technologies: ["Big Data", "Analytics", "Algoritmos Preditivos", "Dashboard"],
            results: [
                "Redução de 15% no tempo de execução das obras",
                "Economia de 22% em materiais de construção",
                "Melhoria de 40% na produtividade das equipes",
                "Previsibilidade de 95% nos cronogramas"
            ],
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 3,
            title: "Projeto Comercial",
            description: "Automação completa de um edifício corporativo de 15 andares, incluindo controle de acesso, segurança, climatização, iluminação e gerenciamento de energia. O sistema se integra ao BMS (Building Management System) existente e adiciona camadas de inteligência artificial para otimização contínua.",
            category: "construction",
            date: "Dezembro 2022",
            location: "Brasília, DF",
            technologies: ["BMS", "IA", "Segurança", "Eficiência Energética"],
            results: [
                "Redução de 40% nos custos de operação",
                "Aumento de 30% na segurança",
                "Certificação LEED Gold obtida após implementação",
                "Sistema operando com 99.9% de confiabilidade"
            ],
            image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 4,
            title: "Automação Industrial",
            description: "Sistema de monitoramento e automação para construção pesada, incluindo sensores em equipamentos, monitoramento de condições climáticas e controle de qualidade automatizado. A solução utiliza drones e IoT para coletar dados em tempo real do canteiro de obras.",
            category: "automation",
            date: "Fevereiro 2023",
            location: "Salvador, BA",
            technologies: ["Drones", "IoT", "Sensores", "Visão Computacional"],
            results: [
                "Aumento de 50% na segurança do canteiro",
                "Redução de 28% em retrabalhos",
                "Economia de 20% em combustível dos equipamentos",
                "Mapeamento 3D da obra atualizado diariamente"
            ],
            image: "https://images.unsplash.com/photo-1533417173168-85ea7372f567?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        }
    ];

    let currentSlide = 0;
    let slideInterval;

    function init() {
        setupFilterButtons();
        setupGallery();
        setupProjectLinks();
        setupModal();
    }

    function setupFilterButtons() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                // Filter projects
                document.querySelectorAll('.project-item').forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                        item.classList.add('fade-in');
                        setTimeout(() => {
                            item.classList.remove('fade-in');
                        }, 500);
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    function setupGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const dots = document.querySelectorAll('.gallery-dot');
        const prevBtn = document.querySelector('.gallery-prev');
        const nextBtn = document.querySelector('.gallery-next');
        
        if (!galleryItems.length) return;

        // Function to show a specific slide
        function showSlide(index) {
            // Hide all slides
            galleryItems.forEach(item => {
                item.classList.remove('active');
                item.style.opacity = 0;
                item.style.transform = 'scale(0.95)';
            });
            
            // Deactivate all dots
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Show selected slide
            setTimeout(() => {
                galleryItems[index].classList.add('active');
                galleryItems[index].style.opacity = 1;
                galleryItems[index].style.transform = 'scale(1)';
                
                // Activate corresponding dot
                dots[index].classList.add('active');
                
                // Update current slide
                currentSlide = index;
            }, 50);
        }

        // Add click event to gallery items
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                openProjectModal(index);
            });
        });

        // Add click events to navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showSlide((currentSlide - 1 + galleryItems.length) % galleryItems.length);
                resetInterval();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showSlide((currentSlide + 1) % galleryItems.length);
                resetInterval();
            });
        }

        // Add click events to dots
        dots.forEach((dot, i) => {
            dot.addEventListener('click', function() {
                showSlide(i);
                resetInterval();
            });
        });

        // Setup touch swipe for mobile
        const galleryContainer = document.querySelector('.gallery-container');
        if (galleryContainer) {
            let touchStartX = 0;
            let touchEndX = 0;
            
            galleryContainer.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            galleryContainer.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });
            
            function handleSwipe() {
                const swipeThreshold = 50;
                if (touchEndX < touchStartX - swipeThreshold) {
                    // Swipe left - go to next slide
                    showSlide((currentSlide + 1) % galleryItems.length);
                    resetInterval();
                } else if (touchEndX > touchStartX + swipeThreshold) {
                    // Swipe right - go to previous slide
                    showSlide((currentSlide - 1 + galleryItems.length) % galleryItems.length);
                    resetInterval();
                }
            }
        }

        // Start automatic slideshow
        startInterval();

        function startInterval() {
            slideInterval = setInterval(() => {
                showSlide((currentSlide + 1) % galleryItems.length);
            }, 5000);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }
    }

    function setupProjectLinks() {
        document.querySelectorAll('.project-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const index = parseInt(this.getAttribute('data-index'));
                openProjectModal(index);
            });
        });
    }

    function setupModal() {
        const modal = document.getElementById('projectModal');
        const closeBtn = document.querySelector('.close-project-modal');
        
        if (!modal || !closeBtn) return;

        // Close modal when clicking the X
        closeBtn.addEventListener('click', closeProjectModal);

        // Close modal when clicking outside the content
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeProjectModal();
            }
        });

        // Close modal when pressing ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeProjectModal();
            }
        });
    }

    function openProjectModal(index) {
        const modal = document.getElementById('projectModal');
        if (!modal) return;

        const project = projectData.find(p => p.id === index);
        if (!project) return;

        // Fill the modal with project data
        document.getElementById('modalImage').src = project.image;
        document.getElementById('modalImage').alt = project.title;
        document.getElementById('modalTitle').textContent = project.title;
        document.getElementById('modalDescription').textContent = project.description;
        document.getElementById('modalDate').textContent = project.date;
        document.getElementById('modalLocation').textContent = project.location;
        document.getElementById('modalCategory').textContent = project.category.charAt(0).toUpperCase() + project.category.slice(1);

        // Fill technologies
        const techContainer = document.getElementById('modalTech');
        techContainer.innerHTML = '';
        project.technologies.forEach(tech => {
            const span = document.createElement('span');
            span.className = 'tech-tag';
            span.textContent = tech;
            techContainer.appendChild(span);
        });

        // Fill results
        const resultsList = document.getElementById('modalResults');
        resultsList.innerHTML = '';
        project.results.forEach(result => {
            const li = document.createElement('li');
            li.textContent = result;
            resultsList.appendChild(li);
        });

        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeProjectModal() {
        const modal = document.getElementById('projectModal');
        if (!modal) return;

        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    return {
        init
    };
})();