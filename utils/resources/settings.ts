
import * as dbConnect from "../../utils/conn";
import {Position} from "../jobs/interfaces";

class Settings {
  private config;
  private api ;
  private db;
  private api_collection;
  private current_sess_user;
  private settings_collection;
  constructor(api, user) {
    this.api = api;
    this.db = dbConnect.getDatabase();
    this.api_collection = "apiData";
    this.current_sess_user = user;

  }

  initial_params = {
    device_id: 0,
    tray_pos: {x:900, y:725, z: -464},
    safe_height: 30,
    ground_level: -486,
    watering: {
      pin_number: 8,
      pin_id: 30536
    },
    seeding: {
      pin_number: 9,
      pin_id: 30538
    }
  }
  getInitialSettings = () =>{
    return this.initial_params;
}
  getDevice = () =>{
    this.db.collection(this.api_collection)
      .findOne({username: this.current_sess_user})
      .then((res) => {
        return res
      })
}
saveSettings = (settings) => {

    return this.db.collection(this.settings_collection).
      updateOne({id: 0}, {$set: settings}, {upsert: true})
}
getSettings = () => {
   return  this.db.collection(this.settings_collection)
      .findOne()
}

}

export let  config = new Settings(null,  0);
