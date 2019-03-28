"use strict";

const UserModel = require("../models/User");
const CollegeModel = require("../models/College");
const EventModel = require("../models/Event");
const ParticipantModel = require("../models/Participant");
const TeamModel = require("../models/Team");
const JudgeModel = require("../models/Judge");

const get = async (req, res) => {
  try {
    let users = await UserModel.find();
    let events = await EventModel.find();
    let colleges = await CollegeModel.find();
    let participants = await ParticipantModel.find();
    let teams = await TeamModel.find();
    let judges = await JudgeModel.find();

    return res.json({
      status: 200,
      message: "Success",
      data: {
        users: users.length,
        events: events.length,
        colleges: colleges.length,
        participants: [ ...new Set(participants.map(p => p.registrationID)) ].length,
        teams: teams.filter(t => t.members.length > 1).length,
        judges: [ ...new Set(judges.map(j => j.name)) ].length,
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  get,
};
