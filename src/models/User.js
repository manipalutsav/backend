const mongoose = require("mongoose");

const schema = {
  name: {
    type: String,
    required: true,
  },
  email: {
    // TODO: Add `match: RegExp` to validate email.
    type: String,
    required: true,
    lowercase: true,
  },
  mobile: {
    // TODO: Add `match: RegExp` to validate mobile number.
    type: String,
  },
  type: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
};

const options = {
  autoCreate: true,
};

const userSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("User", userSchema);
