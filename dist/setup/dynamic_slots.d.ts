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
    updateAllSlots: (slots: any) => Promise<any>;
    insertInitSlots: () => Promise<SlotModel[]>;
    findSlots: () => Promise<unknown>;
}
export declare const slots: Slots;
