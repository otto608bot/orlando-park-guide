// Ride Detail Modal Functionality

// Ride ID to image mapping
const rideImages = {
  // Magic Kingdom
  'mk-space-orbiter': '/images/rides/space-mountain.jpg',
  'mk-barnstormer': '/images/rides/space-mountain.jpg',
  'mk-big-thunder': '/images/rides/mk-big-thunder.jpg',
  'mk-buzz': '/images/rides/space-mountain.jpg',
  'mk-dumbo': '/images/rides/space-mountain.jpg',
  'mk-enchanted-tales': '/images/rides/haunted-mansion.jpg',
  'mk-haunted-mansion': '/images/rides/haunted-mansion.jpg',
  'mk-small-world': '/images/rides/pirates-caribbean.jpg',
  'mk-jungle-cruise': '/images/rides/pirates-caribbean.jpg',
  'mk-magic-carpets': '/images/rides/space-mountain.jpg',
  'mk-peter-pan': '/images/rides/seven-dwarfs.jpg',
  'mk-pirates': '/images/rides/pirates-caribbean.jpg',
  'mk-tea-cups': '/images/rides/space-mountain.jpg',
  'mk-seven-dwarfs': '/images/rides/seven-dwarfs.jpg',
  'mk-space-mountain': '/images/rides/space-mountain.jpg',
  // EPCOT
  'epcot-guardians': '/images/rides/guardians-galaxy.jpg',
  'epcot-remy': '/images/rides/remy.jpg',
  'epcot-soarin': '/images/rides/soarin.jpg',
  'epcot-test-track': '/images/rides/test-track.jpg',
  'epcot-frozen': '/images/rides/remy.jpg',
  // Hollywood Studios
  'hs-rise': '/images/rides/rise-resistance.jpg',
  'hs-slinky': '/images/rides/slinky-dog.jpg',
  'hs-tower': '/images/rides/tower-terror.jpg',
  'hs-smugglers': '/images/rides/millennium-falcon.jpg',
  'hs-mickey': '/images/rides/rise-resistance.jpg',
  // Animal Kingdom
  'ak-avatar': '/images/rides/avatar-flight.jpg',
  'ak-everest': '/images/rides/expedition-everest.jpg',
  'ak-safari': '/images/rides/kilimanjaro-safaris.jpg',
  'ak-dinosaur': '/images/rides/expedition-everest.jpg',
  // Universal Studios Florida
  'usf-gringotts': '/images/rides/gringotts.jpg',
  'usf-mummy': '/images/rides/revenge-mummy.jpg',
  'usf-transformers': '/images/rides/transformers.jpg',
  'usf-men-in-black': '/images/rides/transformers.jpg',
  // Islands of Adventure
  'ioa-hagrids': '/images/rides/hagrids.jpg',
  'ioa-velocicoaster': '/images/rides/velocicoaster.jpg',
  'ioa-spiderman': '/images/rides/spiderman.jpg',
  'ioa-hulk': '/images/rides/velocicoaster.jpg',
  'ioa-forbidden-journey': '/images/rides/hagrids.jpg',
  // SeaWorld
  'sw-mako': '/images/rides/mako.jpg',
  'sw-kraken': '/images/rides/kraken.jpg',
  'sw-atlantis': '/images/rides/journey-atlantis.jpg',
  'sw-manta': '/images/rides/mako.jpg',
  // LEGOLAND
  'll-dragon': '/images/rides/the-dragon.jpg',
  'll-coastersaurus': '/images/rides/coastersaurus.jpg',
  'll-ninjago': '/images/rides/the-dragon.jpg'
};

// Ticket links for each park
const ticketLinks = {
  'Magic Kingdom': 'https://www.dpbolvw.net/click-101693488-5527150',
  'EPCOT': 'https://www.dpbolvw.net/click-101693488-5527150',
  'Hollywood Studios': 'https://www.dpbolvw.net/click-101693488-5527150',
  'Animal Kingdom': 'https://www.dpbolvw.net/click-101693488-5527150',
  'Universal Studios Florida': 'https://www.anrdoezrs.net/click-101693488-12540773',
  'Islands of Adventure': 'https://www.anrdoezrs.net/click-101693488-12540773',
  'Epic Universe': 'https://www.anrdoezrs.net/click-101693488-12540773',
  'SeaWorld Orlando': 'https://www.kqzyfj.com/click-101693488-12540778',
  'LEGOLAND Florida': 'https://www.jdoqocy.com/click-101693488-12540781'
};

