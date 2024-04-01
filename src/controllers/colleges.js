"use strict";

const CollegeModel = require("../models/College");
const TeamModel = require("../models/Team");
const JudgeScoreModel = require("../models/JudgeScore");
const Slot2Model = require("../models/Slot2");
const EventModel = require("../models/Event");
const RoundModel = require("../models/Round");
const ParticipantModel = require("../models/Participant");

/**
 * Create a college object in the DB
 * @param {object} req the request object
 * @param {object} res the response object
 * @returns {object} the response object
 */
const create = async (req, res) => {
  try {
    if (!req.body.name || !req.body.location) {
      return res.status(400).json({
        status: 400,
        message: "Bad request. Invalid request body.",
      });
    }

    let college = await CollegeModel.findOne({ name: req.body.name });

    if (college) {
      return res.status(404).json({
        status: 404,
        message: "Not Found. No college was found for the specified name.",
      });
    }

    college = await CollegeModel.create({
      name: req.body.name,
      location: req.body.location,
      isOutStationed: req.body.isOutStationed
    });

    return res.status(200).json({
      status: 200,
      message: "Success. New college created.",
      data: {
        id: college.id,
        name: college.name,
        location: college.location,
        isOutStationed: college.isOutStationed
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};


const update = async (req, res) => {
  try {
    if (!req.body.name || !req.body.location || !req.body.id) {
      return res.status(400).json({
        status: 400,
        message: "Bad request. Invalid request body.",
      });
    }

    let college = await CollegeModel.findById(req.body.id);

    if (!college) {
      return res.status(404).json({
        status: 404,
        message: "Not Found. No college was found for the specified id.",
      });
    }

    college.name = req.body.name;
    college.location = req.body.location;
    college.isOutStationed = req.body.isOutStationed;

    await college.save();

    return res.status(200).json({
      status: 200,
      message: "Success. College Updated.",
      data: {
        id: college.id,
        name: college.name,
        location: college.location,
        isOutStationed: college.isOutStationed
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

/**
 * Return college object with request id
 * @param {object} req the request object
 * @param {object} res the response object
 * @returns {object} the response object
 */
const get = async (req, res) => {
  try {
    let college = await CollegeModel.findById(req.params.college);

    if (!college) {
      return res.json({
        status: 404,
        message: "Not Found. No college was found for the specified ID.",
      });
    }

    return res.json({
      status: 200,
      message: "Success",
      data: {
        id: college.id,
        name: college.name,
        location: college.location,
        isOutStationed: college.isOutStationed
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

/**
 * Return all colleges
 * @param {object} req the request object
 * @param {object} res the response object
 * @returns {object} the response object
 */
const getAll = async (req, res) => {
  try {
    let colleges = await CollegeModel.find();

    colleges = colleges.map(college => ({
      id: college.id,
      name: college.name,
      location: college.location,
      isOutStationed: college.isOutStationed
    }));

    return res.json({
      status: 200,
      message: "Success",
      data: colleges,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

/**
 * Return participants from college
 * @param {object} req the request object
 * @param {object} res the response object
 * @returns {object} the response object
 */
const getParticipants = async (req, res) => {
  try {
    let participants;

    if (req.params.college) {
      participants = await ParticipantModel.find({ college: req.params.college });
    } else {
      participants = await ParticipantModel.find();
    }

    participants = participants.map(participant => ({
      id: participant.id,
      registrationID: participant.registrationID,
      name: participant.name,
      college: participant.college,
      faculty: participant.faculty,
    }));

    return res.json({
      status: 200,
      message: "Success",
      data: participants,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

/**
 * Return teams from college
 * @param {object} req the request object
 * @param {object} res the response object
 * @returns {object} the response object
 */
const getTeams = async (req, res) => {
  try {
    let teams;

    if (req.params.college) {
      teams = await TeamModel.find({ college: req.params.college }).populate({
        path: "event",
        model: "Event",
      }).populate('college');
    } else {
      teams = await TeamModel.find();
    }


    return res.json({
      status: 200,
      message: "Success",
      data: teams,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

//same code as getOvertimeMinusPoints on events
const getOvertimeMinusPoints = (overtime = 0) => {
  return overtime > 0 ? 5 * (Math.ceil(overtime / 15)) : 0;
}
//same code as getRoundLeaderboard2 without req,res
const getRoundLeaderboard = async (roundId) => {
  let round = await RoundModel.findById(roundId.toString());

  if (!round) {
    console.log(roundId);
    throw "Round does not exist to get leaderboard";
  }

  let scores = await JudgeScoreModel.find({
    round: round._id
  })

  //fetch slots for the round
  let slots = await Slot2Model.find({
    round: round._id
  }).populate('college');

  //get all slot ids from scores
  let slotIds = new Set();

  //Add up points by judges
  scores.forEach(score => {
    score.total = score.points.reduce((p1, p2) => p1 + p2);
    slotIds.add(score.slot);
  })

  //add up totals for each slot
  let leaderboard = [];
  Array.from(slotIds)
    .map(slotId => slots.find(slot => String(slot._id) == slotId))//add slot details
    .filter(slot => !slot.disqualified)//filter out disqualified teams
    .forEach(slot => {
      let total = scores.filter(score => score.slot == String(slot._id)).reduce((total, score) => total + score.total, 0);
      let bias = getOvertimeMinusPoints(slot.overtime)
      total = total - bias;
      if (!leaderboard.find(leaderboardItem => leaderboardItem.slot._id == slot._id))
        leaderboard.push({ slot: slot, total })
    })

  //sort leaderboard
  leaderboard.sort((p1, p2) => p2.total - p1.total);

  //remove duplicates (keep only one entry per slot)

  //Add Rank
  let scoreOrder = Array.from(new Set(leaderboard.map(item => item.total)));
  leaderboard.forEach(item => {
    item.rank = scoreOrder.indexOf(item.total) + 1;
  })
  return leaderboard;
}

const getAllEventsRanking = async (req, res) => {
  try {
    let events = await EventModel.find();
    let response = [];
    //get the latest leaderboard of all events
    await Promise.all(events.map(async event => {
      try {
        //if event doesn't have any rounds, move to next event.
        if (event.rounds.length == 0)
          return;
        //get last round id
        let roundId = event.rounds[event.rounds.length - 1];
        // console.log(event, roundId);
        let leaderboard = await getRoundLeaderboard(roundId);
        let ranks = leaderboard.filter(item => item.slot.college._id == req.params.college);
        response.push({
          event,
          ranks
        })
      } catch (err) {
        console.log(err);
      }
    }))
    return res.json({
      status: 200,
      message: "Success",
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: 500,
      message: "Server Error",
      data: error,
    });
  }

}

const getPublishedEventsRanking = async (req, res) => {
  try {
    let events = await EventModel.find();
    let response = [];
    //get the latest leaderboard of all events
    await Promise.all(events.map(async event => {
      try {
        //if event doesn't have any rounds, move to next event.
        if (event.rounds.length == 0)
          return;
        //get last round id
        let roundId = event.rounds[event.rounds.length - 1];
        const round = await RoundModel.findOne({ _id: roundId });
        if(!round.published)
        {
          response.push({
            event,
            ranks:[],
          });
          return;
        }
        // console.log(event, roundId);
        let leaderboard = await getRoundLeaderboard(roundId);
        let ranks = leaderboard.filter(item => item.slot.college._id == req.params.college);
        response.push({
          event,
          ranks,
        });
      } catch (err) {
        console.log(err);
      }
    }))
    return res.json({
      status: 200,
      message: "Success",
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: 500,
      message: "Server Error",
      data: error,
    });
  }

}

module.exports = {
  create,
  get,
  getAll,
  getParticipants,
  getTeams,
  update,
  getAllEventsRanking,
  getPublishedEventsRanking,
};
