import {  Job } from "./job";
import {Event, EventStatus} from "./interfaces";
import { SeedingJob , SEEDING_COLLECTION} from "./seeding";
import { WateringJob, WATERING_COLLECTION } from "./watering";
import { EventEmitter } from "events";
//import * as dbConnect from "../../utils/conn";
import { DBSetup } from "../setup/api";

const EVENT_COLLECTION = "events";
const EVENT_COLLECTION_SEQ = "events_seq";
const PLANTS_COLLECTION ="plant";

export class EventQueue {
  private queue : Array<Job>;
  private db;
  private collection;
  private collection_seq;
  private readonly seeding : SeedingJob;
  private readonly watering: WateringJob;
  private readonly event_emitter : EventEmitter ;
  static  busy = false;
  private interval :number;
  constructor(bot) {
    this.queue = [];
    this.db = DBSetup.getDatabase();
    this.collection = EVENT_COLLECTION;
    this.collection_seq = EVENT_COLLECTION_SEQ;
    this.seeding = new SeedingJob(bot);
    this.watering = new WateringJob(bot);
    this.event_emitter = new EventEmitter();
    this.interval = 100000;
    console.log("Successfully initialized the event queue and locks system")
  }
  add = (event : Event, args = {single_event: false}) => {
    let _this = this;
    let additional = args;

    return this.getEventSeq((seq)=>{
      let _insert = false;
      if(event.event_id === undefined || typeof  event.event_id !== "number"){
        event.event_id = seq.next_id;
        _insert = true;
      }
      if(event.status === undefined){
        event.status = EventStatus.NotRunning;
      }
      let filter = {event_id: event.event_id}
      if(args.single_event === true && typeof event.job_id === "number") { // @ts-ignore
        filter = {job_id: event.job_id}
      }
      //check if the event is scheduled
      return _this.db.collection(this.collection)
        .findOne(filter)
        .then(r =>{
          if(r && args.single_event) {return  Promise.resolve("Empty")}
          else return _this.db.collection(this.collection)
            .updateOne(filter, {$set: event}, {upsert: true})
            .then((_) => {
              return _this.setEventSeq(_insert)
            })
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
  runReadyEvents = () => {
    let ready_events : Array<Event> = [];
    const _future_ = "now"
    let filter = {time: "now", status:EventStatus.NotRunning}
    let _this = this;
    return this.db.collection(this.collection).find(filter)
      .toArray()
      .then((data) => {
        if(data.length > 0)  console.log(data.length + " Jobs are ready")
        //return _this.runQueue(data);
       return  _this.runNext(data);
      })
  }

  runSingleEvent = (event: Event) => {

    let handler : Job;
    handler = this.watering;
    let _this = this;
    if(event.type === "seeding") handler = this.seeding;
    if(handler === undefined || handler === null){
      return Promise.reject("Handler is empty");
    }
    else  if (event.type === "watering") handler = this.watering;
    event.status = EventStatus.Running;
    EventQueue.busy = true;
    return  this.add(event)
      .then(_ => {
        console.log("started executing jobs")
        return handler.executeJob(event.job_id, (err, res) => {
          console.log("Finished running job steps")

          let event_status = {job_id: event.job_id, type: event.type, status : "failed"};
          if(err) event_status.status = "failed";
          if(res) event_status.status = "completed"
          _this.event_emitter.emit('status', event_status);
          EventQueue.busy = false; // release the lock
          // @ts-ignore
          return _this.remove(event.event_id);
        })
      })
      .then(() => {
        return Promise.resolve(event.event_id)
      })
  }
  runQueue = async (events) => {
    let _this = this;
    let results  = [];
    for(let event of events){
      let r = await _this.runSingleEvent(event)
        .then(function(_){
          console.log("Finished running a single event from the queue")
        }).catch(err => {
          console.error(err)
        });

    }
  }
  runNext = (events) => {
    let event;
    if( EventQueue.busy){
      console.log("Queue busy")
      return  Promise.resolve("Job queued")
    }
    if(events.length > 0) {
      event = events[0];
      return this.runSingleEvent(event)
    }else{
      return Promise.resolve();
    }
  }
collectEvents = (reschedule = false) => {

  const addJobsToEventsQueue = async (res, type, handler) => {
    for(let item of res){
      let event: Event = {
        name: item.name,
        job_id: item.id,
        type: type,
        time: "now",
        status: EventStatus.NotRunning
      }

      await this.add(event, {single_event: true}).then(_=>{
        item.scheduled = true;
        if (handler ) return handler.updateJob(item, (e, s) =>{
          if (s)console.log("Job's schedule updated")
          if (e) console.error("Failed to update the scheduling of the job updated")
        }, false);
      });
    }
    return Promise.resolve("Added Jobs to the Queue :  " + res.length)
  }
    //First clean the event queue: if the Queue is not busy but the there are events marked as running: renew them
    //collect the ready watering jobs and submit them
  const now = new Date();
  const next_10 = new Date(now.getTime() + this.interval);
    reschedule;
    //console.log({ nextRunAt: { '$gt': new Date(now), '$lt': new Date(next_10)}})
    //console.log( {$and: [{ nextRunAt: { '$gt': new Date(now), '$lt': new Date(next_10)}}, {"status.active": true}]})
   let ready_filter = [
     {nextRunAt: 'now'},
     {$and: [{ nextRunAt: { '$gt': new Date(now), '$lt': new Date(next_10)}}]}
   ]
  this.db.collection(WATERING_COLLECTION)
    .find({
      $or: ready_filter
    }).toArray()
    .then( (res) => {
      return addJobsToEventsQueue(res, "watering", this.watering)
    })
    .then(_ => {

      return this.db.collection(SEEDING_COLLECTION)
        .find({$or: ready_filter}).toArray()
    }).then((res) => {
    return addJobsToEventsQueue(res, "seeding", this.seeding)
  })
}
getScheduledEvents = () => {
    return this.db.collection(this.collection)
      .find({})
      .toArray()
}
  process = () => {
    return this.runReadyEvents();
  }
  getEventEmitter = () => {
    return this.event_emitter;
  }
}
