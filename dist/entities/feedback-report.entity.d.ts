import { SalesRep } from './sales-rep.entity';
import { Clients } from './clients.entity';
import { JourneyPlan } from '../journey-plans/entities/journey-plan.entity';
export declare class FeedbackReport {
    id: number;
    comment: string;
    createdAt: Date;
    clientId: number;
    userId: number;
    journeyPlanId: number;
    user: SalesRep;
    client: Clients;
    journeyPlan: JourneyPlan;
}
