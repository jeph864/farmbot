"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexrouter = void 0;
var express_1 = __importDefault(require("express"));
var interfaces_1 = require("../jobs/interfaces");
var api_1 = require("../setup/api");
var dynamic_slots_1 = require("../setup/dynamic_slots");
var router = express_1.default.Router();
router.use(function timeLog(_, __, next) {
    console.log('Time: ', Date.now());
    next();
});
router.get('/search/', function (req, res, next) {
    var search_term = req.query.name, pattern = '^' + search_term;
    api_1.seeding_jobs.getAllJobs({ name: { '$regex': pattern, '$options': 'i' } }, function (err, results) {
        if (err)
            throw err;
        if (results) {
            res.json(results);
        }
        next();
    });
});
router.get('/jobs/get', function (_, res, next) {
    api_1.seeding_jobs.getAll()
        .then(function (data) {
        console.log(data);
        res.json(data);
        next();
    }).catch(function (e) { console.error(e); });
});
router.get('/jobs/watering/get', function (_, res, next) {
    api_1.watering_jobs.getAll()
        .then(function (data) {
        res.json(data);
        next();
    }).catch(function (e) { console.error(e); });
});
router.post('/jobs/create/', function (req, res, next) {
    var params = req.body;
    api_1.seeding_jobs.createJob(params, function (error, results) {
        if (error)
            throw error;
        if (results) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(results);
        }
        next();
    });
});
router.post('/jobs/seeding/update/', function (req, res, next) {
    var params = req.body;
    api_1.seeding_jobs.updateJob(params, function (e, r) {
        if (e)
            throw e;
        if (r)
            res.json(r);
        next();
    });
});
router.post('/jobs/watering/update/', function (req, res, next) {
    var params = req.body;
    api_1.watering_jobs.updateJob(params, function (e, r) {
        if (e)
            throw e;
        if (r)
            res.json(r);
        next();
    });
});
router.get('/jobs/execute/', function (req, response, next) {
    api_1.seeding_jobs.executeJob(req.body.job_id, function (error, results) {
        if (results) {
            response.send("Finished running job in the queue");
        }
        if (error)
            throw error;
        next();
    });
});
router.post('/events/submit', function (req, res, _) {
    var event = req.body;
    api_1.event_queue.add(event)
        .then(function (_) {
        res.send("Submitted new Event");
    }).catch(function (_) { return res.send("Could not submit the event"); });
});
router.get('/events/process', function (__, res, _) {
    api_1.event_queue.process().then(function (_) {
        res.send("Run the submitted events");
    }).catch(function (_) {
        res.send("Encountered an error during the processing of jobs");
    });
});
router.get('/status', function (__, res, _) {
    if (api_1.status_message) {
        res.json(api_1.status_message);
    }
    else {
        res.send("No status available yet");
    }
});
router.post('/steps', function (req, res, _) {
    var job = req.body;
    var steps = api_1.seeding_jobs.calculateSteps(job);
    var r = {
        count: steps.length,
        data: steps
    };
    res.json(r);
});
router.get('/pinwrite', function (req, res, _) {
    var pin_number = parseInt(req.query.number), pin_value = parseInt(req.query.value); //pin_mode = req.query.mode;
    api_1.seeding_jobs.write(pin_number, pin_value)
        .then(function (_) {
        res.send("Wrote");
    }).catch(function (e) { console.error(e); });
});
/*app.post('/jobs/watering/execute', function(req, res, next){
  const location = req.body;
  watering_job.doWatering(location)
    .then(_ => {
      res.send("Finished watering");
    }).catch(_ => res.send("Couldn't finish the watering job successfully"))
})*/
router.post('/jobs/watering/execute', function (req, res, _) {
    var job_id;
    if (!req.query.id) {
        var dest_location = req.body.dest;
        var tray_location = req.body.tray_pos;
        api_1.watering_jobs.doWatering(dest_location)
            .then(function (_) {
            res.send("Finished Planting step");
        }).catch(function (_) { return res.send("Couldn't finish the watering job successfully"); });
    }
    else {
        job_id = parseInt(req.query.id);
        api_1.watering_jobs.getJob(job_id)
            .then(function (job) {
            if (!job || typeof job === "undefined" || typeof job === null) {
                return Promise.reject("There is no job for the given ID");
            }
            var event = {
                job_id: job.id,
                type: "watering",
                status: interfaces_1.EventStatus.NotRunning,
                time: "now"
            };
            return api_1.event_queue.add(event, { single_event: true });
        }).then(function (_) {
            res.send("Job submitted");
        }).catch(function (e) {
            console.log(e);
            res.status(500);
            res.send(e);
        });
    }
});
router.post('/jobs/seeding/execute', function (req, res, _) {
    var job_id;
    if (!req.query.id) {
        var dest_location = req.body.dest;
        var tray_location = req.body.tray_pos;
        api_1.seeding_jobs.plantSeed(tray_location, dest_location)
            .then(function (_) {
            res.send("Finished Planting step");
        }).catch(function (_) { return res.send("Couldn't finish the watering job successfully"); });
    }
    else {
        job_id = parseInt(req.query.id);
        api_1.seeding_jobs.getJob(job_id)
            .then(function (job) {
            var event = {
                job_id: job.id,
                type: "seeding",
                status: interfaces_1.EventStatus.NotRunning,
                time: "now"
            };
            return api_1.event_queue.add(event, { single_event: true });
        }).then(function (_) {
            res.send("Job submitted");
        });
    }
});
router.get('/slots/', function (_, res) {
    var slots = new dynamic_slots_1.Slots();
    slots.findSlots()
        .then(function (data) {
        res.json(data.map(function (value) {
            // @ts-ignore
            return value.type;
        }));
    }).catch(function (e) {
        console.error(e);
        res.send(e);
    });
});
router.post('/slots/', function (req, res) {
    var job_types = req.body.data;
    job_types = job_types.map(function (t, index) {
        return { type: t, id: index };
    });
    var slots = new dynamic_slots_1.Slots();
    slots.updateManySlots(job_types)
        .then(function (data) {
        res.json(data);
    }).catch(function (e) {
        console.error(e);
        res.send(e);
    });
});
router.post('/move', function (req, res, _) {
    if (req.body.home && req.body.home.value) {
        api_1.bot.home(req.body.home.args || { speed: 100, axis: "all" }).then(function (_) {
            res.send("Moved home");
        }).catch(function (err) {
            console.log(err);
            res.send("Cannot move");
        });
    }
    else {
        // console.log(req.body)
        var moveFunc = req.body.mode && parseInt(req.body.mode) == 1 ? api_1.bot.moveRelative : api_1.bot.moveAbsolute;
        moveFunc({ x: req.body.x, y: req.body.y, z: req.body.z, speed: req.body.speed })
            .then(function (_) {
            res.send("Moved successfully");
        }).catch(function (_) { res.send("Failed to move"); });
    }
});
exports.indexrouter = router;
//module.exports = router;
