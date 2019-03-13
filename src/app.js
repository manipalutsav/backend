"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
dotenv.config();

// Middlewares
const handle404 = require("./middlewares/handle404");
const errorHandler = require("./middlewares/errorHandler");
const headers = require("./middlewares/headers");
const auth = require("./middlewares/auth");

// Configure application
app.use(logger("combined"));
app.use(cors({
  origin: [
    "http://manipalutsav.com",
    "https://manipalutsav.com",
    "https://manipalutsav.github.io",
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
/* if (process.env.NODE_ENV !== "development"){*/
app.use(auth);
//  eslint-disable-next-line no-console
console.log("💳  Auth activated");
/* }*/

// Routes
const collegesRouter = require("./routes/colleges");
const eventsRouter = require("./routes/events");
const leaderboardRouter = require("./routes/leaderboard");
const usersRouter = require("./routes/users");
const judgesRouter = require("./routes/judges");

app.use("/colleges", collegesRouter);
app.use("/events", eventsRouter);
app.use("/leaderboard", leaderboardRouter);
app.use("/users", usersRouter);
app.use("/judges", judgesRouter);

// Error handlers
app.use(handle404);
app.use(errorHandler);

module.exports = app;
