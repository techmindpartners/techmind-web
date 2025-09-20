#!/usr/bin/env node

/**
 * CSS Optimization Build Script
 * Handles minification, purging, and critical CSS extraction
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  inputDir: './css',
  outputDir: './css/build',
  criticalCSS: './css/critical.css',
  mainCSS: './css/main.css',
  contentFiles: [
    './index.html',
    './pages/**/*.html'
  ],
  browsers: [
    'last 2 versions',
    '> 1%',
    'not dead'
  ]
};

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

console.log('🚀 Starting CSS optimization process...\n');

// Step 1: Purge unused CSS
console.log('📦 Step 1: Purging unused CSS...');
try {
  execSync(`purgecss --css ${config.mainCSS} --content ${config.contentFiles.join(' ')} --output ${config.outputDir}/purged/`, {
    stdio: 'inherit'
  });
  console.log('✅ Unused CSS purged successfully\n');
} catch (error) {
  console.error('❌ Error purging CSS:', error.message);
  process.exit(1);
}

// Step 2: Minify CSS
console.log('🗜️  Step 2: Minifying CSS...');
try {
  const purgedCSS = path.join(config.outputDir, 'purged', 'main.css');
  const minifiedCSS = path.join(config.outputDir, 'main.min.css');
  
  execSync(`cssnano ${purgedCSS} ${minifiedCSS}`, {
    stdio: 'inherit'
  });
  console.log('✅ CSS minified successfully\n');
} catch (error) {
  console.error('❌ Error minifying CSS:', error.message);
  process.exit(1);
}

// Step 3: Extract critical CSS
console.log('⚡ Step 3: Extracting critical CSS...');
try {
  const criticalCSS = fs.readFileSync(config.criticalCSS, 'utf8');
  const outputPath = path.join(config.outputDir, 'critical.css');
  fs.writeFileSync(outputPath, criticalCSS);
  console.log('✅ Critical CSS extracted successfully\n');
} catch (error) {
  console.error('❌ Error extracting critical CSS:', error.message);
  process.exit(1);
}

// Step 4: Generate performance report
console.log('📊 Step 4: Generating performance report...');
try {
  const originalSize = fs.statSync(config.mainCSS).size;
  const minifiedSize = fs.statSync(path.join(config.outputDir, 'main.min.css')).size;
  const criticalSize = fs.statSync(path.join(config.outputDir, 'critical.css')).size;
  
  const savings = originalSize - minifiedSize;
  const savingsPercent = ((savings / originalSize) * 100).toFixed(1);
  
  const report = {
    timestamp: new Date().toISOString(),
    originalSize: `${(originalSize / 1024).toFixed(2)} KB`,
    minifiedSize: `${(minifiedSize / 1024).toFixed(2)} KB`,
    criticalSize: `${(criticalSize / 1024).toFixed(2)} KB`,
    savings: `${(savings / 1024).toFixed(2)} KB`,
    savingsPercent: `${savingsPercent}%`,
    compressionRatio: `${(minifiedSize / originalSize).toFixed(3)}`,
    recommendations: []
  };
  
  // Add recommendations based on file sizes
  if (criticalSize > 14000) {
    report.recommendations.push('Critical CSS is larger than 14KB. Consider reducing above-the-fold styles.');
  }
  
  if (minifiedSize > 50000) {
    report.recommendations.push('Minified CSS is larger than 50KB. Consider code splitting or removing unused styles.');
  }
  
  if (savingsPercent < 20) {
    report.recommendations.push('CSS compression is less than 20%. Consider using more efficient selectors.');
  }
  
  // Write report
  fs.writeFileSync(
    path.join(config.outputDir, 'performance-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('✅ Performance report generated:');
  console.log(`   Original size: ${report.originalSize}`);
  console.log(`   Minified size: ${report.minifiedSize}`);
  console.log(`   Critical size: ${report.criticalSize}`);
  console.log(`   Savings: ${report.savings} (${report.savingsPercent})`);
  console.log(`   Compression ratio: ${report.compressionRatio}`);
  
  if (report.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    report.recommendations.forEach(rec => console.log(`   - ${rec}`));
  }
  
  console.log('\n✅ CSS optimization completed successfully!');
  
} catch (error) {
  console.error('❌ Error generating performance report:', error.message);
  process.exit(1);
}
