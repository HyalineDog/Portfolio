const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
}

// Close navbar when link is clicked
const navLink = document.querySelectorAll(".nav-link");

navLink.forEach((n) => n.addEventListener("click", closeMenu));

function closeMenu() {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
}

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

toggleSwitch.addEventListener("change", switchTheme, false);

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

const currentTheme = localStorage.getItem("theme")
  ? localStorage.getItem("theme")
  : null;

// Challenge card selection functionality
function initializeChallengeHover() {
  const challengeCards = document.querySelectorAll('.challenge-card');
  
  // Check if we're on the Student Pad page or Classroom Platform page
  const isStudentPadPage = window.location.pathname.includes('ZhiKe Student Pad') || document.title.includes('Student Pad');
  
  const mediaMap = isStudentPadPage ? {
    'legacy': 'assets/figma_assets/Student Pad/Challenge 1.mp4',
    'pedagogy': 'assets/figma_assets/Student Pad/Challenge 2.mp4',
    'engagement': 'assets/figma_assets/Student Pad/Challenge 3.png'
  } : {
    'static': 'assets/figma_assets/Zhike Classroom Platform/Challenge 1.png',
    'business': 'assets/figma_assets/Zhike Classroom Platform/Challenge 2.mp4',
    'fragmented': 'assets/figma_assets/Zhike Classroom Platform/Challenge 3.mp4'
  };
  
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
  document.addEventListener('DOMContentLoaded', initializeGamificationTabs);
} else {
  initializeChallengeHover();
  initializeGamificationTabs();
}

// Gamification tabs functionality
function initializeGamificationTabs() {
  const tabControllers = document.querySelectorAll('.tab-controller');
  const tabContents = document.querySelectorAll('.tab-content');
  
  if (tabControllers.length === 0 || tabContents.length === 0) return;
  
  function switchTab(targetTab) {
    // Remove active state from all controllers and contents
    tabControllers.forEach(controller => {
      controller.setAttribute('data-active', 'false');
    });
    
    tabContents.forEach(content => {
      content.setAttribute('data-active', 'false');
    });
    
    // Add active state to target controller and content
    const targetController = document.querySelector(`[data-tab="${targetTab}"]`);
    const targetContent = document.querySelector(`[data-content="${targetTab}"]`);
    
    if (targetController && targetContent) {
      targetController.setAttribute('data-active', 'true');
      targetContent.setAttribute('data-active', 'true');
    }
  }
  
  // Add hover event listeners to tab controllers
  tabControllers.forEach(controller => {
    controller.addEventListener('mouseenter', () => {
      const tabName = controller.getAttribute('data-tab');
      switchTab(tabName);
    });
    
    controller.addEventListener('click', () => {
      const tabName = controller.getAttribute('data-tab');
      switchTab(tabName);
    });
  });
}

