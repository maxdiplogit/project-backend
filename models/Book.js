const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const BookSchema = new Schema({
    BookID: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    BookName: {
        type: String,
        required: true,
        index: true
    },
    NumberOfCopies: {
        type: Number,
        required: true
    }
});


const Book = mongoose.model('Book', BookSchema);


module.exports = Book;