const mongoose = require('mongoose');
const imageSchema = new mongoose.Schema({
    public_id: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    tags: [
        {
            name: String,
        }
    ]
});

module.exports = mongoose.model('Image', imageSchema);