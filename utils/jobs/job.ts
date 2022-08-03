import { CSInteger, Farmbot, NamedPin, RpcError, RpcOk, rpcRequest } from "farmbot";
import {DBSetup, unsafe_locations, slots_container} from "../setup/api";
import { Db, MongoClient } from "mongodb";
import {
  WorkingArea, Position, JobParams,
  EventDate,
  DelayedJob,
  Seeding,
  Watering,
  JobStep,
  Event,
  Plant
} from "./interfaces";

const DELAYED_JOBS = "delayed_jobs";
const PLANT_COLLECTION = "plants";
export abstract class Job{
  protected  readonly bot: Farmbot;
  protected  config;
  protected db : Db;
  protected collection;
  protected readonly delayed_jobs;
  protected   collection_seq;
  private plants;
  protected safe_height:number;
  protected ground_level:number ;
  private  readonly max_depth;
  private readonly zlock: number
  protected type_name : string;

  protected constructor(bot: Farmbot, config = {}) {
    this.bot = bot;
    this.config = config;
    this.db = DBSetup.getDatabase();
    this.collection = "";
    this.collection_seq = this.collection + "_seq"
    this.delayed_jobs = DELAYED_JOBS;
    this.plants = PLANT_COLLECTION;
    this.safe_height = 80;
    this.ground_level = -430;
    this.zlock = -460;
    this.max_depth = 30;
    this.type_name = "job"
    //initialize the seq collection
    this.getJobSeq((e) => {
      if(e) console.log("Successfully initialized " + this.collection_seq);
    })
  }

  getConfig = () => {
    return this.config;
  };
  setConfig = () => {};

  getJobId = () => {

  }
  protected df_position: Position = {x: 0, y: 0, z: 0};
  protected df_working_area: WorkingArea = {
    beg_pos: this.df_position,
    end_pos: this.df_position,
    length: 0,
    width: 0
  }

  abstract initParams (jobParams: JobParams) : JobParams
  abstract runStep (args: JobStep);

  //abstract  executeJob (job_id : number, callback) : void;
  minPos = (pos1: Position, pos2: Position) => {
    pos2;
    return pos1;
  }
  maxPos = (pos1: Position, pos2: Position) => {
    pos1;
    return pos2;
  }
  calculateSteps = (job) => {
    const pos = job.working_area.beg_pos
    let length = job.working_area.length
    let width= job.working_area.width
    let locations : Array<Position> = [];
    length = length + pos.x
    width = width + pos.y
    const min_dist_to_borders = Math.floor(job.min_dist/2)
    for(let i = pos.x+min_dist_to_borders; i<=length-min_dist_to_borders; i = i+job.min_dist){
      for(let j = pos.y+min_dist_to_borders;j<=width-min_dist_to_borders; j = j+ job.min_dist){
        let location : Position = {x:i, y:j, z: job.depth}
        locations.push( location )
      }
    }
    console.log("Locations: "+ locations.length)
    return  this.removeUnsafeLocations(locations);
  }
  removeUnsafeLocations = (locations, radius = 0) => {
    const  isInVicinity = (point:Position, location, radius = 0) =>{
      return ( point.x >= location.location.beg.x - radius &&  point.x <= location.location.end.x + radius) &&
        ( point.y >= location.location.beg.y - radius &&  point.y <= location.location.end.y + radius)
    }
    const isUnsafe = (point, locations) => {
      for (const loc of  locations){
        if(isInVicinity(point, loc, radius)) {
          return true;
        }
      }
      return false;
    }
    return unsafe_locations.get()
      .then(results => {
        locations = locations.filter((item) => {
          return !isUnsafe(item, results)
        })
        return Promise.resolve(locations)
      })
  }
  getAbsolutePlantPosition(pos: Position){
    let absolute_pos_z = this.ground_level - pos.z;
    if(absolute_pos_z <= this.zlock) pos.z = this.zlock +1;
    else pos.z = absolute_pos_z
    return pos;
  }

