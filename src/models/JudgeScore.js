const mongoose = require("mongoose");

const schema = {
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot2',
    required: true,
  },
  round: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  judge:
  {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  points: [Number]
};

const options = {
  autoCreate: true,
};

const judgeScoreSchema = new mongoose.Schema(schema, options);

judgeScoreSchema.virtual("total").get(function () {
  return this.points.reduce((acc, curr) => acc + curr, 0)
});

module.exports = mongoose.model("JudgeScore", judgeScoreSchema);
