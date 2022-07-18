import { Job, Position, Watering } from "./job";
import { Farmbot } from "farmbot";
export declare class WateringJob extends Job {
    private pin;
    constructor(bot: Farmbot, config?: any);
    private getDefaultParams;
    initParams: (input: Watering) => Watering;
    runStep: (dest: any) => Promise<import("farmbot").RpcOk | import("farmbot").RpcError>;
    doWatering: (dest: Position, speed?: number) => Promise<import("farmbot").RpcOk | import("farmbot").RpcError>;
    afterUpdate: (_: any, callback: any, data?: null) => void;
    updateJob: (jobParams: any, callback: any) => void;
}
