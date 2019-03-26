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
      college: event.college,
      venue: event.venue,
      duration: event.duration,
      startDate: event.startDate,
      endDate: event.endDate,
      faculty: event.faculty,
      round: event.rounds[0].id,
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
    let users = await UserModel.find();

    users = users.map(user => {
      if(user.type !== USER_TYPES.FACULTY_COORDINATOR) {
        return ({
          id: user.id,
          name: user.name,
          type: user.type,
          college: user.college,
        });
      }
    });

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

const getSlots = async (req, res) => {
  let slots = await SlotModel.find({ round: req.params.round });
  if (!slots) next();
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
}

module.exports = {
  getEvents,
  getUsers,
  getSlots
}