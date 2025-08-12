import { Repository, DataSource } from 'typeorm';
import { SampleRequest } from '../entities/sample-request.entity';
import { SampleRequestItem } from '../entities/sample-request-item.entity';
export interface CreateSampleRequestDto {
    clientId: number;
    userId: number;
    notes?: string;
    items: Array<{
        productId: number;
        quantity: number;
        notes?: string;
    }>;
}
export interface UpdateSampleRequestDto {
    status?: 'pending' | 'approved' | 'rejected';
    notes?: string;
    approvedBy?: number;
}
export declare class SampleRequestsService {
    private sampleRequestRepository;
    private sampleRequestItemRepository;
    private dataSource;
    constructor(sampleRequestRepository: Repository<SampleRequest>, sampleRequestItemRepository: Repository<SampleRequestItem>, dataSource: DataSource);
    create(createDto: CreateSampleRequestDto): Promise<SampleRequest>;
    findAll(): Promise<SampleRequest[]>;
    findOne(id: number): Promise<SampleRequest>;
    update(id: number, updateDto: UpdateSampleRequestDto): Promise<SampleRequest>;
    remove(id: number): Promise<void>;
    findByClient(clientId: number): Promise<SampleRequest[]>;
    findByUser(userId: number): Promise<SampleRequest[]>;
    findByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<SampleRequest[]>;
    private generateRequestNumber;
}
