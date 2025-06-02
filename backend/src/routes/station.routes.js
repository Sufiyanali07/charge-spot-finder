const express = require('express');
const router = express.Router();
const { 
  getStations, 
  getStationById, 
  createStation, 
  updateStation, 
  deleteStation 
} = require('../controllers/station.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getStations);
router.get('/:id', getStationById);

// Protected routes
router.post('/', protect, createStation);
router.put('/:id', protect, updateStation);
router.delete('/:id', protect, deleteStation);

module.exports = router;
