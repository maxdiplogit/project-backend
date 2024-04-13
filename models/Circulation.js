const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const CirculationSchema = new Schema({
    EventType: {
        type: String,
        enum: ['checkout', 'return'],
        required: true
    },
    BookID: {
        type: Number,
        required: true,
        index: true
    },
    MemberID: {
        type: Number,
        required: true,
        index: true
    },
    TimeStamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    DueDate: {
        type: Date,
        required: true
    }
});


const Circulation = mongoose.model('Circulation', CirculationSchema);


module.exports = Circulation;