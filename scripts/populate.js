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


async function populate() {
  try {
    let college = await College.create({
      name: "MIT",
      location: "Manipal",
    });

    let event = await Event.create({
      rounds: [],
      name: "Dancing",
      college: college.id,
      teams: [],
      minParticipants: 3,
      maxParticipants: 5,
      maxTeamsPerCollege: 2,
      venue: "IC",
      slottable: true,
      isFaculty: false,
    });

    let round = await Round.create({
      event: event.id,
      teams: [],
      criteria: [ "C1", "C2", "C3", "C4" ],
      slottable: true,
      status: 1,
    });

    event.rounds.push(round.id);
    await event.save();


    let participant1 = await Participant.create({
      registrationID:'18090092',
      name:'Megh',
      email:'r21meghashyam@gmail.com',
      mobile:'8123928667',
      college:college.id,
      faculty:false
    });
    let participant2 = await Participant.create({
      registrationID:'102',
      name:'BBB',
      email:'BBB@b.com',
      mobile:'8123928667',
      college:college.id,
      faculty:false
    });
    let participant3 = await Participant.create({
      registrationID:'103',
      name:'CCC',
      email:'CCC@gmail.com',
      mobile:'8123928660',
      college:college.id,
      faculty:false
    });
    let participant4 = await Participant.create({
      registrationID:'104',
      name:'DDD',
      email:'DDD@gmail.com',
      mobile:'8123928665',
      college:college.id,
      faculty:false
    });

    let team1 = await Team.create({
      name: college.name + " Alpha",
      event:event.id,
      college:college.id,
      members:[
        participant1.id,participant2.id
      ]
    });
    let team2 = await Team.create({
      name: college.name + " Bravo",
      event:event.id,
      college:college.id,
      members:[
        participant3.id,participant4.id
      ]
    });

    round.teams.push(team1.id);
    round.teams.push(team2.id);
    round.save();

    await Slot.create({
      number: 1,
      round: round.id,
      team: team2.id,
      teamName: team2.name,
    });

    await Slot.create({
      number: 2,
      round: round.id,
      team: team1.id,
      teamName: team1.name,
    });

  } catch (e) {
    console.error(e);
  }

}

populate().catch(console.error).finally(() => {
  mongoose.connection.close();
})
