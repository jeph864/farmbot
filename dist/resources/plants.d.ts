import { Plant } from "../jobs/interfaces";
export declare class PlantCoordinates {
    private db;
    private collection;
    constructor(db: any);
    save: (location: Plant) => Promise<import("mongodb").InsertOneResult<import("bson").Document>>;
    getALL: () => Promise<import("mongodb").WithId<import("bson").Document>[]>;
}
