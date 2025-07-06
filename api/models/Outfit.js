const mongoose = require('mongoose');
const outfitSchema = new mongoose.Schema({
    hat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
        required: true
    },
    top: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
        required: true
    },
    bottom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
        required: true
    },
    shoes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
        required: true
    },
    accessory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
        required: true
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
    },
});

module.exports = mongoose.model('Outfit', outfitSchema);