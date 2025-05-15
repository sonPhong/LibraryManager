import { Book } from '../models/Book';
import { loadData } from '../utils/storage';
import { debouncedSave } from '../utils/debouncedSave';
import { generateId } from '../utils/generateID';

const BOOKS_FILE = './data/books.json';

export class BookManager {
    private books: Book[] = [];

    constructor() {
        this.books = loadData<Book>(BOOKS_FILE);
    }

    private saveBooks() {
        debouncedSave(BOOKS_FILE, this.books);
    }

    getAllBooks(): Book[] {
        return this.books;
    }

    getBookById(id: string): Book | null {
        return this.books.find(book => book.id === id) || null;
    }

    addBook(title: string, author: string): Book {
        const newBook: Book = {
            id: generateId(),
            title,
            author,
            isBorrowed: false
        };
        this.books.push(newBook);
        this.saveBooks();
        return newBook;
    }

    updateBook(id: string, updatedData: Partial<Book>): Book | null {
        const book = this.getBookById(id);
        if (!book) return null;
        Object.assign(book, updatedData);  // Cập nhật trực tiếp đối tượng book đã lấy ra
        this.saveBooks();
        return book;
    }    

    deleteBook(id: string): boolean {
        const index = this.books.findIndex(book => book.id === id);
        if (index === -1) return false;
        this.books.splice(index, 1);
        this.saveBooks();
        return true;
    }

    searchBooksByTitle(title: string): Book[] {
        return this.books.filter(book =>
            book.title.toLowerCase().includes(title.toLowerCase())
        );
    }

    markAsBorrowed(id: string): void {
        const book = this.getBookById(id);
        if (book) {
            book.isBorrowed = true;
            this.saveBooks();
        }
    }
    
    markAsReturned(id: string): void {
        const book = this.getBookById(id);
        if (book) {
            book.isBorrowed = false;
            this.saveBooks();
        }
    }
    
}
