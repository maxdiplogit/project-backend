// Models
const Book = require('../models/Book');
const Member = require('../models/Member');
const Circulation = require('../models/Circulation');


const ExpressError = require('../utils/ExpressError');


module.exports.getAllData = async (req, res, next) => {
    const foundBooks = await Book.find({})
    res.send({ books: foundBooks });
}


module.exports.checkoutBook = async (req, res, next) => {
    const { bookID } = req.params;
    const { memberID } = req.body;

    const foundBook = await Book.findOne({ BookID: bookID })
    if (!foundBook) {
        throw new ExpressError(404, "Book not found");
    }

    const foundMember = await Member.findOne({ MemberID: memberID })
    if (!foundMember) {
        throw new ExpressError(404, "Member not found");
    }

    console.log(foundBook.NumberOfCopies);

    if (foundBook.NumberOfCopies <= 0) {
        res.send({ "message": "Book is not available in the library" });
        next()
    }

    const newCirculation = new Circulation({
        EventType: 'checkout',
        BookID: foundBook.BookID,
        MemberID: foundMember.MemberID,
        DueDate: Date.now() + 7*24*60*60*1000
    });

    foundBook.NumberOfCopies = foundBook.NumberOfCopies - 1;

    await newCirculation.save();
    await foundBook.save();

    res.send({ newCirculation });
}


module.exports.returnBook = async (req, res, next) => {
    const { bookID } = req.params;
    const { memberID } = req.body;

    const foundBook = await Book.findOne({ BookID: bookID })
    if (!foundBook) {
        throw new ExpressError(404, "Book not found");
    }

    const foundMember = await Member.findOne({ MemberID: memberID });
    if (!foundMember) {
        throw new ExpressError(404, "Member not found");
    }

    console.log(bookID, foundMember.MemberID)
    const foundCirculation = await Circulation.findOne({ BookID: bookID, MemberID: foundMember.MemberID });
    if (!foundCirculation) {
        throw new ExpressError(404, "Circulation record not found");
    }

    await Circulation.findByIdAndDelete(foundCirculation.id);

    foundBook.NumberOfCopies = foundBook.NumberOfCopies + 1;
    await foundBook.save();

    res.send({ message: "Book returned successfully" });
};


module.exports.getOverdueBooks = async (req, res, next) => {
    const foundCirculations = await Circulation.find({});

    const result = {};

    for (const circulation of foundCirculations) {
        if (Date.now() > circulation.DueDate) {
            const foundBook = await Book.findOne({ BookID: circulation.BookID });
            const fine = Date.now() - circulation.DueDate;
            if (!result[foundBook.BookID]) {
                result[foundBook.BookID] = {
                    bookName: foundBook.BookName,
                    totalFine: fine
                };
            } else {
                result[foundBook.BookID.totalFine] = result[foundBook.BookID.totalFine] + fine; 
            }
        }
    }

    res.send({ result });
};


module.exports.getMemberOverdueBooks = async (req, res, next) => {
    const { memberID } = req.params;
    const foundCirculations = await Circulation.find({ MemberID: memberID });

    const result = {}

    for (const circulation of foundCirculations) {
        if (Date.now() > circulation.DueDate) {
            const foundBook = await Book.findOne({ BookID: circulation.BookID });
            const fine = Date.now() - circulation.DueDate;
            if (!result[foundBook.BookID]) {
                result[foundBook.BookID] = {
                    bookName: foundBook.BookName,
                    totalFine: fine
                };
            } else {
                result[foundBook.BookID.totalFine] = result[foundBook.BookID.totalFine] + fine; 
            }
        }
    }

    res.send({ result });
};