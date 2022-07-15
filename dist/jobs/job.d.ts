import { CSInteger, Farmbot, RpcError, RpcOk } from "farmbot";
import { Db } from "mongodb";
export interface Position {
    x: number;
    y: number;
    z: number;
}
export interface WorkingArea {
    beg_pos: Position;
    end_pos: Position;
    length: number;
    width: number;
}
export interface DelayedJob {
    id: number;
    type: string;
    q_pos: number;
}
export interface JobParams {
    name: string;
    id: number;
    status: {
        running: boolean;
    };
}
export interface Seeding extends JobParams {
    name: string;
    id: number;
    depth: number;
    min_dist: number;
    plant_type: string;
    working_area: WorkingArea;
    status: {
        running: boolean;
    };
}
export interface Watering extends JobParams {
    name: string;
    amount: number;
    id: number;
    min_dist: number;
    depth: number;
    height: number;
    working_area: WorkingArea;
    status: {
        running: boolean;
    };
    next: Date;
}
export interface JobStep {
}
export declare abstract class Job {
    protected readonly bot: Farmbot;
    protected config: any;
    protected db: Db;
    protected collection: any;
    protected readonly delayed_jobs: any;
    protected collection_seq: any;
    protected constructor(bot: Farmbot, config?: {});
    getConfig: () => any;
    setConfig: () => void;
    getJobId: () => void;
    protected df_position: Position;
    protected df_working_area: WorkingArea;
    abstract initParams(jobParams: JobParams): JobParams;
    abstract runStep(args: JobStep): any;
    minPos: (pos1: Position, pos2: Position) => Position;
    maxPos: (pos1: Position, pos2: Position) => Position;
    calculateSteps: (job: any) => Position[];
    executeJob: (job_id: any, callback: any) => Promise<void>;
    createJob: (jobParams: JobParams, callback: any) => void;
    getJobSeq: (callback: any) => void;
    setJobSeq: () => void;
    addToQueue: (job_id: any, callback: any) => Promise<void>;
    removeFromQueue: (job_id: number) => Promise<import("bson").Document | import("mongodb").UpdateResult>;
    writePin: (value?: number, pin_id?: number, mode?: number) => Promise<RpcOk | RpcError>;
    move: (dest: Position, speed: CSInteger) => Promise<RpcOk | RpcError>;
    markAs: (args: any, body: any) => Promise<RpcOk | RpcError>;
    executeAllSteps: (items: any) => Promise<(RpcOk | RpcError)[]>;
    getAllJobs: (filter: {}, callback: any) => Promise<any>;
    getAll: (filter: {}) => Promise<import("mongodb").WithId<import("bson").Document>[]>;
    delay: (t: any) => Promise<unknown>;
    getStatus: () => void;
    deleteJob: () => void;
    updateJob: (jobParams: any) => Promise<import("mongodb").UpdateResult>;
    getJob: () => void;
    lock: () => void;
    unlock: () => void;
    getDelayedJobs: (callback: any) => void;
}
