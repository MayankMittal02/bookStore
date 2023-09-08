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
                type: String,
                default: "new user"
            },
        },
    ],




});

// const Book = new mongoose.model("Book", bookSchema)

// module.export = { Book}

module.exports = mongoose.model('Book', bookSchema)