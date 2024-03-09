const mongoose = require('mongoose');

const officialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  governmentId: {
    type: String,
    required: true,
    unique: true
  },
  isGovernmentRecognized: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Available', 'Busy'],
    default: 'Available'
  },
}, { timestamps: true });

officialSchema.index({ location: '2dsphere' });

const Official = mongoose.model('Official', officialSchema);

module.exports = Official;
