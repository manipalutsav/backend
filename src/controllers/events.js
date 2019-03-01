"use strict";

const EventModel = require("../models/Event");
const RoundModel = require("../models/Round");
const TeamModel = require("../models/Team");

const get = async (req, res, next) => {
  let event = await EventModel.findById(req.params.event);

  if (!event) return next();

  return res.json({
    status: 200,
    message: "Success",
    data: {
      id: event.id,
      name: event.name,
      description: event.description,
      college: event.college,
      rounds: event.rounds,
      teams: event.teams,
      minParticipants: event.minParticipants,
      maxParticipants: event.maxParticipants,
      venue: event.venue,
      duration: event.duration,
      startDate: event.startDate,
      endDate: event.endDate,
      slottable: event.slottable,
    },
  });
};

const getAll = async (req, res) => {
  let events = await EventModel.find();

  events = events.map(event => ({
    id: event.id,
    name: event.name,
    description: event.description,
    college: event.college,
    rounds: event.rounds,
    teams: event.teams,
    minParticipants: event.minParticipants,
    maxParticipants: event.maxParticipants,
    venue: event.venue,
    duration: event.duration,
    startDate: event.startDate,
    endDate: event.endDate,
    slottable: event.slottable,
  }));

  return res.json({
    status: 200,
    message: "Success",
    data: events,
  });
};

const getRounds = async (req, res, next) => {
  let rounds = await RoundModel.find({ event: req.params.event });

  if (!rounds) rounds = [];

  rounds = rounds.map(round => {
    id: round.id,
    event: round.event,
    teams: round.teams,
    duration: round.duration,
    slottable: round.slottable,
  });

  return res.json({
    status: 200,
    message: "Success",
    data: rounds,
  });
};

const getTeam = async (req, res, next) => {
  let team = await TeamModel.findOne({
    id: req.params.id,
    event: req.params.event,
  });

  if (!team) next();

  return res.json({
    status: 200,
    message: "Success",
    data: {
      id: team.id,
      event: team.event,
      college: team.college,
      members: team.members,
      disqualified: team.disqualified,
    },
  });
};

const getTeams = async (req, res, next) => {
  let teams = await TeamModel.find({ event: req.params.event });

  if (!teams) teams = [];

  teams = teams.map(team => {
    id: team.id,
    event: team.event,
    college: team.college,
    members: team.members,
    disqualified: team.disqualified,
  });

  return res.json({
    status: 200,
    message: "Success",
    data: teams,
  });
};

module.exports = {
  get,
  getAll,
  getRounds,
  getTeam,
  getTeams,
};
