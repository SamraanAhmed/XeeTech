@@ .. @@
 class XeeListApp {
     constructor() {
         this.baseURL = 'https://api.jikan.moe/v4';
         this.currentPage = 1;
         this.isLoading = false;
+        this.selectedGenres = [];
+        this.currentFilters = {};
         
         this.init();
     }
@@ .. @@
         heroSearchInput?.addEventListener('keypress', (e) => {
             if (e.key === 'Enter') this.handleHeroSearch();
         });
 
+        // Advanced search functionality
+        const advancedSearchBtn = document.getElementById('advancedSearchBtn');
+        const advancedSearchInput = document.getElementById('advancedSearchInput');
+        
+        advancedSearchBtn?.addEventListener('click', () => this.handleAdvancedSearch());
+        advancedSearchInput?.addEventListener('keypress', (e) => {
+            if (e.key === 'Enter') this.handleAdvancedSearch();
+        });
+
+        // Filter functionality
+        const applyFiltersBtn = document.getElementById('applyFiltersBtn');
+        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
+        
+        applyFiltersBtn?.addEventListener('click', () => this.applyFilters());
+        clearFiltersBtn?.addEventListener('click', () => this.clearFilters());
+
+        // Genre tag selection
+        const genreTags = document.querySelectorAll('.genre-tag');
+        genreTags.forEach(tag => {
+            tag.addEventListener('click', () => this.toggleGenre(tag));
+        });
+
         // Mobile menu toggle
@@ .. @@
         }
     }

+    // Handle advanced search
+    async handleAdvancedSearch() {
+        const advancedSearchInput = document.getElementById('advancedSearchInput');
+        const query = advancedSearchInput.value.trim();
+        
+        if (query) {
+            this.currentFilters.query = query;
+            await this.performFilteredSearch();
+        }
+    }
+
+    // Toggle genre selection
+    toggleGenre(genreTag) {
+        const genreId = genreTag.getAttribute('data-genre');
+        const genreName = genreTag.textContent;
+        
+        if (genreTag.classList.contains('active')) {
+            // Remove genre
+            genreTag.classList.remove('active');
+            this.selectedGenres = this.selectedGenres.filter(g => g.id !== genreId);
+        } else {
+            // Add genre
+            genreTag.classList.add('active');
+            this.selectedGenres.push({ id: genreId, name: genreName });
+        }
+    }
+
+    // Apply filters
+    async applyFilters() {
+        const ratingFilter = document.getElementById('ratingFilter').value;
+        const statusFilter = document.getElementById('statusFilter').value;
+        const yearFilter = document.getElementById('yearFilter').value;
+        const typeFilter = document.getElementById('typeFilter').value;
+        const advancedSearchInput = document.getElementById('advancedSearchInput');
+        const query = advancedSearchInput.value.trim();
+
+        // Build filters object
+        this.currentFilters = {};
+        
+        if (query) this.currentFilters.query = query;
+        if (ratingFilter) this.currentFilters.min_score = ratingFilter;
+        if (statusFilter) this.currentFilters.status = statusFilter;
+        if (yearFilter) this.currentFilters.year = yearFilter;
+        if (typeFilter) this.currentFilters.type = typeFilter;
+        if (this.selectedGenres.length > 0) {
+            this.currentFilters.genres = this.selectedGenres.map(g => g.id).join(',');
+        }
+
+        await this.performFilteredSearch();
+    }
+
+    // Clear all filters
+    clearFilters() {
+        // Reset form elements
+        document.getElementById('advancedSearchInput').value = '';
+        document.getElementById('ratingFilter').value = '';
+        document.getElementById('statusFilter').value = '';
+        document.getElementById('yearFilter').value = '';
+        document.getElementById('typeFilter').value = '';
+        
+        // Clear genre selections
+        document.querySelectorAll('.genre-tag').forEach(tag => {
+            tag.classList.remove('active');
+        });
+        
+        // Reset internal state
+        this.selectedGenres = [];
+        this.currentFilters = {};
+        
+        // Hide results
+        const filterResults = document.getElementById('filterResults');
+        filterResults.style.display = 'none';
+        
+        this.showNotification('All filters cleared', 'info');
+    }
+
+    // Perform filtered search
+    async performFilteredSearch() {
+        const filterResults = document.getElementById('filterResults');
+        const filterGrid = document.getElementById('filterGrid');
+        const filterLoading = document.getElementById('filterLoading');
+        const resultsTitle = document.getElementById('resultsTitle');
+        const resultsCount = document.getElementById('resultsCount');
+
+        try {
+            // Show results section and loading
+            filterResults.style.display = 'block';
+            filterLoading.style.display = 'block';
+            filterGrid.innerHTML = '';
+            
+            // Scroll to results
+            filterResults.scrollIntoView({ behavior: 'smooth' });
+
+            // Build API URL with filters
+            let apiUrl = `${this.baseURL}/anime?limit=24`;
+            
+            Object.keys(this.currentFilters).forEach(key => {
+                if (key === 'year' && this.currentFilters[key].includes('-')) {
+                    // Handle year ranges
+                    const [startYear, endYear] = this.currentFilters[key].split('-');
+                    apiUrl += `&start_date=${startYear}-01-01&end_date=${endYear}-12-31`;
+                } else {
+                    apiUrl += `&${key}=${encodeURIComponent(this.currentFilters[key])}`;
+                }
+            });
+
+            console.log('Fetching from:', apiUrl); // Debug log
+
+            const response = await fetch(apiUrl);
+            const data = await response.json();
+
+            if (data.data && data.data.length > 0) {
+                // Update results header
+                resultsTitle.textContent = this.buildResultsTitle();
+                resultsCount.textContent = `${data.data.length} results found`;
+                
+                this.renderAnimeGrid(data.data, filterGrid);
+            } else {
+                this.showError(filterGrid, 'No anime found matching your criteria. Try adjusting your filters.');
+                resultsCount.textContent = '0 results found';
+            }
+        } catch (error) {
+            console.error('Error performing filtered search:', error);
+            this.showError(filterGrid, 'Search failed. Please try again.');
+            resultsCount.textContent = 'Search failed';
+        } finally {
+            filterLoading.style.display = 'none';
+        }
+    }
+
+    // Build results title based on current filters
+    buildResultsTitle() {
+        let title = 'Search Results';
+        
+        if (this.currentFilters.query) {
+            title = `Results for "${this.currentFilters.query}"`;
+        } else if (Object.keys(this.currentFilters).length > 0) {
+            title = 'Filtered Results';
+        }
+        
+        return title;
+    }
+
     // Search anime by query
