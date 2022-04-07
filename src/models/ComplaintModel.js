const mongoose = require('../database');

const ComplaintSchema = new mongoose.Schema({
    text: {
        type: String,
        require: true,
    },
    validation: {
        type: Boolean,
        require: true,
        default: false,
    },
    message_id: {
        type: String,
        require: true,
    },
    date: {
        type: String,
        require: true,
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