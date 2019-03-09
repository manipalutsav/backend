"use strict";

const LeaderboardModel = require("../models/Leaderboard");
const CollegeModel = require("../models/College");

/**
 * Returns the leaderboard
 * @param {object} req the request object
 * @param {object} res the response object
 * @returns {object} the response object
 */
const get = async (req, res) => {
  try {
    let leaderboard = await LeaderboardModel.find();

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
  init,
  update,
};
