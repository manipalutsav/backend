const mongoose = require("mongoose");

const schema = {
  number: {
    type: Number,
    required: true,
  },
  round: mongoose.Schema.Types.ObjectId,
  team: mongoose.Schema.Types.ObjectId,
};

const options = {
  autoCreate: true,
};

const slotSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("Slot", slotSchema);
