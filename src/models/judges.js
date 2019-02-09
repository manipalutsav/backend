let mongoose = require("mongoose");

let judgesSchema = new mongoose.Schema({
  id: Number,
  name: String,
  rounds: [ String ],
});

module.exports = mongoose.model("Judges", judgesSchema);
