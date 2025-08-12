"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ImageKitService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageKitService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ImageKit = require("imagekit");
const path = require("path");
let ImageKitService = ImageKitService_1 = class ImageKitService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(ImageKitService_1.name);
        this.imagekit = new ImageKit({
            publicKey: this.configService.get('IMAGEKIT_PUBLIC_KEY'),
            privateKey: this.configService.get('IMAGEKIT_PRIVATE_KEY'),
            urlEndpoint: this.configService.get('IMAGEKIT_URL_ENDPOINT'),
        });
        this.logger.log('ImageKit service initialized');
    }
    async uploadFile(file, folder = 'whoosh') {
        try {
            this.logger.log(`📤 Uploading file to ImageKit: ${file.originalname}`);
            const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
            const result = await this.imagekit.upload({
                file: file.buffer,
                fileName: uniqueFilename,
                folder: folder,
            });
            this.logger.log(`✅ File uploaded successfully to ImageKit: ${result.url}`);
            return {
                url: result.url,
                fileId: result.fileId,
                name: result.name,
            };
        }
        catch (error) {
            this.logger.error(`❌ Error uploading file to ImageKit:`, error);
            throw error;
        }
    }
    async testConnection() {
        try {
            const authParams = this.imagekit.getAuthenticationParameters();
            const files = await this.imagekit.listFiles({ limit: 1 });
            this.logger.log('✅ ImageKit connection test successful');
            return {
                success: true,
                message: 'ImageKit connection successful',
                authParams,
            };
        }
        catch (error) {
            this.logger.error(`❌ ImageKit connection test failed:`, error);
            return {
                success: false,
                message: `ImageKit connection failed: ${error.message}`,
            };
        }
    }
    validateFileType(filename) {
        const allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf'];
        const ext = path.extname(filename).toLowerCase();
        return allowedTypes.includes(ext);
    }
    validateFileSize(fileSize, maxSize = 5 * 1024 * 1024) {
        return fileSize <= maxSize;
    }
};
exports.ImageKitService = ImageKitService;
exports.ImageKitService = ImageKitService = ImageKitService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ImageKitService);
//# sourceMappingURL=imagekit.service.js.map