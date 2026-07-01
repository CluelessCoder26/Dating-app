import fs from 'fs/promises';
import path from 'path';
import logger from '../utils/logger.js';

export class StorageService {
  static uploadDir = path.join(process.cwd(), 'uploads');

  static async init() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
      logger.info(`Upload directory verified at ${this.uploadDir}`);
    } catch (err) {
      logger.error(`Failed to create upload directory: ${err.message}`);
    }
  }

  static async deleteFile(filename) {
    if (!filename) return;
    try {
      const filepath = path.join(this.uploadDir, filename);
      await fs.unlink(filepath);
      logger.info(`Deleted file: ${filename}`);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        logger.error(`Failed to delete file ${filename}: ${err.message}`);
      }
    }
  }
}
