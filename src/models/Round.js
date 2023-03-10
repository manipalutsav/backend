const mongoose = require("mongoose");
const { ROUND_STATUS } = require("../utils/constants");

const schema = {
  event: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  teams: [mongoose.Schema.Types.ObjectId],
  criteria: [{
    criterion: String,
    weightage: {
      type: Number,
      required: true,
      default: 10
    }
  }],
  slotType: {
    type: String,
    required: true,
    default: "all",
    match: /^(?:all|registered)$/i,
  },
  slotOrder: {
    type: String,
    required: true,
    default: "random",
    match: /^(?:random|asc|desc)$/i,
  },
  status: {
    type: Number,
    default: ROUND_STATUS.SCHEDULED,
  },

  published: {
    type: Boolean,
    default: false,
  },
};

const options = {
  autoCreate: true,
};

const roundSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("Round", roundSchema);
