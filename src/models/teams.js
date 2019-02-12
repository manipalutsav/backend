let mongoose = require("mongoose");

let teamSchema = new mongoose.Schema({
  participants: [ String ],
  maxParticipants: Number,
  minParticipants: Number,
  collegeId: String,
  disqualified: Boolean,
});

module.exports = mongoose.model("Team", teamSchema);
