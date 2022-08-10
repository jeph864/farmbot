import express from "express"
import { EventDate, EventStatus } from "../jobs/interfaces";
import {
  unsafe_locations,
  seeding_jobs,
  watering_jobs,
  event_queue,
  status_message,
  bot,
  slots_container,
  SetupArgs,
  setup,
  FAKE_USER, DBSetup, app_status
} from "../setup/api";
import { Slots } from "../setup/dynamic_slots";
import { UnsafeLocation } from "../setup/unsafe_locations";

const router = express.Router();


router.use(function timeLog(_, __, next) {
  //console.log('Time: ', Date.now());
  next();
});


router.get('/search/', function(req, res, next){
  let search_term = req.query.name, pattern = '^'+search_term;
  seeding_jobs.getAllJobs({name: {'$regex': pattern, '$options': 'i'}}, function(err, results){
    if(err) throw  err;
    if (results){
      res.json(results);
    }
    next();
  })
})
router.get('/jobs/get', function(_, res, next){
  seeding_jobs.getAll()
    .then(data => {
      console.log(data)
      res.json(data);
      next();
    }).catch(e => {console.error(e)})
})

router.get('/jobs/watering/get', function(_, res, next){
  watering_jobs.getAll()
    .then(data => {
      res.json(data);
      next();
    }).catch(e => {console.error(e)})
})
router.post('/jobs/create/', function(req, res, next){
  let params = req.body;
  seeding_jobs.createJob(params, function(error ,results){
    if(error) throw error;
    if (results) {

      res.setHeader('Access-Control-Allow-Origin', '*')
      res.json(results);
    }
    next();
  })
});
router.post('/jobs/seeding/update/', function(req, res, next){
  let params = req.body;
  seeding_jobs.updateJob(params, function(e, r){
    if(e) throw  e;
    if(r)  res.json(r);
    next();
  })
});

router.post('/jobs/watering/update/', function(req, res, next){
  let params = req.body;
  watering_jobs.updateJob(params, function(e, r){
    if(e) throw  e;
    if(r)  res.json(r);
    next();
  })
});

router.get('/jobs/execute/', function(req,response,next){
  seeding_jobs.executeJob(req.body.job_id, function(error, results){
    if (results){
      response.send("Finished running job in the queue");
    }
    if(error) throw error;
    next();
  })

})
router.post('/events/submit', (req, res, _) => {
  let event = req.body;
  event_queue.add(event)
    .then(_ => {
      res.send("Submitted new Event")
    }).catch(_ =>  res.send("Could not submit the event"))
})
router.get('/events/process', (__, res, _) => {
  event_queue.process().then( _ => {
    res.send("Run the submitted events")
  }).catch( _ => {
    res.send("Encountered an error during the processing of jobs")
  })
})
router.get('/status', function(__, res, _){
  if(status_message){
    res.json(status_message)
  }else{
    res.send("No status available yet");
  }
});

router.get('/appstatus', function(__, res, _){
  if(status_message){
    app_status.location = status_message;
    event_queue.getActiveEvent()
      .then(r => {
        app_status.running = r.running;
        app_status.busy = r.busy
        res.json(app_status)
      })
  }else{
    res.send("No status available yet");
  }
});

router.post('/steps', (req, res, _) => {
  const job = req.body;
  const steps = seeding_jobs.calculateSteps(job);

  let r = {
    //@ts-ignore
    count: steps.length,
    data: steps
  }
  res.json(r)
})
router.get('/pinwrite', (req, res, _)=>{
  let pin_number= parseInt(req.query.number as string), pin_value = parseInt(req.query.value as string); //pin_mode = req.query.mode;
  seeding_jobs.write(pin_number, pin_value)
    .then((_) =>  {
      res.send("Wrote")
    }).catch((e) => {console.error(e)})
})
/*app.post('/jobs/watering/execute', function(req, res, next){
  const location = req.body;
  watering_job.doWatering(location)
    .then(_ => {
      res.send("Finished watering");
    }).catch(_ => res.send("Couldn't finish the watering job successfully"))
})*/

