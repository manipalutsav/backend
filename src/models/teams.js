const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  collegeId: String,
  participants: [ String ],
  eventID: String,
  disqualified: Boolean,
});

module.exports = mongoose.model("Team", teamSchema);
