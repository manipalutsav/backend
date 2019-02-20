const mongoose = require("mongoose");

const schema = {
  event: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  teams: [ mongoose.Schema.Types.ObjectId ],
  duration: Number,
  slottable: {
    type: Boolean,
    required: true,
    default: true,
  },
};

const options = {
  autoCreate: true,
};

const roundSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("Round", roundSchema);
