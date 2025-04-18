const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  regNo: {
    type: String,
    required: true
  },
  pan: {
    type: String,
    required: true
  },
  panPhotoPath: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true
  },
  bankName: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  ifsc: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  chequePhotoPath: {
    type: String,
    required: true
  }
}, { _id: false }); 

const winnerFormData = new mongoose.Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },
  participants: {
    type: [participantSchema],
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("WinnerSubmission", winnerFormData);
