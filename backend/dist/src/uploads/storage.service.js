"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const cloudinary_1 = require("cloudinary");
const streamifier = __importStar(require("streamifier"));
let StorageService = StorageService_1 = class StorageService {
    provider;
    logger = new common_1.Logger(StorageService_1.name);
    constructor() {
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
            this.logger.log('Using Cloudinary Storage Provider');
            this.provider = new CloudinaryStorageProvider();
        }
        else {
            this.logger.log('Using Local Storage Provider');
            this.provider = new LocalStorageProvider();
        }
    }
    async upload(file) {
        return this.provider.uploadFile(file);
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StorageService);
class LocalStorageProvider {
    async uploadFile(file) {
        if (file.buffer) {
            const fileName = `${Date.now()}-${file.originalname}`;
            const uploadPath = path.join(process.cwd(), 'uploads', fileName);
            fs.writeFileSync(uploadPath, file.buffer);
            const baseUrl = process.env.API_URL || 'http://localhost:4011';
            return `${baseUrl}/uploads/${fileName}`;
        }
        const baseUrl = process.env.API_URL || 'http://localhost:4011';
        return `${baseUrl}/uploads/${file.filename}`;
    }
}
class CloudinaryStorageProvider {
    constructor() {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    async uploadFile(file) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder: 'stayflow_uploads' }, (error, result) => {
                if (error)
                    return reject(error);
                resolve(result.secure_url);
            });
            if (file.buffer) {
                streamifier.createReadStream(file.buffer).pipe(uploadStream);
            }
            else if (file.path) {
                fs.createReadStream(file.path).pipe(uploadStream);
            }
            else {
                reject(new Error('File content not found'));
            }
        });
    }
}
//# sourceMappingURL=storage.service.js.map