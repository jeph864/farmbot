/*const express = require("express");
const app = express();
app.use(express.json());
app.get("/getting",(req,res)=>{
  const test = req.query.test;
  //res.send("Hello world");
  res.send(test);
});

app.post("/posting",(req,res)=>{
  const {testing} = req.body;
  res.json({status : "test successful"});
  console.log(testing.data);
})

app.put("/putting",(req,res)=>{

})

app.delete("/deleting",(req,res)=>{

})

app.listen(5000,()=>{
  console.log("Hello World")
});*/


//import contents of .env file
require('dotenv').config();

//add express and mongoose
const cors = require('cors');
const express =  require('express');
const mongoose = require('mongoose');

const mongoString = process.env.DATABASE_URL; // read URL


//connect database to server
mongoose.connect(mongoString);
const database = mongoose.connection;

//check connection success
database.on('error',(error)=>{
  console.log(error)
})

database.once('connected',()=>{
  console.log('Database connected');
})


//transfer contents of express into a const
const app = express();
app.use(cors())

//accept data in json
app.use(express.json());

const routes = require('./routes/home');

//use routes (base end point, content of routes)
//all endpoints will start from /api
app.use('/api', routes)

//set server to listen on port 3000
app.listen(3000, () =>{
  console.log('Server started ${3000}')
})

