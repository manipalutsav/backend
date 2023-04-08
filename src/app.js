"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const chalk = require("chalk");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Middlewares
const handle404 = require("./middlewares/handle404");
const errorHandler = require("./middlewares/errorHandler");
const headers = require("./middlewares/headers");
const auth = require("./middlewares/auth");

// Configure application


app.use(cors({
  origin: [
    "http://manipalutsav.github.io",
    "https://manipalutsav.github.io",
    "http://manipalutsav.com",
    "https://manipalutsav.com",
    /\.manipalutsav\.com$/,
    /^(https?:\/\/)(localhost|(192\.168\.\d{1,3}\.\d{1,3}))(:\d{1,5})*$/,
    // /^(?:https?:\/\/)?(?:localhost|(?:192\.168(?:\.(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])){2})(?::(?:[0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))$/,
  ],
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(headers);


if (process.env.NODE_ENV !== "development") app.use(auth);
//::ffff:172.68.154.133 Sat, 08 Apr 2023 22:06:50 GMT POST /events/6246c631e4164a291dd21005/rounds/642d461e7dcfe149a2298970/judges/640a300d2445a63259c09373/backup 200 https://test.manipalutsav.com/ Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 1990.208

app.use(logger(function (tokens, req, res) {
  return chalk.redBright(tokens["remote-addr"](req, res))
    + " " + chalk.blue(tokens.date(req, res))
    + " " + chalk.green(tokens.method(req, res))
    + " " + chalk.white(tokens.url(req, res))
    + " " + chalk.green(tokens.status(req, res))
    + " " + chalk.redBright(tokens.referrer(req, res))
    + " " + chalk.yellow(tokens["user-agent"](req, res))
    + " " + chalk.cyan(tokens["response-time"](req, res))
    + " " + chalk.white(req.user.email || "(anonymous)");
}));

// Routes
const collegesRouter = require("./routes/colleges");
const eventsRouter = require("./routes/events");
const leaderboardRouter = require("./routes/leaderboard");
const usersRouter = require("./routes/users");
const judgesRouter = require("./routes/judges");
const intruderRouter = require("./routes/intruder");
const participantsRouter = require("./routes/participants");
const statsRouter = require("./routes/stats");
const coreVolunteerRouter = require("./routes/coreVolunteer");
const eventVolunteerRouter = require("./routes/eventVolunteer");
const volunteerRouter = require("./routes/volunteer");
const participationStatus = require("./routes/participationStatus");

app.use("/colleges", collegesRouter);
app.use("/events", eventsRouter);
app.use("/leaderboard", leaderboardRouter);
app.use("/users", usersRouter);
app.use("/judges", judgesRouter);
app.use("/intruder", intruderRouter);
app.use("/participants", participantsRouter);
app.use("/stats", statsRouter);
app.use("/participationStatus", participationStatus)
app.use("/coreVolunteer", coreVolunteerRouter);
app.use("/eventVolunteer", eventVolunteerRouter);
app.use("/volunteer", volunteerRouter);

// Error handlers
app.use(handle404);
app.use(errorHandler);

module.exports = app;
