import { Position, Vec2 } from "../jobs/interfaces";
import { Db } from "mongodb";
import { DBSetup } from "./api";


interface ULocationConfig {
  ground_level?: number;
  db: Db;
}
interface ULocation {
  id?: number;
  area: {
    beg_pos : Vec2,
    end_pos: Vec2
  };
  height : number;
}

const COLLECTION = "unsafe_locations"
export class UnsafeLocation {
  private config;
  private readonly  ground_level;
  private db: Db;
  private readonly collection;
  private db_setup;
  private readonly seq_collection;
  constructor(config: ULocationConfig) {
    this.config = config;
    this.ground_level = config.ground_level
    this.db = config.db;
    this.collection = COLLECTION;
    this.db_setup = DBSetup;
    this.seq_collection = 'unsafe_seq';
  }
  save = (location : ULocation) => {
    let _this = this;
    let  _insert : boolean = false;
    return this.getSeq()
      .then(next => {
        let next_id = next.next_id;
        let filter = {}
        if(location.id === -1 || typeof location.id !== "number"){
          location.id = next_id;
          _insert = true;
        }

        location.id = next_id;
        return _this.db.collection(this.collection)
          .updateOne({id: next_id}, {$set: location}, {upsert: _insert})
      }).then( _ => {
        return _this.setSeq(_insert)
      })
  }
  get = (filter = {}) => {
    return this.db.collection(this.collection)
      .find(filter)
      .toArray()
  }
  getSeq =  () => {
    // @ts-ignore
    let collection_seq = this.seq_collection;
    return this.db.collection(collection_seq)
    .findOne({})
    .then(res => {
      const doc = {next_id : 0}
      if (res) {
        doc.next_id = res.next_id;
        return Promise.resolve(doc );
      }
      else return this.db.collection(collection_seq).insertOne(doc)
        .then(_ => {
          return Promise.resolve(doc)
        })
})

}
delete = (id: number) => {
    return this.db.collection(this.collection)
      .deleteOne({id: id})
}
setSeq =  (set = true) => {
  const db = DBSetup.getDatabase();
  // @ts-ignore
  let collection_seq = this.seq_collection;
  return db.collection(collection_seq)
    .updateOne({}, {$inc : {next_id: set?1 : 0}})
}
}
