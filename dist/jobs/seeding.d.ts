import { Job } from "./job";
import { Position, Seeding, JobStep } from "./interfaces";
import { CSInteger, Farmbot } from "farmbot";
export interface SeedingStep extends JobStep {
    tray_pos: Position;
    dest: Position;
    speed: CSInteger;
}
export declare const SEEDING_COLLECTION = "seeding_jobs";
export declare class SeedingJob extends Job {
    private tray_pos;
    private watering_job;
    private pin_number;
    private plant_coordinates;
    constructor(bot: Farmbot, config?: any);
    private getDefaultParams;
    initParams: (inputJob: Seeding) => Seeding;
    runStep: (dest: any, no_amount?: number, plant_type?: string) => Promise<void>;
    plantSeed: (bay_pos: Position, dest: Position, speed?: number, plant_type?: string) => Promise<void>;
    afterUpdate: (jobParams: any, callback: any, update?: boolean) => void;
    getPlantCoordinates: () => Promise<import("mongodb").WithId<import("bson").Document>[]>;
}
