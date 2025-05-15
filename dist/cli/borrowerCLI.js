"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowerCLI = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
class BorrowerCLI {
    constructor(borrowerManager) {
        this.borrowerManager = borrowerManager;
    }
    async showMenu() {
        while (true) {
            const { action } = await inquirer_1.default.prompt({
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
            if (action === 'exit')
                break;
            await this.handleAction(action);
        }
    }
    async handleAction(action) {
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
    listBorrowers() {
        const list = this.borrowerManager.getAllBorrowers();
        console.log('\n👥 DANH SÁCH NGƯỜI MƯỢN:');
        if (list.length === 0)
            return console.log('📭 Không có người mượn.');
        console.table(list.map(b => ({
            ID: b.id,
            Tên: b.name,
            Email: b.email,
            SáchĐangMượn: b.borrowedBookIds.length
        })));
    }
    async addBorrower() {
        const { name, email } = await inquirer_1.default.prompt([
            { name: 'name', type: 'input', message: '👤 Tên người mượn:' },
            { name: 'email', type: 'input', message: '📧 Email:' }
        ]);
        const borrower = this.borrowerManager.addBorrower(name, email);
        console.log('\n✅ Đã thêm:', borrower.name);
    }
    async updateBorrower() {
        const list = this.borrowerManager.getAllBorrowers();
        if (list.length === 0)
            return console.log('❌ Không có người mượn.');
        const { id } = await inquirer_1.default.prompt({
            name: 'id',
            type: 'list',
            message: '✏️  Chọn người mượn để cập nhật:',
            choices: list.map(b => ({ name: `${b.name} (${b.email})`, value: b.id }))
        });
        const b = this.borrowerManager.getBorrowerById(id);
        const { name, email } = await inquirer_1.default.prompt([
            { name: 'name', type: 'input', message: '👤 Tên:', default: b.name },
            { name: 'email', type: 'input', message: '📧 Email:', default: b.email }
        ]);
        this.borrowerManager.updateBorrower(id, { name, email });
        console.log('✅ Đã cập nhật.');
    }
    async deleteBorrower() {
        const list = this.borrowerManager.getAllBorrowers();
        if (list.length === 0)
            return console.log('❌ Không có người mượn.');
        const { id } = await inquirer_1.default.prompt({
            name: 'id',
            type: 'list',
            message: '🗑️  Chọn người mượn để xóa:',
            choices: list.map(b => ({ name: `${b.name} (${b.email})`, value: b.id }))
        });
        const { confirm } = await inquirer_1.default.prompt({
            name: 'confirm',
            type: 'confirm',
            message: '⚠️  Xác nhận xóa?'
        });
        if (confirm) {
            this.borrowerManager.deleteBorrower(id);
            console.log('✅ Đã xóa.');
        }
    }
    async searchBorrower() {
        const { keyword } = await inquirer_1.default.prompt({
            name: 'keyword',
            type: 'input',
            message: '🔍 Nhập từ khóa tên:'
        });
        const results = this.borrowerManager.searchBorrowerByName(keyword);
        console.log('\n🔎 KẾT QUẢ TÌM KIẾM:');
        if (results.length === 0)
            console.log('❌ Không tìm thấy người mượn.');
        else {
            console.table(results.map(b => ({
                ID: b.id,
                Tên: b.name,
                Email: b.email,
                SáchĐangMượn: b.borrowedBookIds.length
            })));
        }
    }
}
exports.BorrowerCLI = BorrowerCLI;
