import { ClientsService } from './clients.service';
import { OutletQuantityService } from '../outlet-quantity/outlet-quantity.service';
import { ClientAssignmentService } from '../client-assignment/client-assignment.service';
export declare class OutletsController {
    private readonly clientsService;
    private readonly outletQuantityService;
    private readonly clientAssignmentService;
    private readonly logger;
    constructor(clientsService: ClientsService, outletQuantityService: OutletQuantityService, clientAssignmentService: ClientAssignmentService);
    getOutlets(req: any): Promise<any>;
    getOutlet(id: string, req: any): Promise<{
        id: number;
        name: string;
        address: string;
        contact: string;
        email: string;
        latitude: number;
        longitude: number;
        regionId: number;
        region: string;
        countryId: number;
        status: number;
        taxPin: string;
        location: string;
        clientType: number;
        outletAccount: number;
        balance: number;
        createdAt: Date;
    }>;
    createOutlet(body: any, req: any): Promise<{
        id: number;
        name: string;
        address: string;
        contact: string;
        email: string;
        latitude: number;
        longitude: number;
        regionId: number;
        region: string;
        countryId: number;
        status: number;
        taxPin: string;
        location: string;
        clientType: number;
        outletAccount: number;
        balance: number;
        createdAt: Date;
    }>;
    updateOutlet(id: string, body: any, req: any): Promise<{
        id: number;
        name: string;
        address: string;
        contact: string;
        email: string;
        latitude: number;
        longitude: number;
        regionId: number;
        region: string;
        countryId: number;
        status: number;
        taxPin: string;
        location: string;
        clientType: number;
        outletAccount: number;
        balance: number;
        createdAt: Date;
    }>;
    getOutletProducts(id: string, req: any): Promise<{
        id: number;
        clientId: number;
        productId: number;
        quantity: number;
        createdAt: Date;
        product: {
            id: number;
            name: string;
            description: string;
            price: number;
            imageUrl: string;
        };
    }[]>;
    assignOutlet(body: {
        outletId: number;
        salesRepId: number;
    }, req: any): Promise<{
        id: number;
        outletId: number;
        salesRepId: number;
        assignedAt: Date;
        status: string;
        message: string;
    }>;
    getOutletAssignment(id: string): Promise<{
        message: string;
        id?: undefined;
        outletId?: undefined;
        salesRepId?: undefined;
        assignedAt?: undefined;
        status?: undefined;
        salesRep?: undefined;
    } | {
        id: number;
        outletId: number;
        salesRepId: number;
        assignedAt: Date;
        status: string;
        salesRep: {
            id: number;
            name: string;
            email: string;
        };
        message?: undefined;
    }>;
    getOutletAssignmentHistory(id: string): Promise<{
        id: number;
        outletId: number;
        salesRepId: number;
        assignedAt: Date;
        status: string;
        salesRep: {
            id: number;
            name: string;
            email: string;
        };
    }[]>;
    private getFallbackCoordinates;
}
