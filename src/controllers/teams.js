"use strict";

const TeamModel = require("../models/Team");
const EventModel = require("../models/Event");
const ParticipantModel = require("../models/Participant");
const path = require("path");
const fs = require("fs");
const WinnerSubmission = require("../models/Winners");

/**
 * Add new team into the system.
 * @param {object} req The request object
 * @param {object} res The response object
 * @returns {void}
 */
const create = async (req, res) => {
  let {
    event,
    college,
    members,
  } = req.body;


  // Check if participation limit reached
  let participatedTeams = await TeamModel.find({ college: college });
  let eventInfo = await EventModel.findOne(event);
  if (participatedTeams.length === eventInfo.maxParticpants) {
    return res.status(401).json({
      status: 416,
      message: "Max participation limit reached",
    });
  }

  let team = new TeamModel({
    event,
    college,
    members,
  });

  team.save((err) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Team created",
      data: team,
    });
  });
};

/**
 * Fetch team details.
 * @param {object} req The request object
 * @param {object} res The response object
 * @returns {void}
 */
const get = async (req, res) => {
  let team = await TeamModel.findById({ id: req.params.id });

  return res.json({
    status: 200,
    message: "Success",
    data: { team },
  });
};

const getAll = async (req, res) => {
  try {
    let teams = await TeamModel.find();

    return res.json({
      status: 200,
      message: "Success",
      data: teams,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const deleteOne = async (req, res) => {
  try {
    let participant = await ParticipantModel.findById(req.params.participant);
    let team = await TeamModel.findById(req.params.team).populate('event');

    if (!participant) {
      return res.status(404).json({
        status: 404,
        message: "Not Found. No participant was found for the given ID.",
      });
    }

    if(!team){
      return res.status(404).json({
        status: 404,
        message: "Not Found. No team was found for the given ID.",
      });
    }

    if(team.members.length <= team.event.minMembersPerTeam){
      return res.status(403).json({
        status: 403,
        message: "Min. members should be there!",
      });
    }
    
    // Removing member id from team
    team.members = await team.members.filter((m) => !m.equals(participant._id));
    await team.save();

    await ParticipantModel.findByIdAndDelete(participant._id);

    return res.status(200).json({
      status: 200,
      message: "Deleted successfully!",
    });

  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};


const getTeamByCollegeIdAndEventId = async (req, res) => {
  try {
    const { collegeId, eventId } = req.params;
    if(!collegeId || !eventId){
      return res.status(400).json({
        status: 400,
        message: "Bad Request",
      });
    }
    let team = await TeamModel.findOne({ event: eventId, college: collegeId });

    return res.status(200).json({
      status: 200,
      message: "Success",
      data: team,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

// Regular expression for PAN validation (case-insensitive)
const VALID_PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
const submitWinners = async (req, res) => {
  console.log("Received files array:", JSON.stringify(req.files, null, 2));
  try {
      // Parse the participants string into an array
      const participants = JSON.parse(req.body.participants);

      // Map frontend fields to schema fields
      const processedParticipants = participants.map((p, i) => {
          const panFile = req.files.find(file => file.fieldname === `panPhoto-${i}`);
          const chequeFile = req.files.find(file => file.fieldname === `chequePhoto-${i}`);

          return {
              name: p.name,
              regNo: p.regNumber,
              pan: p.panNumber,
              accountNumber: p.bankAccount,
              bankName: p.bankName,
              branch: p.branch,
              ifsc: p.ifsc,
              phone: p.phone,
              panPhotoPath: panFile ? panFile.path : null,
              chequePhotoPath: chequeFile ? chequeFile.path : null
          };
      });

      // Create and save the WinnerSubmission document
      const winnerSubmission = new WinnerSubmission({
          collegeId: req.body.collegeId,
          eventId: req.body.eventId,
          participants: processedParticipants
      });

      await winnerSubmission.save();
      res.status(200).json({ message: 'Winners submitted successfully' });
  } catch (error) {
      console.error('Winner submission error:', error);
      res.status(500).json({ error: 'Failed to submit winners' });
  }
};


module.exports = {
  create,
  get,
  getAll,
  deleteOne,
  submitWinners,
  getTeamByCollegeIdAndEventId,
};
