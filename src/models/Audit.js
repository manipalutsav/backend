const mongoose = require("mongoose");

const schema = {
  method: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  user: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
  },
};

const options = {
  autoCreate: true,
};

const auditSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("Audit", auditSchema);
