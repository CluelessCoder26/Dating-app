import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';

class StorageService {
  constructor() {
    this.provider = env.STORAGE_PROVIDER || 'local'; // 'local' or 'supabase'
    
    if (this.provider === 'supabase') {
      this.supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
      this.bucket = env.SUPABASE_BUCKET || 'media';
    } else {
      this.uploadDir = path.join(process.cwd(), 'uploads');
      this.initLocal().catch(err => logger.error(`Failed to init local storage: ${err.message}`));
    }
  }

  async initLocal() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async uploadBuffer(buffer, fileName, mimeType) {
    if (this.provider === 'supabase') {
      const { data, error } = await this.supabase.storage
        .from(this.bucket)
        .upload(fileName, buffer, {
          contentType: mimeType,
          upsert: true
        });

      if (error) throw new Error(`Supabase upload failed: ${error.message}`);
      
      const { data: publicData } = this.supabase.storage
        .from(this.bucket)
        .getPublicUrl(fileName);
        
      return { url: publicData.publicUrl, key: fileName };
    } else {
      const filePath = path.join(this.uploadDir, fileName);
      await fs.writeFile(filePath, buffer);
      // For local, return a relative URL
      return { url: `/uploads/${fileName}`, key: fileName };
    }
  }

  async deleteFile(key) {
    if (!key) return;

    if (this.provider === 'supabase') {
      const { error } = await this.supabase.storage
        .from(this.bucket)
        .remove([key]);
      
      if (error) logger.error(`Supabase delete failed: ${error.message}`);
    } else {
      try {
        const filePath = path.join(this.uploadDir, key);
        await fs.unlink(filePath);
      } catch (err) {
        logger.error(`Local file delete failed: ${err.message}`);
      }
    }
  }
}

export const storageService = new StorageService();
