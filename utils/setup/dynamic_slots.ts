
import { DBSetup } from "./api";
import {Api} from "./api";
import { Db } from "mongodb";
import { Position } from "../jobs/interfaces";
import { Farmbot } from "farmbot";

const SLOT_COLLECTION = "slots"
export interface  SlotModel{
  id: number;
  type: string;
  location: Position;
  bay:number;
}

export class Slots {
  private db: Db;
  private readonly  bot: Farmbot
  private readonly zero_locations: Array<Position>;
  private  readonly collection;
  private  safe_dist_to_bay : number;
  constructor() {
    this.db = DBSetup.getDatabase();
    this.bot = Api.getBot();
    this.collection = SLOT_COLLECTION;
    this.zero_locations = [ { x: 60, y:243, z:-357},  { x: 60, y:860, z:-357}];
    this.safe_dist_to_bay = 169;
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
      if(item.id == 0){
        item.type = "seeding";
      }
      if(item.id == 1){
        item.type = "watering";
      }
      return item ;
    })
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
  retire = () => {}
  pick =() => {
  }
  getLatestSlot = () => {
  }
  move  = (slot_pos: Position, speed = 100) => {
    const dest = {...slot_pos}
    return this.bot.moveAbsolute({x: dest.x-this.safe_dist_to_bay, y: dest.y, z:dest.z, speed : speed})
  }
}
export const  slots = new Slots();
