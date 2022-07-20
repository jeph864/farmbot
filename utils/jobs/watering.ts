import { Job,  } from "./job";
import {JobParams, JobStep, Position, Seeding, Watering} from "./interfaces";
import { Farmbot } from "farmbot";

export const WATERING_COLLECTION = "watering_jobs";
const WATERING_COLLECTION_SEQ = "watering_jobs_seq";

export class WateringJob extends Job {
  private pin_number : number;

  constructor(bot: Farmbot, config:any = {}) {
    super(bot, config);
    this.collection = WATERING_COLLECTION;
    this.collection_seq = WATERING_COLLECTION_SEQ
    this.pin_number = 8;
    config.pin_id = 30536;
  }

  private getDefaultParams  =  () => {
    const df :Watering = {
      name: "Job 0",
      id: 0,
      depth : 0,
      min_dist : 0,
      amount: 0,
      height: 0,
      seeding_id: -1,
      from_seeding: false,
      scheduled: false,
      working_area :  {
        beg_pos: { x: 0, y: 0, z: 0},
        end_pos : {x: 0, y: 0, z: 0},
        length : 0,
        width : 0
      },
      status: {running: false},
      next: ( d => new Date(d.setDate(d.getDate()-1)) )(new Date) //initialize with an expired date unless the user updates the date
    }
    return df;
  }
  // @ts-ignore
  initParams = (input: Watering) => {
    input.working_area.length = input.working_area.end_pos.x - input.working_area.beg_pos.x;
    input.working_area.width = input.working_area.end_pos.y - input.working_area.beg_pos.y;
    input.working_area.beg_pos = Object.assign({x:0 ,y:0,z: 0}, input.working_area.beg_pos);
    input.working_area.end_pos = Object.assign({x:0 ,y:0,z: 0}, input.working_area.end_pos);
    return Object.assign(this.getDefaultParams(), input);
  }
  runStep = (dest) =>{
    return this.doWatering(dest, 100)
  }
   doWatering = (dest: Position, speed:number = 100) => {
    let _this = this;
    return this.bot.moveAbsolute({x:dest.x, y:dest.y,z:dest.z, speed:speed})
      .then (function(_){
        return _this.bot.writePin({pin_mode : 0, pin_number:_this.pin_number, pin_value:1})
      }).then(function(_){
        return _this.delay(5000);
      }).then(function(_){
        return _this.bot.writePin({pin_mode : 0, pin_number:_this.pin_number, pin_value:0})
      })
  };
  afterUpdate = (_, callback, data = null, update = false) => {
    //if(!update) callback(data);
    update = update;
    callback(data)
  }
  updateJob = (jobParams, callback) => {
    const params = this.initParams(jobParams);
    const job = params;
    let _this = this;
    this.getJobSeq( (seq) => {
      let  _insert : boolean = false;
      let filter = {}
      if((job.id == -1 && typeof job.from_seeding == "boolean" && job.from_seeding ) || (job.id === -1 && !job.from_seeding) || typeof jobParams.id !== "number"){
        job.id = seq.next_id;
        _insert = true;
      }
      filter = {id: job.id};
      if (job.seeding_id !== -1){
        filter = {seeding_id: job.seeding_id};
        _insert = true;
      }
      _this.db.collection(this.collection)
        .findOne(filter)
        .then((results) => {
          if(results && results.seeding_id > -1){
            job.id = results.id;
            filter = {id: results.id}
          }else{

          }
          _this.db.collection(this.collection)
            .updateOne(filter, {$set: job}, {upsert: _insert})
            .then((_) => {
              _this.setJobSeq(_insert)
                .then(_ => {
                  //@ts-ignore
                  jobParams.seeding_id = job.id;
                  callback(null, job);
                })

            }).catch( e => callback(e, null))
        })

    })
  };
}