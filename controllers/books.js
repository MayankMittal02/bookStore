const Book = require('../models/bookmodels')
const asycnWrapper = require('../middleware/async');
const CustomAPIError = require('../errors/custom-api')
const { StatusCodes } = require('http-status-codes')

const getAllBooks = asycnWrapper(async (req, res, next) => {
    // res.send('get all books');
    const { title, author, publishYear, excludeOutOfStock, price, sort, fields } = req.query;
    const queryObject = {}

    if (title) {
        queryObject.title = { $regex: title, $options: 'i' }
    }
    if (author) {
        queryObject.author = { $regex: author, $options: 'i' }
    }
    if (publishYear) {
        queryObject.publishYear = publishYear
    }
    if (excludeOutOfStock === 'true') {
        queryObject.inStock = true
    }

    let result = Book.find(queryObject);

    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('publishYear');
    }
    if (fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const book = await result;
    if (!book) {
        const error = new CustomAPIError('No book found', StatusCodes.NOT_FOUND)
        return next(error)
    }
    // console.log(...book)

    res.status(200).json({ book })

});

const getBook = asycnWrapper(async (req, res, next) => {
    const { id } = req.params
    const book = await Book.findById(id)
    if (!book) {
        const error = new CustomAPIError('No book found', StatusCodes.NOT_FOUND)
        return next(error)
    }
    res.status(200).json(book)
});


const insertBook = asycnWrapper(async (req, res) => {
    req.body.createdBy = req.user.userId
    const book = await Book.create(req.body)
    res.status(200).json({ book })
});

const deleteBook = asycnWrapper(async (req, res, next) => {
    // res.send('delete book');
    const { id } = req.params
    const { userId } = req.user
    const book = await Book.findOneAndDelete({ _id: id, createdBy: userId, })
    if (!book) {
        const error = new CustomAPIError('No book found', StatusCodes.NOT_FOUND)
        return next(error)
    }

    res.status(200).json({ book })
});

const updateBook = asycnWrapper(async (req, res, next) => {
    // res.send('update book');

    const { id } = req.params
    const { userId } = req.user
    delete req.body.createdBy
    const book = await Book.findByIdAndUpdate({ _id: id, createdBy: userId }, req.body, {
        new: true,
        runValidators: true
    })
    if (!book) {
        const error = new CustomAPIError('No book found', StatusCodes.NOT_FOUND)
        return next(error)
    }
    res.status(200).json({ book })

});

// const addReview = asycnWrapper(async (req, res) => {
//     const { id } = req.params
//     const new_review = {
//         rating: req.body.rating,
//         comment: req.body.comment,
//         reviewer: req.user.userId
//     }

//     const book = await Book.findById(id);
//     if (!book) { return res.send('Book not exist') }
//     book.reviews.push(new_review);

//     await book.save();
//     // return res.send(book)

//     res.status(200).json({ book });

// });

const addReview = async (req, res) => {
    try{
    const { id } = req.params
    const new_review = {
        rating: req.body.rating,
        comment: req.body.comment,
        reviewer: req.user.userId
    }
    console.log(new_review)

    const book = await Book.findById(id);
    if (!book) { return res.send('Book not exist') }
    book.reviews.push(new_review);

    await book.save();
    // return res.send(book)

    res.status(200).json({ book });}
    catch(error){
        res.send(error)
    }

}

const getReview = async (req, res, next) => {
    try {
        const { id, r_id } = req.params
        const book = await Book.findById(id);
        if (!book) {
            const error = new CustomAPIError('No book found', StatusCodes.NOT_FOUND)
            return next(error)
        }
        const review = book.reviews.find((r) => r._id.equals(r_id));
        if (!review) { return res.send('no review found') }
        res.status(200).json({ review });
    }
    catch (error) {
        next(error)
    }
}

const updateReview = asycnWrapper(async (req, res) => {
    const { id, r_id } = req.params
    const { userId } = req.user
    const book = await Book.findById({ id });
    if (!book) {
        const error = new CustomAPIError('No book found', StatusCodes.NOT_FOUND)
        return next(error)
    }
    const reviewIndex = book.reviews.findIndex((r) => {
        return r._id.equals(r_id) && r.reviewer.equals(userId)
    })
    if (reviewIndex === -1) {
        return res.status(500).json({ msg: "review not found" })
    }
    const { rating, comment } = req.body
    const review = book.reviews[reviewIndex]
    if (rating) {
        book.reviews[reviewIndex].rating = rating
    }
    if (comment) {
        book.reviews[reviewIndex].comment = comment;
    }
    book.save();
    res.status(200).json({ review })
});

const deleteReview = asycnWrapper(async (req, res) => {
    const { id, r_id } = req.params
    const { userId } = req.user
    const book = await Book.findById(id);
    if (!book) {
        const error = new CustomAPIError('No book found', StatusCodes.NOT_FOUND)
        return next(error)
    }
    const reviewIndex = book.reviews.findIndex((r) => {
        return r._id.equals(r_id) && r.reviewer.equals(userId)
    })
    if (reviewIndex === -1) {
        //  throw new Error('Review not found');
        return res.status(500).json({ msg: "review not found" })

    }

    const review = book.reviews[reviewIndex];
    book.reviews.splice(reviewIndex, 1);
    await book.save();
    res.status(200).json({ review })
});

module.exports = {
    getAllBooks, getBook, insertBook, deleteBook, updateBook, addReview, updateReview, getReview, deleteReview
}