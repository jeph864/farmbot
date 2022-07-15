import { Job, JobStep, Position, Seeding, Watering } from "./job";
import { Farmbot } from "farmbot";

const WATERING_COLLECTION = "watering_jobs";
const WATERING_COLLECTION_SEQ = "watering_jobs_seq";

export class WateringJob extends Job {
  private pin : number;

  constructor(bot: Farmbot, config:any = {}) {
    super(bot, config);
    this.collection = WATERING_COLLECTION;
    this.collection_seq = WATERING_COLLECTION_SEQ
    this.pin = 0
    config.pin_id = 30536;
  }

  private default_params : Watering = {
    name: "Job 0",
    id: 0,
    depth : 0,
    min_dist : 0,
    amount: 0,
    height: 0,
    working_area :  {
      beg_pos: { x: 0, y: 0, z: 0},
      end_pos : {x: 0, y: 0, z: 0},
      length : 0,
      width : 0
    },
    status: {running: false},
    next: ( d => new Date(d.setDate(d.getDate()-1)) )(new Date) //initialize with an expired date unless the user updates the date
  }
  // @ts-ignore
  initParams = (input: Watering) => {
    input.working_area.length = input.working_area.end_pos.x - input.working_area.beg_pos.x;
    input.working_area.width = input.working_area.end_pos.y - input.working_area.beg_pos.y;
    input.working_area.beg_pos = Object.assign(this.df_position, input.working_area.beg_pos);
    input.working_area.end_pos = Object.assign(this.df_position, input.working_area.end_pos);
    return Object.assign(this.default_params, input);
  }
  runStep = (dest) =>{
    return this.doWatering(dest, 100)
  }
   doWatering = (dest: Position, speed:number = 100) => {
    let _this = this;
    return this.bot.moveAbsolute({x:dest.x, y:dest.y,z:dest.z, speed:speed})
      .then (function(_){
        return _this.writePin(1, _this.config.pin_id)
      }).then(function(_){
        return _this.delay(5000);
      }).then(function(_){
        return  _this.writePin(0);
      })
  };
}