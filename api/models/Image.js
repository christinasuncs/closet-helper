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
    ],
    archived: {
        type: Boolean,
        default: false
    },
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        default: null
    },
});

module.exports = mongoose.model('Image', imageSchema);