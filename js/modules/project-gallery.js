    /**
 * Galeria de Projetos Avançada
 * Combina grid responsivo com lightbox imersivo
 */
const ProjectGallery = (function() {
    // Configuração
    const config = {
        gridSelector: '.project-gallery-grid',
        itemSelector: '.gallery-item',
        lightboxContainerId: 'projectLightbox',
        animationDuration: 300,
        imagesPerPage: 6,
        enableKeyboardNav: true,
        preloadNextImage: true
    };
    
    // Estado
    let state = {
        projects: [], // Array com todos os projetos
        currentIndex: 0,
        isLightboxOpen: false,
        lightboxElement: null,
        categories: new Set(), // Categorias únicas para filtros
        isTransitioning: false,
        currentCategory: 'all',
        currentPage: 1,
        totalPages: 1
    };
    
    /**
     * Inicializa a galeria
     * @param {Array} projectsData Dados dos projetos (opcional, pode ser carregado via data-attributes)
     */
    function init(projectsData = null) {
        // Se dados foram fornecidos, usar eles
        if (projectsData && Array.isArray(projectsData)) {
            state.projects = projectsData;
        } else {
            // Caso contrário, tentar extrair dados dos elementos
            collectProjectData();
        }
        
        // Extrair categorias para filtros
        extractCategories();
        
        // Preparar container do lightbox
        setupLightbox();
        
        // Configurar grid responsivo
        setupGrid();
        
        // Configurar controles de navegação e filtros
        setupControls();
        
        // Calcular paginação
        calculatePagination();
        
        // Aplicar filtros iniciais
        applyFilter('all');
        
        console.log('✅ Galeria de projetos inicializada com', state.projects.length, 'projetos em', state.categories.size, 'categorias');
    }
    
    /**
     * Coleta dados dos projetos a partir do DOM
     */
    function collectProjectData() {
        const items = document.querySelectorAll(config.itemSelector);
        
        items.forEach((item, index) => {
            // Extrair dados dos atributos data-*
            const project = {
                id: item.dataset.id || index,
                title: item.dataset.title || 'Projeto ' + (index + 1),
                description: item.dataset.description || '',
                category: item.dataset.category || 'outro',
                image: item.dataset.image || item.querySelector('img')?.src,
                date: item.dataset.date || '',
                client: item.dataset.client || '',
                location: item.dataset.location || '',
                tags: item.dataset.tags ? item.dataset.tags.split(',').map(tag => tag.trim()) : [],
                element: item
            };
            
            state.projects.push(project);
        });
    }
    
    /**
     * Extrai categorias únicas dos projetos
     */
    function extractCategories() {
        state.projects.forEach(project => {
            if (project.category) {
                state.categories.add(project.category);
            }
        });
    }
    
    /**
     * Configura o container do lightbox
     */
    function setupLightbox() {
        // Verificar se já existe um lightbox
        let lightbox = document.getElementById(config.lightboxContainerId);
        
        // Se não existir, criar um novo
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = config.lightboxContainerId;
            lightbox.className = 'project-lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-overlay"></div>
                <div class="lightbox-container">
                    <button class="lightbox-close" aria-label="Fechar">&times;</button>
                    <div class="lightbox-content">
                        <div class="lightbox-image-container">
                            <img src="" alt="" class="lightbox-image">
                        </div>
                        <div class="lightbox-info">
                            <h2 class="lightbox-title"></h2>
                            <div class="lightbox-meta">
                                <span class="lightbox-date"></span>
                                <span class="lightbox-client"></span>
                                <span class="lightbox-location"></span>
                            </div>
                            <div class="lightbox-tags"></div>
                            <div class="lightbox-description"></div>
                        </div>
                    </div>
                    <div class="lightbox-navigation">
                        <button class="lightbox-prev" aria-label="Projeto anterior">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="lightbox-next" aria-label="Próximo projeto">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(lightbox);
        }
        
        // Guardar referência
        state.lightboxElement = lightbox;
        
        // Configurar event listeners
        setupLightboxEvents();
    }
    
    /**
     * Configura eventos do lightbox
     */
    function setupLightboxEvents() {
        const lightbox = state.lightboxElement;
        
        // Fechar ao clicar no X
        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        
        // Fechar ao clicar no overlay
        lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
        
        // Navegação
        lightbox.querySelector('.lightbox-prev').addEventListener('click', navigateToPrev);
        lightbox.querySelector('.lightbox-next').addEventListener('click', navigateToNext);
        
        // Keyboard navigation
        if (config.enableKeyboardNav) {
            document.addEventListener('keydown', handleKeyNavigation);
        }
    }
    
    /**
     * Manipula navegação por teclado
     */
    function handleKeyNavigation(e) {
        // Só responde se o lightbox estiver aberto
        if (!state.isLightboxOpen) return;
        
        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateToPrev();
                break;
            case 'ArrowRight':
                navigateToNext();
                break;
        }
    }
    
    /**
     * Configura o grid responsivo
     */
    function setupGrid() {
        const gridContainer = document.querySelector(config.gridSelector);
        if (!gridContainer) return;
        
        // Configurar event listeners para items do grid
        gridContainer.addEventListener('click', event => {
            // Encontrar o item clicado
            const item = event.target.closest(config.itemSelector);
            if (!item) return;
            
            // Prevenir comportamento padrão do link
            event.preventDefault();
            
            // Abrir lightbox para o item clicado
            const index = parseInt(item.dataset.index || 0);
            openLightbox(index);
        });
    }
    
    /**
     * Configura controles de filtro e navegação
     */
    function setupControls() {
        // Configurar filtros
        const filterContainer = document.querySelector('.gallery-filters');
        if (filterContainer) {
            // Limpar filtros existentes
            filterContainer.innerHTML = '';
            
            // Adicionar filtro para "Todos"
            const allFilter = document.createElement('button');
            allFilter.className = 'filter-btn active';
            allFilter.dataset.filter = 'all';
            allFilter.textContent = 'Todos';
            allFilter.addEventListener('click', () => applyFilter('all'));
            filterContainer.appendChild(allFilter);
            
            // Adicionar filtros para cada categoria
            state.categories.forEach(category => {
                const filterBtn = document.createElement('button');
                filterBtn.className = 'filter-btn';
                filterBtn.dataset.filter = category;
                filterBtn.textContent = capitalizeFirstLetter(category);
                filterBtn.addEventListener('click', () => applyFilter(category));
                filterContainer.appendChild(filterBtn);
            });
        }
        
        // Configurar paginação
        setupPagination();
    }
    
    /**
     * Configura controles de paginação
     */
    function setupPagination() {
        const paginationContainer = document.querySelector('.gallery-pagination');
        if (!paginationContainer) return;
        
        // Limpar paginação existente
        paginationContainer.innerHTML = '';
        
        // Botão anterior
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.addEventListener('click', () => goToPage(state.currentPage - 1));
        paginationContainer.appendChild(prevBtn);
        
        // Números das páginas
        for (let i = 1; i <= state.totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-btn page-num ${i === state.currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => goToPage(i));
            paginationContainer.appendChild(pageBtn);
        }
        
        // Botão próximo
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.addEventListener('click', () => goToPage(state.currentPage + 1));
        paginationContainer.appendChild(nextBtn);
        
        // Atualizar estado dos botões
        updatePaginationState();
    }
    
    /**
     * Atualiza estado visual dos botões de paginação
     */
    function updatePaginationState() {
        const paginationContainer = document.querySelector('.gallery-pagination');
        if (!paginationContainer) return;
        
        // Atualizar botão anterior
        const prevBtn = paginationContainer.querySelector('.prev');
        if (prevBtn) {
            prevBtn.disabled = state.currentPage === 1;
            prevBtn.classList.toggle('disabled', state.currentPage === 1);
        }
        
        // Atualizar botões de página
        const pageButtons = paginationContainer.querySelectorAll('.page-num');
        pageButtons.forEach((btn, index) => {
            const page = index + 1;
            btn.classList.toggle('active', page === state.currentPage);
        });
        
        // Atualizar botão próximo
        const nextBtn = paginationContainer.querySelector('.next');
        if (nextBtn) {
            nextBtn.disabled = state.currentPage === state.totalPages;
            nextBtn.classList.toggle('disabled', state.currentPage === state.totalPages);
        }
    }
    
    /**
     * Navega para uma página específica
     */
    function goToPage(page) {
        // Validar página
        if (page < 1 || page > state.totalPages || page === state.currentPage) return;
        
        // Atualizar página atual
        state.currentPage = page;
        
        // Replicar filtro atual para mostrar os itens corretos
        applyFilter(state.currentCategory);
        
        // Atualizar estado dos botões de paginação
        updatePaginationState();
        
        // Rolar para o topo da galeria
        const galleryTop = document.querySelector(config.gridSelector).offsetTop;
        window.scrollTo({ top: galleryTop - 100, behavior: 'smooth' });
    }
    
    /**
     * Calcular paginação com base no número de projetos e config.imagesPerPage
     */
    function calculatePagination() {
        // Filtrar projetos pela categoria atual
        const filteredProjects = state.currentCategory === 'all' 
            ? state.projects 
            : state.projects.filter(p => p.category === state.currentCategory);
        
        // Calcular número total de páginas
        state.totalPages = Math.ceil(filteredProjects.length / config.imagesPerPage);
        
        // Garantir que a página atual está dentro dos limites
        if (state.currentPage > state.totalPages) {
            state.currentPage = Math.max(1, state.totalPages);
        }
    }
    
    /**
     * Aplica um filtro de categoria
     */
    function applyFilter(category) {
        // Se estiver em transição, ignorar
        if (state.isTransitioning) return;
        state.isTransitioning = true;
        
        // Atualizar categoria atual
        state.currentCategory = category;
        
        // Atualizar paginação para a nova categoria
        calculatePagination();
        setupPagination();
        
        // Atualizar estado visual dos botões de filtro
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === category);
        });
        
        // Filtrar e mostrar os projetos
        const grid = document.querySelector(config.gridSelector);
        if (!grid) {
            state.isTransitioning = false;
            return;
        }
        
        // Primeiro, vamos esconder todos os projetos com uma animação de fade out
        const allItems = grid.querySelectorAll(config.itemSelector);
        let fadeOutComplete = 0;
        
        if (allItems.length === 0) {
            // Se não houver itens, ir direto para o próximo passo
            showFilteredProjects();
            return;
        }
        
        allItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
        });
        
        // Após a animação de fade out, mostrar os projetos filtrados
        setTimeout(showFilteredProjects, config.animationDuration);
        
        function showFilteredProjects() {
            // Filtrar projetos
            let filteredProjects = state.currentCategory === 'all' 
                ? [...state.projects] 
                : state.projects.filter(p => p.category === state.currentCategory);
            
            // Calcular projetos da página atual
            const startIndex = (state.currentPage - 1) * config.imagesPerPage;
            const endIndex = startIndex + config.imagesPerPage;
            const pageProjects = filteredProjects.slice(startIndex, endIndex);
            
            // Atualizar índices e visibilidade dos itens
            allItems.forEach((item, index) => {
                const projectId = parseInt(item.dataset.id);
                const project = pageProjects.find(p => parseInt(p.id) === projectId);
                
                if (project) {
                    // Este item deve ser visível
                    item.style.display = 'block';
                    
                    // Atualizar o índice para navegação no lightbox
                    const globalIndex = state.projects.findIndex(p => parseInt(p.id) === projectId);
                    item.dataset.index = globalIndex;
                    
                    // Animar entrada com pequeno atraso baseado na posição
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50 * (index % config.imagesPerPage));
                } else {
                    // Este item deve ser escondido
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, config.animationDuration);
                }
            });
            
            // Se não houver projetos para mostrar
            if (pageProjects.length === 0) {
                const noResults = document.createElement('div');
                noResults.className = 'no-results';
                noResults.textContent = 'Nenhum projeto encontrado nesta categoria.';
                grid.appendChild(noResults);
            } else {
                // Remover mensagem de "nenhum resultado" se existir
                const noResults = grid.querySelector('.no-results');
                if (noResults) {
                    grid.removeChild(noResults);
                }
            }
            
            // Finalizar transição
            state.isTransitioning = false;
        }
    }
    
    /**
     * Abre o lightbox para um projeto específico
     */
    function openLightbox(index) {
        // Validar índice
        if (index < 0 || index >= state.projects.length) return;
        
        // Atualizar estado
        state.currentIndex = index;
        state.isLightboxOpen = true;
        
        // Carregar dados do projeto
        const project = state.projects[index];
        
        // Atualizar conteúdo do lightbox
        updateLightboxContent(project);
        
        // Mostrar lightbox
        state.lightboxElement.classList.add('open');
        document.body.style.overflow = 'hidden'; // Impedir scroll do body
        
        // Pré-carregar próxima imagem para navegação mais suave
        if (config.preloadNextImage) {
            preloadNextImage();
        }
    }
    
    /**
     * Atualiza o conteúdo do lightbox
     */
    function updateLightboxContent(project) {
        const lightbox = state.lightboxElement;
        
        // Imagem principal
        const imageEl = lightbox.querySelector('.lightbox-image');
        imageEl.src = project.image;
        imageEl.alt = project.title;
        
        // Título e descrição
        lightbox.querySelector('.lightbox-title').textContent = project.title;
        lightbox.querySelector('.lightbox-description').innerHTML = project.description;
        
        // Metadados
        const dateEl = lightbox.querySelector('.lightbox-date');
        const clientEl = lightbox.querySelector('.lightbox-client');
        const locationEl = lightbox.querySelector('.lightbox-location');
        
        // Mostrar/esconder elementos com base nos dados disponíveis
        if (project.date) {
            dateEl.textContent = project.date;
            dateEl.style.display = 'inline-block';
        } else {
            dateEl.style.display = 'none';
        }
        
        if (project.client) {
            clientEl.textContent = 'Cliente: ' + project.client;
            clientEl.style.display = 'inline-block';
        } else {
            clientEl.style.display = 'none';
        }
        
        if (project.location) {
            locationEl.textContent = project.location;
            locationEl.style.display = 'inline-block';
        } else {
            locationEl.style.display = 'none';
        }
        
        // Tags
        const tagsContainer = lightbox.querySelector('.lightbox-tags');
        if (project.tags && project.tags.length) {
            tagsContainer.innerHTML = '';
            project.tags.forEach(tag => {
                const tagEl = document.createElement('span');
                tagEl.className = 'project-tag';
                tagEl.textContent = tag;
                tagsContainer.appendChild(tagEl);
            });
            tagsContainer.style.display = 'block';
        } else {
            tagsContainer.style.display = 'none';
        }
    }
    
    /**
     * Pré-carrega a próxima imagem
     */
    function preloadNextImage() {
        const nextIndex = (state.currentIndex + 1) % state.projects.length;
        const nextProject = state.projects[nextIndex];
        
        if (nextProject && nextProject.image) {
            const preloadImg = new Image();
            preloadImg.src = nextProject.image;
        }
    }
    
    /**
     * Fecha o lightbox
     */
    function closeLightbox() {
        state.isLightboxOpen = false;
        state.lightboxElement.classList.remove('open');
        document.body.style.overflow = ''; // Restaurar scroll do body
    }
    
    /**
     * Navega para o projeto anterior
     */
    function navigateToPrev() {
        if (state.isTransitioning) return;
        state.isTransitioning = true;
        
        // Calcular índice anterior (loop para o final se necessário)
        const prevIndex = (state.currentIndex - 1 + state.projects.length) % state.projects.length;
        
        // Animar transição
        const contentEl = state.lightboxElement.querySelector('.lightbox-content');
        contentEl.classList.add('slide-out-right');
        
        setTimeout(() => {
            // Atualizar conteúdo
            state.currentIndex = prevIndex;
            updateLightboxContent(state.projects[prevIndex]);
            
            // Animar entrada
            contentEl.classList.remove('slide-out-right');
            contentEl.classList.add('slide-in-left');
            
            // Limpar classes de animação após transição
            setTimeout(() => {
                contentEl.classList.remove('slide-in-left');
                state.isTransitioning = false;
                
                // Pré-carregar
                if (config.preloadNextImage) {
                    preloadNextImage();
                }
            }, config.animationDuration);
        }, config.animationDuration);
    }
    
    /**
     * Navega para o próximo projeto
     */
    function navigateToNext() {
        if (state.isTransitioning) return;
        state.isTransitioning = true;
        
        // Calcular próximo índice
        const nextIndex = (state.currentIndex + 1) % state.projects.length;
        
        // Animar transição
        const contentEl = state.lightboxElement.querySelector('.lightbox-content');
        contentEl.classList.add('slide-out-left');
        
        setTimeout(() => {
            // Atualizar conteúdo
            state.currentIndex = nextIndex;
            updateLightboxContent(state.projects[nextIndex]);
            
            // Animar entrada
            contentEl.classList.remove('slide-out-left');
            contentEl.classList.add('slide-in-right');
            
            // Limpar classes de animação após transição
            setTimeout(() => {
                contentEl.classList.remove('slide-in-right');
                state.isTransitioning = false;
                
                // Pré-carregar
                if (config.preloadNextImage) {
                    preloadNextImage();
                }
            }, config.animationDuration);
        }, config.animationDuration);
    }
    
    /**
     * Adiciona novos projetos à galeria
     */
    function addProjects(newProjects) {
        if (!Array.isArray(newProjects) || !newProjects.length) return;
        
        // Adicionar ao estado
        state.projects = [...state.projects, ...newProjects];
        
        // Extrair novas categorias
        newProjects.forEach(project => {
            if (project.category) {
                state.categories.add(project.category);
            }
        });
        
        // Recalcular paginação
        calculatePagination();
        
        // Atualizar filtros para incluir novas categorias
        setupControls();
        
        // Replicar filtro atual
        applyFilter(state.currentCategory);
        
        console.log('✅ Adicionados', newProjects.length, 'novos projetos à galeria');
    }
    
    // ==== UTILITÁRIOS ====
    
    /**
     * Capitaliza a primeira letra de uma string
     */
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // API pública
    return {
        init,
        addProjects,
        openLightbox,
        closeLightbox,
        applyFilter,
        goToPage
    };
})();