let mongoose = require("mongoose");

let teamsSchema = new mongoose.Schema({
  id: Number,
  participants: [ Number ],
  maxParticipants: Number,
  minParticipants: Number,
  collegeId: Number,
  disqualified: Boolean,
});

module.exports = mongoose.model("Teams", teamsSchema);
