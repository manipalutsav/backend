"use strict";

const CollegeModel = require("../models/College");
const TeamModel = require("../models/Team");
const ParticipantModel = require("../models/Participant");

const create = (req, res) => {
  let { name, location } = req.body;

  let college = new CollegeModel({
    name,
    location,
  });

  college.save((err) => {
    console.error(err);

    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Success",
      data: { name, location },
    });
  });
};

const get = async (req, res) => {
  let college = await CollegeModel.findById({
    id: req.params.id,
  });

  return res.json({
    status: 200,
    message: "Success",
    data: {
      name: college.name,
      location: college.location,
    },
  });
};

const getAll = async (req, res) => {
  let colleges = await CollegeModel.find();

  colleges = colleges.map(clg => ({
    name: clg.name,
    location: clg.location,
  }));

  return res.json({
    status: 200,
    message: "Success",
    data: colleges,
  });
};

const getParticipants = async (req, res) => {
  let participants = await ParticipantModel.find({ college: req.params.college });

  participants = participants.map(participant => ({
    registrationID: participant.registrationID,
    name: participant.name,
    email: participant.email,
    mobile: participant.mobile,
    college: participant.college,
    faculty: participant.faculty,
  }));

  return res.json({
    status: 200,
    message: "Success",
    data: participants,
  });
};

const getTeams = async (req, res) => {
  let teams = await TeamModel.find({ college: req.params.college });

  teams = teams.map(team => ({
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

module.exports = {
  create,
  get,
  getAll,
  getParticipants,
  getTeams,
};
