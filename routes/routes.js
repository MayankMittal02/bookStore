const express = require('express')
const router = express.Router();
const {
    getAllBooksStatic,
    getAllBooks,
    getBook,
    insertBook,
    deleteBook,
    updateBook,
    addReview,
    updateReview,
    getReview,
    deleteReview
} = require('../controllers/books')

router.route('/').get(getAllBooks)
router.route('/static').get(getAllBooksStatic)

router.route('/:id').get(getBook).delete(deleteBook).patch(updateBook)
router.route('/sellbook').post(insertBook)

router.route('/reviews/:id').post(addReview)
router.route('/reviews/:id/:r_id').get(getReview).patch(updateReview).delete(deleteReview)
// router.route('reviews/:id/:r_id').get(getReview)


module.exports = router
