const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  moodRating: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  stressLevel: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High']
  },
  journalEntry: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Checkin', checkinSchema);