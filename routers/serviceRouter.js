const express = require('express');

const router = express.Router();


const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

// Controllers
const serviceController = require('../controllers/serviceController');


router.route('/books')
    .get(catchAsync(serviceController.getAllData));

router.route('/books/checkout/:bookID')
    .post(catchAsync(serviceController.checkoutBook));

router.route('/books/return/:bookID')
    .post(catchAsync(serviceController.returnBook));

router.route('/books/overdue')
    .get(catchAsync(serviceController.getOverdueBooks));

router.route('/books/overdue/:memberID')
    .get(catchAsync(serviceController.getMemberOverdueBooks));


module.exports = router;