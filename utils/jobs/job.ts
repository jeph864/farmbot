import { CSInteger, Farmbot, NamedPin, RpcError, RpcOk, rpcRequest } from "farmbot";
import * as dbConnect from "../../utils/conn"
import { Db, MongoClient } from "mongodb";


const DELAYED_JOBS = "delayed_jobs";
export interface Position{
  x: number;
  y: number;
  z: number;
}

export interface  WorkingArea {
  beg_pos : Position;
  end_pos: Position;
  length : number;
  width: number
}
export interface DelayedJob{
  id:number;
  type: string;
  q_pos: number;
}


export interface JobParams {
  name: string;
  id: number;
  status: { running: boolean};
}
export  interface Seeding extends JobParams{
  name: string;
  id: number;
  depth: number;
  min_dist: number;
  plant_type: string;
  working_area: WorkingArea;
  status: { running: boolean};
}
export interface Watering  extends  JobParams{
  name: string;
  amount: number;
  id: number
  min_dist: number
  depth: number;
  height: number;
  working_area: WorkingArea;
  status: { running: boolean};
  next: Date

}
export interface JobStep{

}



export abstract class Job{
  protected  readonly bot: Farmbot;
  protected  config;
  protected db : Db;
  protected collection;
  protected readonly delayed_jobs;
  protected   collection_seq;

  protected constructor(bot: Farmbot, config = {}) {
    this.bot = bot;
    this.config = config;
    this.db = dbConnect.getDatabase();
    this.collection = "";
    this.collection_seq = this.collection + "_seq"
    this.delayed_jobs = DELAYED_JOBS;
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
    for(let i = pos.x+job.min_dist; i<length-job.min_dist; i = i+job.min_dist){
      for(let j = pos.y+job.min_dist;j<width-job.min_dist; j = j+ job.min_dist){
        locations.push({
          x:i, y:j, z: job.depth
        })
      }
    }
    return locations;
  }

  executeJob = (job_id, callback) => {
    let _this = this;
    return this.addToQueue(job_id, function(_, data){
      let top = data[0];
      return _this.getAllJobs({id: top.job_id}, function(e, d){
        if(e) {
          callback(e, null);
        }
        let ready_job = d[0];
        let steps = _this.calculateSteps(ready_job), step_count = steps.length;
        _this.executeAllSteps(steps).then(function(_){
          _this.removeFromQueue(ready_job.id)
            .then(function(data){
              console.log(data)
              callback(null, "Finished running all job steps")
            })

        }).catch(function(err){
          throw err;
        })
      })
    })
  };
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
 getJobSeq = (callback) => {
  let _this = this;
  this.db.collection(this.collection_seq)
    .findOne({})
    .then(res => {
      const doc = {next_id : 0}
      if (res) {
        callback(res);
      }
      else _this.db.collection(this.collection_seq).insertOne(doc)
        .then(_ => { callback(doc);})
        .catch( _ => callback(null))
    }).catch(_ => callback(null));
}
 setJobSeq = () => {
   this.db.collection(this.collection_seq)
    .updateOne({}, {$inc : {nextid: 1}})
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
    let _this = this;
    return this.db.collection(this.delayed_jobs)
      .deleteOne({job_id : job_id})
      .then(function(_){
        return _this.db.collection(_this.collection)
          .updateMany({}, {$inc : {q_pos: -1}} )
      })
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


  getAllJobs = (filter: {}, callback) => {
    return this.db.collection(this.collection)
      .find(filter).toArray().then( res => callback(null, res))
      .catch(err => callback(err, null));
  };
  getAll = (filter: {}) => {
    console.log("Collection: ${this.collection}")
    return this.db.collection(this.collection)
      .find(filter).toArray()
  };
  delay = (t) => {
    return new Promise(resolve => setTimeout(resolve, t))
  }
  getStatus = () => {};
  deleteJob = () => {};
  updateJob = (jobParams) => {
    const job = this.initParams(jobParams);
    return this.db.collection(this.collection)
      .updateOne({id: jobParams.id}, {$set: {job}}, {upsert: false})
  };
  getJob = () => {};
  lock = () => {};
  unlock = () => {};
  getDelayedJobs = (callback) =>{
    this.db.collection(this.delayed_jobs)
      .find().toArray().then(res => callback(null, res))
      .catch(err => callback(err, null));
  };
};