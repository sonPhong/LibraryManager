import { readFileSync, writeFileSync, existsSync } from 'fs';

export function loadData<T>(path: string): T[] {
  try {
    if (!existsSync(path)) return []; // Nếu file không tồn tại, trả về mảng rỗng
    const content = readFileSync(path, 'utf-8').trim(); // Đọc file và loại bỏ khoảng trắng thừa
    if (!content) return []; // Nếu file rỗng, trả về mảng rỗng
    return JSON.parse(content); // Parse nội dung file từ JSON thành object
  } catch (err) {
    console.error(`Lỗi đọc dữ liệu từ ${path}:`, err);
    return [];
  }
}

export function saveData<T>(path: string, data: T[]) {
  try {
    writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8'); // Ghi dữ liệu vào file JSON
  } catch (err) {
    console.error(`Lỗi ghi dữ liệu vào ${path}:`, err);
  }
}
