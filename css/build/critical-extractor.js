#!/usr/bin/env node

/**
 * Critical CSS Extractor
 * Extracts above-the-fold styles for inline inclusion
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  inputDir: './css',
  outputDir: './css/build',
  criticalSelectors: [
    // Header and navigation
    '.header',
    '.navbar',
    '.nav-brand',
    '.nav-menu',
    '.nav-list',
    '.nav-link',
    '.nav-contact',
    '.contact-btn',
    '.nav-toggle',
    
    // Hero section
    '.hero',
    '.hero__title',
    '.hero__subtitle',
    '.hero__container',
    '.hero__content',
    
    // Critical layout
    '.container',
    'body',
    'html',
    
    // Critical typography
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'a', 'button',
    
    // Critical utilities
    '.sr-only',
    '.skip-link'
  ],
  criticalCSSFile: './css/critical.css'
};

// Extract critical CSS from main CSS file
function extractCriticalCSS() {
  console.log('🎯 Extracting critical CSS...');
  
  try {
    const mainCSS = fs.readFileSync(path.join(config.inputDir, 'main.css'), 'utf8');
    const criticalCSS = [];
    
    // Split CSS into rules
    const rules = mainCSS.split('}').filter(rule => rule.trim());
    
    rules.forEach(rule => {
      const ruleText = rule.trim() + '}';
      
      // Check if rule contains critical selectors
      const isCritical = config.criticalSelectors.some(selector => {
        // Handle different selector patterns
        const patterns = [
          selector, // Exact match
          `.${selector}`, // Class selector
          `#${selector}`, // ID selector
          `[class*="${selector}"]`, // Partial class match
          `[id*="${selector}"]`, // Partial ID match
          `*:${selector}`, // Pseudo-selector
          `${selector}:`, // Pseudo-element
          `${selector} `, // Descendant
          `${selector}>`, // Child
          `${selector}+`, // Adjacent sibling
          `${selector}~`, // General sibling
        ];
        
        return patterns.some(pattern => ruleText.includes(pattern));
      });
      
      if (isCritical) {
        criticalCSS.push(ruleText);
      }
    });
    
    // Add critical CSS variables
    const criticalVariables = `
/* Critical CSS Variables */
:root {
  --color-primary: #017fe4;
  --color-primary-hover: #0174d0;
  --color-text-primary: #181d27;
  --color-text-secondary: #535862;
  --color-background: #ffffff;
  --color-background-hero: #fafafa;
  --font-family-primary: "Inter", sans-serif;
  --font-family-secondary: "Space Grotesk", sans-serif;
  --font-size-6xl: 64px;
  --font-size-lg: 18px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-4xl: 80px;
  --line-height-tight: 1.2;
  --line-height-relaxed: 1.6;
  --transition-normal: 0.3s ease;
  --radius-md: 8px;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --z-fixed: 1030;
  --header-height: 87px;
}

/* Critical Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-family-primary);
  font-size: 16px;
  line-height: var(--line-height-relaxed);
  color: var(--color-text-primary);
  background-color: var(--color-background);
  overflow-x: hidden;
}

/* Critical Focus Styles */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

:focus:not(:focus-visible) {
  outline: none;
}
`;

    // Combine critical CSS
    const finalCriticalCSS = criticalVariables + '\n' + criticalCSS.join('\n');
    
    // Write critical CSS file
    fs.writeFileSync(config.criticalCSSFile, finalCriticalCSS);
    
    // Calculate file size
    const fileSize = Buffer.byteLength(finalCriticalCSS, 'utf8');
    const fileSizeKB = (fileSize / 1024).toFixed(2);
    
    console.log(`✅ Critical CSS extracted successfully`);
    console.log(`   File size: ${fileSizeKB} KB`);
    console.log(`   Rules extracted: ${criticalCSS.length}`);
    
    // Check if file size is optimal
    if (fileSize > 14000) {
      console.log('⚠️  Warning: Critical CSS is larger than 14KB. Consider reducing above-the-fold styles.');
    } else {
      console.log('✅ Critical CSS size is optimal (< 14KB)');
    }
    
  } catch (error) {
    console.error('❌ Error extracting critical CSS:', error.message);
    process.exit(1);
  }
}

// Generate inline critical CSS for HTML
function generateInlineCriticalCSS() {
  console.log('📝 Generating inline critical CSS...');
  
  try {
    const criticalCSS = fs.readFileSync(config.criticalCSSFile, 'utf8');
    
    // Minify critical CSS for inline use
    const minifiedCriticalCSS = criticalCSS
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/;\s*}/g, '}') // Remove semicolons before closing braces
      .replace(/,\s+/g, ',') // Remove spaces after commas
      .replace(/:\s+/g, ':') // Remove spaces after colons
      .replace(/;\s+/g, ';') // Remove spaces after semicolons
      .trim();
    
    // Generate HTML template
    const htmlTemplate = `<!-- Critical CSS - Above the fold styles -->
<style>
${minifiedCriticalCSS}
</style>

<!-- Non-Critical CSS - Load asynchronously -->
<link rel="preload" href="css/main.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="css/main.min.css"></noscript>`;

    // Write HTML template
    const outputPath = path.join(config.outputDir, 'critical-css-inline.html');
    fs.writeFileSync(outputPath, htmlTemplate);
    
    const inlineSize = Buffer.byteLength(minifiedCriticalCSS, 'utf8');
    const inlineSizeKB = (inlineSize / 1024).toFixed(2);
    
    console.log(`✅ Inline critical CSS generated`);
    console.log(`   Inline size: ${inlineSizeKB} KB`);
    console.log(`   Output file: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error generating inline critical CSS:', error.message);
    process.exit(1);
  }
}

// Main execution
if (require.main === module) {
  console.log('🚀 Starting critical CSS extraction...\n');
  
  extractCriticalCSS();
  console.log('');
  generateInlineCriticalCSS();
  
  console.log('\n✅ Critical CSS extraction completed successfully!');
}

module.exports = {
  extractCriticalCSS,
  generateInlineCriticalCSS
};
