let mongoose = require("mongoose");

let collegesSchema = new mongoose.Schema({
  id: Number,
  name: String,
  location: String,
});

module.exports = mongoose.model("Colleges", collegesSchema);
