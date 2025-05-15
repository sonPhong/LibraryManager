import fs from 'fs';
import path from 'path';

let timeout: NodeJS.Timeout | null = null;

// dùng gêneric
export function debouncedSave<T>(filePath: string, data: T, delay: number = 1000) {
  if (timeout) clearTimeout(timeout);

  timeout = setTimeout(() => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    timeout = null;
  }, delay);
}
