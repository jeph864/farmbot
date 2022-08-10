//import { EventDate, EventStatus } from "../../dist/jobs/interfaces";
import { Farmbot } from "farmbot";
import { WateringJob } from "../jobs/watering";
import { SEEDING_COLLECTION } from "../jobs/seeding";
import { Db } from "mongodb";
import { Plant } from "../jobs/interfaces";

class Resource {

}

class PlantGroup extends  Resource{


}

export class PlantCoordinates {
  private db: Db;
  private collection;
  constructor( db) {
    this.db = db;
    this.collection = "plants_coordinates" ;
  }
  save = (location : Plant) => {
    return this.db.collection(this.collection)
      .insertOne(location)
  }
  getALL = () => {
    return this.db.collection(this.collection)
      .find()
      .toArray()
  }
}

