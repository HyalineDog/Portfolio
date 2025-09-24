const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", mobileMenu);
}

function mobileMenu() {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
}

// Close navbar when link is clicked
const navLink = document.querySelectorAll(".nav-link");

if (navLink.length > 0) {
  navLink.forEach((n) => n.addEventListener("click", closeMenu));
}

function closeMenu() {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
}

// Close hamburger menu when clicking outside
document.addEventListener("click", function(event) {
  if (hamburger && navMenu) {
    const isClickInsideNav = navMenu.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);
    
    if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains("active")) {
      closeMenu();
    }
  }
});

// Apple-style navbar scroll effect
let lastScrollY = 0;
let isRetracting = false;

function handleNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const scrollY = window.scrollY;
    const scrollDirection = scrollY > lastScrollY ? 'down' : 'up';
    const navbarHeight = 80; // Height of the navbar
    
    if (scrollY < navbarHeight) {
      // Original navbar is still visible - keep it at top
      navbar.classList.add('at-top');
      navbar.classList.remove('scrolled', 'hidden', 'retracting');
      isRetracting = false;
    } else {
      // Original navbar is completely out of view
      if (scrollDirection === 'down' && !navbar.classList.contains('scrolled') && !isRetracting) {
        // Show floating island when scrolling down past navbar
        navbar.classList.remove('at-top', 'hidden', 'retracting');
        navbar.classList.add('scrolled');
      } else if (scrollDirection === 'up' && navbar.classList.contains('scrolled') && !isRetracting && scrollY < navbarHeight * 2) {
        // Hide floating island only when scrolling up near the top of the page
        isRetracting = true;
        navbar.classList.remove('scrolled');
        navbar.classList.add('retracting');
        
        // After animation completes, show original navbar
        setTimeout(() => {
          if (window.scrollY < navbarHeight) {
            navbar.classList.remove('retracting');
            navbar.classList.add('at-top');
          } else {
            navbar.classList.remove('retracting');
            navbar.classList.add('hidden');
          }
          isRetracting = false;
        }, 400);
      }
    }
    
    lastScrollY = scrollY;
  }
}

// Initialize navbar state
document.addEventListener('DOMContentLoaded', function() {
  handleNavbarScroll(); // Set initial state
  window.addEventListener('scroll', handleNavbarScroll);
});

// Event Listeners: Handling toggle event
const toggleSwitch = document.querySelector(
  '.theme-switch input[type="checkbox"]'
);

function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
}

if (toggleSwitch) {
  toggleSwitch.addEventListener("change", switchTheme, false);
}

//  Store color theme for future visits

function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark"); //add this
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light"); //add this
  }
}

// Save user preference on load
const currentTheme = localStorage.getItem("theme") ? localStorage.getItem("theme") : null;

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);

  if (currentTheme === "dark" && toggleSwitch) {
    toggleSwitch.checked = true;
  }
}



// Challenge card selection functionality
function initializeChallengeHover() {
  const challengeCards = document.querySelectorAll('.challenge-card');
  
  // Check which page we're on
  const isStudentPadPage = window.location.pathname.includes('ZhiKe Student Pad') || document.title.includes('Student Pad');
  const isNotetakingAppPage = window.location.pathname.includes('Notetaking App') || document.title.includes('Note Taking') || document.title.includes('Note-Taking');
  
  let mediaMap;
  if (isStudentPadPage) {
    mediaMap = {
      'legacy': 'assets/figma_assets/Student Pad/Challenge 1.mp4',
      'pedagogy': 'assets/figma_assets/Student Pad/Challenge 2.mp4',
      'engagement': 'assets/figma_assets/Student Pad/Challenge 3.png'
    };
  } else if (isNotetakingAppPage) {
    mediaMap = {
      'confusing': 'assets/figma_assets/Notetaking App/Challenge 1.png',
      'isolated': 'assets/figma_assets/Notetaking App/Challenge 2.png',
      'limited': 'assets/figma_assets/Notetaking App/Challenge 3.png'
    };
  } else {
    mediaMap = {
      'static': 'assets/figma_assets/Zhike Classroom Platform/Challenge 1.png',
      'business': 'assets/figma_assets/Zhike Classroom Platform/Challenge 2.mp4',
      'fragmented': 'assets/figma_assets/Zhike Classroom Platform/Challenge 3.mp4'
    };
  }
  
  let currentlySelected = null;
  
  // Function to get current media element
  function getCurrentMediaElement() {
    return document.getElementById('challenge-media');
  }
  
  // Function to select a card
  function selectCard(card) {
    // Remove selected class from all cards
    challengeCards.forEach(c => c.classList.remove('selected'));
    
    // Add selected class to the clicked card
    card.classList.add('selected');
    currentlySelected = card;
    
    // Update media
    const challengeType = card.getAttribute('data-challenge');
    if (mediaMap[challengeType]) {
      const mediaPath = mediaMap[challengeType];
      const isVideo = mediaPath.endsWith('.mp4');
      let currentMedia = getCurrentMediaElement();
      
      if (!currentMedia) return;
      
      if (isVideo) {
        // If it's a video, ensure the element is a video tag
        if (currentMedia.tagName !== 'VIDEO') {
          const videoElement = document.createElement('video');
          videoElement.className = currentMedia.className;
          videoElement.id = currentMedia.id;
          videoElement.autoplay = true;
          videoElement.loop = true;
          videoElement.muted = true;
          videoElement.playsInline = true;
          videoElement.innerHTML = 'Your browser does not support the video tag.';
          currentMedia.parentNode.replaceChild(videoElement, currentMedia);
          currentMedia = videoElement;
        }
        currentMedia.src = mediaPath;
        currentMedia.load();
        currentMedia.play().catch(e => console.log('Video autoplay failed:', e));
      } else {
        // If it's an image, ensure the element is an img tag
        if (currentMedia.tagName !== 'IMG') {
          const imgElement = document.createElement('img');
          imgElement.className = currentMedia.className;
          imgElement.id = currentMedia.id;
          currentMedia.parentNode.replaceChild(imgElement, currentMedia);
          currentMedia = imgElement;
        }
        currentMedia.src = mediaPath;
        currentMedia.alt = `${challengeType} challenge visualization`;
      }
    }
  }
  
  // Auto-select the first card on page load
  if (challengeCards.length > 0) {
    selectCard(challengeCards[0]);
  }
  
  challengeCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      selectCard(card);
    });
  });
}

