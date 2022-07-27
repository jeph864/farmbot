import { Db } from "mongodb";
import { Position } from "../jobs/interfaces";
interface SModel {
}
export interface SlotModel extends SModel {
    id: number;
    type: string;
    location: Position;
    bay: number;
    free?: boolean;
}
export declare class Slots {
    private db;
    private readonly bot;
    private readonly zero_locations;
    private readonly collection;
    private safe_dist_to_bay;
    private safe_height;
    constructor(database: Db);
    init: () => SlotModel[];
    update: (slot: any) => Promise<import("mongodb").UpdateResult>;
    updateManySlots: (slots: any) => Promise<any[]>;
    insertInitSlots: () => Promise<SlotModel[]>;
    findSlots: () => Promise<unknown[]>;
    retire: (job_type: string, slot_id?: number) => Promise<unknown>;
    pick: (job_type: string, slot_id?: number) => Promise<unknown>;
    getLatestSlot: () => Promise<number>;
    releaseStep: (slot_pos: Position, speed?: number) => Promise<import("farmbot").RpcOk | import("farmbot").RpcError>;
    releaseSlot: (slot: SlotModel) => Promise<import("mongodb").UpdateResult>;
    pickSlot: (slot: SlotModel) => Promise<import("mongodb").UpdateResult>;
    pickupStep: (slot_pos: Position, speed?: number) => Promise<import("farmbot").RpcOk | import("farmbot").RpcError>;
    getRightSlot: (job_type: string) => Promise<unknown>;
}
export {};
