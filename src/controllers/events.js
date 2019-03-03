"use strict";

const EventModel = require("../models/Event");
const RoundModel = require("../models/Round");
const SlotModel = require("../models/Slot");
const TeamModel = require("../models/Team");
const JudgeModel = require("../models/Judge");

const createRound = async (req, res, next) => {
  let event = await EventModel.findById(req.params.event);

  if (!event) next();

  let roundDocument = new RoundModel({
    event: event.id,
    teams: [],
    duration: req.body.duration,
    slottable: req.body.slottable,
  });

  await roundDocument.save().
    then(async round => {
      event.rounds.push(round.id);
      await event.save();

      return res.json({
        status: 200,
        message: "New round created",
        data: {
          id: round.id,
          event: req.params.event,
          teams: [],
          duration: round.duration,
          slottable: round.slottable,
        },
      });
    }).
    catch((e) => {
      // eslint-disable-next-line no-console
      console.poo(e);

      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    });
};

const createSlots = async (req, res) => {
  let teams = await TeamModel.find({
    event: req.params.event,
    round: req.params.round,
  });

  if (!teams) teams = [];

  // TODO: Use team names
  teams = teams.map(team => team.id);

  // Slotting
  let slots = [];
  for (let i = 0; i < teams.length; i++) {
    let team = teams[Math.floor(Math.random() * teams.length)];

    await SlotModel.create({
      number: i + 1,
      round: req.params.round,
      team: team,
    });

    slots.push(team);
    teams.splice(teams.indexOf(team), 1);
  }

  return res.json({
    status: 200,
    message: "Success",
    data: slots,
  });
};

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

const getRound = async (req, res, next) => {
  let round = await RoundModel.findOne({
    event: req.params.event,
    round: req.params.round,
  });

  if (!round) next();

  return res.json({
    status: 200,
    message: "Success",
    data: {
      id: round.id,
      event: round.event,
      teams: round.teams,
      duration: round.duration,
      slottable: round.slottable,
    },
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

const getTeamsInRound = async (req, res) => {
  let teams = await TeamModel.find({
    event: req.params.event,
    round: req.params.round,
  });

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

const create = async (req, res, next) => {
  let {
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

  await event.save().
    then(event => {
      return res.json({
        status: 200,
        message: "New event created",
        data: {
          id: event.id,
          name: event.name,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
        },
      });
    }).
    catch((e) => {
      // eslint-disable-next-line no-console
      console.poo(e);

      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    });
};

const createJudge = async (req, res) => {
  let { name } = req.body;
  let { round } = req.params;

  let judge = new JudgeModel({
    name,
    round,
  });

  await judge.save(err => {
    if (err) {
      // eslint-disable-next-line no-console
      console.poo(err);
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
  createRound,
  createSlots,
  get,
  getAll,
  getRound,
  getRounds,
  getSlot,
  getSlots,
  getTeam,
  getTeams,
  getTeamsInRound,
  create,
  createJudge,
};
