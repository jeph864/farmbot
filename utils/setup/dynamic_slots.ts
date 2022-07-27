
import { DBSetup } from "./api";
import { Db } from "mongodb";
import { Position } from "../jobs/interfaces";

const SLOT_COLLECTION = "slots"
export interface  SlotModel{
  id: number;
  type: string;
  location: Position;
  bay:number;
}

export class Slots {
  private db: Db;
  private readonly zero_locations: Array<Position>;
  private  readonly collection;
  constructor() {
    this.db = DBSetup.getDatabase();
    this.collection = SLOT_COLLECTION;
    this.zero_locations = [ { x: 60, y:243, z:-357},  { x: 60, y:860, z:-357}];
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
  updateAllSlots = (slots)=>{
    return this.db.collection(this.collection)
      .updateMany({}, {$set: {slots: slots}}, {upsert: true})
      .then(_ => {
        return Promise.resolve(slots)
      }).catch(e => Promise.reject(e))
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
        if(res.length > 0) return Promise.resolve(res as unknown)
        else return this.insertInitSlots();
      })
  }
}
export const  slots = new Slots();
