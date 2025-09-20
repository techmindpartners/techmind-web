# CSS Naming Conventions

## BEM Methodology

### Block
A standalone entity that is meaningful on its own.
```css
/* Good */
.button { }
.menu { }
.input { }

/* Bad */
.btn { }
.nav { }
.field { }
```

### Element
A part of a block that has no standalone meaning.
```css
/* Good */
.button__icon { }
.menu__item { }
.input__label { }

/* Bad */
.buttonIcon { }
.menuItem { }
.inputLabel { }
```

### Modifier
A flag on blocks or elements used to change appearance or behavior.
```css
/* Good */
.button--primary { }
.button--large { }
.button--disabled { }

/* Bad */
.buttonPrimary { }
.buttonLarge { }
.buttonDisabled { }
```

## Component Naming

### Page Sections
```css
/* Hero Section */
.hero { }
.hero__title { }
.hero__subtitle { }
.hero__background { }

/* Footer */
.footer { }
.footer__content { }
.footer__logo { }
.footer__nav { }
```

### UI Components
```css
/* Buttons */
.btn { }
.btn--primary { }
.btn--secondary { }
.btn--large { }
.btn__icon { }

/* Cards */
.card { }
.card--elevated { }
.card--outlined { }
.card__header { }
.card__body { }
.card__footer { }
```

### Layout Components
```css
/* Container */
.container { }
.container--fluid { }
.container--sm { }

/* Grid */
.grid { }
.grid__item { }
.grid--2-cols { }
.grid--3-cols { }
```

## State Classes

### Interactive States
```css
/* Active state */
.is-active { }
.is-open { }
.is-expanded { }

/* Loading state */
.is-loading { }
.is-loading--skeleton { }

/* Error state */
.is-error { }
.has-error { }

/* Disabled state */
.is-disabled { }
.is-readonly { }
```

### Visibility States
```css
/* Visibility */
.is-visible { }
.is-hidden { }
.is-invisible { }

/* Screen reader */
.sr-only { }
.sr-only--focusable { }
```

## Utility Classes

### Spacing
```css
/* Margin */
.m-0 { margin: 0; }
.mt-lg { margin-top: var(--spacing-lg); }
.mb-xl { margin-bottom: var(--spacing-xl); }

/* Padding */
.p-0 { padding: 0; }
.pt-md { padding-top: var(--spacing-md); }
.px-xl { padding-left: var(--spacing-xl); padding-right: var(--spacing-xl); }
```

### Typography
```css
/* Font size */
.text-xs { font-size: var(--font-size-xs); }
.text-lg { font-size: var(--font-size-lg); }

/* Font weight */
.font-light { font-weight: var(--font-weight-light); }
.font-bold { font-weight: var(--font-weight-bold); }

/* Text alignment */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }
```

### Display
```css
/* Display */
.block { display: block; }
.flex { display: flex; }
.grid { display: grid; }
.hidden { display: none; }

/* Flexbox */
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
```

## Responsive Modifiers

### Breakpoint Prefixes
```css
/* Mobile first */
.sm\:hidden { }
.md\:block { }
.lg\:flex { }
.xl\:grid { }

/* Usage */
<div class="hidden md:block lg:flex">
  <!-- Hidden on mobile, block on tablet, flex on desktop -->
</div>
```

### Responsive Utilities
```css
/* Responsive spacing */
.sm\:mt-lg { }
.md\:px-xl { }
.lg\:py-2xl { }

/* Responsive typography */
.sm\:text-lg { }
.md\:text-xl { }
.lg\:text-2xl { }
```

## Animation Classes

### Transitions
```css
/* Transition utilities */
.transition { transition: all var(--transition-normal); }
.transition-colors { transition: color var(--transition-normal), background-color var(--transition-normal); }
.transition-transform { transition: transform var(--transition-normal); }
```

### Animation States
```css
/* Fade animations */
.fade-in { opacity: 0; transform: translateY(30px); }
.fade-in.visible { opacity: 1; transform: translateY(0); }

/* Slide animations */
.slide-in-left { opacity: 0; transform: translateX(-30px); }
.slide-in-left.visible { opacity: 1; transform: translateX(0); }
```

## Form Elements

### Input States
```css
/* Form inputs */
.input { }
.input--error { }
.input--success { }
.input--disabled { }

/* Form groups */
.form-group { }
.form-group__label { }
.form-group__error { }
.form-group__help { }
```

## Navigation

### Navigation Components
```css
/* Main navigation */
.nav { }
.nav__list { }
.nav__item { }
.nav__link { }
.nav__link--active { }

/* Breadcrumbs */
.breadcrumb { }
.breadcrumb__item { }
.breadcrumb__link { }
.breadcrumb__separator { }
```

## Media Components

### Images
```css
/* Responsive images */
.img { }
.img--responsive { }
.img--rounded { }
.img--circle { }

/* Image containers */
.img-container { }
.img-container--aspect-16-9 { }
.img-container--aspect-4-3 { }
```

### Videos
```css
/* Video components */
.video { }
.video--responsive { }
.video__controls { }
.video__overlay { }
```

## Layout Patterns

### Card Layouts
```css
/* Card grid */
.card-grid { }
.card-grid--2-cols { }
.card-grid--3-cols { }
.card-grid--4-cols { }

/* Card variations */
.card-grid--featured { }
.card-grid--compact { }
```

### List Layouts
```css
/* List components */
.list { }
.list--horizontal { }
.list--vertical { }
.list--inline { }

/* List items */
.list__item { }
.list__item--separated { }
```

## Naming Best Practices

### Do's
- Use descriptive names: `.hero__title` not `.hero__h1`
- Be consistent: `.btn--primary` not `.btn-primary`
- Use semantic names: `.card__header` not `.card__top`
- Keep it simple: `.nav` not `.navigation-menu`

### Don'ts
- Don't use abbreviations: `.btn` not `.b`
- Don't use generic names: `.container` not `.wrapper`
- Don't use presentational names: `.red-button` not `.btn--red`
- Don't use deep nesting: `.card__header__title` not `.card__header-title`

### Examples

#### Good Naming
```css
/* Clear and semantic */
.hero__title { }
.button--primary { }
.card__body { }
.nav__link--active { }
.form-group__error { }
```

#### Bad Naming
```css
/* Unclear and non-semantic */
.heroTitle { }
.primaryBtn { }
.cardBody { }
.activeNavLink { }
.errorFormGroup { }
```

## File Naming

### Component Files
```css
/* Use kebab-case */
hero.css
footer.css
responsive-images.css
touch-optimization.css
```

### Utility Files
```css
/* Descriptive names */
utilities.css
breakpoints.css
mixins.css
```

### Layout Files
```css
/* Clear purpose */
container.css
grid.css
layout.css
```

## CSS Custom Properties Naming

### Color Properties
```css
:root {
  /* Primary colors */
  --color-primary: #017fe4;
  --color-primary-hover: #0174d0;
  --color-primary-light: #0089f7;
  --color-primary-dark: #1e3a8a;
  
  /* Text colors */
  --color-text-primary: #181d27;
  --color-text-secondary: #535862;
  --color-text-muted: #64748b;
}
```

### Spacing Properties
```css
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}
```

### Typography Properties
```css
:root {
  --font-family-primary: "Inter", sans-serif;
  --font-size-base: 16px;
  --font-weight-normal: 400;
  --line-height-normal: 1.5;
}
```
