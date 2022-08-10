/// <reference types="node" />
import { Event } from "./interfaces";
import { EventEmitter } from "events";
export declare class EventQueue {
    private queue;
    private db;
    private collection;
    private collection_seq;
    private readonly seeding;
    private readonly watering;
    private readonly event_emitter;
    static busy: boolean;
    private interval;
    constructor(bot: any);
    add: (event: Event, args?: {
        single_event: boolean;
    }) => any;
    remove: (event: Event | number) => any;
    getEventSeq: (callback: any) => any;
    setEventSeq: (set?: boolean) => any;
    runReadyEvents: () => any;
    runSingleEvent: (event: Event) => any;
    runQueue: (events: any) => Promise<void>;
    runNext: (events: any) => any;
    collectEvents: (reschedule?: boolean) => void;
    getScheduledEvents: () => any;
    process: () => any;
    getEventEmitter: () => EventEmitter;
    changeBuyStatus: (status: boolean) => void;
    getActiveEvent: () => any;
    cleanEvents: () => any;
}
