const dbConnect = require("./conn");
const { rpcRequest } = require("farmbot");
const ObjectID = require('mongodb').ObjectId;


var WateringJob = /** @class */ (function () {
  function WateringJob(bot, config={}){
    this.db = dbConnect.getDatabase();
    this.watering_collection = "watering_jobs";
    this.delayed_jobs = "delayed_jobs";
    this.bot = bot;
    if(config){
      this.pins = config.pins;

    }
    this.base_z = config.base_z ? config.base_z : 0;
    this.__default_params = {
      name: "Watering Job",
      id: 0,
      amount_of_water : 0,
      height : 0,
      min_dist : 0,
      plant_type: "radish",
      },
      status: {running: false}
    };
    this.__minPoint = function(point1, point2){

    }
    this.__init_params = function(input){
      input.working_area.length = input.working_area.end_pos.x - input.working_area.pos.x;
      input.working_area.width = input.working_area.end_pos.y - input.working_area.pos.y;
      return Object.assign(this.__default_params, input);
    }
    this.createJob = function (jobParams, callback){
      var params = this.__init_params(jobParams);
      delete params._id;
      const job = params;
      let _this = this;
      this.db.collection(this.seeding_collection)
        .countDocuments()
        .then(function(res){
          _this.db.collection(_this.seeding_collection)
            .find({name: job.name}).toArray()
            .then(function(data) {
              if(res == 0 && data.length == 0) res = 1;
              else if(res > 0 && data.length == 0) res = res +1
              else if(data.length == 1) res = data[0].id;
              job.id = res;

              _this.db.collection(_this.seeding_collection)
                .insertOne(job)
                .then(function(data){
                  callback(null, data);
                })
                .catch(function(err){
                  callback(err, null);
                })
            })

        }).catch(e => console.error(e));
    };
    this.executeJob = function(job_id, callback){
      let _this = this;
      let run = async function(items){
        let results = [];
        for(let item of items){
          let r = await _this.plantSeed({x:10,y:10, z:0}, item)
            .then(function(ack){
              results.push(ack)
            });

        }
        return results;
      }
      this.addToQueue(job_id, function(err, data){
       let top = data[0];
       _this.getAllJobs({id: top.job_id}, function(e, d){

         if(e) {
           callback(e, null);
         }
         let ready_job = d[0];
         let steps = _this.__calculateSteps(ready_job), step_count = steps.length;
        run(steps).then(function(res){
          _this.removeFromQueue(ready_job.id)
            .then(function(data){
              console.log(data)
              callback(null, "Finished running all job steps")
            })

        }).catch(function(err){
          throw err;
        })
         /*steps.forEach(function(item, index){
           let promise = Promise.resolve(_this.plantSeed({x:10,y:10, z:0}, item))
             .then(function(bot){
               console.log("Moved one step");
             });
           promises.push(promise);
         })

         Promise.all(promises).then(function(){
           console.log('After all jobs');
         })*/
       /*  console.log(top);
        console.log(steps.shift())
         _this.plantSeed({x:10,y:10, z:0}, steps[5], 100)
           .then(function(ack){
             if(ack) console.log(ack)
             else console.log("Failed to execute step");
           })*/

       })
      })
      /*this.bot.moveAbsolute({ x: 1500, y: 200, z: 0, speed: 100 })
        .then(function(data){
          callback(null, data);

        }).catch(function(err){
          callback(err, null);
        })*/
     /* this.writePin().then(function(ack){
      }).catch(e=> {throw  e});*/
    };
    this.executeOneStep = function(step){

    }
    this.removeFromQueue = function (job_id){
      let _this = this;
       return this.db.collection(this.delayed_jobs)
        .deleteOne({job_id: job_id})
        .then(function(ack){
           return _this.db.collection(_this.delayed_jobs)
             .updateMany({},{$inc : {q_pos: -1}})
        })
    }
    this.__calculateSteps = function(jobs){
      /*let jobs =   {
        name: 'Job Test 3',
        depth: 10,
        id: 4,
        min_dist: 20,
        plant_type: 'lettuce',
        status: { running: false },
        working_area: { pos: { x: 0, y: 0 }, length: 150, width: 100 }
      }*/
      const pos = jobs.working_area.pos
      let length = jobs.working_area.length
      let width= jobs.working_area.width
      let locations = [];
      length = length + pos.x
      width = width + pos.y
      for(let i = pos.x+jobs.min_dist; i<length-jobs.min_dist; i = i+jobs.min_dist){
        for(let j = pos.y+jobs.min_dist;j<width-jobs.min_dist; j = j+ jobs.min_dist){
          locations.push({
            x:i, y:j, z: jobs.depth
          })
        }
      }

      return locations;
    }
    this.plantSeed = function( bay_pos, dest, speed = 100) {
      let _this = this;
      return this.bot.moveAbsolute({ x: bay_pos.x, y: bay_pos.y, z: bay_pos.z, speed: speed })
        .then (function(ack){
          console.log("Moved successfully to bay position");
          return _this.writePin(1)
        }).then(function(ack){
        console.log("Wrote to pin: 1");
          return _this.bot.moveAbsolute({x:dest.x, y:dest.y,z:dest.z, speed:speed})
      }).then(function(ack){
        console.log("Moved successfully to plant position ");
        return  _this.writePin(0);
      }).then(function(ack){
          console.log("Wrote to pin: 0");
        return _this.bot.moveAbsolute({x:dest.x, y:dest.y,z:dest.z, speed:speed});
      })
    }
    this.addToQueue = function (job_id, callback){
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
                .then(function(data){
                  return _this.db.collection(_this.delayed_jobs)
                    .find()
                    .sort({q_pos: 1}).limit(1).toArray()
                    .then(function(data){
                      callback(null, data);
                      //
                    }).catch(e => callback(e, null))
                })
            })

        });
    };
    this.writePin= function (value = 1, pin_id = 30538, mode  = 0){
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
      return this.bot.writePin({pin_number: args.pin_number, pin_value:args.pin_value, pin_mode:args.pin_mode})
    };
    this.move = function (x = 0, y = 0, z = 0, speed = 0){
      return this.bot.moveAbsolute({ x: x, y: y, z: z, speed: speed })
    }
    this.__markAs = function(args = {}, body = {}){
      return this.bot.send(rpcRequest([
        { kind: "update_resource", args: args, body: body}
      ]));
    };
    this.markPlanted = function (resource_id = 769779){
      let args = {
        args: {
          resource :{
            kind: "resource",
            args: {
              resource_type: "Plant",
              "resource_id": resource_id
            }
          }
        },
        body: [
          {
            kind: "pair",
            args: {
              label: "plant_stage",
              value: "planted"
            }
          }
        ]
      }
      return this.__markAs(args.args, args.body);
    };
    this.getStatus = function (){
    };
    this.deleteJob = function(){
    };
    this.updateJob = function(jobParams){
      const job = this.__init_params(jobParams);
      return this.db.collection(this.seeding_collection)
        .updateOne({id: jobParams.id}, {$set: {job}}, {upsert: false})
    };
    this.getAllJobs = function(filter = {}, callback){
      this.db.collection(this.seeding_collection)
        .find(filter).toArray().then( res => callback(null, res))
        .catch(err => callback(err, null));
    };
    this.getJob = function (filter){
    };
    this.acquireLock = function(){
    };
    this.pause = function (){
    }
    this.getDelayedJobs = function(callback){
      this.db.collection(this.delayed_jobs)
        .find().toArray().then(res => callback(null, res))
        .catch(err => callback(err, null));
    }
    this.isJobdelayed =   function(job_id){
      return this.db.collection(this.delayed_jobs)
        .find({job_id: job_id }).toArray();
    }

  }
  return SeedingJob;
}());

module.exports = SeedingJob;