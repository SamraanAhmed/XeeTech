// XeeList - Anime Database Application
// Using Jikan API for anime data

class XeeListApp {
    constructor() {
        this.baseURL = 'https://api.jikan.moe/v4';
        this.currentPage = 1;
        this.isLoading = false;
        
        this.init();
    }

    // Initialize the application
    init() {
        this.setupEventListeners();
        this.loadInitialData();
    }

    // Set up all event listeners
    setupEventListeners() {
        // Search functionality
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        const heroSearchBtn = document.getElementById('heroSearchBtn');
        const heroSearchInput = document.getElementById('heroSearchInput');

        searchBtn?.addEventListener('click', () => this.handleSearch());
        searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });

        heroSearchBtn?.addEventListener('click', () => this.handleHeroSearch());
        heroSearchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleHeroSearch();
        });

        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        mobileMenuToggle?.addEventListener('click', this.toggleMobileMenu);

        // Modal functionality
        const modal = document.getElementById('animeModal');
        const modalClose = document.getElementById('modalClose');
        
        modalClose?.addEventListener('click', () => this.closeModal());
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });

        // Navigation smooth scrolling
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Scroll spy for navigation
        window.addEventListener('scroll', this.handleScroll);
    }

    // Load initial data for all sections
    async loadInitialData() {
        try {
            await Promise.all([
                this.loadTopAnime(),
                this.loadAiringAnime(),
                this.loadTrendingAnime()
            ]);
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    }

    // Load top anime of all time
    async loadTopAnime() {
        const loadingElement = document.getElementById('topAnimeLoading');
        const gridElement = document.getElementById('topAnimeGrid');

        try {
            loadingElement.style.display = 'block';
            
            const response = await fetch(`${this.baseURL}/top/anime?limit=12`);
            const data = await response.json();

            if (data.data && data.data.length > 0) {
                this.renderAnimeGrid(data.data, gridElement);
            } else {
                this.showError(gridElement, 'No top anime found');
            }
        } catch (error) {
            console.error('Error loading top anime:', error);
            this.showError(gridElement, 'Failed to load top anime');
        } finally {
            loadingElement.style.display = 'none';
        }
    }

    // Load currently airing anime
    async loadAiringAnime() {
        const loadingElement = document.getElementById('airingLoading');
        const gridElement = document.getElementById('airingGrid');

        try {
            loadingElement.style.display = 'block';
            
            const response = await fetch(`${this.baseURL}/seasons/now?limit=12`);
            const data = await response.json();

            if (data.data && data.data.length > 0) {
                this.renderAnimeGrid(data.data, gridElement);
            } else {
                this.showError(gridElement, 'No airing anime found');
            }
        } catch (error) {
            console.error('Error loading airing anime:', error);
            this.showError(gridElement, 'Failed to load airing anime');
        } finally {
            loadingElement.style.display = 'none';
        }
    }

    // Load trending/popular anime
    async loadTrendingAnime() {
        const loadingElement = document.getElementById('trendingLoading');
        const gridElement = document.getElementById('trendingGrid');

        try {
            loadingElement.style.display = 'block';
            
            const response = await fetch(`${this.baseURL}/anime?order_by=popularity&sort=asc&limit=12`);
            const data = await response.json();

            if (data.data && data.data.length > 0) {
                this.renderAnimeGrid(data.data, gridElement);
            } else {
                this.showError(gridElement, 'No trending anime found');
            }
        } catch (error) {
            console.error('Error loading trending anime:', error);
            this.showError(gridElement, 'Failed to load trending anime');
        } finally {
            loadingElement.style.display = 'none';
        }
    }

    // Handle search from navigation
    async handleSearch() {
        const searchInput = document.getElementById('searchInput');
        const query = searchInput.value.trim();
        
        if (query) {
            await this.searchAnime(query);
        }
    }

    // Handle search from hero section
    async handleHeroSearch() {
        const heroSearchInput = document.getElementById('heroSearchInput');
        const query = heroSearchInput.value.trim();
        
        if (query) {
            await this.searchAnime(query);
        }
    }

    // Search anime by query
    async searchAnime(query) {
        const searchResults = document.getElementById('searchResults');
        const searchGrid = document.getElementById('searchGrid');

        try {
            // Show search results section
            searchResults.style.display = 'block';
            searchGrid.innerHTML = '<div class="loading"><div class="spinner"></div><p>Searching...</p></div>';

            // Scroll to search results
            searchResults.scrollIntoView({ behavior: 'smooth' });

            const response = await fetch(`${this.baseURL}/anime?q=${encodeURIComponent(query)}&limit=20`);
            const data = await response.json();

            if (data.data && data.data.length > 0) {
                // Update section title
                const sectionTitle = searchResults.querySelector('.section-title');
                sectionTitle.textContent = `Search Results for "${query}"`;
                
                this.renderAnimeGrid(data.data, searchGrid);
            } else {
                this.showError(searchGrid, `No results found for "${query}"`);
            }
        } catch (error) {
            console.error('Error searching anime:', error);
            this.showError(searchGrid, 'Search failed. Please try again.');
        }
    }

    // Render anime grid
    renderAnimeGrid(animeList, container) {
        container.innerHTML = '';

        animeList.forEach(anime => {
            const animeCard = this.createAnimeCard(anime);
            container.appendChild(animeCard);
        });
    }

    // Create individual anime card
    createAnimeCard(anime) {
        const card = document.createElement('div');
        card.className = 'anime-card';
        card.addEventListener('click', () => this.showAnimeDetails(anime));

        // Get anime image
        const imageUrl = anime.images?.jpg?.large_image_url || 
                        anime.images?.jpg?.image_url || 
                        'https://via.placeholder.com/300x400?text=No+Image';

        // Get anime score
        const score = anime.score ? anime.score.toFixed(1) : 'N/A';

        // Get anime year
        const year = anime.aired?.from ? new Date(anime.aired.from).getFullYear() : 'Unknown';

        // Get genres (limit to 3)
        const genres = anime.genres?.slice(0, 3) || [];

        // Truncate synopsis
        const synopsis = anime.synopsis ? 
            (anime.synopsis.length > 150 ? anime.synopsis.substring(0, 150) + '...' : anime.synopsis) : 
            'No synopsis available.';

        card.innerHTML = `
            <img src="${imageUrl}" alt="${anime.title}" class="anime-image" loading="lazy">
            <div class="anime-info">
                <h3 class="anime-title">${anime.title}</h3>
                <div class="anime-meta">
                    <span class="anime-score">${score}</span>
                    <span class="anime-year">${year}</span>
                </div>
                <p class="anime-synopsis">${synopsis}</p>
                <div class="anime-genres">
                    ${genres.map(genre => `<span class="genre-tag">${genre.name}</span>`).join('')}
                </div>
            </div>
        `;

        return card;
    }

    // Show anime details in modal
    async showAnimeDetails(anime) {
        const modal = document.getElementById('animeModal');
        const modalBody = document.getElementById('modalBody');

        try {
            // Show loading in modal
            modalBody.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading details...</p></div>';
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';

            // Fetch detailed anime information
            const response = await fetch(`${this.baseURL}/anime/${anime.mal_id}/full`);
            const data = await response.json();
            const detailedAnime = data.data;

            // Render detailed information
            this.renderAnimeDetails(detailedAnime, modalBody);
        } catch (error) {
            console.error('Error loading anime details:', error);
            modalBody.innerHTML = '<div class="error-message">Failed to load anime details</div>';
        }
    }

    // Render detailed anime information
    renderAnimeDetails(anime, container) {
        const imageUrl = anime.images?.jpg?.large_image_url || 
                        anime.images?.jpg?.image_url || 
                        'https://via.placeholder.com/300x400?text=No+Image';

        const score = anime.score ? anime.score.toFixed(1) : 'N/A';
        const year = anime.aired?.from ? new Date(anime.aired.from).getFullYear() : 'Unknown';
        const status = anime.status || 'Unknown';
        const episodes = anime.episodes || 'Unknown';
        const duration = anime.duration || 'Unknown';
        const genres = anime.genres || [];
        const studios = anime.studios || [];

        container.innerHTML = `
            <div style="display: flex; gap: 30px; flex-wrap: wrap;">
                <div style="flex: 0 0 300px;">
                    <img src="${imageUrl}" alt="${anime.title}" style="width: 100%; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.15);">
                </div>
                <div style="flex: 1; min-width: 300px;">
                    <h2 style="font-size: 28px; margin-bottom: 16px; color: #1e293b;">${anime.title}</h2>
                    ${anime.title_english && anime.title_english !== anime.title ? 
                        `<h3 style="font-size: 18px; color: #64748b; margin-bottom: 20px;">${anime.title_english}</h3>` : ''}
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 24px;">
                        <div>
                            <strong style="color: #374151;">Score:</strong>
                            <div style="background: #10b981; color: white; padding: 4px 12px; border-radius: 20px; display: inline-block; margin-top: 4px; font-weight: 600;">${score}</div>
                        </div>
                        <div>
                            <strong style="color: #374151;">Year:</strong>
                            <div style="margin-top: 4px;">${year}</div>
                        </div>
                        <div>
                            <strong style="color: #374151;">Status:</strong>
                            <div style="margin-top: 4px;">${status}</div>
                        </div>
                        <div>
                            <strong style="color: #374151;">Episodes:</strong>
                            <div style="margin-top: 4px;">${episodes}</div>
                        </div>
                        <div>
                            <strong style="color: #374151;">Duration:</strong>
                            <div style="margin-top: 4px;">${duration}</div>
                        </div>
                    </div>

                    ${genres.length > 0 ? `
                        <div style="margin-bottom: 20px;">
                            <strong style="color: #374151;">Genres:</strong>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
                                ${genres.map(genre => `<span style="background: #e0e7ff; color: #3730a3; padding: 6px 12px; border-radius: 16px; font-size: 14px; font-weight: 500;">${genre.name}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}

                    ${studios.length > 0 ? `
                        <div style="margin-bottom: 20px;">
                            <strong style="color: #374151;">Studios:</strong>
                            <div style="margin-top: 4px;">${studios.map(studio => studio.name).join(', ')}</div>
                        </div>
                    ` : ''}

                    ${anime.synopsis ? `
                        <div>
                            <strong style="color: #374151;">Synopsis:</strong>
                            <p style="margin-top: 8px; line-height: 1.6; color: #64748b;">${anime.synopsis}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Close modal
    closeModal() {
        const modal = document.getElementById('animeModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Show error message
    showError(container, message) {
        container.innerHTML = `<div class="error-message">${message}</div>`;
    }

    // Toggle mobile menu
    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.classList.toggle('mobile-active');
    }

    // Handle scroll for navigation highlighting
    handleScroll() {
        const sections = document.querySelectorAll('.anime-section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new XeeListApp();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC key to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('animeModal');
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        searchInput?.focus();
    }
});