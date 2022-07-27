import {MongoClient} from "mongodb";
const MONGO_URL: string = process.env.MONGO_URI !;

const client = new MongoClient(MONGO_URL);
let dbConnection;

export const DB = {
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
  }
}
