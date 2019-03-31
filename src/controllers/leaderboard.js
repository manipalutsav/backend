"use strict";

const LeaderboardModel = require("../models/Leaderboard");
const CollegeModel = require("../models/College");
const EventModel = require("../models/Event");
const ScoreModel = require("../models/Score");

const get = async (req, res) => {
  let events = await EventModel.find();

  let overallLeaderboard = [];
  for (let event of events) {
    let scores = await ScoreModel.find({
      round: { $in: event.rounds },
    }).populate({
      path: "team",
      model: "Team",
      populate: {
        path: "event",
        model: "Event",
      },
    });

    scores = scores.map(score => {
      let bias = score.overtime > 0 ? 5 * (Math.ceil(score.overtime / 15)) : 0;

      return {
        round: score.round,
        team: score.team,
        overtime: score.overtime,
        points: {
          judge: score.points,
          final: score.points - bias,
        },
      };
    });

    let leaderboard = {};
    for (let score of scores) {
      if (!leaderboard.hasOwnProperty(score.team.id)) {
        leaderboard[score.team.id] = {
          team: score.team,
          points: score.points,
        };
      } else {
        leaderboard[score.team.id] = {
          ...leaderboard[score.team.id],
          points: {
            judge: leaderboard[score.team.id].points.judge + score.points.judge,
            final: leaderboard[score.team.id].points.final + score.points.final,
          },
        };
      }
    }

    overallLeaderboard = overallLeaderboard.concat(Object.values(leaderboard));
  }

  // TODO: Calculate college scores.

  return res.json({
    status: 200,
    message: "Success",
    data: overallLeaderboard,
  });
};

/**
 * Returns the leaderboard
 * @param {object} req the request object
 * @param {object} res the response object
 * @returns {object} the response object
 */
const getPublic = async (req, res) => {
  try {
    let leaderboard = await LeaderboardModel.find().populate({
      path: "college",
      model: "College",
    });

    leaderboard = leaderboard.map(lb => ({
      college: lb.college,
      points: lb.points,
    }));

    return res.json({
      status: 200,
      message: "Success",
      data: leaderboard,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

/**
 * Create the leaderboard with initial scores
 * @param {object} req the request object
 * @param {object} res the response object
 * @returns {object} the response object
 */
const init = async (req, res) => {
  try {
    let colleges = await CollegeModel.find();

    colleges = colleges.map(college => college.id);

    let leaderboard = colleges.map(college => ({
      college: college,
      points: 0,
    }));

    await LeaderboardModel.create(leaderboard);

    return res.json({
      status: 200,
      message: "Success",
      data: leaderboard,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

/**
 * Modify the leaderboard with updated scores
 * @param {object} req the request object
 * @param {object} res the response object
 * @returns {object} the response object
 */
const update = async (req, res) => {
  try {
    if (!req.body.points) {
      return res.status(400).json({
        status: 400,
        message: "Bad request. Invalid request body.",
      });
    }

    let collegeLeaderboard = await LeaderboardModel.findOne({ college: req.params.college });

    collegeLeaderboard.points = req.body.points;

    await collegeLeaderboard.save();

    return res.json({
      status: 200,
      message: "Success. Points updated.",
      data: {
        college: collegeLeaderboard.college,
        points: collegeLeaderboard.points,
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  get,
  getPublic,
  init,
  update,
};
