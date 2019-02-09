let mongoose = require("mongoose");

let slotsSchema = new mongoose.Schema({
  slotNo: Number,
  team: Number,
  round: String,
});

module.exports = mongoose.model("Slots", slotsSchema);
