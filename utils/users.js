const dbConnect = require("./conn");

let db = dbConnect.getDatabase();
module.exports = {
  createClientUser: function(username, password, device_id = "", api_token = "", api_user_id = "", role = "fake"){
    let db = dbConnect.getDatabase();
    return db.collection('clientUser')
      .findOneAndUpdate(
        {"username": username},
        {
          $set: {
            "username": username,
            "password": password,
            "role": role
          }
        },
        {upsert : true}
      );
  },
  getClientUser: function(username, callback = null){
    let db = dbConnect.getDatabase();
    db.collection('clientUser')
      .findOne({"username": username}, function (err, result){
        if(err){
          throw new Error(err);
        }
        callback(null, result);
      });
  },
  saveApiData : function(username, data, callback = null){
    let db = dbConnect.getDatabase();
    this.getClientUser(username, function(err, results){
      if (err) throw err;
      if(results){
        return db.collection('apiData')
          .updateOne(
            {"username": results.username},
            {
              $set: {
                "username": username,
                "data" : data
              }
            },
            {upsert : true}
          ).then(function(data){
            if(callback) callback(data)
          });
      }
    });

  },
  getApiData : function(username, callback){
    let db = dbConnect.getDatabase();
    db.collection('apiData')
      .findOne({"username": username}, function (err, result){
        if(err){
          throw new Error(err);
        }
        callback(null, result);
      });
  },
  createOrUpdateSeedingJob : function (seedingJobParams){
    let db = dbConnect.getDatabase();
  },
  deleteSeedingJob : function(jobId){
  },
  addSeedingJobToExecutionQueue: function(seedingJobExecParams){
  }
}