import rideData from './data/rides.js';

// State management
const state = {
  filters: {
    height: 40,
    pregnancy: false,
    wheelchair: false,
    sensory: false
  }
};

// DOM Elements
const elements = {
  heightSlider: document.getElementById('height-slider'),
  heightValue: document.getElementById('height-value'),
  matchCount: document.getElementById('match-count'),
  parkCount: document.getElementById('park-count'),
  parkList: document.getElementById('park-list'),
  toggles: {
    pregnancy: document.getElementById('toggle-pregnancy'),
    wheelchair: document.getElementById('toggle-wheelchair'),
    sensory: document.getElementById('toggle-sensory')
  }
};

// Park color mapping
const parkColors = {
  'Magic Kingdom': { color: '#2563eb', bg: '#dbeafe' },
  'EPCOT': { color: '#4f46e5', bg: '#e0e7ff' },
  'Hollywood Studios': { color: '#7c3aed', bg: '#ede9fe' },
  'Animal Kingdom': { color: '#059669', bg: '#d1fae5' },
  'Universal Studios Florida': { color: '#ea580c', bg: '#ffedd5' },
  'Islands of Adventure': { color: '#dc2626', bg: '#fee2e2' }
};

// Initialize
function init() {
  setupEventListeners();
  render();
}

// Event listeners
function setupEventListeners() {
  elements.heightSlider.addEventListener('input', handleHeightChange);
}

// Height change handler
function handleHeightChange(e) {
  state.filters.height = parseInt(e.target.value);
  elements.heightValue.textContent = `${state.filters.height}"`;
  render();
}

// Toggle filter handler (exposed to window)
window.toggleFilter = function(type) {
  state.filters[type] = !state.filters[type];
  
  const btn = elements.toggles[type];
  const isActive = state.filters[type];
  
  btn.classList.toggle('active', isActive);
  btn.setAttribute('aria-pressed', isActive);
  
  render();
};

// Filter rides
function getFilteredRides() {
  return rideData.filter(ride => {
    // Height filter
    if (ride.height > state.filters.height) return false;
    
    // Pregnancy filter
    if (state.filters.pregnancy && !ride.pregnant) return false;
    
    // Wheelchair filter (WAV = no transfer required)
    if (state.filters.wheelchair && ride.wheelchair !== 'WAV') return false;
    
    // Sensory filter (no intense effects)
    if (state.filters.sensory) {
      const s = ride.sensory;
      if (s.dark || s.loud || s.fog || s.sudden || s.enclosed || s.strobe) {
        return false;
      }
    }
    
    return true;
  });
}

// Group rides by park
function groupByPark(rides) {
  const groups = {};
  
  rides.forEach(ride => {
    if (!groups[ride.park]) {
      groups[ride.park] = {
        resort: ride.resort,
        rides: []
      };
    }
    groups[ride.park].rides.push(ride);
  });
  
  return groups;
}

// Generate sensory tags
function getSensoryTags(sensory) {
  const tags = [];
  
  if (sensory.dark) {
    tags.push({ label: 'Dark', class: 'tag--sensory-dark' });
  }
  if (sensory.loud) {
    tags.push({ label: 'Loud', class: 'tag--sensory-loud' });
  }
  if (sensory.sudden) {
    tags.push({ label: 'Sudden', class: 'tag--sensory-sudden' });
  }
  if (sensory.enclosed) {
    tags.push({ label: 'Enclosed', class: 'tag--sensory-enclosed' });
  }
  if (sensory.strobe) {
    tags.push({ label: 'Strobe', class: 'tag--sensory-strobe' });
  }
  
  return tags;
}

// Render ride card
function renderRideCard(ride) {
  const sensoryTags = getSensoryTags(ride.sensory);
  
  return `
    <article class="ride-card">
      <div class="ride-card__header">
        <h3 class="ride-card__name">${escapeHtml(ride.name)}</h3>
        <span class="ride-card__duration">${escapeHtml(ride.duration)}</span>
      </div>
      <p class="ride-card__description">${escapeHtml(ride.description)}</p>
      <div class="ride-card__tags">
        ${ride.height > 0 ? `
          <span class="tag tag--height">${ride.height}"</span>
        ` : ''}
        ${ride.pregnant ? `
          <span class="tag tag--pregnancy">🤰 Safe</span>
        ` : ''}
        ${ride.wheelchair === 'WAV' ? `
          <span class="tag tag--wheelchair">♿ No Transfer</span>
        ` : ride.wheelchair === 'TAV' ? `
          <span class="tag tag--height">Transfer Required</span>
        ` : ''}
        ${sensoryTags.map(tag => `
          <span class="tag ${tag.class}">${tag.label}</span>
        `).join('')}
      </div>
    </article>
  `;
}

// Render park section
function renderParkSection(parkName, parkData) {
  const colors = parkColors[parkName] || { color: '#64748b', bg: '#f1f5f9' };
  
  return `
    <details class="park-section" open>
      <summary class="park-header">
        <div class="park-header__info">
          <span class="park-header__resort" style="color: ${colors.color}">${escapeHtml(parkData.resort)}</span>
          <span class="park-header__name">${escapeHtml(parkName)}</span>
          <span class="park-header__count" style="color: ${colors.color}">${parkData.rides.length} rides</span>
        </div>
        <svg class="park-header__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 9l-7 7-7-7"/>
        </svg>
      </summary>
      <div class="ride-list">
        ${parkData.rides.map(renderRideCard).join('')}
      </div>
    </details>
  `;
}

// Render empty state
function renderEmptyState() {
  return `
    <div class="empty-state">
      <div class="empty-state__icon">🔍</div>
      <div class="empty-state__title">No rides match your filters</div>
      <p>Try adjusting your height requirement or turning off some filters.</p>
    </div>
  `;
}

// Main render function
function render() {
  const filtered = getFilteredRides();
  const grouped = groupByPark(filtered);
  const parkNames = Object.keys(grouped);
  
  // Update counts
  elements.matchCount.textContent = filtered.length;
  elements.parkCount.textContent = parkNames.length;
  
  // Render results
  if (filtered.length === 0) {
    elements.parkList.innerHTML = renderEmptyState();
  } else {
    elements.parkList.innerHTML = parkNames
      .map(park => renderParkSection(park, grouped[park]))
      .join('');
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Start the app
init();
