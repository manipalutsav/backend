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
  criteria: [ String ],
  teams: [ mongoose.Schema.Types.ObjectId ],
  minParticipants: Number,
  maxParticipants: Number,
  maxTeamsPerCollege: Number,
  venue: String,
  description: String,
  duration: Number,
  startDate: Date,
  endDate: Date,
  slottable: {
    type: Boolean,
    required: true,
    default: true,
  },
  isFaculty: Boolean,
};

const options = {
  autoCreate: true,
};

const eventSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("Event", eventSchema);
