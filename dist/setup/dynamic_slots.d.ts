import { Position } from "../jobs/interfaces";
export interface SlotModel {
    id: number;
    type: string;
    location: Position;
    bay: number;
}
export declare class Slots {
    private db;
    private readonly bot;
    private readonly zero_locations;
    private readonly collection;
    private safe_dist_to_bay;
    constructor();
    init: () => SlotModel[];
    update: (slot: any) => Promise<import("mongodb").UpdateResult>;
    updateManySlots: (slots: any) => Promise<any[]>;
    insertInitSlots: () => Promise<SlotModel[]>;
    findSlots: () => Promise<unknown[]>;
    retire: () => void;
    pick: () => void;
    getLatestSlot: () => void;
    move: (slot_pos: Position, speed?: number) => Promise<import("farmbot").RpcOk | import("farmbot").RpcError>;
}
export declare const slots: Slots;
