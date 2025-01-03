import { Job }  from "./job";
import  {Position, Seeding, WorkingArea, JobStep, Stage, Plant} from "./interfaces";
import { CSInteger, Farmbot, RpcError, RpcOk } from "farmbot";
import { WateringJob } from "./watering";
import { EventQueue } from "./queue";
import { PlantCoordinates } from "../resources/plants";

export interface SeedingStep extends  JobStep{
  tray_pos: Position;
  dest: Position;
  speed: CSInteger
}
export const SEEDING_COLLECTION = "seeding_jobs";
const SEEDING_COLLECTION_SEQ = "seeding_jobs_seq";

export class SeedingJob extends  Job{
  private tray_pos: Position;
  private watering_job : WateringJob;
  private pin_number;
  private plant_coordinates: PlantCoordinates;
  constructor(bot: Farmbot, config:any = {}) {
    super(bot, config);
    this.collection = SEEDING_COLLECTION;
    this.tray_pos = {x:990, y:725, z: -310}
    this.collection_seq = SEEDING_COLLECTION_SEQ;
    this.config.pin_id = 30538;
    this.watering_job = new WateringJob(bot);
    this.pin_number = 9;
    this.type_name = "seeding"
    this.plant_coordinates = new PlantCoordinates(this.db)

  }


  private getDefaultParams  = () => {
    const df: Seeding =  {
      name: "Job 0",
      id: -1,
      depth : 0,
      min_dist : 0,
      plant_type: "radish",
      working_area :  {
        beg_pos: {x: 0, y: 0, z:0},
        end_pos: {x: 0, y: 0, z:0},
        length: 0,
        width: 0
      },
      status: {running: false, active: false},
      nextRunAt: "yesterday",
      lastFinished: "never",
      lastStarted: "never",
      stage: "Not Planted",
      scheduled: false
    }
    return df;
  }
  // @ts-ignore
  initParams = (inputJob : Seeding) =>{
    let pos = {
      x1: inputJob.working_area.beg_pos.x,
      y1: inputJob.working_area.beg_pos.y,
      x2: inputJob.working_area.end_pos.x,
      y2: inputJob.working_area.end_pos.y
    }
    let length: number, width: number;
    length = pos.x2- pos.x1, width = pos.y2-pos.y1;
    inputJob.working_area.beg_pos = Object.assign({x:0 ,y:0,z: 0}, inputJob.working_area.beg_pos);
    inputJob.working_area.end_pos = Object.assign({x: 0, y: 0, z: 0}, inputJob.working_area.end_pos);
    inputJob.working_area.width = width, inputJob.working_area.length = length ;
    return Object.assign(this.getDefaultParams(), inputJob);
  }
  runStep = (dest , no_amount = 0, plant_type="") => {
    no_amount;
    return this.plantSeed(this.tray_pos, dest, 100, plant_type);
  };
 plantSeed = (bay_pos: Position, dest: Position, speed:number = 100, plant_type:string = "") => {
    let _this = this;
    let safety_position_z = this.ground_level+ this.safe_height;
   dest = this.getAbsolutePlantPosition(dest);
   return _this.bot.moveAbsolute({ x: bay_pos.x, y: bay_pos.y, z: safety_position_z, speed: speed })
     .then(function(_){
       return _this.bot.moveAbsolute({ x: bay_pos.x, y: bay_pos.y, z: bay_pos.z, speed: speed });
     })
      .then (function(_){
        console.log(`Moved successfully to tray position: x: ${bay_pos.x}, y: ${bay_pos.y} , z: ${bay_pos.z}`);
        return _this.bot.writePin({pin_mode : 0, pin_number:_this.pin_number, pin_value:1})
      }).then(function(_){
        console.log("Wrote to pin: 1");
        return _this.bot.moveAbsolute({ x: bay_pos.x, y: bay_pos.y, z: safety_position_z, speed: speed })
      })/*.then((_) =>{
        return _this.bot.moveAbsolute({x:bay_pos.x, y:bay_pos.y,z:bay_pos.z + _this.safe_height, speed:speed})
      })*/
      .then((_) =>{
      return _this.bot.moveAbsolute({x:dest.x, y:dest.y,z:safety_position_z, speed:speed})
      }).then((_) => {
        return _this.bot.moveAbsolute({x:dest.x, y:dest.y,z:dest.z, speed:speed})
      })
      .then(function(_){
        console.log("Moved successfully to plant position ");
        let p: Plant = {
          plant_type:plant_type,
          x_coord:dest.x,
          y_coord:dest.y
        }
        return _this.plant_coordinates.save(p)
      })
     .then(function(_){
       console.log("plant coordinates saved")
       return _this.bot.writePin({pin_mode : 0, pin_number:_this.pin_number, pin_value:0})
     })
     .then(function(_){
        console.log("Wrote to pin: 0");
        return _this.bot.moveAbsolute({x:dest.x, y:dest.y,z:safety_position_z, speed:speed});
      }).then((_) => {
        console.log({x:dest.x, y:dest.y,z:safety_position_z, speed:speed})
     }).catch((e) => {
       EventQueue.busy = false
       console.log(e)
     })
  };

  afterUpdate = (jobParams, callback, update = false) => {
    callback(null, "No update");
    jobParams; update;
    //if(!update) callback(null, "No update");
    /*this.watering_job.updateJob(jobParams, (e, r) =>{
      callback(e,r);
    })*/
  }
  getPlantCoordinates = () => {
    return this.plant_coordinates.getALL();
  };
}
