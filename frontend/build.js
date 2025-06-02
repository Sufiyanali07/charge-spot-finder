const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting custom build script for frontend...');

// Ensure the vue-cli-service is executable
try {
  console.log('Making vue-cli-service executable...');
  const cliPath = path.join(__dirname, 'node_modules', '.bin', 'vue-cli-service');
  fs.chmodSync(cliPath, '755');
  console.log('chmod successful');
} catch (error) {
  console.log('chmod error (may be expected on some platforms):', error.message);
}

// Run the build process using npx
try {
  console.log('Running build with npx...');
  execSync('npx vue-cli-service build', { 
    stdio: 'inherit',
    cwd: __dirname
  });
  console.log('Build completed successfully');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