  executeJob = (job_id, callback) => {
    let started = new Date();
    let _this = this;
    return _this.getAllJobs({id: job_id}, function(e, d){
      if(e) {
        callback(e, null);
      }
      let ready_job = d[0];
      return slots_container.getRightSlot(_this.type_name)
        .then(_ => {
          return _this.calculateSteps(ready_job)
        })
        .then(steps => {
          return _this.executeAllSteps(steps)
            .then(function(_){
            return _this.updateLastRun(job_id, started)
              .then((_) => {
                return _this.removeFromQueue(ready_job.id)
                  .then(function(data){
                    data;
                    callback(null, "Finished running all job steps")
                  })
              })
          })

        })
      .catch(function(err){
        throw err;
      })
    })
  };
  updateLastRun = (job_id, date, interval  = -1) => {
    const lastFinished = new Date();
    if(interval == 0){
      interval = 2;
    }
    let nextRun =  this.__addHours(interval, lastFinished)
    return this.db.collection(this.collection)
      .updateOne({id: job_id}, {$set: {lastStarted: date, lastFinished: lastFinished, nextRunAt: nextRun }})
}
  createJob = (jobParams: JobParams, callback) => {
    const params = this.initParams(jobParams);
    const job = params;
    let _this = this;
    this.db.collection(this.collection)
      .countDocuments()
      .then(function(res){
        _this.db.collection(_this.collection)
          .find({name: job.name}).toArray()
          .then(function(data){
            if(res == 0 && data.length == 0) res = 1;
            else if(res > 0 && data.length == 0) res = res +1
            else if(data.length == 1) res = data[0].id;
            job.id = res;
            _this.db.collection(_this.collection)
              .insertOne(job)
              .then(function(data){
                // @ts-ignore
                if(data.acknowledged){
                  callback(null, job);
                }else{
                  callback("NotAcknowledged", null);
                }
              })
              .catch(function(err){
                // @ts-ignore
                callback(err, null);
              })
          }).catch( e => console.error(e))
      })
  };
  updateJob = (jobParams: JobParams, callback, args = {update_after : true}) => {
    const params = this.initParams(jobParams);
    const job = params;
    let _this = this;
    this.getJobSeq( (seq) => {
      let  _insert : boolean = false;
      let filter = {}

      if(job.id === -1 || typeof jobParams.id !== "number"){
        job.id = seq.next_id;
        _insert = true;
      }
      filter = {id: job.id};
      _this.db.collection(this.collection)
        .updateOne(filter, {$set: job}, {upsert: _insert})
        .then((upres) => {
          _this.setJobSeq(_insert)
            .then(_ => {
              const tmp_job = job;
              if(upres.acknowledged &&(upres.modifiedCount > 0 || upres.upsertedCount > 0)){
                //@ts-ignore
                tmp_job.seeding_id = job.id;
                tmp_job.id = -1;
                tmp_job.from_seeding = true;
                _this.afterUpdate(tmp_job, (_, r) =>{
                  r;
                  callback(null, job);
                }, tmp_job, args.update_after)
              }else{
                callback(null, job);
              }

            })

        }).catch( e => callback(e, null))
    })
  };
  abstract  afterUpdate  (jobParams: JobParams, callback, data, update)
 getJobSeq = (callback) => {
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
 setJobSeq = (set : boolean = true) => {
   return this.db.collection(this.collection_seq)
    .updateOne({}, {$inc : {next_id: set?1 : 0}})
}

  addToQueue = (job_id, callback) => {
    let _this = this;
    return this.db.collection(_this.delayed_jobs)
      .countDocuments()
      .then(function(pos){
        _this.db.collection(_this.delayed_jobs)
          .findOne({job_id: job_id})
          .then(function(job){
            if(job){
              if(pos == 0) pos =1;
              pos = job.q_pos
            }else{
              if (pos == 0) pos = 1;
              else pos = pos +1;
            }
            return _this.db.collection(_this.delayed_jobs)
              .updateOne({job_id: job_id}, {$set: {job_id: job_id, q_pos: pos}}, {upsert:true})
              .then(function(_){
                return _this.db.collection(_this.delayed_jobs)
                  .find()
                  .sort({q_pos: 1}).limit(1).toArray()
                  .then(function(data){
                    callback(null, data);
                  }).catch(e => callback(e, null))
              })
          })

      });
  };
  removeFromQueue = (job_id : number) => {
    return Promise.resolve("Queue function  deprecated: " + job_id);

  };
  writePin = (value:number = 1, pin_id: number = this.config.pin_id, mode:number = 0) => {
    let args = {
      pin_number: {
        kind: "named_pin",
        args: {
          "pin_type": "Peripheral",
          "pin_id": pin_id
        }
      },
      "pin_value": value,
      "pin_mode": mode
    };
    // @ts-ignore
    return this.bot.writePin({pin_number: args.pin_number, pin_value:args.pin_value, pin_mode:args.pin_mode})
  };

  move = (dest: Position, speed: CSInteger) => {
    return this.bot.moveAbsolute({ x: dest.x, y: dest.y, z: dest.z, speed: speed });
  };
  markAs = (args, body) => {
    return this.bot.send(rpcRequest([
      { kind: "update_resource", args: args, body: body}
    ]));
  };
  executeAllSteps = async (items) => {
    let _this = this;
    let results : Array<RpcOk|RpcError>= [];
    for(let item of items){
      let r = await _this.runStep(item)
        .then(function(ack){
          results.push(ack)
        });
    }
    return results;
  }
convertMl = (duration: number) => {
    return duration;
}

write = (pin_number, value, pin_mode = 0) => {
    const args =  { pin_mode: pin_mode, pin_value: value, pin_number: pin_number }
    // @ts-ignore
  return this.bot.writePin(args/*{pin_number: pin_number, pin_mode:0, pin_value: value}*/)
}

getJob = (job_id) => {
    return this.db.collection(this.collection)
      .findOne({id: job_id})
}
  getAllJobs = (filter: {}, callback) => {
    return this.db.collection(this.collection)
      .find(filter).toArray().then( res => callback(null, res))
      .catch(err => callback(err, null));
  };
  getAll = (filter:any = {}) => {
    //console.log("Collection: ${this.collection}")
    return this.db.collection(this.collection)
      .find(filter).toArray()
  };
  delay = (t) => {
    return new Promise(resolve => setTimeout(resolve, t))
  }
  __addHours = (hours, date: Date) => {
    //@ts-ignore
    Date.prototype.addHours = function(h) {
      this.setTime(this.getTime() + (h*60*60*1000));
      return this;
    }
    //@ts-ignore
    return date.addHours(hours);

  }
  getStatus = () => {};
  deleteJob = () => {};
  lock = () => {};
  unlock = () => {};
  getDelayedJobs = (callback) =>{
    this.db.collection(this.delayed_jobs)
      .find().toArray().then(res => callback(null, res))
      .catch(err => callback(err, null));
  };
  updatePlant = (plant :Plant) => {
    return this.db.collection(this.plants)
      .updateOne({$and: [{x: plant.location.x}, {y:plant.location.y}, {z:plant.location.z}]},{$set: plant}, {upsert: true})
  };
};