@@ .. @@
         setTimeout(() => ripple.remove(), 600);
         });
     });

+    // Show notification
+    showNotification(message, type = 'info') {
+        // Remove existing notifications
+        const existingNotification = document.querySelector('.notification');
+        if (existingNotification) {
+            existingNotification.remove();
+        }
+
+        const notification = document.createElement('div');
+        notification.className = `notification ${type}`;
+        notification.style.cssText = `
+            position: fixed;
+            top: 20px;
+            right: 20px;
+            padding: 16px 24px;
+            border-radius: 8px;
+            color: white;
+            font-weight: 500;
+            z-index: 2000;
+            animation: slideInNotification 0.3s ease-out;
+            max-width: 400px;
+            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
+        `;
+
+        switch (type) {
+            case 'success':
+                notification.style.background = '#10b981';
+                break;
+            case 'error':
+                notification.style.background = '#ef4444';
+                break;
+            case 'info':
+                notification.style.background = '#3b82f6';
+                break;
+        }
+
+        notification.textContent = message;
+        document.body.appendChild(notification);
+
+        // Add slide-in animation
+        const style = document.createElement('style');
+        style.textContent = `
+            @keyframes slideInNotification {
+                from {
+                    opacity: 0;
+                    transform: translateX(100%);
+                }
+                to {
+                    opacity: 1;
+                    transform: translateX(0);
+                }
+            }
+        `;
+        document.head.appendChild(style);
+
+        setTimeout(() => {
+            notification.remove();
+            style.remove();
+        }, 4000);
+    }
+
     // Add ripple animation