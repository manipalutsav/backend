let mongoose = require("mongoose");

let ScoresSchema = new mongoose.Schema({
  id: Number,
  round: String,
  team: Number,
  judges: [
    {
      id: Number,
      points: [ Number ],
    },
  ],
});

module.exports = mongoose.model("Scores", ScoresSchema);
