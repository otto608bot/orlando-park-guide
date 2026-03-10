/**
 * Shared Filter Component for Plan Your Park
 * Include this script on any page that needs filters
 * 
 * Usage:
 * 1. Include this script: <script src="/components/filter-component.js"></script>
 * 2. Add a container: <div id="filter-sidebar"></div>
 * 3. Add mobile sheet container: <div id="filter-mobile-sheet"></div>
 * 4. Call: FilterComponent.init('filter-sidebar', 'filter-mobile-sheet');
 */

const FilterComponent = (function() {
  'use strict';
  
  // Default filter state
  const defaultState = {
    height: 0,
    pregnancy: false,
    wheelchair: 'any',
    sensory: {
      dark: false,
      loud: false,
      sudden: false,
      enclosed: false,
      strobe: false
    }
  };
  
  // Current state
  let state = { ...defaultState };
  
  // Callbacks
  let onFilterChange = null;
  
  // Storage key
  const STORAGE_KEY = 'pyp_filters_v1';
  
  /**
   * Generate the sidebar filter HTML
   */
  function generateSidebarHTML() {
    return `
      <div class="sidebar-section">
        <h3 class="sidebar-title">Filters</h3>
        
        <!-- Height Filter -->
        <div class="height-filter">
          <div class="height-display" id="height-display">Any <span>height</span></div>
          <div class="height-ruler">
            <input type="range" id="height-slider" min="0" max="54" value="0" step="1">
          </div>
        </div>
        
        <!-- Pregnancy Filter -->
        <button class="filter-chip" id="chip-pregnancy" data-filter="pregnancy">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 4c1.5 0 2.5 1 2.5 2.5S13.5 9 12 9s-2.5-1-2.5-2.5S10.5 4 12 4z"></path>
            <path d="M12 9c2.5 0 4.5 2 4.5 4.5v.5c0 2.5-2 4.5-4.5 4.5s-4.5-2-4.5-4.5v-.5C7.5 11 9.5 9 12 9z"></path>
            <path d="M12 18v3"></path>
            <path d="M9 21h6"></path>
          </svg>
          Pregnancy Safe
        </button>
        
        <!-- Wheelchair Filter -->
        <div style="margin-top: var(--space-lg);">
          <h4 style="font-size: 0.8125rem; color: var(--gray-500); margin-bottom: var(--space-sm); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Wheelchair Access</h4>
          <div class="wheelchair-options">
            <button class="wheelchair-option active" id="wheelchair-any" data-wheelchair="any">
              Any
            </button>
            <button class="wheelchair-option" id="wheelchair-wav" data-wheelchair="WAV">
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" style="width: 16px; height: 16px;">
                <path d="M 73.12 88.75 L 72.18 87.50 L 59.95 58.75 L 32.66 58.61 L 29.97 22.50 L 29.70 20.00 L 28.36 16.94 L 28.36 14.17 L 28.90 12.22 L 31.72 8.75 L 35.22 7.36 L 37.37 7.36 L 39.25 7.92 L 42.34 10.28 L 43.95 13.61 L 43.95 17.50 L 42.88 20.00 L 40.59 22.36 L 36.69 23.89 L 37.90 37.08 L 62.23 37.22 L 62.10 43.19 L 38.44 43.19 L 38.84 51.39 L 64.25 51.53 L 76.21 79.17 L 76.88 79.58 L 83.87 76.53 L 84.68 76.25 L 85.08 76.67 L 87.23 82.22 L 87.10 82.92 L 73.12 88.75 Z" fill="currentColor"/>
                <path d="M 39.52 92.36 L 35.48 92.36 L 31.99 91.81 L 28.49 90.69 L 23.39 87.92 L 20.70 85.69 L 17.34 81.94 L 15.73 79.44 L 13.31 73.61 L 12.50 70.00 L 12.50 62.78 L 14.38 55.83 L 15.73 53.06 L 19.09 48.47 L 23.39 44.58 L 27.42 42.36 L 28.09 43.06 L 28.36 49.72 L 24.60 52.78 L 21.64 56.67 L 20.56 58.89 L 19.22 64.17 L 19.22 68.33 L 20.56 73.61 L 22.72 77.50 L 25.27 80.42 L 28.23 82.64 L 30.91 84.03 L 34.95 85.14 L 40.32 85.14 L 44.35 84.03 L 47.04 82.64 L 51.21 79.17 L 54.44 74.17 L 56.05 68.06 L 55.65 62.36 L 57.93 62.50 L 61.96 71.94 L 61.96 73.61 L 59.81 78.89 L 57.66 82.22 L 54.84 85.42 L 50.54 88.75 L 47.31 90.42 L 43.01 91.81 L 39.52 92.36 Z" fill="currentColor"/>
              </svg>
              Stay in Wheelchair
            </button>
            <button class="wheelchair-option" id="wheelchair-tav" data-wheelchair="TAV">
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" style="width: 16px; height: 16px;">
                <path d="M 73.12 88.75 L 72.18 87.50 L 59.95 58.75 L 32.66 58.61 L 29.97 22.50 L 29.70 20.00 L 28.36 16.94 L 28.36 14.17 L 28.90 12.22 L 31.72 8.75 L 35.22 7.36 L 37.37 7.36 L 39.25 7.92 L 42.34 10.28 L 43.95 13.61 L 43.95 17.50 L 42.88 20.00 L 40.59 22.36 L 36.69 23.89 L 37.90 37.08 L 62.23 37.22 L 62.10 43.19 L 38.44 43.19 L 38.84 51.39 L 64.25 51.53 L 76.21 79.17 L 76.88 79.58 L 83.87 76.53 L 84.68 76.25 L 85.08 76.67 L 87.23 82.22 L 87.10 82.92 L 73.12 88.75 Z" fill="currentColor"/>
                <path d="M 39.52 92.36 L 35.48 92.36 L 31.99 91.81 L 28.49 90.69 L 23.39 87.92 L 20.70 85.69 L 17.34 81.94 L 15.73 79.44 L 13.31 73.61 L 12.50 70.00 L 12.50 62.78 L 14.38 55.83 L 15.73 53.06 L 19.09 48.47 L 23.39 44.58 L 27.42 42.36 L 28.09 43.06 L 28.36 49.72 L 24.60 52.78 L 21.64 56.67 L 20.56 58.89 L 19.22 64.17 L 19.22 68.33 L 20.56 73.61 L 22.72 77.50 L 25.27 80.42 L 28.23 82.64 L 30.91 84.03 L 34.95 85.14 L 40.32 85.14 L 44.35 84.03 L 47.04 82.64 L 51.21 79.17 L 54.44 74.17 L 56.05 68.06 L 55.65 62.36 L 57.93 62.50 L 61.96 71.94 L 61.96 73.61 L 59.81 78.89 L 57.66 82.22 L 54.84 85.42 L 50.54 88.75 L 47.31 90.42 L 43.01 91.81 L 39.52 92.36 Z" fill="currentColor"/>
              </svg>
              Transfer Required
            </button>
          </div>
        </div>
        
        <!-- Sensory Filters -->
        <div style="margin-top: var(--space-lg);">
          <h4 style="font-size: 0.8125rem; color: var(--gray-500); margin-bottom: var(--space-sm); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Avoid Sensory Triggers</h4>
          <div class="sensory-filters">
            <button class="sensory-filter" id="sensory-dark" data-sensory="dark">
              <input type="checkbox" id="cb-dark">
              <span>Dark Spaces</span>
            </button>
            <button class="sensory-filter" id="sensory-loud" data-sensory="loud">
              <input type="checkbox" id="cb-loud">
              <span>Loud Noises</span>
            </button>
            <button class="sensory-filter" id="sensory-sudden" data-sensory="sudden">
              <input type="checkbox" id="cb-sudden">
              <span>Sudden Movements</span>
            </button>
            <button class="sensory-filter" id="sensory-enclosed" data-sensory="enclosed">
              <input type="checkbox" id="cb-enclosed">
              <span>Enclosed Spaces</span>
            </button>
            <button class="sensory-filter" id="sensory-strobe" data-sensory="strobe">
              <input type="checkbox" id="cb-strobe">
              <span>Strobe Lights</span>
            </button>
          </div>
        </div>
        
        <!-- Clear Filters -->
        <button class="clear-filters-btn" id="clear-filters-btn">
          Clear All Filters
        </button>
      </div>
      
      <div class="sidebar-section">
        <h3 class="sidebar-title">Get Tickets</h3>
        <div class="ticket-cards">
          <a href="https://www.dpbolvw.net/click-101693488-5527150" target="_blank" rel="noopener noreferrer" class="ticket-card disney">
            🏰 Disney World
          </a>
          <a href="https://www.anrdoezrs.net/click-101693488-12540773" target="_blank" rel="noopener noreferrer" class="ticket-card universal">
            🎢 Universal
          </a>
          <a href="https://www.kqzyfj.com/click-101693488-12540778" target="_blank" rel="noopener noreferrer" class="ticket-card seaworld">
            🐋 SeaWorld
          </a>
          <a href="https://www.jdoqocy.com/click-101693488-12540781" target="_blank" rel="noopener noreferrer" class="ticket-card legoland">
            🧱 LEGOLAND
          </a>
        </div>
        <p style="font-size: 0.75rem; color: var(--gray-500); margin-top: var(--space-md);">Affiliate links — we earn a commission at no extra cost to you</p>
      </div>
    `;
  }
  
  /**
   * Generate the mobile filter sheet HTML
   */
  function generateMobileSheetHTML() {
    return `
      <div class="mobile-filter-sheet" id="mobile-filter-sheet">
        <div class="mobile-filter-content" onclick="event.stopPropagation()">
          <div class="mobile-filter-header">
            <h3>Filters</h3>
            <button class="close-sheet-btn" id="close-mobile-filters">&times;</button>
          </div>
          
          <!-- Height Filter -->
          <div class="height-filter">
            <div class="height-display" id="mobile-height-display">Any <span>height</span></div>
            <div class="height-ruler">
              <input type="range" id="mobile-height-slider" min="0" max="54" value="0" step="1">
            </div>
          </div>
          
          <!-- Pregnancy Filter -->
          <button class="filter-chip" id="mobile-chip-pregnancy" data-filter="pregnancy" style="margin-top: var(--space-lg);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 4c1.5 0 2.5 1 2.5 2.5S13.5 9 12 9s-2.5-1-2.5-2.5S10.5 4 12 4z"></path>
              <path d="M12 9c2.5 0 4.5 2 4.5 4.5v.5c0 2.5-2 4.5-4.5 4.5s-4.5-2-4.5-4.5v-.5C7.5 11 9.5 9 12 9z"></path>
              <path d="M12 18v3"></path>
              <path d="M9 21h6"></path>
            </svg>
            Pregnancy Safe
          </button>
          
          <!-- Wheelchair Filter -->
          <div style="margin-top: var(--space-lg);">
            <h4 style="font-size: 0.8125rem; color: var(--gray-500); margin-bottom: var(--space-sm); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Wheelchair Access</h4>
            <div class="wheelchair-options">
              <button class="wheelchair-option active" id="mobile-wheelchair-any" data-wheelchair="any">
                Any
              </button>
              <button class="wheelchair-option" id="mobile-wheelchair-wav" data-wheelchair="WAV">
                Stay in Wheelchair
              </button>
              <button class="wheelchair-option" id="mobile-wheelchair-tav" data-wheelchair="TAV">
                Transfer Required
              </button>
            </div>
          </div>
          
          <!-- Sensory Filters -->
          <div style="margin-top: var(--space-lg);">
            <h4 style="font-size: 0.8125rem; color: var(--gray-500); margin-bottom: var(--space-sm); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Avoid Sensory Triggers</h4>
            <div class="sensory-filters">
              <button class="sensory-filter" id="mobile-sensory-dark" data-sensory="dark">
                <input type="checkbox" id="mobile-cb-dark">
                <span>Dark Spaces</span>
              </button>
              <button class="sensory-filter" id="mobile-sensory-loud" data-sensory="loud">
                <input type="checkbox" id="mobile-cb-loud">
                <span>Loud Noises</span>
              </button>
              <button class="sensory-filter" id="mobile-sensory-sudden" data-sensory="sudden">
                <input type="checkbox" id="mobile-cb-sudden">
                <span>Sudden Movements</span>
              </button>
              <button class="sensory-filter" id="mobile-sensory-enclosed" data-sensory="enclosed">
                <input type="checkbox" id="mobile-cb-enclosed">
                <span>Enclosed Spaces</span>
              </button>
              <button class="sensory-filter" id="mobile-sensory-strobe" data-sensory="strobe">
                <input type="checkbox" id="mobile-cb-strobe">
                <span>Strobe Lights</span>
              </button>
            </div>
          </div>
          
          <!-- Clear Filters -->
          <button class="clear-filters-btn" id="mobile-clear-filters-btn">
            Clear All Filters
          </button>
          
          <div style="margin-top: var(--space-xl); padding-top: var(--space-lg); border-top: 1px solid var(--gray-200);">
            <h4 style="font-family: var(--font-heading); font-size: 0.875rem; margin-bottom: var(--space-md);">Get Tickets</h4>
            <div class="ticket-cards">
              <a href="https://www.dpbolvw.net/click-101693488-5527150" target="_blank" rel="noopener noreferrer" class="ticket-card disney">
                🏰 Disney World
              </a>
              <a href="https://www.anrdoezrs.net/click-101693488-12540773" target="_blank" rel="noopener noreferrer" class="ticket-card universal">
                🎢 Universal
              </a>
              <a href="https://www.kqzyfj.com/click-101693488-12540778" target="_blank" rel="noopener noreferrer" class="ticket-card seaworld">
                🐋 SeaWorld
              </a>
              <a href="https://www.jdoqocy.com/click-101693488-12540781" target="_blank" rel="noopener noreferrer" class="ticket-card legoland">
                🧱 LEGOLAND
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Update the height display text
   */
  function updateHeightDisplay(value) {
    const text = value === 0 ? 'Any <span>height</span>' : value + '" <span>minimum</span>';
    const displays = document.querySelectorAll('#height-display, #mobile-height-display');
    displays.forEach(el => {
      if (el) el.innerHTML = text;
    });
  }
  
  /**
   * Update UI to match current state
   */
  function updateUI() {
    // Height slider
    const heightSlider = document.getElementById('height-slider');
    const mobileHeightSlider = document.getElementById('mobile-height-slider');
    if (heightSlider) heightSlider.value = state.height;
    if (mobileHeightSlider) mobileHeightSlider.value = state.height;
    updateHeightDisplay(state.height);
    
    // Pregnancy chip
    const pregnancyChips = document.querySelectorAll('[data-filter="pregnancy"]');
    pregnancyChips.forEach(chip => {
      chip.classList.toggle('active', state.pregnancy);
    });
    
    // Wheelchair options
    const wheelchairOptions = document.querySelectorAll('[data-wheelchair]');
    wheelchairOptions.forEach(opt => {
      opt.classList.toggle('active', opt.dataset.wheelchair === state.wheelchair);
    });
    
    // Sensory filters
    Object.keys(state.sensory).forEach(key => {
      const filters = document.querySelectorAll(`[data-sensory="${key}"]`);
      filters.forEach(filter => {
        filter.classList.toggle('active', state.sensory[key]);
        const checkbox = filter.querySelector('input[type="checkbox"]');
        if (checkbox) checkbox.checked = state.sensory[key];
      });
    });
  }
  
  /**
   * Save filters to localStorage
   */
  function saveFilters() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...state,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('Failed to save filters:', e);
    }
  }
  
  /**
   * Load filters from localStorage
   */
  function loadFilters() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if filters are less than 7 days old
        if (parsed.timestamp && (Date.now() - parsed.timestamp) < 7 * 24 * 60 * 60 * 1000) {
          state = {
            height: parsed.height ?? 0,
            pregnancy: parsed.pregnancy ?? false,
            wheelchair: parsed.wheelchair ?? 'any',
            sensory: {
              dark: parsed.sensory?.dark ?? false,
              loud: parsed.sensory?.loud ?? false,
              sudden: parsed.sensory?.sudden ?? false,
              enclosed: parsed.sensory?.enclosed ?? false,
              strobe: parsed.sensory?.strobe ?? false
            }
          };
        }
      }
    } catch (e) {
      console.warn('Failed to load filters:', e);
    }
  }
  
  /**
   * Notify callback of filter change
   */
  function notifyChange() {
    saveFilters();
    if (onFilterChange) {
      onFilterChange({ ...state });
    }
  }
  
  /**
   * Set up event listeners
   */
  function setupEventListeners() {
    // Height slider
    const heightSlider = document.getElementById('height-slider');
    const mobileHeightSlider = document.getElementById('mobile-height-slider');
    
    const handleHeightChange = (e) => {
      state.height = parseInt(e.target.value, 10);
      updateHeightDisplay(state.height);
      updateUI();
      notifyChange();
    };
    
    if (heightSlider) heightSlider.addEventListener('input', handleHeightChange);
    if (mobileHeightSlider) mobileHeightSlider.addEventListener('input', handleHeightChange);
    
    // Pregnancy filter
    const pregnancyChips = document.querySelectorAll('[data-filter="pregnancy"]');
    pregnancyChips.forEach(chip => {
      chip.addEventListener('click', () => {
        state.pregnancy = !state.pregnancy;
        updateUI();
        notifyChange();
      });
    });
    
    // Wheelchair filters
    const wheelchairOptions = document.querySelectorAll('[data-wheelchair]');
    wheelchairOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        state.wheelchair = opt.dataset.wheelchair;
        updateUI();
        notifyChange();
      });
    });
    
    // Sensory filters
    const sensoryFilters = document.querySelectorAll('[data-sensory]');
    sensoryFilters.forEach(filter => {
      filter.addEventListener('click', () => {
        const key = filter.dataset.sensory;
        state.sensory[key] = !state.sensory[key];
        updateUI();
        notifyChange();
      });
    });
    
    // Clear filters
    const clearBtns = document.querySelectorAll('#clear-filters-btn, #mobile-clear-filters-btn');
    clearBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        state = { ...defaultState };
        updateUI();
        notifyChange();
      });
    });
    
    // Mobile sheet close
    const closeBtn = document.getElementById('close-mobile-filters');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMobileSheet);
    }
    
    // Close on backdrop click
    const sheet = document.getElementById('mobile-filter-sheet');
    if (sheet) {
      sheet.addEventListener('click', (e) => {
        if (e.target === sheet) closeMobileSheet();
      });
    }
  }
  
  /**
   * Open mobile filter sheet
   */
  function openMobileSheet() {
    const sheet = document.getElementById('mobile-filter-sheet');
    if (sheet) {
      sheet.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  
  /**
   * Close mobile filter sheet
   */
  function closeMobileSheet() {
    const sheet = document.getElementById('mobile-filter-sheet');
    if (sheet) {
      sheet.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  /**
   * Initialize the filter component
   * @param {string} sidebarContainerId - ID of the sidebar container
   * @param {string} mobileSheetContainerId - ID of the mobile sheet container
   * @param {function} callback - Called when filters change
   */
  function init(sidebarContainerId, mobileSheetContainerId, callback) {
    onFilterChange = callback;
    
    // Load saved filters
    loadFilters();
    
    // Inject HTML
    const sidebarContainer = document.getElementById(sidebarContainerId);
    const mobileSheetContainer = document.getElementById(mobileSheetContainerId);
    
    if (sidebarContainer) {
      sidebarContainer.innerHTML = generateSidebarHTML();
    }
    
    if (mobileSheetContainer) {
      mobileSheetContainer.innerHTML = generateMobileSheetHTML();
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Update UI to match state
    updateUI();
    
    // Initial callback
    if (onFilterChange) {
      onFilterChange({ ...state });
    }
  }
  
  /**
   * Get current filter state
   */
  function getState() {
    return { ...state };
  }
  
  /**
   * Set filter state programmatically
   */
  function setState(newState) {
    state = {
      ...state,
      ...newState,
      sensory: { ...state.sensory, ...newState.sensory }
    };
    updateUI();
    notifyChange();
  }
  
  // Public API
  return {
    init,
    getState,
    setState,
    openMobileSheet,
    closeMobileSheet
  };
})();

// Make available globally
window.FilterComponent = FilterComponent;
