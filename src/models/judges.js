const mongoose = require("mongoose");

const schema = {
  name: {
    type: String,
    required: true,
  },
  // TODO: Should it be rounds instead?
  events: [ mongoose.Schema.Types.ObjectId ],
};

const options = {
  autoCreate: true,
};

const judgeSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("Judge", judgeSchema);
