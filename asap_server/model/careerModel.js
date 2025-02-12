const mongoose = require('mongoose');

const careerObjectiveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mainHeading: {
    type: String,
    default: 'Career Objective'
  },
  subHeading: {
    type: String,
    default: 'For Entry Level Position'
  },
  description: {
    type: String,
    default: ''
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CareerObjective', careerObjectiveSchema);