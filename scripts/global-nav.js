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
  },
  
  setActiveNav(page) {
    // Desktop nav
    const navIds = {
      'rides': 'nav-rides',
      'dining': 'nav-dining',
      'blog': 'nav-blog',
      'deals': 'nav-deals'
    };
    
    // Mobile nav
    const mobileNavIds = {
      'rides': 'mobile-nav-rides',
      'dining': 'mobile-nav-dining',
      'blog': 'mobile-nav-blog',
      'deals': 'mobile-nav-deals'
    };
    
    // Set active class
    const activeNav = document.getElementById(navIds[page]);
    const activeMobileNav = document.getElementById(mobileNavIds[page]);
    
    if (activeNav) activeNav.classList.add('active');
    if (activeMobileNav) activeMobileNav.classList.add('active');
  },
  
  openNav() {
    const sheet = document.getElementById('global-mobile-nav-sheet');
    if (sheet) {
      sheet.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },
  
  closeNav(event) {
    const sheet = document.getElementById('global-mobile-nav-sheet');
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
  },
  
  closeFilters() {
    document.dispatchEvent(new CustomEvent('global:closeFilters'));
  }
};

// Close on escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    GlobalNav.closeNav();
  }
});
