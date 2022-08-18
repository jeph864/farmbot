const axios = require('axios');
const Farmbot = require('farmbot').Farmbot;


let bot;
async  function token(email, password){
  const data = JSON.stringify({
    "user": {
      "email": email,
      "password": password
    }
  });
  const config = {
    method: 'post',
    url: 'https://my.farm.bot/api/tokens',
    headers: {
      'Content-Type': 'application/json'
    },
    data : data
  };
  let res = await axios(config)
    .catch(function(err) {
      throw err;
    });
  return res.data;
}

module.exports = {
  token,
  connect : function(token, callback){
    bot = new Farmbot({token: token});
    bot.connect()
      .then(function(res){
        console.log("Successfully connected to the Farmbot");
        callback();
      })
      .catch(function(error){
        console.log(error)
        callback(error);
      });
  },
  getBot : function(){
    return bot;
  },
  getStatus :  function(callback){
    bot.on('message', function (topic, payload, packet){
      if(topic == bot.channel.status){
        //console.log(JSON.parse(payload.toString()))
        console.log(JSON.parse(payload.toString()))
        callback(null, JSON.parse(payload.toString()));
      return JSON.parse(payload.toString())
      }
    })
  }
}
