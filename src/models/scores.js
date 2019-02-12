const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  // Format: RoundID.TeamID
  id: String,
  judges: [
    {
      id: String,
      points: [ Number ],
    },
  ],
});

module.exports = mongoose.model("Score", scoreSchema);
