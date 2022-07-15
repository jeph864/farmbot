import { Job } from "./job";
export declare class JobQueue {
    private queue;
    constructor();
    add: (job: Job) => void;
    remove: (job: Job) => void;
}
