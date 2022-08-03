import { Db, MongoClient } from "mongodb";
import axios from "axios"
import { Farmbot } from "farmbot";
import { SeedingJob } from "../jobs/seeding";
import { WateringJob } from "../jobs/watering";
import { EventQueue } from "../jobs/queue";
import { Scheduler } from "../jobs/scheduler";
import { Slots } from "./dynamic_slots";
import { UnsafeLocation } from "./unsafe_locations";

const MONGO_URL: string = process.env.MONGO_URI !;

const client = new MongoClient(MONGO_URL);
let dbConnection;
export let unsafe_locations: UnsafeLocation;
export let  status_message;
export let seeding_jobs: SeedingJob;
export let watering_jobs: WateringJob;
export let event_queue: EventQueue;
export let slots_container: Slots
export const FAKE_USER = 0;
export const REAL_USER = 1;


export let bot: Farmbot;

let users : Users;

type UserArgs =
  {
    device_id?: ""| string,
    api_token?: ""|string,
    api_user_id?: ""|string,
    role?: "fake"|"real"
 };

export interface ApiData{}
export interface SetupArgs {
  port : number;
  username: string;
  fallback_user:  number;
}
const CLIENT_USER_COLLECTION = "clientUser"
const API_DATA_COLLECTION = "apiData"
const SEQ_COLLECTION = "sequences"
export class Users{
  private readonly db: Db;
  constructor() {
    this.db = DBSetup.getDatabase();
  }
  createClientUser = (username: string, password:string, args: UserArgs) =>{
    return this.db.collection(CLIENT_USER_COLLECTION)
      .findOneAndUpdate(
        { username : username},
        {
          $set: {
            "username": username,
            "password": password,
            "role": args.role
          },
        },
        {upsert: true}
      )
  }
  getClientUser = (username: string) =>{
    return this.db.collection('clientUser')
      .findOne({"username": username})
  }
  saveApiDate = (username: string, data) => {
    return this.getClientUser(username)
      .then((res )  => {
        return this.db.collection(API_DATA_COLLECTION)
          .updateOne(
            {username: res!.username},
            {$set: { username: res!.username, data: data}}
          )
      })
  }
  getApiData = (username: string) => {
    return this.db.collection(API_DATA_COLLECTION)
      .findOne({username: username})
  }
}

export const Api = {
  connect : (token: string) => {
    bot = new Farmbot({token : token});
    return bot.connect()
      .then(  result => {
        console.log("Successfully connected to the Farmbot");
        return Promise.resolve(result);
      }).catch( err => {
        console.error(err);
        process.exit();
      })
  },
  getBot: () => {
    return bot;
  },
  token: (email: string, password:string) => {
    const config = {
      method: 'post',
      url: 'https://my.farm.bot/api/tokens',
      headers: {
        'Content-Type': 'application/json'
      },
      data : JSON.stringify({
        "user": {
          "email": email,
          "password": password
        }
      })
    };
    return  axios(config)
  }
}
export const DBSetup = {
  seq_collection : SEQ_COLLECTION,
  connect : () => {
    return client.connect()
      .then( db => {
        dbConnection = db.db("farmbot")
        console.log("Successfully connected to MongoDB");
      }).catch(err => {
        console.error(err);
        console.log("Exiting... Could not connect to the database");
        process.exit()
      })
  },
  getDatabase : () => {
    return dbConnection;
  },
  getSeq: (callback) => {
    const db = DBSetup.getDatabase();
    // @ts-ignore
    let collection_seq = this.seq_collection;
    return db.collection(collection_seq)
      .findOne({})
      .then(res => {
        const doc = {next_id : 0}
        if (res) {
          if (callback)callback(res);
        }
        else db.collection(collection_seq).insertOne(doc)
          .then(_ => { if (callback) callback(doc);})
          .catch( _ => {if (callback) callback(null)})
      }).catch(_ => {if (callback) callback(null)});

  },
  setSeq: (set = true) => {
    const db = DBSetup.getDatabase();
    // @ts-ignore
    let collection_seq = this.seq_collection;
    return db.collection(collection_seq)
      .updateOne({}, {$inc : {next_id: set?1 : 0}})
  }
}

export function setup(args: SetupArgs) {
  const initUsers = (users: Users) => {
    if(!users) {
      users = new Users();
    }
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
    return users.createClientUser(user[FAKE_USER].username, user[FAKE_USER].password, {})
      .then(_ => {
        return users.createClientUser(user[REAL_USER].username, user[REAL_USER].password, {})
      }).then(_ => {
        console.log("Users created successfully")
        console.log("Fetching API data ")
        bot = Api.getBot();
        return Api.token(user[args.fallback_user].username, user[args.fallback_user].password)
      }).then(_ => {
        return users.getApiData(args.username)
      })
  }
  const database = DBSetup.getDatabase();
  return DBSetup.connect()
    .then(_ => {
      users = new Users();
      return users.getApiData(args.username)
    })
    .catch( _ => {
      console.log("Init: users")
      return initUsers(users)
    })
    .then(results  => {
      return Api.connect(results!.data.token.encoded)
    })
    .then(_ => {
      bot = Api.getBot();
      bot.client!.on('message', function (topic, payload, _){
        if(topic == bot.channel.status){
          status_message = JSON.parse(payload.toString()).location_data.position;
          //console.log(status_message)
        }
      })
      console.log("Initializing the Jobs")
      unsafe_locations = new UnsafeLocation({db: DBSetup.getDatabase()})
      seeding_jobs = new SeedingJob(bot);
      watering_jobs = new WateringJob(bot);
      //slots
      slots_container = new Slots(DBSetup.getDatabase());
      event_queue = new EventQueue(bot);
      //schedulers
      const dbase = DBSetup.getDatabase();
      const sch1 = new Scheduler(database)
      const event_collector = (new Scheduler(dbase)).getAgenda();
      event_collector.define("collectEvents", async (_) => {
        await event_queue.collectEvents();
      })
      event_collector.every("10 seconds", "collectEvents")
        .then(_ => {
          return event_collector.start();
        }).then(_ => {})
      const queue_executor = (new Scheduler(dbase)).getAgenda();
      queue_executor.define("runQueuedJobs", async (_) => {
        await event_queue.process();
      })
      queue_executor.every("5 seconds", "runQueuedJobs")
        .then(_ => {
          return queue_executor.start();
        }).then(_ => {})
    })
}

