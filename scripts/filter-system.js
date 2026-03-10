/**
 * Plan Your Park - Shared Filter System
 * Single source of truth for all filter functionality
 * 
 * Used by: index.html, park.html, character-dining.html
 * 
 * Features:
 * - Unified filter state (height, pregnancy, wheelchair, sensory)
 * - localStorage persistence with 7-day expiry
 * - Event-driven updates (subscribe to changes)
 * - Mobile sheet management
 * - URL sync support
 */

const FilterSystem = (function() {
  'use strict';
  
  const STORAGE_KEY = 'pyp_filters_v2';
  
  // Clear old storage keys on load to prevent conflicts
  (function cleanupOldStorage() {
    try {
      localStorage.removeItem('pyp_filters_v1');
    } catch (e) {}
  })();
  
  // Unified filter state - used by ALL pages
  const defaultState = {
    height: 0,           // 0 = any, or inches (32, 40, 48, 54)
    pregnancy: false,    // true = show only pregnancy-safe
    wheelchair: 'any',   // 'any', 'WAV' (stay in wheelchair), 'TAV' (transfer)
    sensory: {
      dark: false,       // avoid dark spaces
      loud: false,       // avoid loud noises
      sudden: false,     // avoid sudden movements
      enclosed: false,   // avoid enclosed spaces
      strobe: false      // avoid strobe lights
    }
  };
  
  let state = null;
  let subscribers = [];
  let isInitialized = false;
  
  /**
   * Load state from localStorage
   */
  function loadFromStorage() {
    if (state !== null) return state;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check expiry (7 days)
        if (parsed.timestamp && (Date.now() - parsed.timestamp) < 7 * 24 * 60 * 60 * 1000) {
          state = {
            height: parsed.height ?? 0,
            pregnancy: parsed.pregnancy ?? false,
            wheelchair: ['WAV', 'TAV'].includes(parsed.wheelchair) ? parsed.wheelchair : 'any',
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
      console.warn('FilterSystem: Failed to load from storage', e);
    }
    
    state = JSON.parse(JSON.stringify(defaultState));
    return state;
  }
  
  /**
   * Save state to localStorage
   */
  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...state,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('FilterSystem: Failed to save to storage', e);
    }
  }
  
  /**
   * Notify all subscribers of state change
   */
  function notify() {
    subscribers.forEach(cb => {
      try {
        cb(getState());
      } catch (e) {
        console.warn('FilterSystem: Subscriber error', e);
      }
    });
  }
  
  /**
   * Get current state (deep copy)
   */
  function getState() {
    loadFromStorage();
    return JSON.parse(JSON.stringify(state));
  }
  
  /**
   * Set entire state
   */
  function setState(newState) {
    state = {
      height: newState.height ?? state.height,
      pregnancy: newState.pregnancy ?? state.pregnancy,
      wheelchair: ['WAV', 'TAV'].includes(newState.wheelchair) ? newState.wheelchair : state.wheelchair,
      sensory: {
        dark: newState.sensory?.dark ?? state.sensory.dark,
        loud: newState.sensory?.loud ?? state.sensory.loud,
        sudden: newState.sensory?.sudden ?? state.sensory.sudden,
        enclosed: newState.sensory?.enclosed ?? state.sensory.enclosed,
        strobe: newState.sensory?.strobe ?? state.sensory.strobe
      }
    };
    saveToStorage();
    notify();
    updateAllUI();
  }
  
  // ============================================
  // INDIVIDUAL FILTER UPDATES
  // ============================================
  
  function setHeight(value) {
    loadFromStorage();
    state.height = Math.max(0, Math.min(54, parseInt(value, 10) || 0));
    saveToStorage();
    updateHeightUI();
    notify();
  }
  
  function setPregnancy(value) {
    loadFromStorage();
    state.pregnancy = !!value;
    saveToStorage();
    updatePregnancyUI();
    notify();
  }
  
  function togglePregnancy() {
    setPregnancy(!state.pregnancy);
  }
  
  function setWheelchair(value) {
    loadFromStorage();
    state.wheelchair = ['WAV', 'TAV'].includes(value) ? value : 'any';
    saveToStorage();
    updateWheelchairUI();
    notify();
  }
  
  function setSensoryType(type, value) {
    loadFromStorage();
    if (state.sensory.hasOwnProperty(type)) {
      state.sensory[type] = !!value;
      saveToStorage();
      updateSensoryUI(type);
      notify();
    }
  }
  
  function toggleSensoryType(type) {
    loadFromStorage();
    if (state.sensory.hasOwnProperty(type)) {
      setSensoryType(type, !state.sensory[type]);
    }
  }
  
  /**
   * Toggle all sensory filters (simplified mode)
   * Returns true if any sensory filter is now active
   */
  function toggleAllSensory() {
    loadFromStorage();
    const anyActive = Object.values(state.sensory).some(v => v);
    const newValue = !anyActive;
    
    Object.keys(state.sensory).forEach(key => {
      state.sensory[key] = newValue;
    });
    
    saveToStorage();
    updateAllSensoryUI();
    notify();
    return newValue;
  }
  
  /**
   * Check if any sensory filter is active
   */
  function isAnySensoryActive() {
    loadFromStorage();
    return Object.values(state.sensory).some(v => v);
  }
  
  /**
   * Reset all filters to default
   */
  function reset() {
    state = JSON.parse(JSON.stringify(defaultState));
    saveToStorage();
    updateAllUI();
    notify();
  }
  
  // ============================================
  // UI UPDATES
  // ============================================
  
  function updateHeightUI() {
    const text = state.height === 0 
      ? 'Any <span>height</span>' 
      : state.height + '" <span>minimum</span>';
    
    document.querySelectorAll('[data-filter-display="height"]').forEach(el => {
      el.innerHTML = text;
    });
    
    document.querySelectorAll('[data-filter-input="height"]').forEach(el => {
      el.value = state.height;
    });
  }
  
  function updatePregnancyUI() {
    document.querySelectorAll('[data-filter="pregnancy"]').forEach(el => {
      el.classList.toggle('active', state.pregnancy);
    });
  }
  
  function updateWheelchairUI() {
    // Update option buttons
    document.querySelectorAll('[data-wheelchair]').forEach(el => {
      el.classList.toggle('active', el.dataset.wheelchair === state.wheelchair);
    });
    
    // Update simplified chip if present
    document.querySelectorAll('[data-filter="wheelchair"]').forEach(el => {
      el.classList.toggle('active', state.wheelchair === 'WAV');
    });
  }
  
  function updateSensoryUI(type) {
    const isActive = state.sensory[type];
    
    // Update specific sensory filter
    document.querySelectorAll(`[data-sensory="${type}"]`).forEach(el => {
      el.classList.toggle('active', isActive);
      const checkbox = el.querySelector('input[type="checkbox"]');
      if (checkbox) checkbox.checked = isActive;
    });
    
    // Update simplified chip
    document.querySelectorAll('[data-filter="sensory"]').forEach(el => {
      el.classList.toggle('active', isAnySensoryActive());
    });
  }
  
  function updateAllSensoryUI() {
    Object.keys(state.sensory).forEach(type => updateSensoryUI(type));
  }
  
  function updateAllUI() {
    updateHeightUI();
    updatePregnancyUI();
    updateWheelchairUI();
    updateAllSensoryUI();
  }
  
  // ============================================
  // EVENT HANDLERS
  // ============================================
  
  function handleHeightChange(e) {
    setHeight(e.target.value);
  }
  
  function handlePregnancyClick() {
    togglePregnancy();
  }
  
  function handleWheelchairClick(e) {
    const value = e.currentTarget.dataset.wheelchair;
    if (value) setWheelchair(value);
  }
  
  function handleSensoryClick(e) {
    const type = e.currentTarget.dataset.sensory;
    if (type) toggleSensoryType(type);
  }
  
  function handleSimplifiedSensoryClick() {
    toggleAllSensory();
  }
  
  function handleClearClick() {
    reset();
  }
  
  /**
   * Set up event listeners for all filter elements
   */
  function setupEventListeners() {
    // Height sliders
    document.querySelectorAll('[data-filter-input="height"]').forEach(el => {
      el.addEventListener('input', handleHeightChange);
    });
    
    // Pregnancy
    document.querySelectorAll('[data-filter="pregnancy"]').forEach(el => {
      el.addEventListener('click', handlePregnancyClick);
    });
    
    // Wheelchair options (full)
    document.querySelectorAll('[data-wheelchair]').forEach(el => {
      el.addEventListener('click', handleWheelchairClick);
    });
    
    // Sensory types (full)
    document.querySelectorAll('[data-sensory]').forEach(el => {
      el.addEventListener('click', handleSensoryClick);
    });
    
    // Sensory simplified
    document.querySelectorAll('[data-filter="sensory"]').forEach(el => {
      // Only if it doesn't also have data-sensory (which would be the full version)
      if (!el.dataset.sensory) {
        el.addEventListener('click', handleSimplifiedSensoryClick);
      }
    });
    
    // Clear buttons
    document.querySelectorAll('[data-filter-action="clear"]').forEach(el => {
      el.addEventListener('click', handleClearClick);
    });
  }
  
  // ============================================
  // MOBILE SHEET
  // ============================================
  
  function openMobileSheet() {
    const sheet = document.getElementById('filter-mobile-sheet');
    if (sheet) {
      sheet.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  
  function closeMobileSheet() {
    const sheet = document.getElementById('filter-mobile-sheet');
    if (sheet) {
      sheet.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  function setupMobileSheet() {
    const sheet = document.getElementById('filter-mobile-sheet');
    if (!sheet) return;
    
    // Close on backdrop click
    sheet.addEventListener('click', (e) => {
      if (e.target === sheet) closeMobileSheet();
    });
    
    // Close button
    const closeBtn = sheet.querySelector('[data-filter-action="close-sheet"]');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMobileSheet);
    }
  }
  
  // ============================================
  // PUBLIC API
  // ============================================
  
  /**
   * Initialize the filter system
   * @param {function} onChange - Callback when filters change
   * @returns {function} Unsubscribe function
   */
  function init(onChange) {
    if (onChange) {
      subscribers.push(onChange);
    }
    
    if (!isInitialized) {
      loadFromStorage();
      setupEventListeners();
      setupMobileSheet();
      updateAllUI();
      isInitialized = true;
      
      // Initial callback
      if (onChange) {
        onChange(getState());
      }
    }
    
    // Return unsubscribe function
    return function unsubscribe() {
      if (onChange) {
        const index = subscribers.indexOf(onChange);
        if (index > -1) subscribers.splice(index, 1);
      }
    };
  }
  
  /**
   * Subscribe to filter changes without re-initializing
   * @param {function} callback
   * @returns {function} Unsubscribe function
   */
  function subscribe(callback) {
    subscribers.push(callback);
    return function unsubscribe() {
      const index = subscribers.indexOf(callback);
      if (index > -1) subscribers.splice(index, 1);
    };
  }
  
  /**
   * Get filter state as URL parameters
   */
  function toURLParams() {
    const params = new URLSearchParams();
    
    if (state.height > 0) params.set('height', state.height);
    if (state.pregnancy) params.set('pregnant', 'true');
    if (state.wheelchair !== 'any') params.set('wheelchair', state.wheelchair);
    
    const activeSensory = Object.entries(state.sensory)
      .filter(([_, v]) => v)
      .map(([k, _]) => k);
    if (activeSensory.length > 0) {
      params.set('sensory', activeSensory.join(','));
    }
    
    return params;
  }
  
  /**
   * Load filter state from URL parameters
   */
  function fromURLParams(params) {
    const newState = getState();
    
    const height = parseInt(params.get('height'), 10);
    if (!isNaN(height)) newState.height = height;
    
    if (params.get('pregnant') === 'true') newState.pregnancy = true;
    
    const wheelchair = params.get('wheelchair');
    if (['WAV', 'TAV'].includes(wheelchair)) newState.wheelchair = wheelchair;
    
    const sensory = params.get('sensory');
    if (sensory) {
      sensory.split(',').forEach(s => {
        if (newState.sensory.hasOwnProperty(s)) {
          newState.sensory[s] = true;
        }
      });
    }
    
    setState(newState);
  }
  
  // Public API
  return {
    init,
    subscribe,
    getState,
    setState,
    setHeight,
    setPregnancy,
    togglePregnancy,
    setWheelchair,
    setSensoryType,
    toggleSensoryType,
    toggleAllSensory,
    isAnySensoryActive,
    reset,
    openMobileSheet,
    closeMobileSheet,
    toURLParams,
    fromURLParams
  };
})();

// Make available globally
window.FilterSystem = FilterSystem;
