/**
 * Global Navigation JavaScript - Plan Your Park
 * Include before closing </body> tag on all pages
 */

window.GlobalNav = {
  currentPage: '',
  
  init(page) {
    this.currentPage = page;
    this.setActiveNav(page);
    
    // Show filter button on pages that need it (mobile only)
    // CSS handles the visibility, JS just ensures it's in the DOM
    if (page === 'rides' || page === 'dining') {
      const filterBtn = document.getElementById('global-filter-btn');
      if (filterBtn) {
        // Add data attribute for CSS targeting
        filterBtn.setAttribute('data-show-on-mobile', 'true');
      }
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('parks-dropdown');
      const toggle = document.getElementById('nav-parks');
      if (dropdown && toggle && !dropdown.contains(e.target) && !toggle.contains(e.target)) {
        dropdown.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  },
  
  setActiveNav(page) {
    // Desktop nav
    const navIds = {
      'home': 'nav-home',
      'rides': 'nav-rides',
      'dining': 'nav-dining',
      'blog': 'nav-blog',
      'deals': 'nav-deals'
    };
    
    // Mobile nav
    const mobileNavIds = {
      'home': 'mobile-nav-home',
      'rides': 'mobile-nav-rides',
      'dining': 'mobile-nav-dining',
      'blog': 'mobile-nav-blog',
      'deals': 'mobile-nav-deals'
    };
    
    // Set active class
    if (page === 'parks') {
      // Parks is a dropdown button, not a regular nav link
      const parksToggle = document.getElementById('nav-parks');
      if (parksToggle) parksToggle.classList.add('active');
    } else {
      const activeNav = document.getElementById(navIds[page]);
      if (activeNav) activeNav.classList.add('active');
    }
    
    const activeMobileNav = document.getElementById(mobileNavIds[page]);
    if (activeMobileNav) activeMobileNav.classList.add('active');
  },
  
  toggleParksDropdown(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('parks-dropdown');
    const toggle = document.getElementById('nav-parks');
    if (dropdown && toggle) {
      const isOpen = dropdown.classList.toggle('active');
      toggle.setAttribute('aria-expanded', isOpen.toString());
    }
  },
  
  openNav() {
    const sheet = document.getElementById('global-mobile-nav-sheet') || document.getElementById('mobile-nav-sheet');
    if (sheet) {
      sheet.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },
  
  closeNav(event) {
    const sheet = document.getElementById('global-mobile-nav-sheet') || document.getElementById('mobile-nav-sheet');
    if (!event || event.target === sheet) {
      if (sheet) {
        sheet.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  },
  
  openFilters() {
    // Dispatch event for pages to handle
    document.dispatchEvent(new CustomEvent('global:openFilters'));
    // Also call the page's own filter function if it exists
    if (typeof openMobileFilters === 'function') {
      openMobileFilters();
    }
  },
  
  closeFilters() {
    document.dispatchEvent(new CustomEvent('global:closeFilters'));
  }
};

// Toggle mobile parks section (for mobile nav expandable sections)
function toggleMobileParksSection() {
  const section = document.getElementById('mobile-parks-section');
  if (section) {
    section.classList.toggle('expanded');
  }
}

// Expose globally
window.toggleMobileParksSection = toggleMobileParksSection;

// Close on escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    GlobalNav.closeNav();
    // Also close dropdown
    const dropdown = document.getElementById('parks-dropdown');
    const toggle = document.getElementById('nav-parks');
    if (dropdown) dropdown.classList.remove('active');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }
});
