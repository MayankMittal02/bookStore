const Book = require('../models/bookmodels')

const getAllBooks = async (req, res) => {
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

    res.status(200).json({ book })

}

const getBook = async (req, res) => {
    const { id } = req.params
    const book = await Book.findById(id)
    res.status(200).json(book)
}

const insertBook = async (req, res) => {
    req.body.createdBy = req.user.userId
    const book = await Book.create(req.body)
    res.status(200).json({ book })
}

const deleteBook = async (req, res) => {
    // res.send('delete book');
    const { id } = req.params
    const { userId } = req.user
    const book = await Book.findOneAndDelete({ _id: id, createdBy: userId, })
    res.status(200).json({ book })
}

const updateBook = async (req, res) => {
    // res.send('update book');
    const { id } = req.params
    const { userId } = req.user
    delete req.body.createdBy
    const book = await Book.findByIdAndUpdate({ _id: id, createdBy: userId }, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({ book })
}

const addReview = async (req, res) => {
    const { id } = req.params

    const new_review = {
        rating: req.body.rating,
        comment: req.body.comment,
        reviewer: req.user.userId
    }
    const book = await Book.findById(id);
    book.reviews.push(new_review);
    await book.save();
    res.status(200).json({ book });

}

const getReview = async (req, res) => {
    const { id, r_id } = req.params
    const book = await Book.findById(id);
    const review = book.reviews.find((r) => r._id.equals(r_id));
    res.status(200).json({ review });
}

const updateReview = async (req, res) => {
    const { id, r_id } = req.params
    const { userId } = req.user
    const book = await Book.findById({ id });
    const reviewIndex = book.reviews.findIndex((r) => {
        return r._id.equals(r_id) && r.reviewer.equals(userId)
    })
    if (reviewIndex === -1) {
        res.send("no review found")
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
}

const deleteReview = async (req, res) => {
    const { id, r_id } = req.params
    const { userId } = req.user
    const book = await Book.findById(id);
    // const reviewIndex = book.reviews.findIndex((r) => r._id.equals(r_id) && r.createdBy.equals(userId));
    const reviewIndex = book.reviews.findIndex((r) => {
        return r._id.equals(r_id) && r.reviewer.equals(userId)
    })
    if (reviewIndex === -1) {
        throw new Error('Review not found');
      }
    const review = book.reviews[reviewIndex];
    book.reviews.splice(reviewIndex, 1);
    await book.save();
    res.status(200).json({ review })
}

module.exports = {
    getAllBooks, getBook, insertBook, deleteBook, updateBook, addReview, updateReview, getReview, deleteReview
}