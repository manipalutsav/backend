const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({
  name: String,
  location: String,
});

module.exports = mongoose.model("College", collegeSchema);
