"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookCLI = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
class BookCLI {
    constructor(bookManager) {
        this.bookManager = bookManager;
    }
    async showMenu() {
        while (true) {
            const { action } = await inquirer_1.default.prompt({
                name: 'action',
                type: 'list',
                message: '\n📚 MENU SÁCH:',
                choices: [
                    { name: '📖 Xem danh sách', value: 'list' },
                    { name: '➕ Thêm sách', value: 'add' },
                    { name: '✏️  Cập nhật sách', value: 'update' },
                    { name: '🗑️  Xóa sách', value: 'delete' },
                    { name: '🔍 Tìm kiếm sách', value: 'search' },
                    { name: '⬅️  Quay lại', value: 'exit' }
                ]
            });
            if (action === 'exit')
                break;
            await this.handleAction(action);
        }
    }
    async handleAction(action) {
        switch (action) {
            case 'list':
                this.listBooks();
                break;
            case 'add':
                await this.addBook();
                break;
            case 'update':
                await this.updateBook();
                break;
            case 'delete':
                await this.deleteBook();
                break;
            case 'search':
                await this.searchBooks();
                break;
        }
    }
    listBooks() {
        const books = this.bookManager.getAllBooks();
        console.log('\n📚 DANH SÁCH SÁCH:');
        if (books.length === 0)
            return console.log('📭 Không có sách nào.');
        console.table(books.map(b => ({
            ID: b.id,
            Tên: b.title,
            TácGiả: b.author,
            TrạngThái: b.isBorrowed ? '📕 Đã mượn' : '📗 Chưa mượn'
        })));
    }
    async addBook() {
        const { title, author } = await inquirer_1.default.prompt([
            { name: 'title', type: 'input', message: '📘 Tên sách:' },
            { name: 'author', type: 'input', message: '✍️  Tác giả:' }
        ]);
        const book = this.bookManager.addBook(title, author);
        console.log('\n✅ Đã thêm sách:', book.title);
    }
    async updateBook() {
        const books = this.bookManager.getAllBooks();
        if (books.length === 0)
            return console.log('❌ Không có sách để cập nhật.');
        const { id } = await inquirer_1.default.prompt({
            name: 'id',
            type: 'list',
            message: '🔧 Chọn sách để cập nhật:',
            choices: books.map(b => ({ name: `${b.title} (${b.author})`, value: b.id }))
        });
        const book = this.bookManager.getBookById(id);
        const { title, author, isBorrowed } = await inquirer_1.default.prompt([
            { name: 'title', type: 'input', message: '📘 Tiêu đề:', default: book.title },
            { name: 'author', type: 'input', message: '✍️  Tác giả:', default: book.author },
            { name: 'isBorrowed', type: 'confirm', message: '📦 Đã mượn?', default: book.isBorrowed }
        ]);
        this.bookManager.updateBook(id, { title, author, isBorrowed });
        console.log('✅ Cập nhật thành công.');
    }
    async deleteBook() {
        const books = this.bookManager.getAllBooks();
        if (books.length === 0)
            return console.log('❌ Không có sách để xóa.');
        const { id } = await inquirer_1.default.prompt({
            name: 'id',
            type: 'list',
            message: '🗑️  Chọn sách để xóa:',
            choices: books.map(b => ({ name: `${b.title} (${b.author})`, value: b.id }))
        });
        const { confirm } = await inquirer_1.default.prompt({
            name: 'confirm',
            type: 'confirm',
            message: '⚠️  Bạn có chắc chắn muốn xóa?'
        });
        if (confirm) {
            this.bookManager.deleteBook(id);
            console.log('✅ Đã xóa sách.');
        }
    }
    async searchBooks() {
        const { keyword } = await inquirer_1.default.prompt({
            name: 'keyword',
            type: 'input',
            message: '🔍 Nhập từ khóa tiêu đề:'
        });
        const results = this.bookManager.searchBooksByTitle(keyword);
        console.log('\n📚 KẾT QUẢ TÌM KIẾM:');
        if (results.length === 0)
            console.log('❌ Không tìm thấy sách nào.');
        else {
            console.table(results.map(b => ({
                ID: b.id,
                Tên: b.title,
                TácGiả: b.author,
                TrạngThái: b.isBorrowed ? '📕 Đã mượn' : '📗 Chưa mượn'
            })));
        }
    }
}
exports.BookCLI = BookCLI;
