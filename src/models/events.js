let mongoose = require("mongoose");

let eventsSchema = new mongoose.Schema({
  id: 2828,
  rounds: [ Number ],
  name: String,
  collegeId: Number,
  teams: [ Number ],
  maxTeams: Number,
  venue: String,
  description: String,
  duration: Number,
  startDate: Date,
  endDate: Date,
});

module.exports = mongoose.model("Events", eventsSchema);
