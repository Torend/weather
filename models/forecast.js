const mongoose = require('mongoose');

const forecastSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  forecastTime: {
    type: Date,
    required: true,
  },
  Temperature: {
    type: Number,
    required: true,
  },
  Precipitation: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('forecast', forecastSchema);
