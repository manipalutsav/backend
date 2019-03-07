#!/usr/bin/env node

// Set environment variables
const dotenv = require("dotenv");
dotenv.config();


// MongoDB Connection
const mongoose = require("mongoose");

const IP = process.env.MONGODB_IP || "127.0.0.1";
const PORT = process.env.MONGODB_PORT || "27017";
const HOST = IP + ":" + PORT;

mongoose.connect("mongodb://" + HOST, {
  useNewUrlParser: true,
  dbName: 'utsav',
});

mongoose.Promise = global.Promise;
const DB = mongoose.connection;
mongoose.connection.on("error", console.error.bind(console, "MongoDB connection error: "));


// Models
const College = require("../src/models/College");
const Event = require("../src/models/Event");
const Judge = require("../src/models/Judge");
const Leaderboard = require("../src/models/Leaderboard");
const Participant = require("../src/models/Participant");
const Round = require("../src/models/Round");
const Score = require("../src/models/Score");
const Slot = require("../src/models/Slot");
const Team = require("../src/models/Team");
const User = require("../src/models/User");


async function clearCollection() {
  try {
  	College.deleteMany({});
    
    Event.deleteMany({});
    
    Round.deleteMany({});

    Participant.deleteMany({});

    Team.deleteMany({});

    Slot.deleteMany({});
    
    Score.deleteMany({});

    Leaderboard.deleteMany({});

  } catch (e) {
    console.error(e);
  }

}

clearCollection().catch(console.error).finally(() => {
  mongoose.connection.close();
})
