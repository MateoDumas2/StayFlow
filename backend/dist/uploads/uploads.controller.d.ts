import { StorageService } from './storage.service';
export declare class UploadsController {
    private readonly storageService;
    constructor(storageService: StorageService);
    uploadFile(file: Express.Multer.File): Promise<{
        url: string;
    }>;
}
