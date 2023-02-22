const mongoose = require("mongoose");

const schema = {
  schema: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  data: {
    type: Object,
    required: true,
  },
};

const options = {
  autoCreate: true,
};

const deletedSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("Deleted", deletedSchema);
