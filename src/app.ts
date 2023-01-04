import express from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import chalk from "chalk";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import https from 'https';
import fs from 'fs';
import path from 'path';
import db from "./utils/dbHelper";
// Routes
import collegesRouter from "./routes/colleges";
import eventsRouter from "./routes/events";
import leaderboardRouter from "./routes/leaderboard";
import usersRouter from "./routes/users";
import judgesRouter from "./routes/judges";
import intruderRouter from "./routes/intruder";
import participantsRouter from "./routes/participants";
import statsRouter from "./routes/stats";
import coreVolunteerRouter from "./routes/coreVolunteer";
import eventVolunteerRouter from "./routes/eventVolunteer";


dotenv.config();

const app = express();

// Middlewares
import handle404 from "./middlewares/handle404";
import errorHandler from "./middlewares/errorHandler";
import headers from "./middlewares/headers";
import auth from "./middlewares/auth";

// Configure application

app.use(logger(function (tokens, req, res) {
  return chalk.redBright(tokens["remote-addr"](req, res))
    + " " + chalk.blue(tokens.date(req, res))
    + " " + chalk.green(tokens.method(req, res))
    + " " + chalk.white(tokens.url(req, res))
    + " " + chalk.green(tokens.status(req, res))
    + " " + chalk.redBright(tokens.referrer(req, res))
    + " " + chalk.yellow(tokens["user-agent"](req, res))
    + " " + chalk.cyan(tokens["response-time"](req, res));
}));
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


app.use("/colleges", collegesRouter);
app.use("/events", eventsRouter);
app.use("/leaderboard", leaderboardRouter);
app.use("/users", usersRouter);
app.use("/judges", judgesRouter);
app.use("/intruder", intruderRouter);
app.use("/participants", participantsRouter);
app.use("/stats", statsRouter);

app.use("/coreVolunteer", coreVolunteerRouter);
app.use("/eventVolunteer", eventVolunteerRouter);

// Error handlers
app.use(handle404);
app.use(errorHandler);

const port = normalizePort(process.env.PORT || "3003");
app.set("port", port);

const cert = path.resolve("ssl/cert.pem");
const key = path.resolve("ssl/key.pem");
const useSSL = (fs.existsSync(cert) && fs.existsSync(key));
if (useSSL) {
  console.log("Using SSL");
}
const server = useSSL ? https.createServer({
  key: fs.readFileSync(key),
  cert: fs.readFileSync(cert)
}, app) : http.createServer(app);

server.listen(port);

server.on("error", onError);
server.on("listening", onListening);

process.on('SIGINT', onShutdown);

function normalizePort(val: string) {
  let port = parseInt(val, 10);

  if (isNaN(port)) return val;
  if (port >= 0) return port;

  return false;
}

function onShutdown() {
  console.log("\x1b[32m");
  console.info('Got SIGINT. Graceful shutdown start', new Date().toISOString())
  server.close(async (err) => {
    if (err) {
      console.log(err)
      process.exit(1)
    } else {
      console.log("Server health restored");
      await db.closeConnection();
      console.log("MongoDB connection closed");
      console.log("Sayonara!");
      console.log("\x1b[0m");
      process.exit(0);
    }
  });
}
//@ts-ignore
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  let bind = typeof port === "string"
    ? 'Pipe ' + port
    : 'Port ' + port;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  let addr = server.address();
  let bind = typeof addr === "string"
    ? "pipe " + addr
    //@ts-ignore
    : "port " + addr.port;
  console.log("Listening on " + bind);
}