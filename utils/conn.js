const { MongoClient } = require("mongodb");
const mongoUrl = process.env.MONGO_URI;
const client = new MongoClient(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connect: function(callback){
    client.connect(function( err, db){
      if(err || !db){
        return callback(err);
      }
      dbConnection = db.db("farmbot");
      console.log("Successfully connected to MongoDB");
      return callback();
    });
  },
  getDatabase : function(){
    return dbConnection;
  }
};