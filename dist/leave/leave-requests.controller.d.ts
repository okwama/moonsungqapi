import { LeaveRequestsService } from './leave-requests.service';
export declare class LeaveRequestsController {
    private readonly leaveRequestsService;
    constructor(leaveRequestsService: LeaveRequestsService);
    findAll(query: any, req: any): Promise<import("../entities").LeaveRequest[]>;
    findOne(id: string): Promise<import("../entities").LeaveRequest>;
    create(createLeaveRequestDto: any, req: any): Promise<import("../entities").LeaveRequest>;
    update(id: string, updateLeaveRequestDto: any): Promise<import("../entities").LeaveRequest>;
    remove(id: string): Promise<void>;
}
