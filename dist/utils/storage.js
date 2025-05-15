"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadData = loadData;
exports.saveData = saveData;
const fs_1 = require("fs");
function loadData(path) {
    try {
        if (!(0, fs_1.existsSync)(path))
            return []; // Nếu file không tồn tại, trả về mảng rỗng
        const content = (0, fs_1.readFileSync)(path, 'utf-8').trim(); // Đọc file và loại bỏ khoảng trắng thừa
        if (!content)
            return []; // Nếu file rỗng, trả về mảng rỗng
        return JSON.parse(content); // Parse nội dung file từ JSON thành object
    }
    catch (err) {
        console.error(`Lỗi đọc dữ liệu từ ${path}:`, err);
        return [];
    }
}
function saveData(path, data) {
    try {
        (0, fs_1.writeFileSync)(path, JSON.stringify(data, null, 2), 'utf-8'); // Ghi dữ liệu vào file JSON
    }
    catch (err) {
        console.error(`Lỗi ghi dữ liệu vào ${path}:`, err);
    }
}
