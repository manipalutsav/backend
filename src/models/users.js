
let mongoose = require("mongoose");

let usersSchema = new mongoose.Schema({
  id: Number,
  name: String,
  email: String,
  contact: [ Number ],
  permissions: Number,
  password: String,
  collegeId: Number,
  regNo: Number,
  teams: [ Number ],
});

module.exports = mongoose.model("Users", usersSchema);
