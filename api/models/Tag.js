const mongoose = require('mongoose');
const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
    },
});

module.exports = mongoose.model('Tag', tagSchema);