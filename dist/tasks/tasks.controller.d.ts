import { TasksService } from './tasks.service';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    findAll(query: any): Promise<import("../entities").Task[]>;
    findOne(id: string): Promise<import("../entities").Task>;
    create(createTaskDto: any): Promise<import("../entities").Task>;
    update(id: string, updateTaskDto: any): Promise<import("../entities").Task>;
    updateStatus(id: string, body: {
        status: string;
    }): Promise<import("../entities").Task>;
    completeTask(id: string): Promise<import("../entities").Task>;
    remove(id: string): Promise<void>;
    getSalesRepTasks(salesRepId: string, req: any): Promise<any[]>;
}
