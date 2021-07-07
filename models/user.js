const mongoose = require("mongoose");


userSchema = new mongoose.Schema({
  verified: {type: Boolean, default: false},// never show a dormant profile in any search result, setting profile picture makes this true. 
  name: {type: String},
  number:{type: String,unique: true },
  otp:{type: Number}
});


module.exports = mongoose.model("User", userSchema);
