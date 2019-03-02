"use strict";

const EventModel = require("../models/Event");
const RoundModel = require("../models/Round");
const SlotModel = require("../models/Slot");
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

const getRounds = async (req, res) => {
  let rounds = await RoundModel.find({ event: req.params.event });

  if (!rounds) rounds = [];

  rounds = rounds.map(round => ({
    id: round.id,
    event: round.event,
    teams: round.teams,
    duration: round.duration,
    slottable: round.slottable,
  }));

  return res.json({
    status: 200,
    message: "Success",
    data: rounds,
  });
};

const getSlot = async (req, res, next) => {
  let slot = await SlotModel.findOne({
    round: req.params.round,
    team: req.params.team,
  });

  if (!slot) next();

  return res.json({
    status: 200,
    message: "Success",
    data: {
      id: slot.id,
      number: slot.number,
      round: slot.round,
      team: slot.team,
    },
  });
};

const getSlots = async (req, res, next) => {
  let slots = await SlotModel.find({ round: req.params.round });

  if (!slots) next();

  slots = slots.map(slot => ({
    id: slot.id,
    number: slot.number,
    round: slot.round,
    team: slot.team,
  }));

  return res.json({
    status: 200,
    message: "Success",
    data: slots,
  });
};

const getTeam = async (req, res, next) => {
  let team = await TeamModel.findOne({
    id: req.params.team,
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

const getTeams = async (req, res) => {
  let teams = await TeamModel.find({ event: req.params.event });

  if (!teams) teams = [];

  teams = teams.map(team => ({
    id: team.id,
    event: team.event,
    college: team.college,
    members: team.members,
    disqualified: team.disqualified,
  }));

  return res.json({
    status: 200,
    message: "Success",
    data: teams,
  });
};

const create = async (req, res) => {
  let {
    rounds,
    name,
    college,
    teams,
    minParticipants,
    maxParticipants,
    venue,
    description,
    duration,
    startDate,
    endDate,
    slottable } = req.body;

  let event = new EventModel({
    rounds,
    name,
    college,
    teams,
    minParticipants,
    maxParticipants,
    venue,
    description,
    duration,
    startDate,
    endDate,
    slottable,
  });

  await event.save((err) => {
    // eslint-disable-next-line no-console
    console.poo(err);

    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Success",
    });
  });

};

module.exports = {
  get,
  getAll,
  getRounds,
  getSlot,
  getSlots,
  getTeam,
  getTeams,
  create,
};
