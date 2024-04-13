const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const MemberSchema = new Schema({
    MemberID: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    MemberName: {
        type: String,
        index: true,
        required: true
    }
});


const Member = mongoose.model('Member', MemberSchema);


module.exports = Member;