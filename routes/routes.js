const express = require('express')
const router = express.Router();
const {
    getAllBooksStatic,
    getAllBooks,
    getBook,
    insertBook,
    deleteBook,
    updateBook,
} = require('../controllers/books')

router.route('/').get(getAllBooks)
router.route('/static').get(getAllBooksStatic)
router.route('/:id').get(getBook).delete(deleteBook).patch(updateBook)
router.route('/sellbook').post(insertBook)


module.exports = router
