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
      name: event.name,
      description: event.description,
      college: event.college,
      venue: event.venue,
      duration: event.duration,
      startDate: event.startDate,
      endDate: event.endDate,
      faculty: event.faculty,
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
        return (
          id: user.id,
          name: user.name,
          type: user.type,
          college: user.college,
        );
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

module.exports = {
  getEvents,

}