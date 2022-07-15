import { Job, Position, Seeding, JobStep } from "./job";
import { CSInteger, Farmbot, RpcError, RpcOk } from "farmbot";
export interface SeedingStep extends JobStep {
    tray_pos: Position;
    dest: Position;
    speed: CSInteger;
}
export declare class SeedingJob extends Job {
    private tray_pos;
    constructor(bot: Farmbot, config?: any);
    private default_params;
    initParams: (inputJob: Seeding) => Seeding;
    runStep: (dest: any) => Promise<RpcOk | RpcError>;
    private plantSeed;
}
