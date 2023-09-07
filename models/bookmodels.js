const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: String,
    publishYear: Number,
    inStock:Boolean,
    price:Number,



});

// const Book = new mongoose.model("Book", bookSchema)

// module.export = { Book}

module.exports = mongoose.model('Book', bookSchema)