// Default rider tips based on ride type
const defaultRiderTips = {
  'Coaster': ['Arrive early for shorter waits', 'Secure loose items before riding', 'Sit in the front for the best view'],
  'Dark Ride': ['Great for all ages', 'Perfect for hot afternoon breaks', 'Look for hidden details'],
  'Simulator': ['Avoid if prone to motion sickness', 'Best experienced in the middle rows', 'Keep your head back against the seat'],
  'Spinner': ['Control your own spin speed', 'Gentle option for younger kids', 'Short wait times usually'],
  'Show': ['Arrive 15 minutes early for good seats', 'Great for resting tired feet', 'Check show times in the app'],
  'Boat Ride': ['You may get slightly wet', 'Relaxing break from walking', 'Great for all ages'],
  'Drop Tower': ['Not for the faint of heart', 'Random drop sequence each ride', 'Keep eyes open for the view'],
  'Interactive': ['Compete for high scores', 'Pull the trigger rapidly', 'Aim for high-point targets'],
  'Walkthrough': ['Go at your own pace', 'Great photo opportunities', 'Usually no wait'],
  'Train': ['Scenic rest for tired feet', 'Good transportation around park', 'Relaxing experience'],
  'Transit': ['Peaceful break from crowds', 'Scenic elevated views', 'Rarely has a wait'],
  'Log Flume': ['You will get wet', 'Store electronics in lockers', 'Best on hot days'],
  '4D Show': ['Feel effects like wind and water', 'Great for the whole family', 'Sit near the middle for best view'],
  'Safari': ['Best viewing in morning or late afternoon', 'Animals are more active then', 'Each ride is unique'],
  'Raft Ride': ['You will get soaked', 'Store belongings in lockers', 'Fun for groups'],
  'Driving': ['Kids love the steering control', 'Great first driving experience', 'Photo opportunities at the end'],
  'Shooter': ['Aim carefully for bonus points', 'Compete with your group', 'Great replay value'],
  'Trackless Dark Ride': ['Smooth, magical experience', 'Look all around you', 'Different experience each time'],
  'Water Coaster': ['You will get wet', 'Thrilling drops with water', 'Store items in lockers'],
  'Observation Tower': ['Best views of the park', 'Great for photos', 'Relaxing experience'],
  'Suspended': ['Gentle gliding sensation', 'Great for younger kids', 'Scenic views'],
  'Trolley': ['Relaxing elevated tour', 'Good rest for tired feet', 'Scenic views of the area'],
  'Omnimover': ['Continuous loading - rarely a wait', 'Smooth, gentle ride', 'Look all around you'],
  'Interactive Dark Ride': ['Use hand gestures to play', 'Great for competitive families', 'Practice your ninja moves'],
  'Carousel': ['Classic ride experience', 'Great for photos', 'Gentle for all ages'],
  'Simulator': ['Can cause motion sickness', 'Keep head back against seat', 'Very immersive experience']
};

// Best times to ride based on ride type and park
const bestTimeForRide = {
  'Coaster': 'Morning or during fireworks',
  'Dark Ride': 'Afternoon (air conditioned)',
  'Simulator': 'Morning (shorter waits)',
  'Spinner': 'Anytime (usually short waits)',
  'Show': 'Check schedule - arrive early',
  'Boat Ride': 'Midday for a relaxing break',
  'Drop Tower': 'Evening for atmosphere',
  'Interactive': 'Morning or late evening',
  'Walkthrough': 'Anytime (self-paced)',
  'Train': 'Anytime (scenic rest)',
  'Transit': 'Anytime (rarely crowded)',
  'Log Flume': 'Hot afternoon (refreshing)',
  '4D Show': 'Hot afternoon (air conditioned)',
  'Safari': 'Early morning (animals active)',
  'Raft Ride': 'Hot afternoon (get cooled off)',
  'Driving': 'Morning (shorter lines)',
  'Shooter': 'Evening (shorter waits)',
  'Trackless Dark Ride': 'Morning or late evening',
  'Water Coaster': 'Hot afternoon',
  'Observation Tower': 'Sunset for best views',
  'Suspended': 'Anytime',
  'Trolley': 'Anytime',
  'Omnimover': 'Anytime (continuous loading)',
  'Interactive Dark Ride': 'Morning or late evening',
  'Carousel': 'Anytime',
  'Simulator': 'Morning'
};

// Find similar rides based on type and characteristics
function findSimilarRides(ride) {
  if (!ride || !rideData) return [];
  
  // Find rides of the same type in the same park
  let similar = rideData.filter(r => 
    r.id !== ride.id && 
    r.park === ride.park && 
    r.type === ride.type
  );
  
  // If not enough, add rides from same park with similar height
  if (similar.length < 3) {
    const heightRange = 6; // +/- 6 inches
    const samePark = rideData.filter(r => 
      r.id !== ride.id && 
      r.park === ride.park && 
      r.type !== ride.type &&
      Math.abs(r.height - ride.height) <= heightRange
    );
    similar = similar.concat(samePark);
  }
  
  // Return up to 3 similar rides
  return similar.slice(0, 3);
}

