let mongoose = require("mongoose");

let judgeSchema = new mongoose.Schema({
  name: String,
  rounds: [ String ],
});

module.exports = mongoose.model("Judge", judgeSchema);
