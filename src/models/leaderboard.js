const mongoose = require("mongoose");

const schema = {
  college: mongoose.Schema.Types.ObjectId,
  points: {
    type: Number,
    required: true,
  }
};

const options = {
  autoCreate: true,
};

const judgeSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("Leaderboard", judgeSchema);
