'use strict';
const express = require("express");
const app = express();
const config = require('config');
var CronJob = require('cron').CronJob;
const connectDB = require("./config/db");
const collector = require('./src/getAllJobs');
const script = require("./src/vacancy");
const userRoutes = require("./src/user");
const bodyParser = require("body-parser");
connectDB();




let j = async()=>{
  try{
  let data = await collector.getData();
  console.log(data);
  }catch(e){
    console.log(e);
  }
 
};

let runner = async()=>{
  try{
    let data = await script.run();
    console.log(data);
    }catch(e){
      console.log(e);
    }
}
runner();
//j();
// var job = new CronJob('0 */1 * * * *', function() {
//   j();
// }, null, true, 'America/Los_Angeles');
// job.start();

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/user",userRoutes);
  const port = 3009
app.listen(port, () => console.log(`server is listening at ${port}`));