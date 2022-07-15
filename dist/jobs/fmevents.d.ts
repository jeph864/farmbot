/// <reference types="node" />
import * as events from "events";
export declare class FMEventEmitter extends events.EventEmitter {
}
export declare class RadishAgenda {
    private agenda;
    private client;
    constructor(client: any);
    start: () => Promise<unknown>;
    define: (jobname: any, [options]: [any], handler: any) => void;
}
