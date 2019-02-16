"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

// Will be used soon.
// eslint-disable-next-line no-unused-vars
const db = require("./utils/dbHelper");

// Configure application
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const usersRouter = require("./routes/users");

app.use("/users", usersRouter);

module.exports = app;
