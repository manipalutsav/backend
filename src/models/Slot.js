const mongoose = require("mongoose");

const schema = {
  number: {
    type: Number,
    required: true,
  },
  round: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
};

const options = {
  autoCreate: true,
};

const slotSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("Slot", slotSchema);
