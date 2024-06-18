const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: String,
    author: String,
    ISBN: { type: String, unique: true },
    borrowed: { type: Boolean, default: false }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;