// Initialize challenge hover functionality when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeChallengeHover);
} else {
  initializeChallengeHover();
}

// Insight card selection functionality
function initializeInsightHover() {
  console.log('Initializing insight hover functionality');
  const insightCards = document.querySelectorAll('.insight-item');
  const teacherQuote = document.getElementById('teacher-quote');
  const problemSummary = document.getElementById('problem-summary');
  const summaryCards = document.querySelectorAll('.summary-card');
  
  console.log('Found elements:', {
    insightCards: insightCards.length,
    teacherQuote: !!teacherQuote,
    problemSummary: !!problemSummary
  });
  
  if (!teacherQuote || !problemSummary) {
    console.log('Missing required elements, exiting');
    return;
  }
  
  // Check if we're on the Student Pad page, Classroom Platform page, or Notetaking App page
  const isStudentPadPage = window.location.pathname.includes('ZhiKe Student Pad') || document.title.includes('Student Pad');
  const isNoteTakingPage = window.location.pathname.includes('Notetaking App') || document.title.includes('Note-taking');
  
  console.log('Page detection:', {
    pathname: window.location.pathname,
    title: document.title,
    isStudentPadPage,
    isNoteTakingPage
  });
  
  // Skip insight hover initialization - now handled by insight-hover-system.js
  console.log('Insight hover functionality moved to unified system');
  return;
}

// Initialize insight hover functionality when DOM is loaded
function safeInitializeInsightHover() {
  // Wait a bit to ensure all other scripts have loaded
  setTimeout(() => {
    console.log('=== Starting Safe Initialization ===');
    console.log('Document ready state:', document.readyState);
    console.log('Window location:', window.location.href);
    
    // Check if we're on the Notetaking App page
    const isNoteTakingPage = window.location.pathname.includes('Notetaking App') || 
                            document.title.includes('Note-taking') ||
                            document.title.includes('note-taking');
    
    console.log('Is note-taking page:', isNoteTakingPage);
    
    if (isNoteTakingPage) {
      console.log('Skipping initialization - Notetaking App has dedicated script');
      return;
    } else {
      console.log('Initializing for other pages');
      initializeInsightHover();
    }
  }, 500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', safeInitializeInsightHover);
} else {
  safeInitializeInsightHover();
}

// Also try to initialize when window loads (as a backup)
window.addEventListener('load', () => {
  console.log('Window loaded, attempting backup initialization');
  setTimeout(initializeInsightHover, 1000);
});

// Manual test function for debugging (can be called from browser console)
window.testInsightHover = function() {
  console.log('=== Manual Test Function Called ===');
  console.log('Current page title:', document.title);
  console.log('Current pathname:', window.location.pathname);
  
  const insightCards = document.querySelectorAll('.insight-item');
  const teacherQuote = document.getElementById('teacher-quote');
  const problemSummary = document.getElementById('problem-summary');
  
  console.log('Elements found:');
  console.log('- Insight cards:', insightCards.length);
  console.log('- Teacher quote:', !!teacherQuote);
  console.log('- Problem summary:', !!problemSummary);
  
  if (insightCards.length > 0) {
    console.log('Insight cards data-insight attributes:');
    insightCards.forEach((card, index) => {
      console.log(`  Card ${index}:`, card.getAttribute('data-insight'));
    });
  }
  
  if (teacherQuote) {
    console.log('Teacher quote structure:');
    console.log('- Blockquote:', !!teacherQuote.querySelector('blockquote'));
    console.log('- Cite:', !!teacherQuote.querySelector('cite'));
  }
  
  if (problemSummary) {
    console.log('Problem summary structure:');
    console.log('- Problem number:', !!problemSummary.querySelector('.problem-number'));
    console.log('- Problem text:', !!problemSummary.querySelector('.problem-text'));
  }
  
  // Try to manually trigger the hover on the first card
  if (insightCards.length > 0) {
    console.log('Manually triggering hover on first card...');
    const firstCard = insightCards[0];
    const event = new Event('mouseenter');
    firstCard.dispatchEvent(event);
  }
  
  return 'Test completed - check console for results';
};



// Date functionality removed as the #datee element doesn't exist

// Scroll animation for project cards and text
document.addEventListener('DOMContentLoaded', function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // When project section is in view
      if (entry.isIntersecting) {
        // Get all cards in the project section
        const cards = document.querySelectorAll('.card');
        // Get all project text elements
        const projectTitles = document.querySelectorAll('.project-title-column h3');
        const projectTimeframes = document.querySelectorAll('.project-title-column .project-timeframe');
        const projectDescriptions = document.querySelectorAll('.project-description-column p');
        
        // Start the animation for each card
        cards.forEach(card => {
          card.style.animationPlayState = 'running';
        });
        
        // Start the animation for each text element
        projectTitles.forEach(title => {
          title.style.animationPlayState = 'running';
        });
        
        projectTimeframes.forEach(timeframe => {
          timeframe.style.animationPlayState = 'running';
        });
        
        projectDescriptions.forEach(description => {
          description.style.animationPlayState = 'running';
        });
      }
    });
  }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

  // Observe the projects section
  const projectsSection = document.querySelector('#projects');
  if (projectsSection) {
    observer.observe(projectsSection);
  }
});