router.post('/jobs/watering/execute', function(req, res, _){
  let job_id;
  if(!req.query.id){
    const dest_location = req.body.dest;
    const tray_location = req.body.tray_pos;
    watering_jobs.doWatering(dest_location)
      .then(_ => {
        res.send("Finished Planting step");
      }).catch(_ => res.send("Couldn't finish the watering job successfully"))
  }else{
    job_id = parseInt(req.query.id as string);
    watering_jobs.getJob(job_id)
      .then((job) => {
        console.log("Executing Job")
        if(!job || typeof  job === "undefined" || typeof job === null){
          return Promise.reject("There is no job for the given ID")
        }
        let event = {
          job_id : job.id,
          type: "watering",
          status: EventStatus.NotRunning,
          time: "now" as EventDate
        }
        return event_queue.add(event, {single_event: true});
      }).then((_) => {

      res.send("Job submitted");
    }).catch( e=> {
      console.log(e)
      res.status(500);
      res.send(e)
    })
  }

})
router.post('/jobs/seeding/execute', function(req, res, _){
  let job_id;
  if(!req.query.id){
    const dest_location = req.body.dest;
    const tray_location = req.body.tray_pos;
    seeding_jobs.plantSeed(tray_location, dest_location)
      .then(_ => {
        res.send("Finished Planting step");
      }).catch(_ => res.send("Couldn't finish the watering job successfully"))
  }else{
    job_id = parseInt(req.query.id as string);
    seeding_jobs.getJob(job_id)
      .then((job) => {
        let event = {
          job_id : job!.id,
          type: "seeding",
          status: EventStatus.NotRunning,
          time: "now" as EventDate
        }
        return event_queue.add(event, {single_event: true});
      }).then((_) => {

      res.send("Job submitted");
    })
  }

})
router.get('/jobs/watering/activate', (req, res) => {
  if(typeof  req.query.status === "undefined" || typeof  req.query.id === "undefined" ) {
     res.status(405);
     res.send("No status/ job ID was supplied")
  }
  // @ts-ignore
  let status = parseInt(req.query.status);
  // @ts-ignore
  const id = parseInt(req.query.id)
  watering_jobs.update({id: id}, {scheduled: Boolean(status)})
    .then(data => {
      res.json(data)
    }).catch( e => {
      console.log(e);
      res.status(405)
    res.send("An error has occurred")
  })
})
router.delete('/jobs/watering', (req, res) => {
  // @ts-ignore
  const id = parseInt(req.query.id)
  watering_jobs.deleteJob(id)
    .then( r => {
      if(r && r.deletedCount == 0){
        res.status(400);
        res.send("Watering job with ID "+id + " does not exists or has been deleted")
      }else
        res.send("Watering job deleted successfully")
    })
})
router.delete('/jobs/seeding', (req, res) => {
  // @ts-ignore
  const id = parseInt(req.query.id)
  seeding_jobs.deleteJob(id)
    .then( r => {
      if(r && r.deletedCount == 0){
        res.status(400);
        res.send("Seeding job with ID "+id + " does not exists or has been deleted")
      }else
        res.send("Seeding job deleted successfully")
    })
})
router.get('/slots/', (_, res) => {
  const slots = new Slots(DBSetup.getDatabase());
  slots.findSlots()
    .then(data => {
      let latest = data.at(-1)
      if(latest) {
        // @ts-ignore
        latest = latest.extra.latestSlot
      }
      let  d = data!.map((value) => {
        // @ts-ignore
        return value.type
      })
      d = d.filter((item) => {
        return !(item == null)
      })
      d.push(latest)
      res.json(d);
    }).catch( e => {
      console.error(e);
      res.send(e)
  })
})
router.post('/slots/', (req, res) => {
  let job_types = req.body.data;
  job_types = job_types.map((t, index) => {
    return {type: t, id: index}
  })
  const slots = new Slots(DBSetup.getDatabase());
  slots.updateManySlots(job_types)
    .then(data => {
      res.json(data)
    }).catch( e => {
    console.error(e);
    res.send(e)
  })
})
router.post('/slots/release', (req, res) => {
  const dest  = req.body
  slots_container.retire("seeding")
    .then((_ => {
      res.send("Move to the slot bay")
    })).catch(e => {
      console.error(e);
      res.send(e)
    })
})
router.post('/slots/pickup', (req, res) => {
  const dest  = req.body
  slots_container.pick("seeding")
    .then((_ => {
      res.send("picked  up")
    })).catch(e => {
    console.error(e);
    res.send(e)
  })
})
router.get('/slots/right', (req, res) => {
  const job_type  = req.query.type as string
  slots_container.getRightSlot(job_type)
    .then((_ => {
      res.send("picked  up")
    })).catch(e => {
    console.error(e);
    res.send(e)
  })
})
router.post('/move', function(req,res, _){
  if (req.body.home && req.body.home.value){
    bot.home(req.body.home.args || {speed:100, axis: "all"}).then(function(_){
      res.send("Moved home");
    }).catch(err => {
      console.log(err)
      res.send("Cannot move")
    })
  }else{
    // console.log(req.body)
    let moveFunc = req.body.mode && parseInt(req.body.mode) == 1 ? bot.moveRelative: bot.moveAbsolute  ;
    moveFunc({x:req.body.x, y:req.body.y, z:req.body.z, speed:req.body.speed })
      .then(function(_){
        res.send("Moved successfully")
      }).catch(_ => {res.send("Failed to move")})
  }
})
router.post('/unsafelocation', (req, res, _) => {
  const area = req.body;
  unsafe_locations.save(area)
    .then(_ => {
      res.send("saved successfully")
    }).catch(e => {console.error(e); res.send("Failed")})
})
router.get('/unsafelocation', (__, res, _) => {
  unsafe_locations.get()
    .then(unsafeLocResult => {
      res.json(unsafeLocResult)
    }).catch( e => {
      console.error(e)
    res.status(400)
    res.send("An error has occurred")
  })
})
router.get('/unsafelocation/delete', (req, res) => {
  // @ts-ignore
  const  id = parseInt(req.query.id);
  unsafe_locations.delete(id)
    .then(r => {
      if(r && r.deletedCount == 0){
        res.status(400);
        res.send("Unsafe location with ID "+id + " does not exists or has been deleted")
      }else
      res.send("deleted successfully")
    }).catch( e => {
      console.error(e)
      res.status(400)
      res.send("Failed to delete")
  })
})
router.delete('/unsafelocation', (req, res) => {
  // @ts-ignore
  const  id = parseInt(req.query.id);
  unsafe_locations.delete(id)
    .then(r => {
      if(r && r.deletedCount == 0){
        res.status(400);
        res.send("Unsafe location with ID "+id + " does not exists or has been deleted")
      }else
        res.send("deleted successfully")
    }).catch( e => {
    console.error(e)
    res.status(400)
    res.send("Failed to delete")
  })
})
router.get('/unsafe/remove', (__, res, _) => {
  console.log("Unsafe check")
  seeding_jobs.getJob(1)
    .then(results => {
      if (results) {
        seeding_jobs.calculateSteps(results)
          .then( locations => {
            console.log(locations)
            res.json({'locs': locations.length})
          })
      }
    }).catch( e => {
      console.error(e)
    res.send("Failed to remove unsafe locations")
    })
})

router.get('/jobs/plantCoordinates/getAll', function(_, res){
  seeding_jobs.getPlantCoordinates()
    .then( function(results) {
      if (results){
        res.json(results);
      }
    })
})


export const indexrouter = router
//module.exports = router;
