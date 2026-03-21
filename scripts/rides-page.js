/**
 * Plan Your Park - Rides Page Renderer
 * Renders all rides into a filterable grid on /rides.html
 */

(function() {
  'use strict';

  // Wait for DOM and dependencies
  document.addEventListener('DOMContentLoaded', init);
  
  function init() {
    const ridesGrid = document.getElementById('rides-grid');
    if (!ridesGrid) return; // Not on rides page
    
    // Wait for rideData to be available
    if (typeof rideData === 'undefined') {
      // Load ride data dynamically if not already loaded
      loadRideData().then(() => {
        setupRidesPage();
      });
    } else {
      setupRidesPage();
    }
  }
  
  function loadRideData() {
    return new Promise((resolve) => {
      // rideData should be loaded via app.js or data file
      // If not, we need to wait for it
      const checkRideData = setInterval(() => {
        if (typeof rideData !== 'undefined') {
          clearInterval(checkRideData);
          resolve();
        }
      }, 100);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkRideData);
        resolve();
      }, 5000);
    });
  }
  
  function setupRidesPage() {
    if (typeof rideData === 'undefined') {
      console.error('RidesPage: rideData not found');
      return;
    }
    
    // Subscribe to filter changes
    if (window.FilterSystem) {
      FilterSystem.subscribe(handleFilterChange);
    }
    
    // Initial render
    renderRides();
  }
  
  function handleFilterChange(filters) {
    renderRides(filters);
  }
  
  function getFilters() {
    if (window.FilterSystem) {
      return FilterSystem.getState();
    }
    return { height: 0, pregnancy: false, wheelchair: 'any', sensory: {} };
  }
  
  function filterRides(rides, filters) {
    return rides.filter(ride => {
      // Height filter
      if (filters.height > 0 && ride.height > filters.height) {
        return false;
      }
      
      // Pregnancy filter
      if (filters.pregnancy && !ride.pregnant) {
        return false;
      }
      
      // Wheelchair filter
      if (filters.wheelchair === 'WAV' && ride.wheelchair !== 'WAV') {
        return false;
      }
      if (filters.wheelchair === 'TAV' && ride.wheelchair === 'NO') {
        return false;
      }
      
      // Sensory filters
      if (filters.sensory) {
        const s = ride.sensory || {};
        if (filters.sensory.dark && s.dark) return false;
        if (filters.sensory.loud && s.loud) return false;
        if (filters.sensory.sudden && s.sudden) return false;
        if (filters.sensory.enclosed && s.enclosed) return false;
        if (filters.sensory.strobe && s.strobe) return false;
      }
      
      return true;
    });
  }
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  function getRideImage(ride) {
    // Try to find the ride image
    const imagePath = `/images/rides/${ride.id}.jpg`;
    return imagePath;
  }
  
  function createRideCard(ride) {
    const card = document.createElement('div');
    card.className = 'ride-card';
    card.dataset.rideId = ride.id;
    
    // Build tags
    const tags = [];
    
    // Height tag
    if (ride.height > 0) {
      tags.push(`<span class="tag tag-height">${ride.height}" min</span>`);
    }
    
    // Pregnancy tag
    if (ride.pregnant) {
      tags.push(`<span class="tag tag-pregnancy">Pregnancy safe</span>`);
    }
    
    // Wheelchair tag
    if (ride.wheelchair === 'WAV') {
      tags.push(`<span class="tag tag-wheelchair">Wheelchair accessible</span>`);
    }
    
    // Sensory tags
    const s = ride.sensory || {};
    if (s.dark) tags.push(`<span class="tag tag-sensory">Dark</span>`);
    if (s.loud) tags.push(`<span class="tag tag-sensory">Loud</span>`);
    if (s.sudden) tags.push(`<span class="tag tag-sensory">Sudden</span>`);
    if (s.enclosed) tags.push(`<span class="tag tag-sensory">Enclosed</span>`);
    if (s.strobe) tags.push(`<span class="tag tag-sensory">Strobe</span>`);
    
    card.innerHTML = `
      <div class="ride-card-header">
        <div class="ride-card-name">${escapeHtml(ride.name)}</div>
        <div class="ride-card-type">${escapeHtml(ride.type)}</div>
      </div>
      <div class="ride-card-park">${escapeHtml(ride.park)}</div>
      <div class="ride-card-description">${escapeHtml(ride.description)}</div>
      <div class="ride-card-tags">${tags.join('')}</div>
    `;
    
    // Add click handler for modal
    card.addEventListener('click', () => {
      if (typeof openRideModal === 'function') {
        openRideModal(ride.id);
      }
    });
    
    return card;
  }
  
  function renderRides(customFilters) {
    const ridesGrid = document.getElementById('rides-grid');
    const shownRidesEl = document.getElementById('shown-rides');
    const totalRidesEl = document.getElementById('total-rides');
    
    if (!ridesGrid) return;
    
    const filters = customFilters || getFilters();
    const filteredRides = filterRides(rideData, filters);
    
    // Update counts
    if (shownRidesEl) shownRidesEl.textContent = filteredRides.length;
    if (totalRidesEl) totalRidesEl.textContent = rideData.length;
    
    // Clear and render
    ridesGrid.innerHTML = '';
    
    if (filteredRides.length === 0) {
      ridesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--gray-600);">
          <p>No rides match your current filters.</p>
          <p>Try adjusting your filter criteria.</p>
        </div>
      `;
      return;
    }
    
    filteredRides.forEach(ride => {
      const card = createRideCard(ride);
      ridesGrid.appendChild(card);
    });
  }
  
  // Expose for global access
  window.RidesPage = {
    render: renderRides,
    getFilters: getFilters,
    filterRides: filterRides
  };
  
})();
