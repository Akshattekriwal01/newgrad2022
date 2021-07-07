const mongoose = require("mongoose");


vacancySchema = new mongoose.Schema({
  link: { type: String },
  detail: {type: String},// never show a dormant profile in any search result, setting profile picture makes this true. 
  name: {type: String},
});


module.exports = mongoose.model("vacancy", vacancySchema);
