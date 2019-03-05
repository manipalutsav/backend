const mongoose = require("mongoose");

const schema = {
  name: String,
  event: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  members: [ mongoose.Schema.Types.ObjectId ],
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
