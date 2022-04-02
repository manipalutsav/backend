const mongoose = require("mongoose");
const College = require("./College");
const Event = require("./Event");

const schema = {
  name: {
    type: String,
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participant' }],
  disqualified: {
    type: Boolean,
    required: true,
    default: false,
  },
};

const options = {
  autoCreate: true,
};

const teamSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("Team", teamSchema);
