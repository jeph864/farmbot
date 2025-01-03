export declare enum EventStatus {
    Running = 0,
    NotRunning = 1,
    Delayed = 2,
    Scheduled = 3,
    Failed = 4
}
export declare type EventDate = Date | "now";
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
export declare type EventTime = Date | "now" | "never";
export interface JobParams {
    name: string;
    id: number;
    status: {
        running: boolean;
    };
    from_seeding?: boolean;
    nextRunAt?: any;
    scheduled?: false;
    lastStarted: EventTime;
    lastFinished: EventTime;
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
        active: boolean;
    };
    stage: Stage;
}
export interface Watering extends JobParams {
    name: string;
    seeding_id: number;
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
    interval: number;
}
export interface JobStep {
}
export interface Event {
    name?: string;
    event_id?: number;
    job_id?: number;
    type: string;
    status?: EventStatus;
    time: EventDate;
    additional_args?: any;
}
export interface Plant {
    plant_type: string;
    x_coord: number;
    y_coord: number;
}
export declare type Stage = "Not Planted" | "Planted" | "Watered";
export interface Vec2 {
    x: number;
    y: number;
}
declare type BotLocation = Position;
declare type Busy = "idle" | "busy" | "init";
interface Running {
    name: string;
    type: string;
    progress: number;
    job_id: number;
}
export interface AppStatus {
    location: BotLocation;
    busy: Busy;
    running: Running;
}
export {};
