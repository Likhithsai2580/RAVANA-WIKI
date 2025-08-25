#!/usr/bin/env node

// Simple deployment script for GitHub Pages
const { execSync } = require('child_process');
const path = require('path');

console.log('Starting deployment process...');

try {
  // Build the Next.js application
  console.log('Building Next.js application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
  console.log('The static files are located in the "out" directory.');
  console.log('You can now deploy these files to GitHub Pages.');
  
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}