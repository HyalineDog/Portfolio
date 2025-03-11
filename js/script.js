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
