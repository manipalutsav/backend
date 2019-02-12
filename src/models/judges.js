const mongoose = require("mongoose");

const judgeSchema = new mongoose.Schema({
  name: String,
  rounds: [ String ],
});

module.exports = mongoose.model("Judge", judgeSchema);
