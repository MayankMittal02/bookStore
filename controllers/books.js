const Book = require('../models/bookmodels')

const getAllBooksStatic = async (req, res) => {

    const queryObject = {
        title: ""
    }
    // queryObject.title = "1st book"



    const book = await Book.find({ "title": "2nd book" })
    // book = await book.find()

    res.status(200).json({ book })




}

const getAllBooks = async (req, res) => {
    // res.send('get all books');


    const { title, author, publishYear, excludeOutOfStock, price, sort } = req.query;
    const queryObject = {}

    if (title) {
        queryObject.title = {$regex : title , $options:'i'}
    }
    if (author) {
        queryObject.author = author
    }
    if (publishYear) {
        queryObject.publishYear = publishYear
    }
    if (excludeOutOfStock === 'true') {
        queryObject.inStock = true
    }



    const book = await Book.find(queryObject)

    res.status(200).json({ book })

}



const getBook = async (req, res) => {
    const { id } = req.params
    // console.log(id)
    // const book = await Book.findById(id)
    const book = await Book.findById(id)

    // res.send('get one book');

    res.status(200).json({ book })
}

const insertBook = async (req, res) => {
    const book = await Book.create(req.body)
    res.status(200).json({ book })
}

const deleteBook = async (req, res) => {
    // res.send('delete book');
    const { id } = req.params
    const book = await Book.findByIdAndDelete(id)
    res.status(200).json({ book })
}

const updateBook = async (req, res) => {
    // res.send('update book');
    const { id } = req.params
    const book = await Book.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({ book })
}

// module.exports = {
//     getAllBooksStatic,getAllBooks, getBook, insertBook, deleteBook, updateBook
// }

module.exports = {
    getAllBooksStatic, getAllBooks, getBook, insertBook, deleteBook, updateBook
}