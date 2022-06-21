const express = require("express");
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
});