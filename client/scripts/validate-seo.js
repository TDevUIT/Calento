#!/usr/bin/env node

/**
 * SEO Validation Script
 * Validates schema data and checks for required SEO assets
 */

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const imagesDir = path.join(publicDir, 'images');

console.log('🔍 Validating SEO Setup...\n');

// Check required files
const requiredFiles = [
  { path: 'icon-192x192.png', name: 'Icon 192x192', required: true },
  { path: 'icon-512x512.png', name: 'Icon 512x512', required: true },
  { path: 'images/logo.png', name: 'Logo PNG', required: true },
  { path: 'og-image.png', name: 'Open Graph Image', required: false },
  { path: 'twitter-image.png', name: 'Twitter Image', required: false },
  { path: 'manifest.json', name: 'Manifest', required: true },
  { path: 'favicon.ico', name: 'Favicon', required: true },
];

let hasErrors = false;
let hasWarnings = false;

console.log('📁 Checking required files:\n');

requiredFiles.forEach((file) => {
  const filePath = path.join(publicDir, file.path);
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`✅ ${file.name}: ${file.path} (${sizeKB} KB)`);
  } else if (file.required) {
    console.log(`❌ ${file.name}: ${file.path} - MISSING (REQUIRED)`);
    hasErrors = true;
  } else {
    console.log(`⚠️  ${file.name}: ${file.path} - Missing (Optional)`);
    hasWarnings = true;
  }
});

// Check logo.png in images directory
const logoPath = path.join(imagesDir, 'logo.png');
if (!fs.existsSync(logoPath)) {
  console.log('\n⚠️  Creating logo.png from icon-512x512.png...');
  
  // Ensure images directory exists
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  // Copy icon as logo if logo doesn't exist
  const iconPath = path.join(publicDir, 'icon-512x512.png');
  if (fs.existsSync(iconPath)) {
    fs.copyFileSync(iconPath, logoPath);
    console.log('✅ Logo created successfully!');
  } else {
    console.log('❌ Cannot create logo - icon-512x512.png not found');
    hasErrors = true;
  }
}

// Check og-image.png
const ogImagePath = path.join(publicDir, 'og-image.png');
if (!fs.existsSync(ogImagePath)) {
  console.log('\n⚠️  og-image.png not found. Creating from logo...');
  
  const logoSource = path.join(imagesDir, 'logo.png');
  if (fs.existsSync(logoSource)) {
    fs.copyFileSync(logoSource, ogImagePath);
    console.log('✅ og-image.png created (Note: Optimize to 1200x630px for best results)');
    hasWarnings = true;
  }
}

// Check twitter-image.png
const twitterImagePath = path.join(publicDir, 'twitter-image.png');
if (!fs.existsSync(twitterImagePath)) {
  console.log('\n⚠️  twitter-image.png not found. Creating from logo...');
  
  const logoSource = path.join(imagesDir, 'logo.png');
  if (fs.existsSync(logoSource)) {
    fs.copyFileSync(logoSource, twitterImagePath);
    console.log('✅ twitter-image.png created (Note: Optimize to 1200x675px for best results)');
    hasWarnings = true;
  }
}

// Validate .env for Google Search Console verification
console.log('\n🔐 Checking environment variables:\n');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  
  if (envContent.includes('NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=')) {
    console.log('✅ NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION is set');
  } else {
    console.log('⚠️  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION not found in .env.local');
    console.log('   Add it after verifying your site with Google Search Console');
    hasWarnings = true;
  }
  
  if (envContent.includes('NEXT_PUBLIC_APP_URL=')) {
    console.log('✅ NEXT_PUBLIC_APP_URL is set');
  } else {
    console.log('❌ NEXT_PUBLIC_APP_URL not found in .env.local (REQUIRED)');
    hasErrors = true;
  }
} else {
  console.log('⚠️  .env.local not found');
  console.log('   Create .env.local with NEXT_PUBLIC_APP_URL and NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION');
  hasWarnings = true;
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Validation Summary:\n');

if (hasErrors) {
  console.log('❌ Validation FAILED - Fix errors above');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Validation passed with warnings');
  console.log('   Review warnings and optimize for best SEO results');
  process.exit(0);
} else {
  console.log('✅ All checks passed!');
  console.log('   Your SEO setup is ready for deployment');
  process.exit(0);
}
