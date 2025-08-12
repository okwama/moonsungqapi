import { ConfigService } from '@nestjs/config';
export declare class ImageKitService {
    private configService;
    private readonly logger;
    private imagekit;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, folder?: string): Promise<{
        url: string;
        fileId: string;
        name: string;
    }>;
    testConnection(): Promise<{
        success: boolean;
        message: string;
        authParams?: any;
    }>;
    validateFileType(filename: string): boolean;
    validateFileSize(fileSize: number, maxSize?: number): boolean;
}
