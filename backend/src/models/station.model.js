const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Station name is required'],
    trim: true
  },
  location: {
    type: {
      latitude: {
        type: Number,
        required: [true, 'Latitude is required'],
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required'],
        min: -180,
        max: 180
      }
    },
    required: [true, 'Location is required']
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Maintenance'],
    default: 'Active'
  },
  powerOutput: {
    type: Number,
    required: [true, 'Power output is required'],
    min: 0
  },
  connectorType: {
    type: String,
    required: [true, 'Connector type is required'],
    enum: ['Type 1', 'Type 2', 'CCS', 'CHAdeMO', 'Tesla']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: {
    type: String,
    trim: true
  },
  pricePerKwh: {
    type: Number,
    min: 0,
    default: 0
  },
  availableHours: {
    open: {
      type: String,
      default: '00:00'
    },
    close: {
      type: String,
      default: '23:59'
    }
  }
}, {
  timestamps: true
});

// Create index for geospatial queries
stationSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

const Station = mongoose.model('Station', stationSchema);

module.exports = Station;