// Insight card selection functionality
function initializeInsightHover() {
  // Exclude gamification insight items from interactive behavior
  const insightCards = document.querySelectorAll('.insight-item:not(.gamification-cards-container .insight-item)');
  const teacherQuote = document.getElementById('teacher-quote');
  const problemSummary = document.getElementById('problem-summary');
  const summaryCards = document.querySelectorAll('.summary-card');
  
  if (!teacherQuote || !problemSummary) return;
  
  // Check if we're on the Student Pad page or Classroom Platform page
  const isStudentPadPage = window.location.pathname.includes('ZhiKe Student Pad') || document.title.includes('Student Pad');
  
  const quoteMap = isStudentPadPage ? {
    'motivation': {
      No: ".01",
      problem: "Students struggle with independent learning without teacher guidance",
      quote: "I know I should be studying, but when there's no assignment due, I just don't know where to start or what to focus on.",
      author: "9th Grade Student, Hefei"
    },
    'skepticism': {
      No: ".02",
      problem: "Teachers questioned technology's educational value in classroom settings",
      quote: "These look just like iPads to them. If I let them have free access, they'd treat them like gaming devices instead of learning tools.",
      author: "Elementary Teacher, Hefei"
    },
    'balance': {
      No: ".03",
      problem: "Parents view all screen as entertainment",
      quote: "My parents don't like me using screens too much. They think I'm playing games even when I'm doing homework.",
      author: "Hefei Fourteenth High School Freshman"
    },
    'rewards': {
      No: ".04",
      problem: "Visual customization motivated learning without creating dependency",
      quote: "I like earning new avatars and themes when I complete my study goals. It makes me want to keep learning, but I don't feel like I have to use it all the time.",
      author: "7th Grade Student, Beijing"
    }
  } : {
    'apps': {
      No: ".01",
      problem: "Application overload disrupts current learning flow",
      quote: "I start with PowerPoint, then switch to the textbook app, then open the activity platform, then back to PowerPoint. My students lose focus every time I'm fumbling with technology instead of teaching.",
      author: "Middle School Science Teacher"
    },
    'time': {
      No: ".02",
      problem: "Inefficient resource management drains productivity",
      quote: "I spend my entire Sunday searching for resources that match our curriculum, then another few hours during the week adapting them to fit our lesson plans. It's exhausting.",
      author: "High School Math Teacher"
    },
    'adoption': {
      No: ".03",
      problem: "Resistance to change due to tool's learning cost",
      quote: "Sure, I know there are probably better tools out there, but learning a new system means weeks of preparation time I don't have. I'll stick with what I know, even if it's frustrating.",
      author: "Elementary School Teacher"
    },
    'controls': {
      No: ".04",
      problem: "Poor smartboard interaction hinders classroom engagement",
      quote: "When I have to turn my back to the students to click something on the computer, I immediately lose their attention. The controls need to be where I can reach them while still facing my class.",
      author: "High School English Teacher"
    }
  };
  
  let currentlySelected = null;
  
  // Function to select an insight card
  function selectInsight(card) {
    // Remove selected class from all insight cards
    insightCards.forEach(c => c.classList.remove('selected'));
    
    // Remove highlighted class from all summary cards
    summaryCards.forEach(c => c.classList.remove('highlighted'));
    
    // Add selected class to the hovered insight card
    card.classList.add('selected');
    currentlySelected = card;
    
    // Get the insight type and highlight corresponding summary card
    const insightType = card.getAttribute('data-insight');
    const correspondingSummaryCard = document.querySelector(`[data-summary="${insightType}"]`);
    if (correspondingSummaryCard) {
      correspondingSummaryCard.classList.add('highlighted');
    }
    
    // Update problem summary
    if (quoteMap[insightType]) {
      const quoteData = quoteMap[insightType];
      const problemNumber = problemSummary.querySelector('.problem-number');
      const problemText = problemSummary.querySelector('.problem-text');
      
      if (problemNumber && problemText) {
        problemNumber.textContent = quoteData.No;
        problemText.textContent = quoteData.problem;
      }
    }
    
    // Update quote
    if (quoteMap[insightType]) {
      const quoteData = quoteMap[insightType];
      const blockquote = teacherQuote.querySelector('blockquote');
      const cite = teacherQuote.querySelector('cite');
      
      if (blockquote && cite) {
        blockquote.textContent = `"${quoteData.quote}"`;
        cite.textContent = `— ${quoteData.author}`;
      }
    }
  }
  
  // Add hover event listeners to insight cards
  insightCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      selectInsight(card);
    });
  });
  
  // Auto-select the first insight card
  if (insightCards.length > 0) {
    selectInsight(insightCards[0]);
  }
}

// Initialize insight hover functionality when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeInsightHover);
} else {
  initializeInsightHover();
}

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);

  if (currentTheme === "dark") {
    toggleSwitch.checked = true;
  }
}

//Adding date

let myDate = document.querySelector("#datee");

const yes = new Date().getFullYear();
myDate.innerHTML = yes;

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

// Intersection Observer for animations
document.addEventListener('DOMContentLoaded', function() {
  // Select all elements with the 'animate' class
  const animatedElements = document.querySelectorAll('.animate');
  
  // Create an Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // If the element is in the viewport
      if (entry.isIntersecting) {
        // Add the animation class that was previously applied
        entry.target.style.opacity = '1';
        // Unobserve the element after it's animated
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 }); // Trigger when 10% of the element is visible
  
  // Observe all animated elements
  animatedElements.forEach(element => {
    observer.observe(element);
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
