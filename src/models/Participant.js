const mongoose = require("mongoose");

const schema = {
  registrationID: {
    // TODO: Add `match: RegExp` to validate registration number.
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    // TODO: Add `match: RegExp` to validate email.
    type: String,
    required: true,
    lowercase: true,
  },
  mobile: {
    // TODO: Add `match: RegExp` to validate mobile number.
    type: String,
    required: true,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  faculty: {
    type: Boolean,
    required: true,
  },
};

const options = {
  autoCreate: true,
};

const participantSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("Participant", participantSchema);
