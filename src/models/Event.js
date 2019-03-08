const mongoose = require("mongoose");

const schema = {
  rounds: [ mongoose.Schema.Types.ObjectId ],
  name: {
    type: String,
    required: true,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  minMembersPerTeam: Number,
  maxMembersPerTeam: Number,
  maxTeamsPerCollege: Number,
  venue: String,
  description: String,
  duration: Number,
  startDate: Date,
  endDate: Date,
  isFaculty: Boolean,
};

const options = {
  autoCreate: true,
};

const eventSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("Event", eventSchema);
