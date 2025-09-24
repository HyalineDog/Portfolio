# Quick Reference: Navigation & Animations

## Navigation Classes

### Navbar States
```css
.navbar.at-top      /* Navbar at page top */
.navbar.scrolled    /* Navbar when scrolled */
.navbar.hidden      /* Hidden navbar */
.navbar.retracting  /* Navbar retracting */
```

### Mobile Menu
```css
.hamburger.active   /* Active hamburger menu */
.nav-menu.active    /* Open mobile menu */
```

## Animation Classes

### Blur to Focus Effects
```html
<div class="animate fly-in-up">Content</div>
<div class="animate fly-in-left">Content</div>
<div class="animate fly-in-right">Content</div>
<div class="animate fly-in-down">Content</div>
```

### Special Effects
```html
<div class="animate gentle-float">Floating content</div>
<div class="animate subtle-glow">Glowing content</div>
<div class="animate slide-reveal">Sliding content</div>
```

### Timing Delays
```html
<div class="animate fly-in-up delay-1">Delayed 0.1s</div>
<div class="animate fly-in-up delay-2">Delayed 0.2s</div>
<div class="animate fly-in-up delay-3">Delayed 0.3s</div>
<!-- Up to delay-6 (0.6s) -->
```

## JavaScript Functions

### Navigation
```javascript
// Toggle mobile menu
toggleMobileMenu()

// Handle navbar scroll behavior
handleNavbarScroll()

// Toggle theme (dark/light)
toggleTheme()
```

### Event Listeners
```javascript
// Hamburger menu click
document.getElementById('hamburger').addEventListener('click', toggleMobileMenu)

// Theme toggle click
document.getElementById('theme-toggle').addEventListener('click', toggleTheme)

// Scroll events
window.addEventListener('scroll', handleNavbarScroll)
```

## CSS Custom Properties

### Colors (Light Theme)
```css
:root {
    --navbar-bg: rgba(255, 255, 255, 0.8);
    --navbar-text: #333;
    --navbar-border: rgba(255, 255, 255, 0.2);
}
```

### Colors (Dark Theme)
```css
[data-theme="dark"] {
    --navbar-bg: rgba(30, 30, 30, 0.8);
    --navbar-text: #fff;
    --navbar-border: rgba(255, 255, 255, 0.1);
}
```

## Common Patterns

### Staggered Animation
```html
<div class="animate fly-in-up">First item</div>
<div class="animate fly-in-up delay-1">Second item</div>
<div class="animate fly-in-up delay-2">Third item</div>
```

### Card with Hover Effect
```html
<div class="animate gentle-float project-card">
    <h3>Project Title</h3>
    <p>Project description</p>
</div>
```

### Button with Glow
```html
<button class="animate subtle-glow btn-primary">
    Call to Action
</button>
```

## File Structure
```
project/
├── index.html          # Main page
├── css/
│   ├── style.css       # Navigation styles
│   ├── animations.css  # Animation effects
│   └── utilities.css   # Helper classes
├── js/
│   └── script.js       # Navigation functionality
└── assets/
    ├── logo.svg        # Website logo
    ├── sun.svg         # Light theme icon
    └── moon.svg        # Dark theme icon
```

## Browser Support
- ✅ Chrome 88+
- ✅ Firefox 94+
- ✅ Safari 14+
- ✅ Edge 88+
- ⚠️ Older browsers (limited support)

## Performance Tips
- Use `transform` and `opacity` for animations
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly
- Test on mobile devices for performance

---

**Quick Start**: Copy files → Update paths → Add animation classes → Test!