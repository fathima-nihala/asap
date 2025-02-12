const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  github: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        return v === '' || v.startsWith('https://github.com/');
      },
      message: 'GitHub URL must start with https://github.com/'
    }
  },
  behance: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        return v === '' || v.startsWith('https://www.behance.net/');
      },
      message: 'Behance URL must start with https://www.behance.net/'
    }
  },
  personalWebsite: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        return v === '' || /^https?:\/\/.+/.test(v);
      },
      message: 'Personal website must be a valid URL starting with http:// or https://'
    }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Portfolio', portfolioSchema);