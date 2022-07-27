import { CSInteger, Farmbot, RpcError, RpcOk } from "farmbot";
import { Db } from "mongodb";
import { WorkingArea, Position, JobParams, JobStep, Plant } from "./interfaces";
export declare abstract class Job {
    protected readonly bot: Farmbot;
    protected config: any;
    protected db: Db;
    protected collection: any;
    protected readonly delayed_jobs: any;
    protected collection_seq: any;
    private plants;
    protected safe_height: number;
    protected ground_level: number;
    private readonly max_depth;
    private readonly zlock;
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
    getAbsolutePlantPosition(pos: Position): Position;
    executeJob: (job_id: any, callback: any) => Promise<any>;
    updateLastRun: (job_id: any, date: any) => Promise<import("mongodb").UpdateResult>;
    createJob: (jobParams: JobParams, callback: any) => void;
    updateJob: (jobParams: JobParams, callback: any, args?: {
        update_after: boolean;
    }) => void;
    abstract afterUpdate(jobParams: JobParams, callback: any, data: any, update: any): any;
    getJobSeq: (callback: any) => Promise<void>;
    setJobSeq: (set?: boolean) => Promise<import("mongodb").UpdateResult>;
    addToQueue: (job_id: any, callback: any) => Promise<void>;
    removeFromQueue: (job_id: number) => Promise<string>;
    writePin: (value?: number, pin_id?: number, mode?: number) => Promise<RpcOk | RpcError>;
    move: (dest: Position, speed: CSInteger) => Promise<RpcOk | RpcError>;
    markAs: (args: any, body: any) => Promise<RpcOk | RpcError>;
    executeAllSteps: (items: any) => Promise<(RpcOk | RpcError)[]>;
    convertMl: (duration: number) => number;
    write: (pin_number: any, value: any, pin_mode?: number) => Promise<RpcOk | RpcError>;
    getJob: (job_id: any) => Promise<import("mongodb").WithId<import("bson").Document> | null>;
    getAllJobs: (filter: {}, callback: any) => Promise<any>;
    getAll: (filter?: any) => Promise<import("mongodb").WithId<import("bson").Document>[]>;
    delay: (t: any) => Promise<unknown>;
    getStatus: () => void;
    deleteJob: () => void;
    lock: () => void;
    unlock: () => void;
    getDelayedJobs: (callback: any) => void;
    updatePlant: (plant: Plant) => Promise<import("mongodb").UpdateResult>;
}
