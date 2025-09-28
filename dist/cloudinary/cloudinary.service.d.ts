import { ConfigService } from '@nestjs/config';
export declare class CloudinaryService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    uploadToCloudinary(buffer: Buffer, options?: any): Promise<{
        url: string;
        fileId: string;
        name: string;
        format: string;
        size: number;
        resource_type: "raw" | "image" | "auto" | "video";
    }>;
    deleteFromCloudinary(publicId: string, resourceType?: string): Promise<any>;
    uploadFile(file: Express.Multer.File): Promise<{
        secure_url: string;
        public_id: string;
        original_filename: string;
        format: string;
        size: number;
    }>;
}
