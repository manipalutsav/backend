const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  // Format for RoundID: EventID.RoundNumber
  rounds: [ String ],
  name: String,
  collegeId: String,
  teams: [ String ],
  maxTeams: Number,
  minParticipants: Number,
  maxParticipants: Number,
  venue: String,
  description: String,
  duration: Number,
  startDate: Date,
  endDate: Date,
  slottable: Boolean,
});

module.exports = mongoose.model("Event", eventSchema);
