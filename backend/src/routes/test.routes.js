const express = require('express');
const router = express.Router();
const os = require('os');

/**
 * @route   GET /api/test
 * @desc    Test API endpoint with system information
 * @access  Public
 */
router.get('/', (req, res) => {
  // Collect basic system and API information
  const apiInfo = {
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    apiVersion: '1.0.0',
    serverInfo: {
      platform: os.platform(),
      uptime: os.uptime(),
      memory: {
        total: `${Math.round(os.totalmem() / (1024 * 1024 * 1024))} GB`,
        free: `${Math.round(os.freemem() / (1024 * 1024 * 1024))} GB`,
      },
      cpus: os.cpus().length
    },
    endpoints: {
      auth: [
        { method: 'POST', path: '/api/auth/register', description: 'Register a new user' },
        { method: 'POST', path: '/api/auth/login', description: 'Login and get JWT token' },
        { method: 'GET', path: '/api/auth/profile', description: 'Get user profile (protected)' }
      ],
      stations: [
        { method: 'GET', path: '/api/stations', description: 'Get all charging stations' },
        { method: 'GET', path: '/api/stations/:id', description: 'Get a specific charging station' },
        { method: 'POST', path: '/api/stations', description: 'Create a new charging station (protected)' },
        { method: 'PUT', path: '/api/stations/:id', description: 'Update a charging station (protected)' },
        { method: 'DELETE', path: '/api/stations/:id', description: 'Delete a charging station (protected)' }
      ],
      test: [
        { method: 'GET', path: '/api/test', description: 'Test API endpoint with system information' },
        { method: 'GET', path: '/api/test/ping', description: 'Simple ping-pong response for connectivity testing' }
      ]
    }
  };

  res.json(apiInfo);
});

/**
 * @route   GET /api/test/ping
 * @desc    Simple ping-pong response for connectivity testing
 * @access  Public
 */
router.get('/ping', (req, res) => {
  res.json({ 
    message: 'pong',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
