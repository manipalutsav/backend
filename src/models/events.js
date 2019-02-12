let mongoose = require("mongoose");

let eventSchema = new mongoose.Schema({
  // Format for RoundID: EventID.RoundNumber
  rounds: [ String ],
  name: String,
  collegeId: String,
  teams: [ String ],
  maxTeams: Number,
  venue: String,
  description: String,
  duration: Number,
  startDate: Date,
  endDate: Date,
  slottable: Boolean,
});

module.exports = mongoose.model("Event", eventSchema);
