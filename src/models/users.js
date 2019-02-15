let mongoose = require("mongoose");

let usersSchema = new mongoose.Schema({
  name: String,
  email: String,
  contact: [ Number ],
  type: Number,
  password: String,
  collegeId: Number,
  regNo: Number,
  teams: [ Number ],
  isAdmin: Boolean,
});

module.exports = mongoose.model("Users", usersSchema);
