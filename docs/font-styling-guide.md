# Microsoft Design System Font Implementation Guide

## Overview

This document outlines the font styling system implemented across the portfolio website. The website now uses Microsoft Design System fonts for a consistent, modern look that aligns with Microsoft's design language.

## Font Implementation

### Base Font Family

The primary font family is Segoe UI, Microsoft's signature font, with appropriate fallbacks:

```css
--ms-font-family: 'Segoe UI', 'Segoe UI Variable', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
```

### Font Size Scale

The font size scale follows Microsoft's Fluent 2 Design System:

```css
--ms-font-size-caption2: 0.625rem;     /* 10px */
--ms-font-size-caption1: 0.75rem;      /* 12px */
--ms-font-size-body1: 0.875rem;        /* 14px */
--ms-font-size-subtitle2: 1rem;        /* 16px */
--ms-font-size-subtitle1: 1.25rem;     /* 20px */
--ms-font-size-title3: 1.5rem;         /* 24px */
--ms-font-size-title2: 1.75rem;        /* 28px */
--ms-font-size-title1: 2rem;           /* 32px */
--ms-font-size-largetitle: 2.5rem;     /* 40px */
--ms-font-size-display: 4.25rem;       /* 68px */
```

### Font Weights

The font weights are defined according to Microsoft's guidelines:

```css
--ms-weight-light: 300;
--ms-weight-regular: 400;
--ms-weight-medium: 500;
--ms-weight-semibold: 600;
--ms-weight-bold: 700;
--ms-weight-extrabold: 800;
```

## Implementation Details

### CSS File Structure

- `microsoft-fonts.css`: Contains all Microsoft font definitions and typography overrides
- This file is imported in all HTML files before other stylesheets to ensure proper cascading

### HTML Integration

All HTML files include the Microsoft font CSS file:

```html
<link rel="stylesheet" href="css/microsoft-fonts.css" />
```

### Typography Hierarchy

The following elements have been styled with Microsoft fonts:

1. **H1 (Homepage)**: Uses `--ms-font-size-largetitle` with `--ms-weight-semibold`
2. **H1 (Other pages)**: Uses `--ms-font-size-title1` with `--ms-weight-semibold`
3. **H2**: Uses `--ms-font-size-title2` with `--ms-weight-semibold`
4. **H3**: Uses `--ms-font-size-title3` with `--ms-weight-semibold`
5. **H4**: Uses `--ms-font-size-subtitle1` with `--ms-weight-semibold`
6. **H5**: Uses `--ms-font-size-subtitle2` with `--ms-weight-semibold`
7. **Body text**: Uses `--ms-font-size-body1` with `--ms-weight-regular`
8. **Caption text**: Uses `--ms-font-size-caption1` with `--ms-weight-regular`

## Responsive Typography

The font sizes adjust responsively based on screen size:

```css
@media (max-width: 768px) {
  h1 {
    font-size: var(--ms-font-size-title1);
  }
  
  h2 {
    font-size: var(--ms-font-size-title2);
  }
  
  /* Additional responsive adjustments */
}

@media (max-width: 480px) {
  h1 {
    font-size: var(--ms-font-size-title2);
  }
  
  h2 {
    font-size: var(--ms-font-size-title3);
  }
  
  /* Additional responsive adjustments */
}
```

## Maintenance Guidelines

1. Always use the CSS variables for font properties rather than hardcoding values
2. Maintain the hierarchy of typography to ensure visual consistency
3. When adding new elements, refer to this guide to determine the appropriate font styling
4. Test any changes across different browsers and devices to ensure compatibility

## Browser Support

The Microsoft font implementation is supported in all modern browsers. For older browsers, the system will fall back to system fonts as defined in the font stack.