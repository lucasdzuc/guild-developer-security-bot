const mongoose = require('../database');

const ComplaintSchema = new mongoose.Schema({
    description: {
        type: String,
        require: true,
    },
    validation: {
        type: Boolean,
        require: true,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

const Complaint = mongoose.model('Complaint', ComplaintSchema);

module.exports = Complaint;