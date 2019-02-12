let mongoose = require("mongoose");

let slotSchema = new mongoose.Schema({
  slotNo: Number,
  round: String,
  team: String,
});

module.exports = mongoose.model("Slot", slotSchema);
