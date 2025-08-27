const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

// Route mappings for clean URLs
const routes = {
  '/': 'index.html',
  '/engineering-solutions': 'engineering-solutions.html',
  '/cloud-solutions': 'cloud-solutions.html',
  '/ai-solutions': 'ai-solutions.html',
  '/end-user-solutions': 'end-user-solutions.html',
  '/contact': 'contact.html'
};

// Handle clean URL routes
Object.keys(routes).forEach(route => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, routes[route]));
  });
});

// Fallback for any other routes - serve index.html
app.get('*', (req, res) => {
  // Check if it's a file request (has extension)
  if (path.extname(req.url)) {
    res.status(404).send('File not found');
  } else {
    // For clean URLs without extension, try to serve corresponding HTML file
    const htmlFile = req.url.slice(1) + '.html';
    const filePath = path.join(__dirname, htmlFile);
    
    // Check if HTML file exists
    require('fs').access(filePath, require('fs').constants.F_OK, (err) => {
      if (err) {
        // If no HTML file found, serve 404 or redirect to home
        res.redirect('/');
      } else {
        res.sendFile(filePath);
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Techmind website running on http://localhost:${PORT}`);
  console.log(`📝 Available routes:`);
  console.log(`   → http://localhost:${PORT}/`);
  console.log(`   → http://localhost:${PORT}/engineering-solutions`);
  console.log(`   → http://localhost:${PORT}/cloud-solutions`);
  console.log(`   → http://localhost:${PORT}/ai-solutions`);
  console.log(`   → http://localhost:${PORT}/end-user-solutions`);
  console.log(`   → http://localhost:${PORT}/contact`);
});
