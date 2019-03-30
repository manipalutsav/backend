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
        users: {
          total: users.length,
        },
        events: {
          total: events.length,
          staff: events.filter(e => e.faculty).length,
          venues: [ ...new Set(events.map(e => e.venue)) ].length,
        },
        colleges: {
          total: colleges.length,
          locations: [ ...new Set(colleges.map(c => c.location)) ].length,
        },
        participants: {
          total: [ ...new Set(participants.map(p => p.registrationID)) ].length,
          staff: [ ...new Set(participants.filter(p => p.faculty).map(p => p.registrationID)) ].length,
        },
        teams: {
          total: teams.filter(t => t.members.length > 1).length,
        },
        judges: {
          total: [ ...new Set(judges.map(j => j.name)) ].length
        },
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
