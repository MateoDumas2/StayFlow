import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

export interface IStorageProvider {
  uploadFile(file: Express.Multer.File): Promise<string>;
}

@Injectable()
export class StorageService {
  private provider: IStorageProvider;
  private readonly logger = new Logger(StorageService.name);

  constructor() {
    // Automatically switch to Cloudinary if keys are present
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      this.logger.log('Using Cloudinary Storage Provider');
      this.provider = new CloudinaryStorageProvider();
    } else {
      this.logger.log('Using Local Storage Provider');
      this.provider = new LocalStorageProvider();
    }
  }

  async upload(file: Express.Multer.File): Promise<string> {
    return this.provider.uploadFile(file);
  }
}

class LocalStorageProvider implements IStorageProvider {
  async uploadFile(file: Express.Multer.File): Promise<string> {
    // For local storage with diskStorage interceptor, 
    // the file is already saved, we just need to return the URL.
    
    // Check if file is in memory (if MemoryStorage was used) or on disk
    if (file.buffer) {
       // Ideally we should write the buffer to disk here if we want to support both
       // But current setup uses diskStorage so file.path/filename should exist
       // If we switched to memory storage for Cloudinary compatibility, we need to handle local saving manually
       const fileName = `${Date.now()}-${file.originalname}`;
       const uploadPath = path.join(process.cwd(), 'uploads', fileName);
       fs.writeFileSync(uploadPath, file.buffer);
       const baseUrl = process.env.API_URL || 'http://localhost:4011';
       return `${baseUrl}/uploads/${fileName}`;
    }

    // Assuming the file is already saved by Multer diskStorage in ./uploads
    const baseUrl = process.env.API_URL || 'http://localhost:4011';
    return `${baseUrl}/uploads/${file.filename}`;
  }
}

class CloudinaryStorageProvider implements IStorageProvider {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'stayflow_uploads' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        },
      );

      // If file.buffer exists (MemoryStorage), use it. 
      // If file.path exists (DiskStorage), we need to read it.
      if (file.buffer) {
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      } else if (file.path) {
        fs.createReadStream(file.path).pipe(uploadStream);
      } else {
        reject(new Error('File content not found'));
      }
    });
  }
}
