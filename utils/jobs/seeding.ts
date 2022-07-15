import { Job, Position, Seeding, WorkingArea, JobStep}  from "./job";
import { CSInteger, Farmbot, RpcError, RpcOk } from "farmbot";

export interface SeedingStep extends  JobStep{
  tray_pos: Position;
  dest: Position;
  speed: CSInteger
}
const SEEDING_COLLECTION = "seeding_jobs";
const SEEDING_COLLECTION_SEQ = "seeding_jobs_seq";

export class SeedingJob extends  Job{
  private tray_pos: Position;
  constructor(bot: Farmbot, config:any = {}) {
    super(bot, config);
    this.collection = SEEDING_COLLECTION;
    this.tray_pos = {x:10, y:10, z:0}
    this.collection_seq = SEEDING_COLLECTION_SEQ;
    this.config.pin_id = 30538;
  }


  private default_params : Seeding = {
    name: "Job 0",
    id: 0,
    depth : 0,
    min_dist : 0,
    plant_type: "radish",
    working_area :  this.df_working_area,
    status: {running: false}
  }
  // @ts-ignore
  initParams = (inputJob : Seeding) =>{
    inputJob.working_area.length = inputJob.working_area.end_pos.x - inputJob.working_area.beg_pos.x;
    inputJob.working_area.width = inputJob.working_area.end_pos.y - inputJob.working_area.beg_pos.y;
    inputJob.working_area.beg_pos = Object.assign(this.df_position, inputJob.working_area.beg_pos);
    inputJob.working_area.end_pos = Object.assign(this.df_position, inputJob.working_area.end_pos);
    return Object.assign(this.default_params, inputJob);
  }
  runStep = (dest ) => {
    return this.plantSeed(this.tray_pos, dest, 100);
  };

  private plantSeed = (bay_pos: Position, dest: Position, speed:number = 100) => {
    let _this = this;
    return this.bot.moveAbsolute({ x: bay_pos.x, y: bay_pos.y, z: bay_pos.z, speed: speed })
      .then (function(_){
        console.log("Moved successfully to bay position");
        return _this.writePin(1)
      }).then(function(_){
        console.log("Wrote to pin: 1");
        return _this.bot.moveAbsolute({x:dest.x, y:dest.y,z:dest.z, speed:speed})
      }).then(function(_){
        console.log("Moved successfully to plant position ");
        return  _this.writePin(0);
      }).then(function(_){
        console.log("Wrote to pin: 0");
        return _this.bot.moveAbsolute({x:dest.x, y:dest.y,z:dest.z, speed:speed});
      })
  };
}