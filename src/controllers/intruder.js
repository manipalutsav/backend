"use strict";

const EventModel = require("../models/Event");
const SlotModel = require("../models/Slot");
const RoundModel = require("../models/Round");
const ScoreModel = require("../models/Score");
const TeamModel = require("../models/Team");
const UserModel = require("../models/User");

const { USER_TYPES } = require("../utils/constants");

const getEvents = async (req, res) => {
  let events = await EventModel.find().populate({
    path: "college",
    model: "College",
  });


  events = events.map(event => {
    return {
      id: event.id,
      name: event.name,
      description: event.description,
      college: event.college.name,
      venue: event.venue,
      duration: event.duration,
      startDate: event.startDate,
      endDate: event.endDate,
      round: event.rounds[0],
    };
  });

  return res.json({
    status: 200,
    message: "Success",
    data: events,
  });
};

const getUsers = async (req, res) => {
  try {
    let users = await UserModel.find().populate({
      path: "college",
      model: "College",
    });

    users = users.filter(u => u.type === USER_TYPES.FACULTY_COORDINATOR).map(u => ({
      id: u.id,
      name: u.name,
      type: u.type,
      college: u.college.name + " " + u.college.location,
    }));

    return res.json({
      status: 200,
      message: "Success",
      data: users,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const getSlots = async (req, res, next) => {
  let slots = await SlotModel.find({ round: req.params.round }).populate({
    path: "team",
    model: "Team",
  });
  if (!slots) return next();

  slots = slots.map(slot => ({
    id: slot.id,
    number: slot.number,
    round: slot.round,
    team: slot.team.name,
  }));

  return res.json({
    status: 200,
    message: "Success",
    data: slots,
  });
};

const getRoundLeaderboard = async (req, res, next) => {
  let round = await RoundModel.findOne({
    _id: req.params.round,
    event: req.params.event,
  });

  if (!round) next();

  if(!round.published) next();

  let scores = await ScoreModel.find({
    round: round.id,
  }).populate({
    path: "team",
    model: "Team",
  });

  scores = await Promise.all(scores.map(async score => {
    let team = await TeamModel.findById(score.team);
    let bias = team.overtime > 0 ? 5 * (Math.ceil(team.overtime / 15)) : 0;
    
    return({
      team: score.team,
      round: score.round,
      judgePoints: score.points,
      points: score.points - bias,
      overtime: team.overtime,
      disqualified: team.disqualified,
    });
  }));
  scores = scores.filter(slot => !slot.disqualified);
  return res.json({
    status: 200,
    message: "Success",
    data: scores,
  });
};

module.exports = {
  getEvents,
  getUsers,
  getSlots,
  getRoundLeaderboard,
};
