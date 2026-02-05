export interface IStorageProvider {
    uploadFile(file: Express.Multer.File): Promise<string>;
}
export declare class StorageService {
    private provider;
    private readonly logger;
    constructor();
    upload(file: Express.Multer.File): Promise<string>;
}
