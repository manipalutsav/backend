const mongoose = require("mongoose");

const schema = {
  team: mongoose.Schema.Types.ObjectId,
  round: mongoose.Schema.Types.ObjectId,
  judges: [
    {
      id: mongoose.Schema.Types.ObjectId,
      points: [ Number ],
    },
  ],
};

const options = {
  autoCreate: true,
};

const scoreSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("Score", scoreSchema);
