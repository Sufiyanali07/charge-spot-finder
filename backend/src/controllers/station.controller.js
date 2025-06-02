const Station = require('../models/station.model');

/**
 * @desc    Get all charging stations
 * @route   GET /api/stations
 * @access  Public
 */
const getStations = async (req, res) => {
  try {
    // Parse query parameters for filtering
    const { status, connectorType, minPower, maxPower } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (connectorType) {
      filter.connectorType = connectorType;
    }
    
    if (minPower || maxPower) {
      filter.powerOutput = {};
      if (minPower) filter.powerOutput.$gte = Number(minPower);
      if (maxPower) filter.powerOutput.$lte = Number(maxPower);
    }

    // Find stations with filters
    const stations = await Station.find(filter).populate('owner', 'username email');
    
    res.json(stations);
  } catch (error) {
    console.error('Get stations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get a single charging station by ID
 * @route   GET /api/stations/:id
 * @access  Public
 */
const getStationById = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id).populate('owner', 'username email');
    
    if (station) {
      res.json(station);
    } else {
      res.status(404).json({ message: 'Station not found' });
    }
  } catch (error) {
    console.error('Get station by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Create a new charging station
 * @route   POST /api/stations
 * @access  Private
 */
const createStation = async (req, res) => {
  try {
    const { 
      name, 
      location, 
      status, 
      powerOutput, 
      connectorType, 
      address,
      pricePerKwh,
      availableHours
    } = req.body;

    // Create new station
    const station = await Station.create({
      name,
      location,
      status,
      powerOutput,
      connectorType,
      owner: req.user._id,
      address,
      pricePerKwh,
      availableHours
    });

    res.status(201).json(station);
  } catch (error) {
    console.error('Create station error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Update a charging station
 * @route   PUT /api/stations/:id
 * @access  Private
 */
const updateStation = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);
    
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }

    // Check if user is the owner of the station or an admin
    if (station.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this station' });
    }

    // Update station with new data
    const updatedStation = await Station.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('owner', 'username email');

    res.json(updatedStation);
  } catch (error) {
    console.error('Update station error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Delete a charging station
 * @route   DELETE /api/stations/:id
 * @access  Private
 */
const deleteStation = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);
    
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }

    // Check if user is the owner of the station or an admin
    if (station.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this station' });
    }

    await station.deleteOne();
    res.json({ message: 'Station removed' });
  } catch (error) {
    console.error('Delete station error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getStations,
  getStationById,
  createStation,
  updateStation,
  deleteStation
};
