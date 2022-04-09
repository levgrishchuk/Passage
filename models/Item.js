const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// // image Schema
// const ImageSchema = new Schema({
//     height: {
//         type: Number,
//         required: true
//     },
//     url: {
//         type: String,
//         required: true
//     },
//     width: {
//         type: Number,
//         required: true
//     }
// });

// create Schema 
// TODO: hash usernames?
const ItemSchema = new Schema({
    user: {
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
    trackUri: {
        type: String,
        required: true 
    },    
    notes: {
        type: String
    },
    tags: {
        type: []
    }
});

module.exports = Item = mongoose.model('item', ItemSchema);