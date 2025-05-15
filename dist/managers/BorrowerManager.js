"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowerManager = void 0;
const storage_1 = require("../utils/storage");
const debouncedSave_1 = require("../utils/debouncedSave");
const generateID_1 = require("../utils/generateID");
const BORROWERS_FILE = './data/borrowers.json';
class BorrowerManager {
    constructor() {
        this.borrowers = [];
        this.borrowers = (0, storage_1.loadData)(BORROWERS_FILE);
    }
    saveBorrowers() {
        (0, debouncedSave_1.debouncedSave)(BORROWERS_FILE, this.borrowers);
    }
    getAllBorrowers() {
        return this.borrowers;
    }
    getBorrowerById(id) {
        return this.borrowers.find(b => b.id === id) || null;
    }
    addBorrower(name, email) {
        const newBorrower = {
            id: (0, generateID_1.generateId)(),
            name,
            email,
            borrowedBookIds: []
        };
        this.borrowers.push(newBorrower);
        this.saveBorrowers();
        return newBorrower;
    }
    updateBorrower(id, data) {
        const borrower = this.getBorrowerById(id);
        if (!borrower)
            return null;
        Object.assign(borrower, data);
        this.saveBorrowers();
        return borrower;
    }
    deleteBorrower(id) {
        const index = this.borrowers.findIndex(b => b.id === id);
        if (index === -1)
            return false;
        this.borrowers.splice(index, 1);
        this.saveBorrowers();
        return true;
    }
    searchBorrowerByName(name) {
        return this.borrowers.filter(b => b.name.toLowerCase().includes(name.toLowerCase()));
    }
    borrowBook(borrowerId, bookId) {
        const borrower = this.getBorrowerById(borrowerId);
        if (!borrower || borrower.borrowedBookIds.includes(bookId))
            return false;
        borrower.borrowedBookIds.push(bookId);
        this.saveBorrowers();
        return true;
    }
    returnBook(borrowerId, bookId) {
        const borrower = this.getBorrowerById(borrowerId);
        if (!borrower)
            return false;
        borrower.borrowedBookIds = borrower.borrowedBookIds.filter(id => id !== bookId);
        this.saveBorrowers();
        return true;
    }
}
exports.BorrowerManager = BorrowerManager;
