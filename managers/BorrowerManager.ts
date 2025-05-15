import { Borrower } from '../models/Borrower';
import { loadData } from '../utils/storage';
import { debouncedSave } from '../utils/debouncedSave';
import { generateId } from '../utils/generateID';

const BORROWERS_FILE = './data/borrowers.json';

export class BorrowerManager {
    private borrowers: Borrower[] = [];

    constructor() {
        this.borrowers = loadData<Borrower>(BORROWERS_FILE);
    }

    private saveBorrowers() {
        debouncedSave(BORROWERS_FILE, this.borrowers);
    }

    getAllBorrowers(): Borrower[] {
        return this.borrowers;
    }

    getBorrowerById(id: string): Borrower | null {
        return this.borrowers.find(b => b.id === id) || null;
    }

    addBorrower(name: string, email: string): Borrower {
        const newBorrower: Borrower = {
            id: generateId(),
            name,
            email,
            borrowedBookIds: []
        };
        this.borrowers.push(newBorrower);
        this.saveBorrowers();
        return newBorrower;
    }

    updateBorrower(id: string, data: Partial<Borrower>): Borrower | null {
        const borrower = this.getBorrowerById(id);
        if (!borrower) return null;
        Object.assign(borrower, data);
        this.saveBorrowers();
        return borrower;
    }


    deleteBorrower(id: string): boolean {
        const index = this.borrowers.findIndex(b => b.id === id);
        if (index === -1) return false;
        this.borrowers.splice(index, 1);
        this.saveBorrowers();
        return true;
    }

    searchBorrowerByName(name: string): Borrower[] {
        return this.borrowers.filter(b =>
            b.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    borrowBook(borrowerId: string, bookId: string): boolean {
        const borrower = this.getBorrowerById(borrowerId);
        if (!borrower || borrower.borrowedBookIds.includes(bookId)) return false;
        borrower.borrowedBookIds.push(bookId);
        this.saveBorrowers();
        return true;
    }

    returnBook(borrowerId: string, bookId: string): boolean {
        const borrower = this.getBorrowerById(borrowerId);
        if (!borrower) return false;
        borrower.borrowedBookIds = borrower.borrowedBookIds.filter(id => id !== bookId);
        this.saveBorrowers();
        return true;
    }
}
