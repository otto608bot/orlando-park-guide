/**
 * Shared Navigation JavaScript for all pages
 * Include this script on character-dining.html and blog pages
 */

// Mobile navigation sheet
function openMobileNav() {
  const sheet = document.getElementById('mobile-nav-sheet');
  if (sheet) {
    sheet.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileNav(event) {
  const sheet = document.getElementById('mobile-nav-sheet');
  if (!event || event.target === sheet) {
    if (sheet) {
      sheet.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
}

// Mobile filter sheet for character dining
function openMobileFilters() {
  const sheet = document.getElementById('mobile-filter-sheet');
  if (sheet) {
    sheet.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    // Fallback: toggle sidebar visibility for character dining
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
    }
  }
}

function closeMobileFilters(event) {
  const sheet = document.getElementById('mobile-filter-sheet');
  if (!event || event.target === sheet) {
    if (sheet) {
      sheet.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
}

// Close on escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const navSheet = document.getElementById('mobile-nav-sheet');
    const filterSheet = document.getElementById('mobile-filter-sheet');
    
    if (navSheet && navSheet.classList.contains('active')) {
      closeMobileNav();
    }
    if (filterSheet && filterSheet.classList.contains('active')) {
      closeMobileFilters();
    }
  }
});

// Expose functions globally
window.openMobileNav = openMobileNav;
window.closeMobileNav = closeMobileNav;
window.openMobileFilters = openMobileFilters;
window.closeMobileFilters = closeMobileFilters;
