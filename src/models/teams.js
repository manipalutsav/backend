const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  participants: [ String ],
  maxParticipants: Number,
  minParticipants: Number,
  collegeId: String,
  disqualified: Boolean,
});

module.exports = mongoose.model("Team", teamSchema);
