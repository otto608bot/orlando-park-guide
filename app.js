import rideData from './data/rides.js';

// State management
const state = {
  filters: {
    height: 40,
    pregnancy: false,
    wheelchair: false,
    sensory: false
  },
  currentView: 'leaderboard',
  selectedPark: null
};

// Park configuration with styling and metadata
const parkConfig = {
  'Magic Kingdom': {
    id: 'mk',
    resort: 'Walt Disney World',
    gradient: 'linear-gradient(135deg, #1a5fb4 0%, #3584e4 50%, #c01c28 100%)',
    accent: '#f5c211',
    description: 'Where fairy tales come true'
  },
  'EPCOT': {
    id: 'epcot',
    resort: 'Walt Disney World',
    gradient: 'linear-gradient(135deg, #613583 0%, #1c71d8 50%, #26a269 100%)',
    accent: '#e5a50a',
    description: 'Celebrate human achievement'
  },
  'Hollywood Studios': {
    id: 'hs',
    resort: 'Walt Disney World',
    gradient: 'linear-gradient(135deg, #a51d2d 0%, #e66100 50%, #b5835a 100%)',
    accent: '#f5c211',
    description: 'The magic of movies'
  },
  'Animal Kingdom': {
    id: 'ak',
    resort: 'Walt Disney World',
    gradient: 'linear-gradient(135deg, #26a269 0%, #5e9624 50%, #8f6e28 100%)',
    accent: '#e5a50a',
    description: 'A celebration of nature'
  },
  'Universal Studios Florida': {
    id: 'usf',
    resort: 'Universal Orlando',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #4a4a6a 50%, #e66100 100%)',
    accent: '#f5c211',
    description: 'Ride the movies'
  },
  'Islands of Adventure': {
    id: 'ioa',
    resort: 'Universal Orlando',
    gradient: 'linear-gradient(135deg, #c01c28 0%, #e66100 50%, #1c71d8 100%)',
    accent: '#f5c211',
    description: 'Live the adventure'
  }
};

// DOM Elements
const elements = {
  heightSlider: document.getElementById('height-slider'),
  heightValue: document.getElementById('height-value'),
  totalCount: document.getElementById('total-count'),
  leaderboard: document.getElementById('leaderboard'),
  leaderboardView: document.getElementById('leaderboard-view'),
  parkDetailView: document.getElementById('park-detail-view'),
  parkHero: document.getElementById('park-hero'),
  detailResort: document.getElementById('detail-resort'),
  detailParkName: document.getElementById('detail-park-name'),
  detailRideCount: document.getElementById('detail-ride-count'),
  detailHeightLimit: document.getElementById('detail-height-limit'),
  rideGrid: document.getElementById('ride-grid'),
  toggles: {
    pregnancy: document.getElementById('toggle-pregnancy'),
    wheelchair: document.getElementById('toggle-wheelchair'),
    sensory: document.getElementById('toggle-sensory')
  }
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
  elements.detailHeightLimit.textContent = `${state.filters.height}"`;
  render();
}

// Toggle filter handler
window.toggleFilter = function(type) {
  state.filters[type] = !state.filters[type];
  
  const btn = elements.toggles[type];
  const isActive = state.filters[type];
  
  btn.classList.toggle('active', isActive);
  btn.setAttribute('aria-pressed', isActive);
  
  render();
};

// Show park detail view
window.showParkDetail = function(parkName) {
  state.selectedPark = parkName;
  state.currentView = 'detail';
  
  elements.leaderboardView.style.display = 'none';
  elements.parkDetailView.classList.add('active');
  
  renderParkDetail(parkName);
};

// Show leaderboard view
window.showLeaderboard = function() {
  state.currentView = 'leaderboard';
  state.selectedPark = null;
  
  elements.parkDetailView.classList.remove('active');
  elements.leaderboardView.style.display = 'block';
  
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
      groups[ride.park] = [];
    }
    groups[ride.park].push(ride);
  });
  
  return groups;
}

