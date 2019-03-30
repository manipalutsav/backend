"use strict";

const EventModel = require("../models/Event");
const SlotModel = require("../models/Slot");
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

    let result = [];

    users.filter(u => u.type === USER_TYPES.FACULTY_COORDINATOR).map(u => ({
      id: u.id,
      name: u.name,
      type: u.type,
      college: u.college.name + " " + u.college.location,
    }));

    return res.json({
      status: 200,
      message: "Success",
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const getSlots = async (req, res, next) => {
  let slots = await SlotModel.find({ round: req.params.round });
  if (!slots) return next();

  slots = slots.map(slot => ({
    id: slot.id,
    number: slot.number,
    round: slot.round,
    team: slot.team,
    teamName:slot.teamName,
  }));


  return res.json({
    status: 200,
    message: "Success",
    data: slots,
  });
};

module.exports = {
  getEvents,
  getUsers,
  getSlots,
};
