#!/usr/bin/env node

/**
 * CSS Performance Monitor
 * Monitors CSS performance metrics and generates reports
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  cssDir: './css',
  buildDir: './css/build',
  reportFile: './css/build/performance-report.json',
  metrics: {
    maxCriticalCSS: 14000, // 14KB
    maxTotalCSS: 50000,    // 50KB
    maxMinifiedCSS: 30000, // 30KB
    targetCompressionRatio: 0.7, // 70% compression
    targetSavingsPercent: 30 // 30% savings
  }
};

// Performance metrics
const metrics = {
  timestamp: new Date().toISOString(),
  files: {},
  totals: {},
  recommendations: [],
  score: 0
};

// Analyze CSS file
function analyzeFile(filePath, fileName) {
  try {
    const stats = fs.statSync(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    
    const fileMetrics = {
      size: stats.size,
      sizeKB: (stats.size / 1024).toFixed(2),
      lines: content.split('\n').length,
      rules: (content.match(/\{[^}]*\}/g) || []).length,
      selectors: (content.match(/[^{]+\{/g) || []).length,
      mediaQueries: (content.match(/@media/g) || []).length,
      customProperties: (content.match(/--[a-zA-Z-]+:/g) || []).length,
      imports: (content.match(/@import/g) || []).length,
      comments: (content.match(/\/\*[\s\S]*?\*\//g) || []).length,
      compressionRatio: 0,
      savingsPercent: 0
    };
    
    // Calculate compression ratio if minified version exists
    const minifiedPath = filePath.replace('.css', '.min.css');
    if (fs.existsSync(minifiedPath)) {
      const minifiedStats = fs.statSync(minifiedPath);
      fileMetrics.compressionRatio = (minifiedStats.size / stats.size).toFixed(3);
      fileMetrics.savingsPercent = (((stats.size - minifiedStats.size) / stats.size) * 100).toFixed(1);
    }
    
    return fileMetrics;
  } catch (error) {
    console.error(`Error analyzing ${fileName}:`, error.message);
    return null;
  }
}

// Calculate performance score
function calculateScore() {
  let score = 100;
  
  // Critical CSS size penalty
  if (metrics.files.critical && metrics.files.critical.size > config.metrics.maxCriticalCSS) {
    const excess = metrics.files.critical.size - config.metrics.maxCriticalCSS;
    score -= Math.min(20, (excess / 1000) * 2);
  }
  
  // Total CSS size penalty
  if (metrics.totals.original > config.metrics.maxTotalCSS) {
    const excess = metrics.totals.original - config.metrics.maxTotalCSS;
    score -= Math.min(30, (excess / 1000) * 1);
  }
  
  // Compression ratio penalty
  if (metrics.totals.compressionRatio > config.metrics.targetCompressionRatio) {
    score -= 15;
  }
  
  // Savings percentage bonus
  if (metrics.totals.savingsPercent > config.metrics.targetSavingsPercent) {
    score += 10;
  }
  
  return Math.max(0, Math.min(100, score));
}

// Generate recommendations
function generateRecommendations() {
  const recommendations = [];
  
  // Critical CSS recommendations
  if (metrics.files.critical && metrics.files.critical.size > config.metrics.maxCriticalCSS) {
    recommendations.push({
      type: 'critical',
      severity: 'high',
      message: `Critical CSS is ${metrics.files.critical.sizeKB}KB (target: <${config.metrics.maxCriticalCSS/1000}KB). Consider reducing above-the-fold styles.`,
      action: 'Remove non-critical styles from critical CSS file'
    });
  }
  
  // Total CSS size recommendations
  if (metrics.totals.original > config.metrics.maxTotalCSS) {
    recommendations.push({
      type: 'size',
      severity: 'high',
      message: `Total CSS is ${metrics.totals.originalKB}KB (target: <${config.metrics.maxTotalCSS/1000}KB). Consider code splitting or removing unused styles.`,
      action: 'Use PurgeCSS to remove unused styles or implement code splitting'
    });
  }
  
  // Compression ratio recommendations
  if (metrics.totals.compressionRatio > config.metrics.targetCompressionRatio) {
    recommendations.push({
      type: 'compression',
      severity: 'medium',
      message: `Compression ratio is ${metrics.totals.compressionRatio} (target: <${config.metrics.targetCompressionRatio}). CSS could be more efficiently minified.`,
      action: 'Review CSS structure and remove redundant code'
    });
  }
  
  // Media query recommendations
  if (metrics.totals.mediaQueries > 20) {
    recommendations.push({
      type: 'media-queries',
      severity: 'low',
      message: `High number of media queries (${metrics.totals.mediaQueries}). Consider consolidating breakpoints.`,
      action: 'Review and consolidate responsive breakpoints'
    });
  }
  
  // Import recommendations
  if (metrics.totals.imports > 10) {
    recommendations.push({
      type: 'imports',
      severity: 'low',
      message: `High number of @import statements (${metrics.totals.imports}). Consider bundling CSS files.`,
      action: 'Bundle CSS files to reduce HTTP requests'
    });
  }
  
  // Custom properties recommendations
  if (metrics.totals.customProperties < 10) {
    recommendations.push({
      type: 'custom-properties',
      severity: 'low',
      message: `Low usage of CSS custom properties (${metrics.totals.customProperties}). Consider using more for better maintainability.`,
      action: 'Extract common values into CSS custom properties'
    });
  }
  
  return recommendations;
}

// Generate performance report
function generateReport() {
  console.log('📊 Analyzing CSS performance...\n');
  
  // Analyze all CSS files
  const cssFiles = [
    'main.css',
    'main.min.css',
    'critical.css',
    'base/variables.css',
    'base/reset.css',
    'base/typography.css',
    'components/buttons.css',
    'components/cards.css',
    'components/header.css'
  ];
  
  cssFiles.forEach(fileName => {
    const filePath = path.join(config.cssDir, fileName);
    if (fs.existsSync(filePath)) {
      const fileMetrics = analyzeFile(filePath, fileName);
      if (fileMetrics) {
        metrics.files[fileName.replace('.css', '').replace('/', '_')] = fileMetrics;
        console.log(`✅ Analyzed ${fileName}: ${fileMetrics.sizeKB}KB, ${fileMetrics.rules} rules`);
      }
    }
  });
  
  // Calculate totals
  metrics.totals = {
    original: 0,
    minified: 0,
    critical: 0,
    rules: 0,
    selectors: 0,
    mediaQueries: 0,
    customProperties: 0,
    imports: 0,
    comments: 0
  };
  
  Object.values(metrics.files).forEach(file => {
    metrics.totals.original += file.size;
    metrics.totals.rules += file.rules;
    metrics.totals.selectors += file.selectors;
    metrics.totals.mediaQueries += file.mediaQueries;
    metrics.totals.customProperties += file.customProperties;
    metrics.totals.imports += file.imports;
    metrics.totals.comments += file.comments;
  });
  
  // Add minified and critical totals
  if (metrics.files.main_min) {
    metrics.totals.minified = metrics.files.main_min.size;
  }
  if (metrics.files.critical) {
    metrics.totals.critical = metrics.files.critical.size;
  }
  
  // Calculate derived metrics
  metrics.totals.originalKB = (metrics.totals.original / 1024).toFixed(2);
  metrics.totals.minifiedKB = (metrics.totals.minified / 1024).toFixed(2);
  metrics.totals.criticalKB = (metrics.totals.critical / 1024).toFixed(2);
  metrics.totals.compressionRatio = metrics.totals.minified > 0 ? 
    (metrics.totals.minified / metrics.totals.original).toFixed(3) : 0;
  metrics.totals.savingsPercent = metrics.totals.original > 0 ? 
    (((metrics.totals.original - metrics.totals.minified) / metrics.totals.original) * 100).toFixed(1) : 0;
  
  // Generate recommendations
  metrics.recommendations = generateRecommendations();
  
  // Calculate performance score
  metrics.score = calculateScore();
  
  // Write report
  fs.writeFileSync(config.reportFile, JSON.stringify(metrics, null, 2));
  
  // Display summary
  console.log('\n📈 Performance Summary:');
  console.log(`   Total CSS size: ${metrics.totals.originalKB}KB`);
  console.log(`   Minified size: ${metrics.totals.minifiedKB}KB`);
  console.log(`   Critical CSS: ${metrics.totals.criticalKB}KB`);
  console.log(`   Compression ratio: ${metrics.totals.compressionRatio}`);
  console.log(`   Savings: ${metrics.totals.savingsPercent}%`);
  console.log(`   Total rules: ${metrics.totals.rules}`);
  console.log(`   Total selectors: ${metrics.totals.selectors}`);
  console.log(`   Media queries: ${metrics.totals.mediaQueries}`);
  console.log(`   Custom properties: ${metrics.totals.customProperties}`);
  console.log(`   Performance score: ${metrics.score}/100`);
  
  // Display recommendations
  if (metrics.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    metrics.recommendations.forEach((rec, index) => {
      const severity = rec.severity === 'high' ? '🔴' : rec.severity === 'medium' ? '🟡' : '🟢';
      console.log(`   ${index + 1}. ${severity} ${rec.message}`);
      console.log(`      Action: ${rec.action}`);
    });
  } else {
    console.log('\n✅ No recommendations - CSS performance is optimal!');
  }
  
  console.log(`\n📄 Full report saved to: ${config.reportFile}`);
}

// Main execution
if (require.main === module) {
  generateReport();
}

module.exports = {
  generateReport,
  analyzeFile,
  calculateScore,
  generateRecommendations
};
