import inquirer from 'inquirer';
import { BookManager } from './managers/BookManager';
import { BorrowerManager } from './managers/BorrowerManager';
import { BookCLI } from './cli/bookCLI';
import { BorrowerCLI } from './cli/borrowerCLI';

const bookManager = new BookManager();
const borrowerManager = new BorrowerManager();
const bookCLI = new BookCLI(bookManager);
const borrowerCLI = new BorrowerCLI(borrowerManager);

async function mainMenu() {
  while (true) {
    const { choice } = await inquirer.prompt({
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

    if (choice === 'exit') break;
    if (choice === 'books') await bookCLI.showMenu();
    if (choice === 'borrowers') await borrowerCLI.showMenu();
    if (choice === 'borrow') await borrowBook();
    if (choice === 'return') await returnBook();
  }
}

async function borrowBook() {
  const books = bookManager.getAllBooks().filter(b => !b.isBorrowed);
  const borrowers = borrowerManager.getAllBorrowers();
  if (books.length === 0 || borrowers.length === 0) return console.log('❌ Không có đủ dữ liệu.');

  const { borrowerId, bookId } = await inquirer.prompt([
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
  if (borrowers.length === 0) return console.log('❌ Không ai đang mượn sách.');

  const { borrowerId } = await inquirer.prompt({
    name: 'borrowerId',
    type: 'list',
    message: 'Người trả sách:',
    choices: borrowers.map(b => ({ name: b.name, value: b.id }))
  });

  const borrower = borrowerManager.getBorrowerById(borrowerId)!;
  const { bookId } = await inquirer.prompt({
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
