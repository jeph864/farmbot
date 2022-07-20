require('dotenv').config({ path: './config.env' });
const express = require('express');
const session = require('express-session');
const path = require('path');
const api = require("./utils/api")
const cors = require("cors")

const dbConnect = require("./utils/conn");
const users = require("./utils/users");

const { saveApiData } = require("./utils/users");
const {SeedingJob } = require("./dist/jobs/seeding")
const { WateringJob } = require("./dist/jobs/watering");
const { Scheduler } = require("./dist/jobs/scheduler");
const { EventQueue } = require("./dist/jobs/queue");
const { EventStatus } = require("./dist/jobs/interfaces");

//const SeedingJob = require("./utils/seeding_job");
const port = 3001;
let seeding_job = null ;
let watering_job = null;
let bot = null;
let status_message = null;
let event_queue;


const app = express();

app.use(session({
  secret: 'secret',
  resave: true,
  name: 'farmbot_session',
  saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' , credentials :  false}));
//app.use(authChecker);
app.get('/', function(request, response) {
  response.send("Welcome in");
});

app.post('/auth', function(request, response) {
  let username = request.body.username;
  let password = request.body.password;
  if (username && password) {
    users.getClientUser(username, function(err, results){
      if (err) {
        response.status(500);
        response.send('Server error. Please contact admin');
        throw err;
      }
      if (results && results.password == password){
        api.token(username,password).then(function(result){
          users.saveApiData(username, result);
          request.session.loggedin = true;
          request.session.username = username;
          request.session.auth = "radish1001";
          response.send('User authorized');
        }).catch(function(_err){
          response.status(403);
          response.send('Incorrect Username and/or Password!');
          console.log("Authorization by API failed");
          console.log(_err);
        });

      } else {
        response.status(403);
        response.send('Incorrect Username and/or Password!');
      }
    });
  } else {
    response.send('Please enter Username and Password!');
    response.end();
  }
});

app.post('/register', function(request, response) {
  let username = request.body.username;
  let password = request.body.password;
  if (username && password) {
    users.createClientUser(username, password);
    response.send('User created');
  } else {
    response.send('Please enter Username and Password!');
    response.end();
  }
});

app.get('/search/', function(req, res, next){
  let search_term = req.query.name, pattern = '^'+search_term;
  seeding_job.getAllJobs({name: {'$regex': pattern, '$options': 'i'}}, function(err, results){
    if(err) throw  err;
    if (results){
      res.json(results);
    }
    next();
  })
})
app.get('/jobs/get', function(req, res, next){
  seeding_job.getAll()
    .then(data => {
      console.log(data)
      res.json(data);
      next();
    }).catch(e => {console.error(e)})
})

app.get('/jobs/watering/get', function(req, res, next){
  watering_job.getAll()
    .then(data => {
      res.json(data);
      next();
    }).catch(e => {console.error(e)})
})
app.post('/jobs/create/', function(req, res, next){
  let params = req.body;
  seeding_job.createJob(params, function(error ,results){
    if(error) throw error;
    if (results) {

      res.setHeader('Access-Control-Allow-Origin', '*')
      res.json(results);
    }
    next();
  })
});
app.post('/jobs/seeding/update/', function(req, res, next){
  let params = req.body;
  seeding_job.updateJob(params, function(e, r){
    if(e) throw  e;
    if(r)  res.json(r);
    next();
  })
});

app.post('/jobs/watering/update/', function(req, res, next){
  let params = req.body;
  watering_job.updateJob(params, function(e, r){
    if(e) throw  e;
    if(r)  res.json(r);
    next();
  })
});

app.get('/jobs/execute/', function(req,response,next){
  seeding_job.executeJob(req.body.job_id, function(error, results){
    if (results){
      response.send("Finished running job in the queue");
    }
    if(error) throw error;
    next();
  })

})
app.post('/events/submit', (req, res, next) => {
  let event = req.body;
  event_queue.add(event)
    .then(_ => {
      res.send("Submitted new Event")
    }).catch(_ =>  res.send("Could not submit the event"))
})
app.get('/events/process', (req, res, next) => {
  event_queue.process().then( _ => {
    res.send("Run the submitted events")
  }).catch( e => {
    res.send("Encountered an error during the processing of jobs")
  })
})
app.get('/status', function(req, res, next){
  if(status_message){
    res.json(status_message)
  }else{
    res.send("No status available yet");
  }
});

app.get('/pinwrite', (req, res, next)=>{
  let pin_number= parseInt(req.query.number), pin_value = parseInt(req.query.value); //pin_mode = req.query.mode;
  seeding_job.write(pin_number, pin_value)
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

app.post('/jobs/watering/execute', function(req, res, next){
  let job_id;
  if(!req.query.id){
    const dest_location = req.body.dest;
    const tray_location = req.body.tray_pos;
    seeding_job.plantSeed(tray_location, dest_location)
      .then(_ => {
        res.send("Finished Planting step");
      }).catch(_ => res.send("Couldn't finish the watering job successfully"))
  }else{
    job_id = parseInt(req.query.id);
    watering_job.getJob(job_id)
      .then((job) => {
        let event = {
          job_id : job.id,
          type: "watering",
          status: EventStatus.NotRunning,
          time: "now"
        }
        return event_queue.add(event, {single_event: true});
      }).then((r) => {

      res.send("Job submitted");
    })
  }

})
app.post('/jobs/seeding/execute', function(req, res, next){
  let job_id;
  if(!req.query.id){
    const dest_location = req.body.dest;
    const tray_location = req.body.tray_pos;
    seeding_job.plantSeed(tray_location, dest_location)
      .then(_ => {
        res.send("Finished Planting step");
      }).catch(_ => res.send("Couldn't finish the watering job successfully"))
  }else{
    job_id = parseInt(req.query.id);
    seeding_job.getJob(job_id)
      .then((job) => {
        let event = {
          job_id : job.id,
          type: "seeding",
          status: EventStatus.NotRunning,
          time: "now"
        }
        return event_queue.add(event, {single_event: true});
      }).then((r) => {

      res.send("Job submitted");
    })
  }

})
app.post('/move', function(req,res, next){
  if (req.body.home && req.body.home.value){
    bot.home(req.body.home.args || {speed:100, axis: "all"}).then(function(ack){
      res.send("Moved home");
    }).catch(err => {
      console.log(err)
      res.send("Cannot move")
    })
  }else{
   // console.log(req.body)
    let moveFunc = req.body.mode && parseInt(req.body.mode) == 1 ? bot.moveRelative: bot.moveAbsolute  ;
    moveFunc({x:req.body.x, y:req.body.y, z:req.body.z, speed:req.body.speed })
      .then(function(ack){
      res.send("Moved successfully")
    }).catch(err => {res.send("Failed to move")})
  }
})

function getUser(username, password, callback){
  if (typeof(callback) !== "function") {
    throw new Error("The callback parameter must be a function");
  }
  let results = users.filter(function(user){
    return user.username == username && user.password == password;
  })
  callback(null, results);
}



function getApiAccount(role){

}

function authChecker(req, res, next) {
  if (req.session.auth || req.path==='/auth') {
    next();
  } else {
    res.redirect("/auth");
  }
}

function error(status, msg){
  let err = Error(msg);
  err.status = status;
  return err;
}

function createClientUsers(username, password){
  let db  = dbConnect.getDatabase();

}

function createTokens(username, request, response)
{
  api.token(username,password).then(function(result){
    users.saveApiData(username, result);
    request.session.loggedin = true;
    request.session.username = username;
    request.session.auth = "radish1001";
    response.send('User authorized');
  }).catch(function(_err){
    response.status(403);
    response.send('Incorrect Username and/or Password!');
    console.log("Authorization by API failed");
    console.log(_err);
  });
}//init database:
dbConnect.connect(function(err){
  if(err){
    console.error(err);
    process.exit();
  }
 users.getApiData("favier@rhrk.uni-kl.de", function(err, results){
   if(err) throw  err;
   if(results){
     api.connect(results.data.token.encoded, function(err){
       if(err){
         console.error(err);
         process.exit();
       }else{
         bot = api.getBot();
         const client = bot.client;
         client.on('message', function (topic, payload, packet){
           if(topic == bot.channel.status){
             status_message = JSON.parse(payload.toString()).location_data.position;
             //console.log(status_message)
           }
         })
        console.log("Initializing the Jobs")
         seeding_job = new SeedingJob(bot);
         watering_job = new WateringJob(bot);
         event_queue = new EventQueue(bot);

         let sch1 = new Scheduler(dbConnect.getDatabase());
         let agenda1 = sch1.getAgenda();
         agenda1.define("collectEvents", async (job) => {
           await event_queue.collectEvents();
         })
         agenda1.every("10 seconds", "collectEvents")
           .then(_ => {
             return agenda1.start()
           }).then(_ => {})

         let sch = new Scheduler(dbConnect.getDatabase());
         let agenda = sch.getAgenda();
         agenda.define("runQueuedJobs", async (job) => {
           await event_queue.process();
         })
         agenda.every("5 seconds", "runQueuedJobs")
           .then(_ => {
             return agenda.start()
           }).then(_ => {})
       }
     })
   }else{
     console.log("Initializing users");
     let user = [
       {
         username: "favier@rhrk.uni-kl.de",
         password: "mYfarm2021*"
       },
       {
         username: "doerr@cs.uni-kl.de",
         password: "mYfarm2022*"
       }
     ]
     let db = dbConnect.getDatabase();
     users.createClientUser(user[0].username, user[0].password)
       .then(function(ack){
         return users.createClientUser(user[1].username, user[1].password)
       }).then(function(ack){
         console.log("Users created successfully")
        console.log("Fetching API data ")
        bot = bot = api.getBot();


       api.token(user[0].username,user[0].password)
         .then(function(result){
           users.saveApiData(user[0].username, result, function(e){
             if(e){
               console.error(e)
               console.log("Successfully fetched the fakebot data ")
               console.log("Closing the server, please restart")
               process.exit();
             }
           })

         }).catch(err => {throw  err})

     }).catch(function(err){
       process.exit();

     })

   }
 })

   const params = {
     name:"Job Test",
     depth:5,
     min_dist: 5,
     working_area: {
       pos:{x:10,y:20},
       length: 20,
       width: 10
     },
   };
  //job.createJob(params);
  /*seeding_job.getAllJobs({}, function(err, res){
    console.log(res);
  });*/

  //start the server
  app.listen(port, ()=>{
    console.log("Webserver started on port " + port);
  });
})

