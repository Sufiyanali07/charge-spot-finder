const { spawn } = require('child_process');
const path = require('path');

// Start backend server
console.log('Starting backend server...');
const backend = spawn('node', ['src/server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit'
});

backend.on('error', (error) => {
  console.error('Failed to start backend:', error);
});

// Give the backend a moment to start
setTimeout(() => {
  // Start frontend server using http-server (simpler than vue-cli)
  console.log('Starting frontend server...');
  const frontend = spawn('npx', ['http-server', '-p', '8080', '-c-1'], {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit'
  });

  frontend.on('error', (error) => {
    console.error('Failed to start frontend:', error);
  });
}, 2000);

console.log('Press Ctrl+C to stop both servers');
