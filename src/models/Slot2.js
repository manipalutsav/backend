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
  teamName: {
    type: String,
    required: true,
  },
};

const options = {
  autoCreate: true,
};

const slot2Schema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("Slot2", slot2Schema);
