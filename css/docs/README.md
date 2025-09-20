# CSS Architecture Documentation

## Overview
This project uses a modular CSS architecture with BEM methodology, mobile-first responsive design, and performance optimizations.

## Directory Structure
```
css/
├── base/                    # Foundation styles
│   ├── variables.css       # CSS custom properties
│   ├── reset.css           # CSS reset & base styles
│   ├── typography.css      # Typography system
│   ├── breakpoints.css     # Responsive breakpoints
│   └── mixins.css          # CSS mixins & helpers
├── layout/                 # Layout components
│   ├── container.css       # Container system
│   └── grid.css            # Grid & flexbox utilities
├── components/             # UI components
│   ├── buttons.css         # Button components
│   ├── cards.css           # Card components
│   ├── header.css          # Header component
│   ├── hero.css            # Hero section
│   ├── sections.css        # Page sections
│   ├── footer.css          # Footer component
│   ├── responsive-images.css # Image optimization
│   └── touch-optimization.css # Touch interface
├── utilities/              # Utility classes
│   └── utilities.css       # Helper utilities
├── docs/                   # Documentation
│   ├── README.md           # This file
│   ├── naming-conventions.md # Naming standards
│   └── performance.md      # Performance guidelines
├── optimized/              # Optimized builds
│   ├── main.css           # Purged CSS
│   └── main-optimized.css # Enhanced version
├── main.css               # Main CSS file
├── main.min.css          # Minified CSS
└── critical.css          # Critical CSS
```

## Naming Conventions

### BEM Methodology
```css
/* Block */
.button { }

/* Element */
.button__icon { }

/* Modifier */
.button--primary { }
.button--large { }
.button--disabled { }
```

### Component Naming
- **Components**: `.hero`, `.footer`, `.header`
- **Elements**: `.hero__title`, `.footer__logo`
- **Modifiers**: `.button--primary`, `.card--elevated`
- **States**: `.is-active`, `.is-loading`, `.is-disabled`
- **Utilities**: `.text-center`, `.mb-lg`, `.flex`

### File Naming
- **kebab-case**: `responsive-images.css`
- **Descriptive**: `touch-optimization.css`
- **Consistent**: All files follow the same pattern

## CSS Custom Properties

### Color System
```css
:root {
  /* Primary Colors */
  --color-primary: #017fe4;
  --color-primary-hover: #0174d0;
  --color-primary-light: #0089f7;
  --color-primary-dark: #1e3a8a;
  
  /* Text Colors */
  --color-text-primary: #181d27;
  --color-text-secondary: #535862;
  --color-text-muted: #64748b;
  --color-text-light: #ffffff;
  
  /* Background Colors */
  --color-background: #ffffff;
  --color-background-secondary: #f8fafc;
  --color-background-tertiary: #f0f7ff;
}
```

### Typography Scale
```css
:root {
  /* Font Families */
  --font-family-primary: "Inter", sans-serif;
  --font-family-secondary: "Space Grotesk", sans-serif;
  
  /* Font Sizes */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 32px;
  --font-size-4xl: 48px;
  --font-size-5xl: 64px;
  --font-size-6xl: 96px;
}
```

### Spacing System
```css
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
  --spacing-4xl: 80px;
  --spacing-5xl: 120px;
}
```

## Responsive Breakpoints

### Mobile-First Approach
```css
/* Base styles (mobile) */
.component { }

/* Small devices (576px+) */
@media (min-width: 576px) { }

/* Medium devices (768px+) */
@media (min-width: 768px) { }

/* Large devices (992px+) */
@media (min-width: 992px) { }

/* Extra large devices (1200px+) */
@media (min-width: 1200px) { }

/* Ultra wide devices (1920px+) */
@media (min-width: 1920px) { }
```

## Performance Optimizations

### Critical CSS
- Above-the-fold styles are inlined
- Non-critical CSS loads asynchronously
- Reduces render-blocking resources

### Minification
- CSS is minified for production
- Unused styles are purged
- File size reduced by ~21%

### Modern CSS Features
- CSS Custom Properties for theming
- CSS Grid and Flexbox for layouts
- Logical properties for internationalization
- Container queries for component-based responsive design

## Browser Support

### Modern Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Fallbacks
- Graceful degradation for older browsers
- CSS fallbacks for modern features
- Progressive enhancement approach

## Development Guidelines

### Code Organization
1. **Base styles** first (variables, reset, typography)
2. **Layout components** (containers, grids)
3. **UI components** (buttons, cards, etc.)
4. **Utilities** last (helpers, overrides)

### Component Structure
```css
/* Component */
.component {
  /* Layout properties */
  display: flex;
  align-items: center;
  
  /* Spacing */
  padding: var(--spacing-lg);
  margin: var(--spacing-md);
  
  /* Colors */
  background-color: var(--color-background);
  color: var(--color-text-primary);
  
  /* Typography */
  font-family: var(--font-family-primary);
  font-size: var(--font-size-base);
  
  /* Transitions */
  transition: all var(--transition-normal);
}

/* Elements */
.component__element {
  /* Element styles */
}

/* Modifiers */
.component--modifier {
  /* Modifier styles */
}

/* States */
.component.is-active {
  /* State styles */
}

/* Responsive */
@media (min-width: 768px) {
  .component {
    /* Tablet styles */
  }
}
```

### Performance Best Practices
1. Use CSS custom properties for dynamic values
2. Minimize specificity conflicts
3. Use efficient selectors
4. Leverage browser optimizations (will-change, contain)
5. Implement lazy loading for non-critical styles

### Accessibility Considerations
1. High contrast mode support
2. Reduced motion preferences
3. Focus management
4. Touch-friendly targets (44px minimum)
5. Screen reader support

## Build Process

### Development
```bash
# Watch for changes
npm run dev

# Build for production
npm run build
```

### Optimization Pipeline
1. **PurgeCSS** - Remove unused styles
2. **CSSnano** - Minify CSS
3. **Critical CSS** - Extract above-the-fold styles
4. **Autoprefixer** - Add vendor prefixes

## Maintenance

### Regular Tasks
- Review and update browser support
- Optimize CSS bundle size
- Update design system variables
- Test responsive breakpoints
- Validate accessibility compliance

### Code Review Checklist
- [ ] BEM naming conventions followed
- [ ] Mobile-first responsive design
- [ ] Performance optimizations applied
- [ ] Accessibility considerations included
- [ ] Browser compatibility verified
- [ ] Documentation updated
