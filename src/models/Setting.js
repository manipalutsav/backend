/* eslint-disable linebreak-style */
const mongoose = require("mongoose");

const schema = {
  title: {
    type: String,
    required: true,
  },
  editTeamEnabled: {
    type: Boolean,
    required: true,
  },
};

const options = {
  autoCreate: true,
};

const settingSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("Setting", settingSchema);
