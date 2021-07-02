const express = require('express');
const router = express.Router();

// Item model
const Item = require('../../models/Item');

// @route   GET api/items
// @desc    Get items
// @access  Public
router.get('/', (req, res) => {
    Item.find()
        .sort({date: -1})
        .then(items => res.json(items));
        
});

// @route   POST api/items
// @desc    Add item
// @access  Public
router.post('/', (req, res) => {        
    const newItem = new Item({
        name: req.body.name,
        start: req.body.start,
        finish: req.body.finish,
        notes: req.body.notes});  
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