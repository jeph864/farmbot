
import {Api} from "./api";
import { Db } from "mongodb";
import { Position } from "../jobs/interfaces";
import { Farmbot } from "farmbot";

const SLOT_COLLECTION = "slots"
interface SModel{

}
export interface  SlotModel extends SModel{
  id: number;
  type: string;
  location: Position;
  bay:number;
  free?: boolean
}

interface SlotExtraModel extends SModel{
  extra: {
    latestSlot: number
  }
}

export class Slots {
  private db: Db;
  private readonly  bot: Farmbot
  private readonly zero_locations: Array<Position>;
  private  readonly collection;
  private  safe_dist_to_bay : number;
  private safe_height: number
  constructor(database: Db) {
    this.db = database
    this.bot = Api.getBot();
    this.collection = SLOT_COLLECTION;
    this.zero_locations = [ { x: 60, y:243, z:-237},  { x: 60, y:883, z:-237}];
    this.safe_dist_to_bay = 109;
    this.safe_height = 50;
  }
  init = () => {
    const slots :Array<SlotModel> = [];
    for(let  i = 0; i<6; i++){
      const bay = Math.floor(i/3);
      const slot_pos : Position = {
        x: this.zero_locations[bay].x,
        z: this.zero_locations[bay].z,
        y: this.zero_locations[bay].y + ((i%3) * 100)
      }
      const slot : SlotModel = {
        id: i,
        type: "",
        location: slot_pos,
        bay: bay
      }
      slots.push(slot);
    }
    slots.map((item, _)=> {
      if(item.id == 3){
        item.type = "seeding";
      }
      if(item.id == 4){
        item.type = "watering";
      }
      return item ;
    });
    return slots;
  };

  update = (slot) => {
    return this.db.collection(this.collection)
      .updateOne({id: slot.id}, {$set: slot}, {upsert: true})
}
  updateManySlots = (slots)=>{
    const insert  =  (s) => {
      return Promise.all(s.map((slot) => {
        return this.db.collection(this.collection)
          .updateOne({id: slot.id}, {$set: slot})
      }))
    }
    slots = slots.filter((slot) => {
      return typeof slot !== "undefined" || slot!.type !== ""
    })
    return insert(slots)
}
insertInitSlots = () => {
    const slots: Array<SlotModel> = this.init();
    const extra : Array<SModel> = slots;
    const init_extra: SlotExtraModel = {
      extra: {
        latestSlot: -1
      }
    }
    extra.push(init_extra)
    return this.db.collection(this.collection)
      .insertMany(slots)
      .then(_ => {
        return Promise.resolve(slots)
      })
}
  findSlots = () => {
    return this.db.collection(this.collection)
      .find()
      .toArray()
      .then(res => {
        if(res.length > 0) return Promise.resolve(res as Array<unknown>)
        else return this.insertInitSlots();
      })
  };
  retire = (job_type: string, slot_id = -1) => {
    let _this = this;
    let filter;
    if(slot_id !== -1){
      filter = {id: slot_id}
    }
    else filter = {type: job_type}
    return this.db.collection(this.collection)
      .find(filter)
      .toArray()
      .then(results => {
        if(results.length < 0) return Promise.reject("No Slot with the given job type/ slot ID")
        //@ts-ignore
        const slot: SlotModel = results[0];
        if (slot.id == slot_id && job_type == slot.type) return Promise.resolve(results as unknown)
        console.log("found the slot")
        console.log(slot)
        return _this.releaseSlot(slot);
      })
  }
  pick =(job_type: string, slot_id = -1) => {
    let _this = this;
    let filter = {type: job_type}
    return this.db.collection(this.collection)
      .find(filter)
      .toArray()
      .then(results => {
        if(results.length < 0) return Promise.reject("No Slot with the given job type")
        //@ts-ignore
        const slot: SlotModel = results[0];
        if (slot.id == slot_id) return Promise.resolve(results as unknown)
        return _this.pickSlot(slot);
      })
  }
  getLatestSlot = () => {
    return this.db.collection(this.collection)
      .findOne({extra: {$exists : true}})
      .then(res => {
        const slot: number = res!.extra.latestSlot as number;
         return Promise.resolve(slot)
      })
  }
  releaseStep  = (slot_pos: Position, speed = 100) => {
    const dest = {...slot_pos}
    return this.bot.moveAbsolute({x: dest.x+this.safe_dist_to_bay, y: dest.y, z:dest.z, speed : speed})
      .then(_ => {
        return this.bot.moveAbsolute({x: dest.x, y: dest.y, z:dest.z, speed : speed})
      }).then(_ => {
        return this.bot.moveAbsolute({x: dest.x, y: dest.y, z:dest.z + this.safe_height, speed : speed})
      })
  }
  releaseSlot = (slot: SlotModel) => {
    let _this = this;
    slot.free = false;
    console.log("releasing the slot")
    return this.releaseStep(slot.location)
      .then(_ => {
        return _this.db.collection(_this.collection)
          .updateOne({id: slot.id}, {$set: slot}, {upsert: false})
      }).then( _ => {
        return _this.db.collection(_this.collection)
          .updateOne({extra: {$exists: true}}, {$set: {"extra.latestSlot": -1}})
      })
  }
  pickSlot = (slot:SlotModel) => {
    let _this = this;
    slot.free = true;
    return this.pickupStep(slot.location)
      .then(_ => {
        return _this.db.collection(_this.collection)
          .updateOne({id: slot.id}, {$set: slot}, {upsert: false})
      }).then(_ => {
        return _this.db.collection(this.collection)
          .updateOne({ extra: { $exists: true } }, {$set: { "extra.latestSlot": slot.id }})
      })
  }
  pickupStep =(slot_pos: Position, speed= 100) => {
    const dest = {...slot_pos};
    return this.bot.moveAbsolute({x: dest.x, y: dest.y, z:dest.z + this.safe_height, speed : speed})
      .then(_ => {
        return this.bot.moveAbsolute({x: dest.x, y: dest.y, z:dest.z, speed : speed})
      }).then(_ => {
        return this.bot.moveAbsolute({x: dest.x+this.safe_dist_to_bay, y: dest.y, z:dest.z, speed : speed})
      })
  }

  getRightSlot = (job_type: string) => {
    let _this = this;
    return this.getLatestSlot()
      .then(slot => {
        if(slot == -1){
          return _this.pick(job_type)
        }else{
          return _this.retire(job_type, slot)
            .then(_ => {
              return _this.pick(job_type, slot);
            })
        }
      })
  }
}

