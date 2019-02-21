"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

// Middlewares
// TODO: Implement auth middleware
// const auth = require("./middlewares/auth");
const handle404 = require("./middlewares/handle404");
const errorHandler = require("./middlewares/errorHandler");
const headers = require("./middlewares/headers");

// Configure application
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(headers);

// Routes
const userRouter = require("./routes/user");

app.use("/user", userRouter);

// Error handlers
app.use(handle404);
app.use(errorHandler);

module.exports = app;
