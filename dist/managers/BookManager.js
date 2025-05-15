"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookManager = void 0;
const storage_1 = require("../utils/storage");
const debouncedSave_1 = require("../utils/debouncedSave");
const generateID_1 = require("../utils/generateID");
const BOOKS_FILE = './data/books.json';
class BookManager {
    constructor() {
        this.books = [];
        this.books = (0, storage_1.loadData)(BOOKS_FILE);
    }
    saveBooks() {
        (0, debouncedSave_1.debouncedSave)(BOOKS_FILE, this.books);
    }
    getAllBooks() {
        return this.books;
    }
    getBookById(id) {
        return this.books.find(book => book.id === id) || null;
    }
    addBook(title, author) {
        const newBook = {
            id: (0, generateID_1.generateId)(),
            title,
            author,
            isBorrowed: false
        };
        this.books.push(newBook);
        this.saveBooks();
        return newBook;
    }
    updateBook(id, updatedData) {
        const book = this.getBookById(id);
        if (!book)
            return null;
        Object.assign(book, updatedData); // Cập nhật trực tiếp đối tượng book đã lấy ra
        this.saveBooks();
        return book;
    }
    deleteBook(id) {
        const index = this.books.findIndex(book => book.id === id);
        if (index === -1)
            return false;
        this.books.splice(index, 1);
        this.saveBooks();
        return true;
    }
    searchBooksByTitle(title) {
        return this.books.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
    }
    markAsBorrowed(id) {
        const book = this.getBookById(id);
        if (book) {
            book.isBorrowed = true;
            this.saveBooks();
        }
    }
    markAsReturned(id) {
        const book = this.getBookById(id);
        if (book) {
            book.isBorrowed = false;
            this.saveBooks();
        }
    }
}
exports.BookManager = BookManager;
