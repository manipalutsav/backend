const mongoose = require("mongoose");

const schema = {
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
};

const options = {
  autoCreate: true,
};

const collegeSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("College", collegeSchema);
