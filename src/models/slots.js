const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  slotNo: Number,
  round: String,
  team: String,
});

module.exports = mongoose.model("Slot", slotSchema);
