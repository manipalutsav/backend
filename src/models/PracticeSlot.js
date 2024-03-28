const mongoose = require("mongoose");

const schema = {
  number: {
    type: Number,
    required: true,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    required: true,
  },
  index: {
    type: Number,
  },
  date:Date
};

const options = {
  autoCreate: true,
};

const practiceSlotSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("PracticeSlot", practiceSlotSchema);
