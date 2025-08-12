import { SampleRequestsService, CreateSampleRequestDto, UpdateSampleRequestDto } from './sample-requests.service';
export declare class SampleRequestsController {
    private readonly sampleRequestsService;
    constructor(sampleRequestsService: SampleRequestsService);
    create(createDto: CreateSampleRequestDto, req: any): Promise<import("../entities/sample-request.entity").SampleRequest>;
    findAll(clientId?: string, status?: string): Promise<import("../entities/sample-request.entity").SampleRequest[]>;
    findMyRequests(req: any): Promise<import("../entities/sample-request.entity").SampleRequest[]>;
    findOne(id: string): Promise<import("../entities/sample-request.entity").SampleRequest>;
    update(id: string, updateDto: UpdateSampleRequestDto, req: any): Promise<import("../entities/sample-request.entity").SampleRequest>;
    remove(id: string): Promise<void>;
}
