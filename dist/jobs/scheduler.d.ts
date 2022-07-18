/// <reference types="node" />
import * as events from "events";
import { Agenda } from "agenda";
export declare class FMEventEmitter extends events.EventEmitter {
}
export declare class Scheduler {
    private agenda;
    private client;
    constructor(client: any);
    start: () => Promise<unknown>;
    getAgenda: () => Agenda;
    define: (jobname: any, [options]: [any], handler: any) => void;
}
