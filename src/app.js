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

const collegeRouter = require("./routes/college");
const judgeRouter = require("./routes/judge");
const judgesRouter = require("./routes/judges");
const leaderboardRouter = require("./routes/leaderboard");
const slotRouter = require("./routes/slot");
const slotsRouter = require("./routes/slots");
const userRouter = require("./routes/user");
const teamRouter = require("./routes/team");

app.use("/college", collegeRouter);
app.use("/judge", judgeRouter);
app.use("/judges", judgesRouter);
app.use("/leaderboard", leaderboardRouter);
app.use("/slot", slotRouter);
app.use("/slots", slotsRouter);
app.use("/user", userRouter);
app.use("/team", teamRouter);

// Error handlers
app.use(handle404);
app.use(errorHandler);

module.exports = app;
