const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");
console.log(db);
const connect = async () => {
  try {
    console.log("in mongoose1");
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useFindAndModify: false 
    });
    console.log("DB connected");
  } catch (err) {
    console.log("in mongoose2");
    console.log(err.message);
    //exit process with failure
    process.exit(1);
  }
};

module.exports = connect;
