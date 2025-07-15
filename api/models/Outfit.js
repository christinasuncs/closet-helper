const mongoose = require('mongoose');
const outfitSchema = new mongoose.Schema({
    hat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
    },
    top: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
    },
    bottom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
    },
    shoes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
    },
    accessory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
    },
});

module.exports = mongoose.model('Outfit', outfitSchema);