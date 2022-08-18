import { Job } from "./job";
import { Position, Watering } from "./interfaces";
import { Farmbot } from "farmbot";
export declare const WATERING_COLLECTION = "watering_jobs";
export declare class WateringJob extends Job {
    private pin_number;
    private water_factor;
    constructor(bot: Farmbot, config?: any);
    private getDefaultParams;
    calculateSteps: (job: any) => Promise<any>;
    initParams: (input: Watering) => Watering;
    runStep: (dest: any, amount?: number) => Promise<void | import("farmbot").RpcOk | import("farmbot").RpcError>;
    doWatering: (dest: Position, amount?: number, speed?: number) => Promise<void | import("farmbot").RpcOk | import("farmbot").RpcError>;
    afterUpdate: (_: any, callback: any, data?: null, update?: boolean) => void;
    getTime: (amount: number) => number;
    updateJob: (jobParams: any, callback: any) => Promise<void | undefined>;
}
