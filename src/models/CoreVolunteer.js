const mongoose = require("mongoose");

const schema = {
  name: {
    type: String,
    required: true,
  },
  registerNumber: {
    type: Number,
    required: true,
  },
  shirtSize: {
    type: String,
    required: true,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
};

const options = {
  autoCreate: true,
};
const coreVolunteerSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("CoreVolunteer", coreVolunteerSchema);
