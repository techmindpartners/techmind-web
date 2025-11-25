const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { promisify } = require('util');
const access = promisify(require('fs').access);
const constants = require('fs').constants;

const app = express();
const PORT = process.env.PORT || 3000;

// Performance monitoring
const performance = {
  requests: 0,
  startTime: Date.now(),
  routes: {},
  errors: 0
};

// Security middleware
app.use((req, res, next) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Performance headers
  res.setHeader('X-Response-Time', '0ms');
  
  next();
});

// Request logging and performance monitoring
app.use((req, res, next) => {
  const start = Date.now();
  performance.requests++;
  
  // Track route performance
  const route = req.route ? req.route.path : req.path;
  if (!performance.routes[route]) {
    performance.routes[route] = { count: 0, totalTime: 0 };
  }
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    performance.routes[route].count++;
    performance.routes[route].totalTime += duration;
    res.setHeader('X-Response-Time', `${duration}ms`);
  });
  
  next();
});

// Compression middleware (if available)
try {
  const compression = require('compression');
  app.use(compression());
} catch (err) {
  console.log('Compression middleware not available');
}

// Cache control for static assets
const staticOptions = {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
};

// Serve static files with optimized settings
app.use(express.static(__dirname, staticOptions));

// Route configuration with metadata
const routes = {
  '/': {
    file: 'index.html',
    title: 'Techmind Partners - Cost-smart Technology',
    description: 'Techmind - Leading platform in the technology world',
    priority: 1
  },
  '/engineering-solutions': {
    file: 'pages/engineering-solutions/index.html',
    title: 'Techmind Partners - Engineering Solutions Program',
    description: 'Professional engineering solutions for your business',
    priority: 0.8
  },
  '/cloud-solutions': {
    file: 'pages/cloud-solutions/index.html',
    title: 'Techmind Partners - Cloud Solutions Program',
    description: 'Scalable cloud solutions for modern businesses',
    priority: 0.8
  },
  '/ai-solutions': {
    file: 'pages/ai-solutions/index.html',
    title: 'Techmind Partners - AI Solutions Program',
    description: 'Artificial intelligence solutions for automation',
    priority: 0.8
  },
  '/end-user-solutions': {
    file: 'pages/end-user-solutions/index.html',
    title: 'Techmind Partners - End User Solutions Program',
    description: 'User-focused technology solutions',
    priority: 0.8
  },
  '/contact': {
    file: 'pages/contact/index.html',
    title: 'Techmind Partners - Contact Us',
    description: 'Get in touch with our team',
    priority: 0.6
  }
};

// Error handling middleware
const handleError = (err, req, res, next) => {
  performance.errors++;
  console.error('Error:', err.message);
  
  if (res.headersSent) {
    return next(err);
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] || 'unknown'
  });
};

// Optimized route handler with caching
const routeCache = new Map();
const CACHE_TTL = 60000; // 1 minute cache

async function getRouteData(route) {
  const cached = routeCache.get(route);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const routeData = routes[route];
  if (!routeData) return null;
  
  const filePath = path.join(__dirname, routeData.file);
  
  try {
    await access(filePath, constants.F_OK);
    const data = { ...routeData, filePath, exists: true };
    routeCache.set(route, { data, timestamp: Date.now() });
    return data;
  } catch (err) {
    const data = { ...routeData, filePath, exists: false };
    routeCache.set(route, { data, timestamp: Date.now() });
    return data;
  }
}

// Handle clean URL routes with optimization
Object.keys(routes).forEach(route => {
  app.get(route, async (req, res, next) => {
    try {
      const routeData = await getRouteData(route);
      
      if (!routeData || !routeData.exists) {
        return res.status(404).json({
          error: 'Page not found',
          message: `The page ${route} does not exist`,
          timestamp: new Date().toISOString()
        });
      }
      
      // Set SEO headers
      res.setHeader('X-Page-Title', routeData.title);
      res.setHeader('X-Page-Description', routeData.description);
      res.setHeader('X-Page-Priority', routeData.priority);
      
      res.sendFile(routeData.filePath);
    } catch (err) {
      next(err);
    }
  });
});

// Sitemap endpoint
app.get('/sitemap.xml', (req, res) => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.entries(routes).map(([route, data]) => `
  <url>
    <loc>http://localhost:${PORT}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${data.priority}</priority>
  </url>`).join('')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.send(sitemap);
});

// Robots.txt endpoint
app.get('/robots.txt', (req, res) => {
  const robots = `User-agent: *
Allow: /

Sitemap: http://localhost:${PORT}/sitemap.xml`;

  res.setHeader('Content-Type', 'text/plain');
  res.send(robots);
});

// Health check endpoint
app.get('/health', (req, res) => {
  const uptime = Date.now() - performance.startTime;
  const avgResponseTime = performance.requests > 0 ? 
    Object.values(performance.routes).reduce((total, route) => total + (route.totalTime / route.count), 0) / Object.keys(performance.routes).length : 0;
  
  res.json({
    status: 'healthy',
    uptime: uptime,
    requests: performance.requests,
    errors: performance.errors,
    averageResponseTime: Math.round(avgResponseTime),
    routes: Object.keys(routes).length,
    timestamp: new Date().toISOString()
  });
});

// Performance metrics endpoint
app.get('/metrics', (req, res) => {
  const uptime = Date.now() - performance.startTime;
  const routeMetrics = Object.entries(performance.routes).map(([route, data]) => ({
    route,
    requests: data.count,
    averageTime: Math.round(data.totalTime / data.count),
    totalTime: data.totalTime
  }));
  
  res.json({
    performance: {
      uptime,
      totalRequests: performance.requests,
      totalErrors: performance.errors,
      routes: routeMetrics
    },
    timestamp: new Date().toISOString()
  });
});

// Optimized fallback handler
app.get('*', async (req, res, next) => {
  try {
    // Check if it's a file request (has extension)
    if (path.extname(req.url)) {
      return res.status(404).json({
        error: 'File not found',
        message: `The file ${req.url} does not exist`,
        timestamp: new Date().toISOString()
      });
    }
    
    // For clean URLs without extension, try to serve corresponding HTML file
    const htmlFile = req.url.slice(1) + '.html';
    const filePath = path.join(__dirname, htmlFile);
    
    try {
      await access(filePath, constants.F_OK);
      res.sendFile(filePath);
    } catch (err) {
      // If no HTML file found, redirect to home with 404 status
      res.status(404).redirect('/');
    }
  } catch (err) {
    next(err);
  }
});

// Error handling middleware
app.use(handleError);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`🚀 Techmind website running on http://localhost:${PORT}`);
  console.log(`📝 Available routes:`);
  Object.entries(routes).forEach(([route, data]) => {
    console.log(`   → http://localhost:${PORT}${route} (${data.title})`);
  });
  console.log(`   → http://localhost:${PORT}/health (Health check)`);
  console.log(`   → http://localhost:${PORT}/metrics (Performance metrics)`);
  console.log(`   → http://localhost:${PORT}/sitemap.xml (Sitemap)`);
  console.log(`   → http://localhost:${PORT}/robots.txt (Robots)`);
  console.log(`\n🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Performance monitoring enabled`);
  console.log(`🛡️  Security headers configured`);
  console.log(`⚡ Caching enabled for static assets`);
});

// Server error handling
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please try a different port.`);
  } else {
    console.error('❌ Server error:', err.message);
  }
  process.exit(1);
});

module.exports = app;
