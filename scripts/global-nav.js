/**
 * Global Navigation JavaScript - Plan Your Park
 * Include before closing </body> tag on all pages
 */

function toggleMobileNav() {
  const sheet = document.getElementById('mobileNavSheet');
  if (sheet) {
    sheet.classList.toggle('active');
    document.body.style.overflow = sheet.classList.contains('active') ? 'hidden' : '';
  }
}

function closeMobileNav(event) {
  if (event.target === event.currentTarget) {
    toggleMobileNav();
  }
}

// Close on escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const sheet = document.getElementById('mobileNavSheet');
    if (sheet && sheet.classList.contains('active')) {
      toggleMobileNav();
    }
  }
});
