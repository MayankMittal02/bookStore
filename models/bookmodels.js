const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: String,
    publishYear: Number,
    inStock: Boolean,
    price: Number,
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user'],
    },
    reviews: [
        {
            rating: {
                type: Number,
                min: 1,
                max: 5,
            },
            comment: {
                type: String,
            },
            reviewer: {
                type: mongoose.Types.ObjectId,
                ref: 'User',
                required: [true, 'Please provide user'],
            },
        },
    ],
});


module.exports = mongoose.model('Book', bookSchema)