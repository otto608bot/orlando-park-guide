/**
 * Shared Filter Module - Plan Your Park
 * Unified filter logic for index.html and park.html
 * 
 * This module provides consistent filter behavior across pages:
 * - localStorage persistence
 * - Simplified 3-chip UI for index.html
 * - Full wheelchair/sensory UI for park.html
 * - Mobile sheet handling
 */

const FilterModule = (function() {
  'use strict';
  
  const STORAGE_KEY = 'pyp_filters_v1';
  
  // Default filter state
  const defaultState = {
    height: 0,
    pregnancy: false,
    wheelchair: 'any', // 'any', 'WAV', 'TAV'
    sensory: {
      dark: false,
      loud: false,
      sudden: false,
      enclosed: false,
      strobe: false
    }
  };
  
  // Current state (shared across pages)
  let state = null;
  
  // Callback when filters change
  let onChangeCallback = null;
  
  /**
   * Load filters from localStorage
   */
  function loadFilters() {
    if (state !== null) return state;
    
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
          return state;
        }
      }
    } catch (e) {
      console.warn('Failed to load filters:', e);
    }
    
    state = { ...defaultState };
    return state;
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
   * Update height filter
   */
  function setHeight(value) {
    loadFilters();
    state.height = parseInt(value, 10) || 0;
    saveFilters();
    updateHeightUI();
    notifyChange();
  }
  
  /**
   * Toggle pregnancy filter
   */
  function togglePregnancy() {
    loadFilters();
    state.pregnancy = !state.pregnancy;
    saveFilters();
    updatePregnancyUI();
    notifyChange();
  }
  
  /**
   * Set wheelchair filter
   */
  function setWheelchair(value) {
    loadFilters();
    state.wheelchair = value;
    saveFilters();
    updateWheelchairUI();
    notifyChange();
  }
  
  /**
   * Toggle wheelchair between 'any' and 'WAV' (simplified mode for index.html)
   */
  function toggleWheelchair() {
    loadFilters();
    state.wheelchair = state.wheelchair === 'WAV' ? 'any' : 'WAV';
    saveFilters();
    updateWheelchairUI();
    notifyChange();
  }
  
  /**
   * Toggle sensory filter (simplified - sets all to true/false for index.html)
   */
  function toggleSensory() {
    loadFilters();
    // Check if any sensory filter is active
    const anyActive = Object.values(state.sensory).some(v => v);
    // Toggle all off if any are on, or set common ones if all off
    if (anyActive) {
      state.sensory = { dark: false, loud: false, sudden: false, enclosed: false, strobe: false };
    } else {
      // For simplified mode, we just mark that user wants "calm" experiences
      // The actual filtering happens in the app logic
      state.sensory = { dark: true, loud: true, sudden: true, enclosed: false, strobe: true };
    }
    saveFilters();
    updateSensoryUI();
    notifyChange();
  }
  
  /**
   * Toggle specific sensory filter (full mode for park.html)
   */
  function toggleSensoryType(type) {
    loadFilters();
    if (state.sensory.hasOwnProperty(type)) {
      state.sensory[type] = !state.sensory[type];
      saveFilters();
      updateSensoryTypeUI(type);
      notifyChange();
    }
  }
  
  /**
   * Clear all filters
   */
  function clearAll() {
    state = { ...defaultState };
    saveFilters();
    updateAllUI();
    notifyChange();
  }
  
  /**
   * Update height display UI
   */
  function updateHeightUI() {
    const text = state.height === 0 
      ? 'Any <span>height</span>' 
      : state.height + '" <span>minimum</span>';
    
    document.querySelectorAll('#height-display, #mobile-height-display').forEach(el => {
      if (el) el.innerHTML = text;
    });
    
    document.querySelectorAll('#height-slider, #mobile-height-slider').forEach(el => {
      if (el) el.value = state.height;
    });
  }
  
  /**
   * Update pregnancy chip UI
   */
  function updatePregnancyUI() {
    document.querySelectorAll('#chip-pregnancy, #mobile-chip-pregnancy').forEach(el => {
      if (el) el.classList.toggle('active', state.pregnancy);
    });
  }
  
  /**
   * Update wheelchair UI (handles both simplified and full modes)
   */
  function updateWheelchairUI() {
    // Simplified chip mode (index.html)
    document.querySelectorAll('#chip-wheelchair, #mobile-chip-wheelchair').forEach(el => {
      if (el) el.classList.toggle('active', state.wheelchair === 'WAV');
    });
    
    // Full option mode (park.html)
    document.querySelectorAll('[id^="wheelchair-"], [id^="mobile-wheelchair-"]').forEach(el => {
      if (el && el.dataset.wheelchair) {
        el.classList.toggle('active', el.dataset.wheelchair === state.wheelchair);
      }
    });
  }
  
  /**
   * Update sensory UI (simplified mode)
   */
  function updateSensoryUI() {
    const anyActive = Object.values(state.sensory).some(v => v);
    document.querySelectorAll('#chip-sensory, #mobile-chip-sensory').forEach(el => {
      if (el) el.classList.toggle('active', anyActive);
    });
  }
  
  /**
   * Update specific sensory type UI (full mode)
   */
  function updateSensoryTypeUI(type) {
    const isActive = state.sensory[type];
    
    // Desktop
    const filterBtn = document.getElementById(`sensory-${type}`);
    if (filterBtn) {
      filterBtn.classList.toggle('active', isActive);
      const checkbox = document.getElementById(`cb-${type}`);
      if (checkbox) checkbox.checked = isActive;
    }
    
    // Mobile
    const mobileFilterBtn = document.getElementById(`mobile-sensory-${type}`);
    if (mobileFilterBtn) {
      mobileFilterBtn.classList.toggle('active', isActive);
      const mobileCheckbox = document.getElementById(`mobile-cb-${type}`);
      if (mobileCheckbox) mobileCheckbox.checked = isActive;
    }
    
    // Also update simplified chip if present
    updateSensoryUI();
  }
  
  /**
   * Update all UI elements
   */
  function updateAllUI() {
    updateHeightUI();
    updatePregnancyUI();
    updateWheelchairUI();
    updateSensoryUI();
    
    // Update all sensory types
    Object.keys(state.sensory).forEach(type => updateSensoryTypeUI(type));
  }
  
  /**
   * Notify callback of change
   */
  function notifyChange() {
    if (onChangeCallback) {
      onChangeCallback(getState());
    }
  }
  
  /**
   * Get current filter state
   */
  function getState() {
    loadFilters();
    return { ...state };
  }
  
  /**
   * Set up event listeners for the page
   */
  function setupEventListeners() {
    // Height sliders
    document.querySelectorAll('#height-slider, #mobile-height-slider').forEach(el => {
      if (el) {
        el.addEventListener('input', (e) => setHeight(e.target.value));
      }
    });
    
    // Pregnancy chips
    document.querySelectorAll('#chip-pregnancy, #mobile-chip-pregnancy').forEach(el => {
      if (el) {
        el.addEventListener('click', togglePregnancy);
      }
    });
    
    // Wheelchair chips (simplified)
    document.querySelectorAll('#chip-wheelchair, #mobile-chip-wheelchair').forEach(el => {
      if (el) {
        el.addEventListener('click', toggleWheelchair);
      }
    });
    
    // Wheelchair options (full)
    document.querySelectorAll('[data-wheelchair]').forEach(el => {
      el.addEventListener('click', () => setWheelchair(el.dataset.wheelchair));
    });
    
    // Sensory chips (simplified)
    document.querySelectorAll('#chip-sensory, #mobile-chip-sensory').forEach(el => {
      if (el) {
        el.addEventListener('click', toggleSensory);
      }
    });
    
    // Sensory filters (full)
    document.querySelectorAll('[data-sensory]').forEach(el => {
      el.addEventListener('click', () => toggleSensoryType(el.dataset.sensory));
    });
    
    // Clear buttons
    document.querySelectorAll('#clear-filters-btn, #mobile-clear-filters-btn').forEach(el => {
      if (el) {
        el.addEventListener('click', clearAll);
      }
    });
  }
  
  /**
   * Initialize the filter module
   * @param {function} onChange - Callback when filters change
   */
  function init(onChange) {
    onChangeCallback = onChange;
    loadFilters();
    setupEventListeners();
    updateAllUI();
    
    // Initial callback
    if (onChangeCallback) {
      onChangeCallback(getState());
    }
  }
  
  /**
   * Mobile filter sheet helpers
   */
  function openMobileSheet() {
    const sheet = document.getElementById('mobile-filter-sheet');
    if (sheet) {
      sheet.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  
  function closeMobileSheet() {
    const sheet = document.getElementById('mobile-filter-sheet');
    if (sheet) {
      sheet.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  // Public API
  return {
    init,
    getState,
    setHeight,
    togglePregnancy,
    setWheelchair,
    toggleWheelchair,
    toggleSensory,
    toggleSensoryType,
    clearAll,
    openMobileSheet,
    closeMobileSheet,
    updateAllUI
  };
})();

// Make available globally
window.FilterModule = FilterModule;
