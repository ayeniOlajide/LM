const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    id: { type: String, unique: true },
    borrowedBooks: [{ type: Schema.Types.ObjectId, ref: 'Book' }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;