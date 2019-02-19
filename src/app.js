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
const judgeRouter = require("./routes/judge");
const judgesRouter = require("./routes/judges");

app.use("/user", userRouter);
app.use("/judge", judgeRouter);
app.use("/judges", judgesRouter);

// Error handlers
app.use(handle404);
app.use(errorHandler);

module.exports = app;
