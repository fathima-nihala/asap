const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    location: { type: String, required: true },
    startYear: { type: Number, required: true },
    endYear: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Education', EducationSchema);
