"use strict";

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(8095, err => {
  if(err) {
    console.log(err);
  } else {
    console.log("Server spawned on port 8095");
  }
});