// Open the ride detail modal
function openRideModal(rideId) {
  // Find the ride data
  const ride = rideData.find(r => r.id === rideId);
  if (!ride) {
    console.error('Ride not found:', rideId);
    return;
  }
  
  // Populate modal fields
  document.getElementById('modal-ride-name').textContent = ride.name;
  document.getElementById('modal-ride-park').textContent = ride.park;
  document.getElementById('modal-ride-height').textContent =
    ride.height === 0 ? 'Any height' : ride.height + '" minimum';
  document.getElementById('modal-ride-description').textContent = ride.description;

  // Set ride image
  const imgContainer = document.querySelector('.ride-modal-image-placeholder');
  const imagePath = rideImages[ride.id] || '/images/rides/mk-space-mountain.jpg';
  imgContainer.innerHTML = `<img src="${imagePath}" alt="${ride.name}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-md,12px)">`;
  
  // Best time
  const bestTime = bestTimeForRide[ride.type] || 'Morning';
  document.getElementById('modal-ride-best-time').textContent = bestTime;
  
  // Rider tips
  const tips = defaultRiderTips[ride.type] || ['Check height requirements', 'Read safety instructions', 'Enjoy the experience!'];
  const tipsList = document.getElementById('modal-ride-tips');
  tipsList.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
  
  // Accessibility
  document.getElementById('modal-wheelchair').textContent = 
    ride.wheelchair === 'WAV' ? 'Stay in wheelchair' : 
    ride.wheelchair === 'TAV' ? 'Transfer required' : 
    'Not wheelchair accessible';
  
  // Sensory warnings
  const sensoryDiv = document.getElementById('modal-sensory-warnings');
  const warnings = [];
  if (ride.sensory.dark) warnings.push('Dark spaces');
  if (ride.sensory.loud) warnings.push('Loud noises');
  if (ride.sensory.sudden) warnings.push('Sudden movements');
  if (ride.sensory.enclosed) warnings.push('Enclosed spaces');
  if (ride.sensory.strobe) warnings.push('Strobe lights');
  if (ride.sensory.fog) warnings.push('Fog effects');
  
  sensoryDiv.innerHTML = warnings.length ? 
    '<div class="sensory-warnings">' + warnings.map(w => `<span>${w}</span>`).join('') + '</div>' : 
    '<div style="color: var(--gray-500);">No major sensory concerns</div>';
  
  // Similar rides
  const similarDiv = document.getElementById('modal-similar-rides');
  const similar = findSimilarRides(ride);
  similarDiv.innerHTML = similar.length ? 
    similar.map(r => `<button class="similar-ride-btn" onclick="openRideModal('${r.id}')">${r.name}</button>`).join('') :
    '<span style="color: var(--gray-500);">No similar rides found</span>';
  
  // Ticket link
  const ticketLink = document.getElementById('modal-ticket-link');
  ticketLink.href = ticketLinks[ride.park] || '#';
  ticketLink.textContent = `Get Tickets for ${ride.park}`;
  
  // Show modal
  document.getElementById('ride-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Update URL
  history.pushState({ rideModal: true, rideId: rideId }, '', `#ride=${rideId}`);
}

// Close the ride detail modal
function closeRideModal(event) {
  // Allow closing by clicking overlay or close button, or calling directly
  if (!event || event.target.id === 'ride-modal' || event.target.closest('.ride-modal-close')) {
    document.getElementById('ride-modal').classList.remove('active');
    document.body.style.overflow = '';
    
    // Remove hash from URL if it was a ride modal
    if (window.location.hash.startsWith('#ride=')) {
      history.pushState(null, '', window.location.pathname + window.location.search);
    }
  }
}

// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('ride-modal');
    if (modal && modal.classList.contains('active')) {
      closeRideModal();
    }
  }
});

// Open from URL hash on page load
window.addEventListener('load', () => {
  const hash = window.location.hash;
  if (hash.startsWith('#ride=')) {
    const rideId = hash.replace('#ride=', '');
    // Small delay to ensure rideData is loaded
    setTimeout(() => {
      if (typeof rideData !== 'undefined' && rideData.length > 0) {
        openRideModal(rideId);
      }
    }, 100);
  }
});

// Handle browser back button
window.addEventListener('popstate', (e) => {
  const modal = document.getElementById('ride-modal');
  if (modal && modal.classList.contains('active')) {
    // If modal is open and we're navigating back, close it
    if (!window.location.hash.startsWith('#ride=')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  } else if (window.location.hash.startsWith('#ride=')) {
    // If hash changed to a ride, open modal
    const rideId = window.location.hash.replace('#ride=', '');
    if (typeof rideData !== 'undefined' && rideData.length > 0) {
      openRideModal(rideId);
    }
  }
});

// Expose functions globally
window.openRideModal = openRideModal;
window.closeRideModal = closeRideModal;
