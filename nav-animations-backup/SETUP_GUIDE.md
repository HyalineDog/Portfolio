# Setup Guide: Navigation & Load-in Animations

This guide walks you through implementing the Apple-style navigation and blur-to-focus load-in animations step by step.

## Prerequisites

- Basic HTML, CSS, and JavaScript knowledge
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor or IDE
- Local web server (optional but recommended)

## Step-by-Step Implementation

### Step 1: HTML Structure Setup

1. **Create your HTML file** or open an existing one
2. **Add the navigation structure** inside the `<body>` tag:

```html
<nav class="navbar at-top" id="navbar">
    <div class="nav-container">
        <div class="nav-logo">
            <a href="index.html">
                <img src="assets/logo.svg" alt="Logo" class="logo">
            </a>
        </div>
        
        <ul class="nav-menu" id="nav-menu">
            <li class="nav-item">
                <a href="index.html" class="nav-link">Home</a>
            </li>
            <li class="nav-item">
                <a href="about.html" class="nav-link">About</a>
            </li>
            <li class="nav-item">
                <a href="#projects" class="nav-link">Projects</a>
            </li>
        </ul>
        
        <div class="nav-actions">
            <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
                <img src="assets/sun.svg" alt="Light mode" class="theme-icon" id="theme-icon">
            </button>
            
            <div class="hamburger" id="hamburger">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </div>
    </div>
</nav>
```

3. **Add CSS and JavaScript links** in the `<head>` section:

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Website</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/animations.css">
    <link rel="stylesheet" href="css/utilities.css">
</head>
```

4. **Add JavaScript before closing `</body>` tag**:

```html
<script src="js/script.js"></script>
</body>
```

### Step 2: CSS Files Setup

1. **Create the `css/` directory** in your project root
2. **Copy the CSS files** from the backup:
   - `style.css` - Main navigation styles
   - `animations.css` - Load-in animation effects
   - `utilities.css` - Helper classes

3. **Verify CSS imports** are working by checking if the navbar appears styled

### Step 3: JavaScript Setup

1. **Create the `js/` directory** in your project root
2. **Copy `script.js`** from the backup to your `js/` folder
3. **Test functionality**:
   - Scroll the page to see navbar transitions
   - Click the hamburger menu on mobile
   - Toggle the theme switch

### Step 4: Assets Setup

1. **Create the `assets/` directory** in your project root
2. **Copy the essential assets**:
   - `logo.svg` or `logo.png` - Your website logo
   - `sun.svg` - Light theme icon
   - `moon.svg` - Dark theme icon

3. **Update asset paths** in your HTML if needed

### Step 5: Adding Load-in Animations

1. **Add animation classes** to elements you want to animate:

```html
<!-- Blur to focus from bottom -->
<div class="animate fly-in-up">
    <h1>Your Content</h1>
</div>

<!-- Blur to focus from left -->
<div class="animate fly-in-left delay-1">
    <p>This appears after a delay</p>
</div>

<!-- Gentle floating effect -->
<div class="animate gentle-float delay-2">
    <img src="image.jpg" alt="Floating image">
</div>

<!-- Subtle glow effect -->
<button class="animate subtle-glow delay-3">
    Click me
</button>
```

2. **Use delay classes** for staggered animations:
   - `.delay-1` - 0.1s delay
   - `.delay-2` - 0.2s delay
   - `.delay-3` - 0.3s delay
   - Up to `.delay-6` - 0.6s delay

### Step 6: Customization

#### Navbar Customization

1. **Colors**: Edit CSS custom properties in `style.css`:
```css
:root {
    --navbar-bg: rgba(255, 255, 255, 0.8);
    --navbar-text: #333;
    --navbar-border: rgba(255, 255, 255, 0.2);
}
```

2. **Logo**: Replace `assets/logo.svg` with your own logo

3. **Menu items**: Add/remove `<li>` elements in the navigation

#### Animation Customization

1. **Animation duration**: Modify in `animations.css`:
```css
.animate.fly-in-up {
    animation: blurFocusOnly 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}
```

2. **Animation delays**: Adjust delay classes or create custom ones

3. **Disable animations**: Add `prefers-reduced-motion` support (already included)

### Step 7: Testing

1. **Desktop Testing**:
   - Scroll up/down to test navbar behavior
   - Resize window to test responsiveness
   - Toggle theme switch
   - Check animation timing

2. **Mobile Testing**:
   - Test hamburger menu functionality
   - Verify touch interactions
   - Check responsive layout

3. **Browser Testing**:
   - Test in Chrome, Firefox, Safari, Edge
   - Check for glassmorphism support
   - Verify animation performance

### Step 8: Performance Optimization

1. **Optimize images**:
   - Use SVG for icons when possible
   - Compress PNG/JPG images
   - Consider WebP format for better compression

2. **CSS optimization**:
   - Remove unused CSS rules
   - Minify CSS for production
   - Use CSS containment where appropriate

3. **JavaScript optimization**:
   - Debounce scroll events (already implemented)
   - Minify JavaScript for production

## Troubleshooting

### Common Issues

1. **Navbar not appearing**:
   - Check CSS file paths
   - Verify HTML structure matches expected classes
   - Check browser console for errors

2. **Animations not working**:
   - Ensure `animations.css` is loaded
   - Check if elements have `.animate` class
   - Verify browser supports CSS animations

3. **JavaScript errors**:
   - Check browser console
   - Verify `script.js` is loaded
   - Ensure DOM elements exist before JavaScript runs

4. **Mobile menu not working**:
   - Check hamburger button HTML structure
   - Verify JavaScript event listeners are attached
   - Test on actual mobile device

### Browser Support

- **Full support**: Chrome 88+, Firefox 94+, Safari 14+, Edge 88+
- **Partial support**: Older browsers (animations may not work)
- **Fallbacks**: Basic navigation still works without advanced features

## Advanced Features

### Adding New Animation Types

1. **Create keyframes** in `animations.css`:
```css
@keyframes customAnimation {
    0% {
        opacity: 0;
        transform: scale(0.8) rotateY(45deg);
    }
    100% {
        opacity: 1;
        transform: scale(1) rotateY(0deg);
    }
}
```

2. **Create animation class**:
```css
.animate.custom-effect {
    animation: customAnimation 1s ease-out forwards;
}
```

### Extending Navigation Features

1. **Add dropdown menus**
2. **Implement search functionality**
3. **Add breadcrumb navigation**
4. **Create mega menus**

## Next Steps

1. **Customize colors and branding** to match your design
2. **Add more content** with appropriate animation classes
3. **Test thoroughly** across different devices and browsers
4. **Optimize for production** by minifying files
5. **Consider accessibility** improvements like focus indicators

---

**Need Help?** Check the `README.md` file for technical details and restoration instructions.