import { LeaveService } from './leave.service';
export declare class LeaveController {
    private readonly leaveService;
    constructor(leaveService: LeaveService);
    getLeaveTypes(): Promise<import("../entities").LeaveType[]>;
    getLeaveBalance(req: any): Promise<any>;
    findAll(query: any, req: any): Promise<import("../entities").Leave[]>;
    findOne(id: string): Promise<import("../entities").Leave>;
    create(createLeaveDto: any, req: any): Promise<import("../entities").Leave>;
    update(id: string, updateLeaveDto: any): Promise<import("../entities").Leave>;
    remove(id: string): Promise<void>;
}
