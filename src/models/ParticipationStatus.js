const mongoose = require("mongoose");

const schema = {
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
  status: {
    type: String,
    required: true
  }
};

const options = {
  autoCreate: true,
};

const teamSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("ParticipationStatus", teamSchema);
