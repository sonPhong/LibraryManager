"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const BookManager_1 = require("./managers/BookManager");
const BorrowerManager_1 = require("./managers/BorrowerManager");
const bookCLI_1 = require("./cli/bookCLI");
const borrowerCLI_1 = require("./cli/borrowerCLI");
const bookManager = new BookManager_1.BookManager();
const borrowerManager = new BorrowerManager_1.BorrowerManager();
const bookCLI = new bookCLI_1.BookCLI(bookManager);
const borrowerCLI = new borrowerCLI_1.BorrowerCLI(borrowerManager);
async function mainMenu() {
    while (true) {
        const { choice } = await inquirer_1.default.prompt({
            name: 'choice',
            type: 'list',
            message: '🏠 MENU CHÍNH',
            choices: [
                { name: '📚 Quản lý sách', value: 'books' },
                { name: '👤 Quản lý người mượn', value: 'borrowers' },
                { name: '📖 Mượn sách', value: 'borrow' },
                { name: '📤 Trả sách', value: 'return' },
                { name: '❌ Thoát', value: 'exit' }
            ]
        });
        if (choice === 'exit')
            break;
        if (choice === 'books')
            await bookCLI.showMenu();
        if (choice === 'borrowers')
            await borrowerCLI.showMenu();
        if (choice === 'borrow')
            await borrowBook();
        if (choice === 'return')
            await returnBook();
    }
}
async function borrowBook() {
    const books = bookManager.getAllBooks().filter(b => !b.isBorrowed);
    const borrowers = borrowerManager.getAllBorrowers();
    if (books.length === 0 || borrowers.length === 0)
        return console.log('❌ Không có đủ dữ liệu.');
    const { borrowerId, bookId } = await inquirer_1.default.prompt([
        {
            name: 'borrowerId',
            type: 'list',
            message: 'Người mượn:',
            choices: borrowers.map(b => ({ name: b.name, value: b.id }))
        },
        {
            name: 'bookId',
            type: 'list',
            message: 'Chọn sách:',
            choices: books.map(b => ({ name: b.title, value: b.id }))
        }
    ]);
    borrowerManager.borrowBook(borrowerId, bookId);
    bookManager.updateBook(bookId, { isBorrowed: true });
    console.log('✅ Đã mượn sách.');
}
async function returnBook() {
    const borrowers = borrowerManager.getAllBorrowers().filter(b => b.borrowedBookIds.length > 0);
    if (borrowers.length === 0)
        return console.log('❌ Không ai đang mượn sách.');
    const { borrowerId } = await inquirer_1.default.prompt({
        name: 'borrowerId',
        type: 'list',
        message: 'Người trả sách:',
        choices: borrowers.map(b => ({ name: b.name, value: b.id }))
    });
    const borrower = borrowerManager.getBorrowerById(borrowerId);
    const { bookId } = await inquirer_1.default.prompt({
        name: 'bookId',
        type: 'list',
        message: 'Chọn sách để trả:',
        choices: borrower.borrowedBookIds.map(id => {
            const book = bookManager.getBookById(id);
            return { name: book?.title || id, value: id };
        })
    });
    borrowerManager.returnBook(borrowerId, bookId);
    bookManager.updateBook(bookId, { isBorrowed: false });
    console.log('✅ Đã trả sách.');
}
mainMenu();
