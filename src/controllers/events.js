"use strict";

const EventModel = require("../models/Event");

const get = async (req, res) => {
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

module.exports = {
  get,
  getAll,
};
