const mongoose = require("mongoose");

//IMPROVE: Participant is also a user, have login, send mail to mahe email id
//Particiant could login and see their events and schedules, certificates etc.
const schema = {
  registrationID: {
    type: String,
    required: true,
    match: /^(?:(?:MAHE[\d]{7})|(?:MAHER[\d]{6})|(?:MSS[\d]{4,5})|(?:MAGE[\d]{8})|(?:EC[\d]{4,5})|(?:[\d]{9}))$/i,
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
    default: false,
  },
  certificateEligible: {
    type: Boolean,
    default: true,
  }
};

const options = {
  autoCreate: true,
};

const participantSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("Participant", participantSchema);