// Modern 2025 Animation System with Intersection Observer
document.addEventListener('DOMContentLoaded', function() {
  // Add animate class to all major sections that don't have it
  const sectionsToAnimate = [
    'section', 
    '.about-container', 
    '.project-container', 
    '.tldr-content',
    '.section',
    'footer',
    '.about-section',
    '.project-list',
    '.image-carousel',
    '.footer-content'
  ];
  
  sectionsToAnimate.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (!element.classList.contains('animate')) {
        element.classList.add('animate');
      }
    });
  });
  
  // Create intersection observer for modern animations
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        
        // Add appropriate modern animation class based on element type
        if (element.classList.contains('profile-image')) {
          element.classList.add('subtle-glow');
        } else if (element.tagName === 'SECTION' || element.classList.contains('about-container') || element.classList.contains('project-container')) {
          // Section-level blur-to-focus animation
          element.classList.add('morph-in');
        } else if (element.tagName === 'H1' || element.tagName === 'H2') {
          element.classList.add('slide-reveal');
        } else if (element.tagName === 'P') {
          element.classList.add('gentle-float');
        } else if (element.classList.contains('btn')) {
          element.classList.add('subtle-glow');
        } else if (element.classList.contains('project-item')) {
          element.classList.add('morph-in');
        } else if (element.tagName === 'FOOTER' || element.classList.contains('footer-content')) {
          element.classList.add('gentle-float');
        } else {
          // Default blur-to-focus animation for other elements
          element.classList.add('morph-in');
        }
        
        // Stop observing this element
        animationObserver.unobserve(element);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Observe all elements with animate class
  const animatedElements = document.querySelectorAll('.animate');
  animatedElements.forEach(element => {
    animationObserver.observe(element);
  });
});
// Key Features Carousel is now handled by dedicated carousel.js file
// This prevents conflicts with other carousel implementations on different pages

const emailLink = document.querySelector('.nav-link[href="mailto:cjn259@gmail.com"]');
if (emailLink) {
  emailLink.addEventListener('click', function(event) {
    event.preventDefault();
    const email = 'cjn259@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      alert('Email address copied to clipboard!');
      window.open(emailLink.href, '_blank');
    });
  });
}

// Solution video scroll-triggered autoplay
const solutionVideo = document.getElementById('solution-video');
if (solutionVideo) {
  // Ensure video is ready
  solutionVideo.addEventListener('loadeddata', () => {
    console.log('Solution video loaded and ready');
  });
  
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Video is in view, start playing
        solutionVideo.play().catch(e => {
          console.log('Solution video autoplay failed:', e);
          // Try to play again after a short delay
          setTimeout(() => {
            solutionVideo.play().catch(err => console.log('Retry failed:', err));
          }, 100);
        });
      } else {
        // Video is out of view, pause it
        solutionVideo.pause();
      }
    });
  }, {
    threshold: 0.3 // Trigger when 30% of the video is visible
  });
  
  videoObserver.observe(solutionVideo);
}
