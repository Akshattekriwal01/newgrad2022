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


let runner = async()=>{
  try{
    await script.run();

    }catch(e){
      console.log(e);
    }
}
runner();
//Runs every one hour
var job = new CronJob('0 0 * * * *', function() {
  runner();
}, null, true, 'America/Los_Angeles');
//job.start();

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/user",userRoutes);
  const port = 3009
app.listen(port, () => console.log(`server is listening at ${port}`));