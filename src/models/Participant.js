const mongoose = require("mongoose");

const schema = {
  registrationID: {
    type: String,
    required: true,
    match: /^(?:(?:MAHE[\d]{7})|(?:[\d]{9}))$/i,
  },
  name: {
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
