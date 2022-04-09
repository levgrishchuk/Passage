const express = require('express');
const router = express.Router();

// Item model
const Item = require('../../models/Item');

// @route   GET api/items
// @desc    Get items
// @access  Public
router.get('/', (req, res) => {    
    Item.find({user: req.query.user})
        .sort({date: -1})
        .then(items => res.json(items));
        
});

// @route   POST api/items
// @desc    Add item
// @access  Public
router.post('/', (req, res) => {        
    const newItem = new Item({
        user: req.body.user,
        start: req.body.start,
        finish: req.body.finish,
        trackUri: req.body.trackUri,        
        notes: req.body.notes,
        tags: req.body.tags});  
    newItem.save().then(newItem => res.json(newItem));   
});

// @route   DELETE api/items
// @desc    Delete item
// @access  Public
router.delete('/:id', (req, res) => {
    Item.findById(req.params.id)
        .then(item => item.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json({success: false}));
});

module.exports = router;