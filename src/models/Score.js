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

collegeSchema.virtual('points').get(function() {
 return this.judges.reduce((acc, curr) => acc + curr.points.reduce((a, c) => a + c, 0), 0);
});

module.exports = mongoose.model("Score", scoreSchema);
