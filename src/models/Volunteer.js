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
  phoneNumber: {
    type: Number,
    required: true,
  },
  shirtSize: {
    type: String,
    required: false,
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  type: {
    type: String,
    required: true,
  }
};

const options = {
  autoCreate: true,
};
const VolunteerSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("Volunteer", VolunteerSchema);