// Get sensory tags for display
function getSensoryTags(sensory) {
  const tags = [];
  if (sensory.dark) tags.push({ label: 'Dark', class: 'tag-sensory-dark' });
  if (sensory.loud) tags.push({ label: 'Loud', class: 'tag-sensory-loud' });
  if (sensory.sudden) tags.push({ label: 'Sudden', class: 'tag-sensory-sudden' });
  if (sensory.enclosed) tags.push({ label: 'Enclosed', class: 'tag-sensory-enclosed' });
  if (sensory.strobe) tags.push({ label: 'Strobe', class: 'tag-sensory-strobe' });
  return tags;
}

// Render leaderboard
function renderLeaderboard() {
  const filtered = getFilteredRides();
  const grouped = groupByPark(filtered);
  
  // Update total count
  elements.totalCount.textContent = filtered.length;
  
  // Sort parks by ride count (descending)
  const sortedParks = Object.entries(grouped)
    .sort((a, b) => b[1].length - a[1].length);
  
  // Render park cards
  elements.leaderboard.innerHTML = sortedParks.map(([parkName, rides]) => {
    const config = parkConfig[parkName];
    const previewRides = rides.slice(0, 4);
    const remainingCount = rides.length - previewRides.length;
    
    return `
      <div class="park-card ${config.id}" onclick="showParkDetail('${parkName}')">
        <div class="park-card-header">
          <div class="park-info">
            <div class="park-resort">${config.resort}</div>
            <h3>${parkName}</h3>
          </div>
          <div class="ride-count">
            <div class="number">${rides.length}</div>
            <div class="label">Rides</div>
          </div>
        </div>
        <div class="park-preview">
          <div class="ride-chips">
            ${previewRides.map(ride => `
              <span class="ride-chip">${escapeHtml(ride.name)}</span>
            `).join('')}
            ${remainingCount > 0 ? `
              <span class="more-rides">+${remainingCount} more</span>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Render park detail
function renderParkDetail(parkName) {
  const config = parkConfig[parkName];
  const filtered = getFilteredRides();
  const parkRides = filtered.filter(ride => ride.park === parkName);
  
  // Update hero
  elements.parkHero.className = `park-hero ${config.id}`;
  elements.detailResort.textContent = config.resort;
  elements.detailParkName.textContent = parkName;
  elements.detailRideCount.textContent = parkRides.length;
  elements.detailHeightLimit.textContent = `${state.filters.height}"`;
  
  // Render ride cards
  if (parkRides.length === 0) {
    elements.rideGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">🔍</div>
        <h3>No rides match your filters</h3>
        <p>Try adjusting your height requirement or turning off some filters.</p>
      </div>
    `;
  } else {
    elements.rideGrid.innerHTML = parkRides.map(ride => {
      const sensoryTags = getSensoryTags(ride.sensory);
      
      return `
        <div class="ride-card">
          <div class="ride-header">
            <div class="ride-name">${escapeHtml(ride.name)}</div>
            <div class="ride-type">${escapeHtml(ride.type)}</div>
          </div>
          <p class="ride-description">${escapeHtml(ride.description)}</p>
          <div class="ride-meta">
            <div class="meta-item">⏱️ ${escapeHtml(ride.duration)}</div>
            ${ride.wheelchair === 'WAV' ? '<div class="meta-item">♿ No Transfer</div>' : ride.wheelchair === 'TAV' ? '<div class="meta-item">♿ Transfer Required</div>' : '<div class="meta-item">♿ Not Accessible</div>'}
          </div>
          <div class="ride-tags">
            ${ride.height > 0 ? `
              <span class="tag tag-height">📏 ${ride.height}"</span>
            ` : ''}
            ${ride.pregnant ? `
              <span class="tag tag-pregnancy">🤰 Pregnancy Safe</span>
            ` : ''}
            ${sensoryTags.map(tag => `
              <span class="tag ${tag.class}">${tag.label}</span>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }
}

// Main render function
function render() {
  if (state.currentView === 'leaderboard') {
    renderLeaderboard();
  } else if (state.currentView === 'detail' && state.selectedPark) {
    renderParkDetail(state.selectedPark);
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
