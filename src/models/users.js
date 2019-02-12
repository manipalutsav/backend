let mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  // Registration Number
  id: String,
  name: String,
  email: String,
  contact: String,
  type: Number,
  password: String,
  collegeId: String,
  faculty: Boolean,
});

module.exports = mongoose.model("User", userSchema);
