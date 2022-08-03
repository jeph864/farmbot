import { Job } from "./job";
import { Position, Watering } from "./interfaces";
import { Farmbot } from "farmbot";
export declare const WATERING_COLLECTION = "watering_jobs";
export declare class WateringJob extends Job {
    private pin_number;
    constructor(bot: Farmbot, config?: any);
    private getDefaultParams;
    calculateSteps: (job: any) => Promise<any>;
    initParams: (input: Watering) => Watering;
    runStep: (dest: any) => Promise<void | import("farmbot").RpcOk | import("farmbot").RpcError>;
    doWatering: (dest: Position, speed?: number) => Promise<void | import("farmbot").RpcOk | import("farmbot").RpcError>;
    afterUpdate: (_: any, callback: any, data?: null, update?: boolean) => void;
    updateJob: (jobParams: any, callback: any) => Promise<void | undefined>;
}
