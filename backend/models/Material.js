const mongoose = require('mongoose');

// Material/Upload Schema
const materialSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,  // Fast lookup by user
  },
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,  // in bytes
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Material', materialSchema);
