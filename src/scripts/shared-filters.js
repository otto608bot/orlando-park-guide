/**
 * Shared Filters Module - Plan Your Park
 * Handles filter state persistence across pages using localStorage
 */

window.SharedFilters = (function() {
  const STORAGE_KEY = 'pyp_filters_v1';
  
  // Default filter state
  const defaultState = {
    height: 0,
    pregnancy: false,
    wheelchair: false,
    sensory: false,
    location: 'all',
    meal: 'all',
    character: 'all'
  };
  
  // Current state
  let state = { ...defaultState };
  
  // Callbacks for state changes
  const listeners = [];
  
  /**
   * Initialize the filter state from localStorage
   */
  function init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        state = { ...defaultState, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load filters from localStorage:', e);
    }
    
    // Listen for global filter events
    document.addEventListener('global:openFilters', handleOpenFilters);
    document.addEventListener('global:closeFilters', handleCloseFilters);
    
    return state;
  }
  
  /**
   * Get current filter state
   */
  function getState() {
    return { ...state };
  }
  
  /**
   * Set a specific filter value
   */
  function setFilter(key, value) {
    if (state[key] !== value) {
      state[key] = value;
      saveState();
      notifyListeners();
    }
  }
  
  /**
   * Toggle a boolean filter
   */
  function toggleFilter(key) {
    if (typeof state[key] === 'boolean') {
      state[key] = !state[key];
      saveState();
      notifyListeners();
    }
  }
  
  /**
   * Reset all filters to defaults
   */
  function resetFilters() {
    state = { ...defaultState };
    saveState();
    notifyListeners();
  }
  
  /**
   * Subscribe to filter changes
   */
  function onChange(callback) {
    listeners.push(callback);
    return () => {
      const index = listeners.indexOf(callback);
      if (index > -1) listeners.splice(index, 1);
    };
  }
  
  /**
   * Save state to localStorage
   */
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save filters to localStorage:', e);
    }
  }
  
  /**
   * Notify all listeners of state change
   */
  function notifyListeners() {
    const currentState = getState();
    listeners.forEach(cb => {
      try {
        cb(currentState);
      } catch (e) {
        console.error('Filter listener error:', e);
      }
    });
  }
  
  /**
   * Filter rides based on current state
   */
  function filterRides(rides) {
    return rides.filter(ride => {
      // Height filter
      if (state.height > 0 && ride.height > state.height) {
        return false;
      }
      
      // Pregnancy filter
      if (state.pregnancy && !ride.pregnant) {
        return false;
      }
      
      // Wheelchair filter - show only rides where you can stay in wheelchair
      if (state.wheelchair && ride.wheelchair !== 'WAV') {
        return false;
      }
      
      // Sensory filter - show only calm experiences
      if (state.sensory) {
        const s = ride.sensory;
        // If any intense sensory elements, exclude
        if (s.dark || s.loud || s.sudden || s.strobe || s.enclosed) {
          return false;
        }
      }
      
      return true;
    });
  }
  
  /**
   * Filter character meals based on current state
   */
  function filterCharacterMeals(meals) {
    return meals.filter(meal => {
      // Location filter
      if (state.location === 'park' && !meal.location.park) return false;
      if (state.location === 'resort' && meal.location.park) return false;
      
      // Meal time filter
      if (state.meal !== 'all') {
        const mealData = meal.meals[state.meal];
        if (!mealData || !mealData.available) return false;
      }
      
      // Character filter (if specific character selected)
      if (state.character !== 'all') {
        const allChars = [
          ...(meal.characters.breakfast || []),
          ...(meal.characters.lunch || []),
          ...(meal.characters.dinner || [])
        ];
        const uniqueChars = [...new Set(allChars)];
        if (!uniqueChars.some(c => c.toLowerCase().includes(state.character.toLowerCase()))) {
          return false;
        }
      }
      
      return true;
    });
  }
  
  /**
   * Sync UI elements with current state
   */
  function syncUI() {
    // Height slider (desktop)
    const heightSlider = document.getElementById('height-slider');
    const heightDisplay = document.getElementById('height-display');
    if (heightSlider) {
      heightSlider.value = state.height;
      if (heightDisplay) {
        heightDisplay.innerHTML = state.height === 0 ? 'Any <span>height</span>' : `${state.height}" <span>max</span>`;
      }
    }
    
    // Height slider (mobile)
    const mobileHeightSlider = document.getElementById('mobile-height-slider');
    const mobileHeightDisplay = document.getElementById('mobile-height-display');
    if (mobileHeightSlider) {
      mobileHeightSlider.value = state.height;
      if (mobileHeightDisplay) {
        mobileHeightDisplay.innerHTML = state.height === 0 ? 'Any <span>height</span>' : `${state.height}" <span>max</span>`;
      }
    }
    
    // Filter chips (desktop)
    updateChip('chip-pregnancy', state.pregnancy);
    updateChip('chip-wheelchair', state.wheelchair);
    updateChip('chip-sensory', state.sensory);
    
    // Filter chips (mobile)
    updateChip('mobile-chip-pregnancy', state.pregnancy);
    updateChip('mobile-chip-wheelchair', state.wheelchair);
    updateChip('mobile-chip-sensory', state.sensory);
    
    // Location filters
    updateLocationChips();
    
    // Meal filters
    updateMealChips();
  }
  
  /**
   * Update a single chip's active state
   */
  function updateChip(id, isActive) {
    const chip = document.getElementById(id);
    if (chip) {
      if (isActive) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    }
  }
  
  /**
   * Update location filter chips
   */
  function updateLocationChips() {
    document.querySelectorAll('[data-filter]').forEach(chip => {
      const isActive = chip.dataset.filter === state.location;
      chip.classList.toggle('active', isActive);
    });
  }
  
  /**
   * Update meal filter chips
   */
  function updateMealChips() {
    document.querySelectorAll('[data-meal]').forEach(chip => {
      const isActive = chip.dataset.meal === state.meal;
      chip.classList.toggle('active', isActive);
    });
  }
  
  /**
   * Handle global:openFilters event
   */
  function handleOpenFilters() {
    const sheet = document.getElementById('mobile-filter-sheet');
    if (sheet) {
      sheet.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  
  /**
   * Handle global:closeFilters event
   */
  function handleCloseFilters() {
    const sheet = document.getElementById('mobile-filter-sheet');
    if (sheet) {
      sheet.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  /**
   * Setup event listeners for filter UI elements
   */
  function setupEventListeners() {
    // Height slider (desktop)
    const heightSlider = document.getElementById('height-slider');
    if (heightSlider) {
      heightSlider.addEventListener('input', (e) => {
        setFilter('height', parseInt(e.target.value, 10));
        syncUI();
      });
    }
    
    // Height slider (mobile)
    const mobileHeightSlider = document.getElementById('mobile-height-slider');
    if (mobileHeightSlider) {
      mobileHeightSlider.addEventListener('input', (e) => {
        setFilter('height', parseInt(e.target.value, 10));
        syncUI();
      });
    }
    
    // Filter chips (desktop)
    setupChipListener('chip-pregnancy', 'pregnancy');
    setupChipListener('chip-wheelchair', 'wheelchair');
    setupChipListener('chip-sensory', 'sensory');
    
    // Filter chips (mobile)
    setupChipListener('mobile-chip-pregnancy', 'pregnancy');
    setupChipListener('mobile-chip-wheelchair', 'wheelchair');
    setupChipListener('mobile-chip-sensory', 'sensory');
    
    // Location filter chips
    document.querySelectorAll('[data-filter]').forEach(chip => {
      chip.addEventListener('click', () => {
        setFilter('location', chip.dataset.filter);
        syncUI();
      });
    });
    
    // Meal filter chips
    document.querySelectorAll('[data-meal]').forEach(chip => {
      chip.addEventListener('click', () => {
        setFilter('meal', chip.dataset.meal);
        syncUI();
      });
    });
    
    // Close mobile sheet on backdrop click
    const sheet = document.getElementById('mobile-filter-sheet');
    if (sheet) {
      sheet.addEventListener('click', (e) => {
        if (e.target === sheet) {
          handleCloseFilters();
        }
      });
    }
  }
  
  /**
   * Setup click listener for a filter chip
   */
  function setupChipListener(id, filterKey) {
    const chip = document.getElementById(id);
    if (chip) {
      chip.addEventListener('click', () => {
        toggleFilter(filterKey);
        syncUI();
      });
    }
  }
  
  /**
   * Get height display text
   */
  function getHeightDisplay() {
    return state.height === 0 ? 'Any height' : `${state.height}" max`;
  }
  
  /**
   * Check if any filters are active
   */
  function hasActiveFilters() {
    return state.height > 0 || 
           state.pregnancy || 
           state.wheelchair || 
           state.sensory ||
           state.location !== 'all' ||
           state.meal !== 'all' ||
           state.character !== 'all';
  }
  
  // Initialize on script load
  init();
  
  // Public API
  return {
    init,
    getState,
    setFilter,
    toggleFilter,
    resetFilters,
    onChange,
    filterRides,
    filterCharacterMeals,
    syncUI,
    setupEventListeners,
    getHeightDisplay,
    hasActiveFilters,
    STORAGE_KEY
  };
})();
