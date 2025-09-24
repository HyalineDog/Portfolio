/* Island Navigation Behavior */
/* Extracted from nav-animations-backup for modular implementation */

// Island Navigation - Mobile menu functionality is handled by main script.js
// This file only handles the Apple-style navbar scroll effect

// Apple-style navbar scroll effect for island navigation
let islandLastScrollY = 0;
let islandIsRetracting = false;

function handleIslandNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const scrollY = window.scrollY;
    const scrollDirection = scrollY > islandLastScrollY ? 'down' : 'up';
    const navbarHeight = 80; // Height of the navbar
    
    if (scrollY < navbarHeight) {
      // Original navbar is still visible - keep it at top
      navbar.classList.add('at-top');
      navbar.classList.remove('scrolled', 'hidden', 'retracting');
      islandIsRetracting = false;
    } else {
      // Original navbar is completely out of view
      if (scrollDirection === 'down' && !navbar.classList.contains('scrolled') && !islandIsRetracting) {
        // Show floating island when scrolling down past navbar
        navbar.classList.remove('at-top', 'hidden', 'retracting');
        navbar.classList.add('scrolled');
      } else if (scrollDirection === 'up' && navbar.classList.contains('scrolled') && !islandIsRetracting && scrollY < navbarHeight * 2) {
        // Hide floating island only when scrolling up near the top of the page
        islandIsRetracting = true;
        navbar.classList.remove('scrolled');
        navbar.classList.add('retracting');
        
        // After animation completes, show original navbar
        setTimeout(() => {
          navbar.style.transition = 'none'; // Disable transitions to prevent flicker
          
          if (window.scrollY < navbarHeight) {
            navbar.classList.remove('retracting', 'hidden');
            navbar.classList.add('at-top');
          } else {
            navbar.classList.remove('retracting');
            navbar.classList.add('hidden');
          }
          
          islandIsRetracting = false;
          
          // Force a reflow to apply the style changes immediately
          void navbar.offsetWidth;
          
          // Restore transitions
          navbar.style.transition = '';
        }, 400); // Corresponds to animation duration
      }
    }
    
    islandLastScrollY = scrollY;
  }
}

// Initialize navbar state
function initializeIslandNavigation() {
  handleIslandNavbarScroll(); // Set initial state
  window.addEventListener('scroll', handleIslandNavbarScroll);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeIslandNavigation);
} else {
  initializeIslandNavigation();
}

// Export functions for external use
window.IslandNavigation = {
  handleIslandNavbarScroll,
  initializeIslandNavigation
};