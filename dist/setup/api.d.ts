import { Farmbot } from "farmbot";
import { SeedingJob } from "../jobs/seeding";
import { WateringJob } from "../jobs/watering";
import { EventQueue } from "../jobs/queue";
import { Slots } from "./dynamic_slots";
export declare let status_message: any;
export declare let seeding_jobs: SeedingJob;
export declare let watering_jobs: WateringJob;
export declare let event_queue: EventQueue;
export declare let slots_container: Slots;
export declare const FAKE_USER = 0;
export declare const REAL_USER = 1;
export declare let bot: Farmbot;
declare type UserArgs = {
    device_id?: "" | string;
    api_token?: "" | string;
    api_user_id?: "" | string;
    role?: "fake" | "real";
};
export interface ApiData {
}
export interface SetupArgs {
    port: number;
    username: string;
    fallback_user: number;
}
export declare class Users {
    private readonly db;
    constructor();
    createClientUser: (username: string, password: string, args: UserArgs) => Promise<import("mongodb").ModifyResult<import("bson").Document>>;
    getClientUser: (username: string) => Promise<import("mongodb").WithId<import("bson").Document> | null>;
    saveApiDate: (username: string, data: any) => Promise<import("mongodb").UpdateResult>;
    getApiData: (username: string) => Promise<import("mongodb").WithId<import("bson").Document> | null>;
}
export declare const Api: {
    connect: (token: string) => Promise<unknown>;
    getBot: () => Farmbot;
    token: (email: string, password: string) => import("axios").AxiosPromise<any>;
};
export declare const DBSetup: {
    seq_collection: string;
    connect: () => Promise<void>;
    getDatabase: () => any;
    getSeq: (callback: any) => any;
    setSeq: (set?: boolean) => any;
};
export declare function setup(args: SetupArgs): Promise<void>;
export {};
