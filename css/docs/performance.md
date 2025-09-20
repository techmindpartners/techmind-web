# CSS Performance Guidelines

## Critical CSS Strategy

### Above-the-Fold Styles
Critical CSS includes only the styles needed for the initial viewport:
- Header and navigation
- Hero section
- First content block
- Essential typography and colors

### Implementation
```html
<!-- Critical CSS inlined -->
<style>
  /* Critical styles here */
</style>

<!-- Non-critical CSS loaded asynchronously -->
<link rel="preload" href="css/main.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="css/main.min.css"></noscript>
```

## CSS Optimization Techniques

### 1. Minification
```bash
# Using CSSnano
cssnano css/main.css css/main.min.css
```

### 2. Unused CSS Removal
```bash
# Using PurgeCSS
purgecss --css css/main.css --content index.html pages/**/*.html --output css/optimized/
```

### 3. CSS Custom Properties
```css
/* Efficient theming */
:root {
  --color-primary: #017fe4;
  --color-primary-hover: #0174d0;
}

/* Dynamic theme switching */
.theme--dark {
  --color-primary: #0089f7;
}
```

## Performance Best Practices

### 1. Efficient Selectors
```css
/* Good - Simple selectors */
.button { }
.button--primary { }
.button__icon { }

/* Bad - Complex selectors */
div.container > ul.menu li.item a.link { }
```

### 2. Specificity Management
```css
/* Use low specificity */
.button { }
.button--primary { }

/* Avoid high specificity */
div.container .menu .button { }
```

### 3. CSS Containment
```css
/* Contain layout and paint */
.card {
  contain: layout style paint;
}

/* Contain size calculations */
.widget {
  contain: size layout;
}
```

### 4. Will-Change Optimization
```css
/* Use sparingly for animated elements */
.hero__chip-background {
  will-change: transform;
}

/* Remove after animation */
.animation-complete {
  will-change: auto;
}
```

## Modern CSS Features

### 1. CSS Grid
```css
/* Efficient layouts */
.services__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}
```

### 2. CSS Custom Properties
```css
/* Dynamic theming */
:root {
  --primary-color: #017fe4;
  --spacing-unit: 16px;
}

/* Responsive spacing */
@media (min-width: 768px) {
  :root {
    --spacing-unit: 20px;
  }
}
```

### 3. Logical Properties
```css
/* Future-proof spacing */
.element {
  margin-inline: auto;
  padding-inline: var(--spacing-lg);
  border-inline: 1px solid var(--color-border);
}
```

### 4. Container Queries
```css
/* Component-based responsive design */
.card {
  container-type: inline-size;
}

@container (min-width: 600px) {
  .card__content {
    flex-direction: row;
  }
}
```

## Loading Strategies

### 1. Progressive Enhancement
```css
/* Base styles for all browsers */
.button {
  background-color: var(--color-primary);
  color: white;
}

/* Enhanced styles for modern browsers */
@supports (backdrop-filter: blur(10px)) {
  .modal {
    backdrop-filter: blur(5px);
  }
}
```

### 2. Conditional Loading
```css
/* Load advanced features conditionally */
@supports (display: grid) {
  .layout {
    display: grid;
  }
}

@supports not (display: grid) {
  .layout {
    display: flex;
  }
}
```

### 3. Resource Hints
```html
<!-- Preload critical resources -->
<link rel="preload" href="fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="css/critical.css" as="style">
```

## Animation Performance

### 1. GPU Acceleration
```css
/* Use transform for animations */
.animate {
  transform: translateX(0);
  transition: transform var(--transition-normal);
}

.animate:hover {
  transform: translateX(10px);
}
```

### 2. Efficient Animations
```css
/* Animate only transform and opacity */
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity var(--transition-normal), transform var(--transition-normal);
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### 3. Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  .animate {
    animation: none;
    transition: none;
  }
}
```

## Responsive Performance

### 1. Mobile-First Approach
```css
/* Base styles (mobile) */
.component {
  padding: var(--spacing-md);
}

/* Progressive enhancement */
@media (min-width: 768px) {
  .component {
    padding: var(--spacing-lg);
  }
}
```

### 2. Efficient Breakpoints
```css
/* Use consistent breakpoints */
@media (min-width: 576px) { }
@media (min-width: 768px) { }
@media (min-width: 992px) { }
@media (min-width: 1200px) { }
```

### 3. Container Queries
```css
/* Component-based responsive design */
.card {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card__content {
    flex-direction: row;
  }
}
```

## Image Optimization

### 1. Responsive Images
```css
/* Efficient image loading */
.responsive-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}
```

### 2. Lazy Loading
```css
/* Lazy loading styles */
.lazy-image {
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.lazy-image.loaded {
  opacity: 1;
}
```

### 3. High DPI Support
```css
/* Crisp images on high DPI displays */
.high-dpi-image {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}
```

## Browser Optimization

### 1. Vendor Prefixes
```css
/* Use Autoprefixer for vendor prefixes */
.flex-container {
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
```

### 2. Fallbacks
```css
/* Provide fallbacks for modern features */
.grid-container {
  display: flex; /* Fallback */
  display: grid; /* Modern browsers */
}
```

### 3. Feature Detection
```css
/* Use @supports for feature detection */
@supports (display: grid) {
  .layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

@supports not (display: grid) {
  .layout {
    display: flex;
    flex-wrap: wrap;
  }
}
```

## Performance Monitoring

### 1. Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### 2. CSS Performance Metrics
- **CSS file size**: < 50KB (gzipped)
- **Critical CSS**: < 14KB
- **Render-blocking CSS**: Minimize
- **Unused CSS**: Remove

### 3. Optimization Checklist
- [ ] Critical CSS inlined
- [ ] Non-critical CSS loaded asynchronously
- [ ] CSS minified and compressed
- [ ] Unused styles removed
- [ ] Efficient selectors used
- [ ] Modern CSS features leveraged
- [ ] Fallbacks provided for older browsers
- [ ] Performance budgets maintained

## Tools and Automation

### 1. Build Tools
```bash
# PurgeCSS for unused styles
npm install --save-dev purgecss

# CSSnano for minification
npm install --save-dev cssnano

# Autoprefixer for vendor prefixes
npm install --save-dev autoprefixer
```

### 2. Performance Tools
- **Lighthouse**: Overall performance audit
- **WebPageTest**: Detailed performance analysis
- **Chrome DevTools**: CSS performance profiling
- **Bundle Analyzer**: CSS bundle size analysis

### 3. Monitoring
- **Real User Monitoring (RUM)**: Track actual performance
- **Synthetic Monitoring**: Regular performance tests
- **Performance Budgets**: Set and monitor limits
