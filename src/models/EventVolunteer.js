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
  college: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
};

const options = {
  autoCreate: true,
};
const eventVolunteerSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("EventVolunteer", eventVolunteerSchema);
