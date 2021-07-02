const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create Schema 
// TODO: hash usernames?
const ItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    start: {
        type: Number,
        required: true
    },
    finish: {
        type: Number,
        required: true
    },
    notes: {
        type: String
    }
});

module.exports = Item = mongoose.model('item', ItemSchema);