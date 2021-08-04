'use strict';
const express = require("express");
const app = express();
const config = require('config');
var CronJob = require('cron').CronJob;
const connectDB = require("./config/db");
const collector = require('./src/getAllJobs');
const script = require("./src/vacancy");
const userRoutes = require("./src/user");
const cors = require("cors");
var https = require('https');
const notifier = require('./src/notify');
const userM = require('./models/user');
const bodyParser = require("body-parser");
connectDB();



let runner = async()=>{

  try{
    await script.run();
    console.log("in runner");
    }catch(e){
      console.log(e);
    }
}
//runner();
//Runs every one hour
var job = new CronJob('0 */30 * * * *', function() {
  runner();
}, null, true, 'America/Los_Angeles');
job.start();
var corsOptions = {
  origin:['https://akshattekriwal.com', 'https://www.akshattekriwal.com'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

let beg = async()=>{
  // add the message inside notfier.js
  try{
let users = await userM.find({verified:true},"number").exec();
if(!users){

}else{
   notifier.notify(users,{});
}
}catch(e){
  console.log(e)
  }
}


app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(function(req, res, next) {
//   console.log(req.originalUrl);
//   next();
// });
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true")
  res.header("Access-Control-Allow-Credentials", "*");
  res.header("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
  next();
});
// app.get("/form" async (req,res)=>{

// })
app.use("/user",userRoutes);
  const port = 3009
app.listen(port, () => console.log(`server is listening at ${port}`));

//https.createServer(app).listen(443)
