import { PlantStage } from "farmbot";

export enum EventStatus {
  Running,
  NotRunning,
  Delayed,
  Scheduled,
  Failed
}
export type EventDate = Date| "now";
export interface Position{
  x: number;
  y: number;
  z: number;
}

export interface  WorkingArea {
  beg_pos : Position;
  end_pos: Position;
  length : number;
  width: number
}
export interface DelayedJob{
  id:number;
  type: string;
  q_pos: number;
}

export type EventTime = Date|"now"| "never"


export interface JobParams {
  name: string;
  id: number;
  status: { running: boolean};
  from_seeding?:boolean,
  nextRunAt?:any
  scheduled?:false
  lastStarted: EventTime;
  lastFinished: EventTime

}
export  interface Seeding extends JobParams{
  name: string;
  id: number;
  depth: number;
  min_dist: number;
  plant_type: string;
  working_area: WorkingArea;
  status: { running: boolean, active: boolean};
  stage: Stage
}
export interface Watering  extends  JobParams{
  name: string;
  seeding_id: number;
  amount: number;
  id: number
  min_dist: number
  depth: number;
  height: number;
  working_area: WorkingArea;
  status: { running: boolean};
  next: Date,
  interval: number

}
export interface JobStep{

}

export interface Event{
  name:string;
  event_id?: number;
  job_id?: number;
  type:string;
  status?:EventStatus;
  time: EventDate;
  additional_args?: any
}


export interface Plant {
  location : Position;
  name: string;
  stage: PlantStage;
  id: number;
}
export type Stage = "Not Planted"| "Planted"| "Watered"