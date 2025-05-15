import inquirer from 'inquirer';
import { BorrowerManager } from '../managers/BorrowerManager';

export class BorrowerCLI {
  constructor(private borrowerManager: BorrowerManager) {}

  async showMenu() {
    while (true) {
      const { action } = await inquirer.prompt({
        name: 'action',
        type: 'list',
        message: '\n👤 MENU NGƯỜI MƯỢN:',
        choices: [
          { name: '📋 Xem danh sách', value: 'list' },
          { name: '➕ Thêm người mượn', value: 'add' },
          { name: '✏️  Cập nhật', value: 'update' },
          { name: '🗑️  Xóa', value: 'delete' },
          { name: '🔍 Tìm kiếm theo tên', value: 'search' },
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
        this.listBorrowers();
        break;
      case 'add':
        await this.addBorrower();
        break;
      case 'update':
        await this.updateBorrower();
        break;
      case 'delete':
        await this.deleteBorrower();
        break;
      case 'search':
        await this.searchBorrower();
        break;
    }
  }

  private listBorrowers() {
    const list = this.borrowerManager.getAllBorrowers();
    console.log('\n👥 DANH SÁCH NGƯỜI MƯỢN:');
    if (list.length === 0) return console.log('📭 Không có người mượn.');

    console.table(
      list.map(b => ({
        ID: b.id,
        Tên: b.name,
        Email: b.email,
        SáchĐangMượn: b.borrowedBookIds.length
      }))
    );
  }

  private async addBorrower() {
    const { name, email } = await inquirer.prompt([
      { name: 'name', type: 'input', message: '👤 Tên người mượn:' },
      { name: 'email', type: 'input', message: '📧 Email:' }
    ]);
    const borrower = this.borrowerManager.addBorrower(name, email);
    console.log('\n✅ Đã thêm:', borrower.name);
  }

  private async updateBorrower() {
    const list = this.borrowerManager.getAllBorrowers();
    if (list.length === 0) return console.log('❌ Không có người mượn.');

    const { id } = await inquirer.prompt({
      name: 'id',
      type: 'list',
      message: '✏️  Chọn người mượn để cập nhật:',
      choices: list.map(b => ({ name: `${b.name} (${b.email})`, value: b.id }))
    });

    const b = this.borrowerManager.getBorrowerById(id)!;
    const { name, email } = await inquirer.prompt([
      { name: 'name', type: 'input', message: '👤 Tên:', default: b.name },
      { name: 'email', type: 'input', message: '📧 Email:', default: b.email }
    ]);

    this.borrowerManager.updateBorrower(id, { name, email });
    console.log('✅ Đã cập nhật.');
  }

  private async deleteBorrower() {
    const list = this.borrowerManager.getAllBorrowers();
    if (list.length === 0) return console.log('❌ Không có người mượn.');

    const { id } = await inquirer.prompt({
      name: 'id',
      type: 'list',
      message: '🗑️  Chọn người mượn để xóa:',
      choices: list.map(b => ({ name: `${b.name} (${b.email})`, value: b.id }))
    });

    const { confirm } = await inquirer.prompt({
      name: 'confirm',
      type: 'confirm',
      message: '⚠️  Xác nhận xóa?'
    });

    if (confirm) {
      this.borrowerManager.deleteBorrower(id);
      console.log('✅ Đã xóa.');
    }
  }

  private async searchBorrower() {
    const { keyword } = await inquirer.prompt({
      name: 'keyword',
      type: 'input',
      message: '🔍 Nhập từ khóa tên:'
    });

    const results = this.borrowerManager.searchBorrowerByName(keyword);
    console.log('\n🔎 KẾT QUẢ TÌM KIẾM:');
    if (results.length === 0) console.log('❌ Không tìm thấy người mượn.');
    else {
      console.table(
        results.map(b => ({
          ID: b.id,
          Tên: b.name,
          Email: b.email,
          SáchĐangMượn: b.borrowedBookIds.length
        }))
      );
    }
  }
}
