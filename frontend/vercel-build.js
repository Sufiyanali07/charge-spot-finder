const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Log the current directory
console.log('Current directory:', process.cwd());

// Make sure we're in the frontend directory
if (!process.cwd().endsWith('frontend')) {
  console.log('Changing to frontend directory');
  process.chdir('frontend');
}

// Log directory contents
console.log('Directory contents:', fs.readdirSync('.'));

// Install dependencies
console.log('Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });

// Check if node_modules/.bin exists and has vue-cli-service
const binPath = path.join('node_modules', '.bin');
const vueCliPath = path.join(binPath, 'vue-cli-service');

if (fs.existsSync(binPath)) {
  console.log('Bin directory exists');
  console.log('Bin directory contents:', fs.readdirSync(binPath));
} else {
  console.log('Bin directory does not exist');
}

if (fs.existsSync(vueCliPath)) {
  console.log('vue-cli-service exists');
  // Make it executable
  try {
    fs.chmodSync(vueCliPath, '755');
    console.log('Made vue-cli-service executable');
  } catch (error) {
    console.error('Failed to make vue-cli-service executable:', error);
  }
} else {
  console.log('vue-cli-service does not exist');
}

// Run the build command
console.log('Building the application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
