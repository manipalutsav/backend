const mongoose = require("mongoose");
const Team = require("./Team");

const schema = {
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot2',
    required: true,
  },
  round: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  judges: [
    {
      id: mongoose.Schema.Types.ObjectId,
      points: [Number],
    },
  ],
  overtime: {
    type: Number,
    required: true,
    default: 0,
  },
};

const options = {
  autoCreate: true,
};

const scoreSchema = new mongoose.Schema(schema, options);

scoreSchema.virtual("points").get(function () {
  return this.judges.reduce((acc, curr) => acc + curr.points.reduce((a, c) => a + c, 0), 0);
});

module.exports = mongoose.model("Score", scoreSchema);
