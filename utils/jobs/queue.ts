import { Job, Event } from "./job";

const EVENT_COLLECTION = "events";
const EVENT_COLLECTION_SEQ = "events_seq";

export class EventQueue {
  private queue : Array<Job>;
  private db;
  private collection;
  private collection_seq;
  constructor(database) {
    this.queue = [];
    this.db = database;
    this.collection = EVENT_COLLECTION;
    this.collection_seq = EVENT_COLLECTION_SEQ;
  }
  add = (event : Event, args = {}) => {
    let _this = this;
    let additional = args;
    return this.getEventSeq((seq)=>{
      let _insert = false;
      if(event.event_id === undefined || typeof  event.event_id !== "number"){
        event.event_id = seq.next_id;
        _insert = true;
      }
      return _this.db.collection(this.collection)
        .updateOne({event_id: event.event_id}, {$set: event}, {upsert: _insert})
        .then((_) => {
          return _this.setEventSeq(_insert)
        })
    })
  }

  remove = (event: Event| number) => {
    let event_id = -1;
    if(typeof event ==="number") event_id = event;
    //@ts-ignore
    else if( event.hasOwnProperty('event_id')) event_id = event.event_id;
    else return Promise.reject(`Event ${event} is not valid`);
    return this.db.collection(this.collection)
      .deleteOne({event_id : event_id})
}
  getEventSeq = (callback) => {
    let _this = this;
    return this.db.collection(this.collection_seq)
      .findOne({})
      .then(res => {
        const doc = {next_id : 0}
        if (res) {
          if (callback)callback(res);
        }
        else _this.db.collection(this.collection_seq).insertOne(doc)
          .then(_ => { if (callback) callback(doc);})
          .catch( _ => {if (callback) callback(null)})
      }).catch(_ => {if (callback) callback(null)});
  }
  setEventSeq = (set : boolean = true) => {

    return this.db.collection(this.collection_seq)
      .updateOne({}, {$inc : {next_id: set?1 : 0}})
  }
}