const mongoose = require("mongoose");
const { ROUND_STATUS } = require("../utils/constants");

const schema = {
  event: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  teams: [ mongoose.Schema.Types.ObjectId ],
  slottable: {
    type: Boolean,
    required: true,
    default: true,
  },
  status: {
    type: Number,
    default: ROUND_STATUS.SCHEDULED,
  },
};

const options = {
  autoCreate: true,
};

const roundSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("Round", roundSchema);
