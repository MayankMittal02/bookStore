const express = require('express')
const authenticateUser = require('../middleware/authentication');
const router = express.Router();
const {
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
router.route('/:id').get(getBook).delete(authenticateUser, deleteBook).patch(authenticateUser, updateBook)
router.route('/sellbook').post(authenticateUser, insertBook)

router.route('/reviews/:id').post(authenticateUser, addReview)
router.route('/reviews/:id/:r_id').get(getReview).patch(authenticateUser, updateReview).delete(authenticateUser, deleteReview)
// router.route('reviews/:id/:r_id').get(getReview)


module.exports = router
