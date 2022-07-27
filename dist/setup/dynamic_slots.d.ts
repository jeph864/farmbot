import { Position } from "../jobs/interfaces";
export interface SlotModel {
    id: number;
    type: string;
    location: Position;
    bay: number;
}
export declare class Slots {
    private db;
    private readonly zero_locations;
    private readonly collection;
    constructor();
    init: () => SlotModel[];
    update: (slot: any) => Promise<import("mongodb").UpdateResult>;
    updateManySlots: (slots: any) => Promise<any[]>;
    insertInitSlots: () => Promise<SlotModel[]>;
    findSlots: () => Promise<unknown[]>;
    retire: () => void;
    pick: () => void;
    getLatestSlot: () => void;
}
export declare const slots: Slots;
