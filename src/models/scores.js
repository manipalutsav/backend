let mongoose = require("mongoose");

let scoreSchema = new mongoose.Schema({
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
