const mongoose = require("mongoose");
const Team = require("./Team");

const schema = {
  round: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  judge:
  {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  time: {
    type: Number,
    required: true,
    default: 0,
  },
  ua: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true
  }
};

const options = {
  autoCreate: true,
};

const scoreBackupSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("ScoreBackup", scoreBackupSchema);
