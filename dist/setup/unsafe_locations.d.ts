import { Vec2 } from "../jobs/interfaces";
import { Db } from "mongodb";
interface ULocationConfig {
    ground_level?: number;
    db: Db;
}
interface ULocation {
    id?: number;
    area: {
        beg_pos: Vec2;
        end_pos: Vec2;
    };
    height: number;
}
export declare class UnsafeLocation {
    private config;
    private readonly ground_level;
    private db;
    private readonly collection;
    private db_setup;
    private readonly seq_collection;
    constructor(config: ULocationConfig);
    save: (location: ULocation) => Promise<any>;
    get: (filter?: {}) => Promise<import("mongodb").WithId<import("bson").Document>[]>;
    getSeq: () => Promise<{
        next_id: number;
    }>;
    delete: (id: number) => Promise<import("mongodb").DeleteResult>;
    setSeq: (set?: boolean) => any;
}
export {};
