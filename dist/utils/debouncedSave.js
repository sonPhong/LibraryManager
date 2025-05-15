"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debouncedSave = debouncedSave;
const fs_1 = __importDefault(require("fs"));
let timeout = null;
// dùng gêneric
function debouncedSave(filePath, data, delay = 1000) {
    if (timeout)
        clearTimeout(timeout);
    timeout = setTimeout(() => {
        fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        timeout = null;
    }, delay);
}
