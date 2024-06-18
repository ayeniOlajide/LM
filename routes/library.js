const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const User = require('../models/user');

// Add a new book
router.post('/addBook', async (req, res) => {
    const { title, author, ISBN } = req.body;
    const book = new Book({ title, author, ISBN });
    await book.save();
    res.status(201).send(`The book "${book.title}" has been added to the library.`);
});

// Register a new user
router.post('/registerUser', async (req, res) => {
    const { name, id } = req.body;
    const user = new User({ name, id });
    await user.save();
    res.status(201).send(`The user "${user.name}" has been registered to the library.`);
});

// Borrow a book
router.post('/borrowBook', async (req, res) => {
    const { userId, ISBN } = req.body;
    const user = await User.findOne({ id: userId }).populate('borrowedBooks');
    if (!user) {
        return res.status(404).send(`No user with ID ${userId} found.`);
    }

    const book = await Book.findOne({ ISBN: ISBN });
    if (!book) {
        return res.status(404).send(`No book with ISBN ${ISBN} found.`);
    }

    if (user.borrowedBooks.length >= 3) {
        return res.status(400).send(`${user.name} cannot borrow more than 3 books.`);
    }
    if (book.borrowed) {
        return res.status(400).send(`The book "${book.title}" is already borrowed.`);
    }

    user.borrowedBooks.push(book);
    book.borrowed = true;
    await user.save();
    await book.save();
    res.send(`${user.name} has borrowed "${book.title}".`);
});

// Return a book
router.post('/returnBook', async (req, res) => {
    const { userId, ISBN } = req.body;
    const user = await User.findOne({ id: userId }).populate('borrowedBooks');
    if (!user) {
        return res.status(404).send(`No user with ID ${userId} found.`);
    }

    const bookIndex = user.borrowedBooks.findIndex(book => book.ISBN === ISBN);
    if (bookIndex === -1) {
        return res.status(404).send(`No book with ISBN ${ISBN} found in borrowed books.`);
    }

    const book = user.borrowedBooks[bookIndex];
    book.borrowed = false;
    user.borrowedBooks.splice(bookIndex, 1);
    await user.save();
    await book.save();
    res.send(`The book "${book.title}" has been returned by ${user.name}.`);
});

// Get book info
router.get('/getBookInfo/:ISBN', async (req, res) => {
    const { ISBN } = req.params;
    const book = await Book.findOne({ ISBN: ISBN });
    if (book) {
        res.send(`Title: ${book.title}, Author: ${book.author}, Borrowed: ${book.borrowed}`);
    } else {
        res.status(404).send(`No book with ISBN ${ISBN} found in the library.`);
    }
});

// Get user's borrowed books
router.get('/getUserBorrowedBooks/:userId', async (req, res) => {
    const { userId } = req.params;
    const user = await User.findOne({ id: userId }).populate('borrowedBooks');
    if (!user) {
        return res.status(404).send(`No user with ID ${userId} found.`);
    }
    const borrowedBooks = user.borrowedBooks.map(book => book.title);
    res.send(borrowedBooks);
});

module.exports = router;
