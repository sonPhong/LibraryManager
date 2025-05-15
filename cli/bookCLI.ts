import inquirer from 'inquirer';
import { BookManager } from '../managers/BookManager';

export class BookCLI {
  constructor(private bookManager: BookManager) {}

  async showMenu() {
    while (true) {
      const { action } = await inquirer.prompt({
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

      if (action === 'exit') break;
      await this.handleAction(action);
    }
  }

  private async handleAction(action: string) {
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

  private listBooks() {
    const books = this.bookManager.getAllBooks();
    console.log('\n📚 DANH SÁCH SÁCH:');
    if (books.length === 0) return console.log('📭 Không có sách nào.');

    console.table(
      books.map(b => ({
        ID: b.id,
        Tên: b.title,
        TácGiả: b.author,
        TrạngThái: b.isBorrowed ? '📕 Đã mượn' : '📗 Chưa mượn'
      }))
    );
  }

  private async addBook() {
    const { title, author } = await inquirer.prompt([
      { name: 'title', type: 'input', message: '📘 Tên sách:' },
      { name: 'author', type: 'input', message: '✍️  Tác giả:' }
    ]);
    const book = this.bookManager.addBook(title, author);
    console.log('\n✅ Đã thêm sách:', book.title);
  }

  private async updateBook() {
    const books = this.bookManager.getAllBooks();
    if (books.length === 0) return console.log('❌ Không có sách để cập nhật.');

    const { id } = await inquirer.prompt({
      name: 'id',
      type: 'list',
      message: '🔧 Chọn sách để cập nhật:',
      choices: books.map(b => ({ name: `${b.title} (${b.author})`, value: b.id }))
    });

    const book = this.bookManager.getBookById(id)!;
    const { title, author, isBorrowed } = await inquirer.prompt([
      { name: 'title', type: 'input', message: '📘 Tiêu đề:', default: book.title },
      { name: 'author', type: 'input', message: '✍️  Tác giả:', default: book.author },
      { name: 'isBorrowed', type: 'confirm', message: '📦 Đã mượn?', default: book.isBorrowed }
    ]);

    this.bookManager.updateBook(id, { title, author, isBorrowed });
    console.log('✅ Cập nhật thành công.');
  }

  private async deleteBook() {
    const books = this.bookManager.getAllBooks();
    if (books.length === 0) return console.log('❌ Không có sách để xóa.');

    const { id } = await inquirer.prompt({
      name: 'id',
      type: 'list',
      message: '🗑️  Chọn sách để xóa:',
      choices: books.map(b => ({ name: `${b.title} (${b.author})`, value: b.id }))
    });

    const { confirm } = await inquirer.prompt({
      name: 'confirm',
      type: 'confirm',
      message: '⚠️  Bạn có chắc chắn muốn xóa?'
    });

    if (confirm) {
      this.bookManager.deleteBook(id);
      console.log('✅ Đã xóa sách.');
    }
  }

  private async searchBooks() {
    const { keyword } = await inquirer.prompt({
      name: 'keyword',
      type: 'input',
      message: '🔍 Nhập từ khóa tiêu đề:'
    });

    const results = this.bookManager.searchBooksByTitle(keyword);
    console.log('\n📚 KẾT QUẢ TÌM KIẾM:');
    if (results.length === 0) console.log('❌ Không tìm thấy sách nào.');
    else {
      console.table(
        results.map(b => ({
          ID: b.id,
          Tên: b.title,
          TácGiả: b.author,
          TrạngThái: b.isBorrowed ? '📕 Đã mượn' : '📗 Chưa mượn'
        }))
      );
    }
  }
}
