const mongoose = require('mongoose');
const menuSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
    description: {
        type: String, 
        required: true,
      },
});

module.exports = mongoose.model('Menu', menuSchema);