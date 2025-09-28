import { VersionService } from './version.service';
export declare class VersionController {
    private readonly versionService;
    constructor(versionService: VersionService);
    getCurrentVersion(): Promise<{
        version: string;
        buildNumber: string;
        minRequiredVersion: string;
        forceUpdate: boolean;
        updateMessage: string;
        androidUrl: string;
        iosUrl: string;
        lastChecked: string;
    }>;
    createVersion(versionData: any): Promise<import("../entities").Version>;
}
