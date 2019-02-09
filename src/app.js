"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const dotenv = require("dotenv");

// Will be used soon.
// eslint-disable-next-line no-unused-vars
const db = require("./utils/dbHelper");

// Create Express.js application
const app = express();

// Configure application
dotenv.config();
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("./routes/users")(app);
module.exports = app;
