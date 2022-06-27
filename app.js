require('dotenv').config({ path: './config.env' });
const express = require('express');
const session = require('express-session');
const path = require('path');
const api = require("./utils/api")

const dbConnect = require("./utils/conn");
const users = require("./utils/users");
const SeedingJob = require("./utils/seedingJob");

const port =3000;
let seeding_job = null ;
let bot = null;


const app = express();

app.use(session({
  secret: 'secret',
  resave: true,
  name: 'farmbot_session',
  saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  let search_term = req.body.name, pattern = '^'+search_term;
  seeding_job.getAllJobs({name: {'$regex': pattern, '$options': 'i'}}, function(err, results){
    if(err) throw  err;
    if (results){
      res.json(results);
    }
    next();
  })
})
app.post('/jobs/create/', function(req, res, next){
  let params = req.body;
  seeding_job.createJob(params, function(error ,results){
    if(error) throw error;
    if (results) {
      res.send("Job created successfully");
    }
    next();
  })
});

app.get('/jobs/execute/', function(req,response,next){

  seeding_job.executeJob(req.body.job_id, function(error, results){
    if (results){
      console.log(results)
      response.send("Finished running job in the queue");
    }
    if(error) throw error;
    next();
  })

})
app.get('/status', function(req, res, next){
  api.getStatus(function(err, data){
    console.log(data);
  })
  res.send("No response");
});
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


//init database:
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
             //console.log(JSON.parse(payload.toString()).location_data.position)
           }
         })

         seeding_job = new SeedingJob(bot);
       }
     })
   }else{
     console.log("User not found");
     process.exit()
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
    console.log("Webserver started on port 3000");
  });
})

