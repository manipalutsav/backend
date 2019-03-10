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
  let leaderboard = await LeaderboardModel.find()
  .populate({
    path: 'college',
    model: 'College'
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
};

/**
 * Create the leaderboard with initial scores
 * @param {object} req the request object
 * @param {object} res the response object
 * @returns {object} the response object
 */
const init = async (req, res) => {
  let colleges = await CollegeModel.find();
  colleges = colleges.map(clg => clg.id);

  let leaderboard = colleges.map(clg => ({
    college: clg,
    points: 0,
  }));

  await LeaderboardModel.create(leaderboard);

  return res.json({
    status: 200,
    message: "Success",
    data: leaderboard,
  });
};

/**
 * Modify the leaderboard with updated scores
 * @param {object} req the request object
 * @param {object} res the response object
 * @returns {object} the response object
 */
const update = async (req, res) => {
  let college = await LeaderboardModel.findOne({ college: req.params.college });

  college.points = req.body.points;

  await college.save().
    then(lb => {
      return res.json({
        status: 200,
        message: "Success",
        data: {
          college: lb.college,
          points: lb.points,
        },
      });
    }).
    catch(e => {
      // eslint-disable-next-line no-console
      console.poo(e);

      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    });

};

module.exports = {
  get,
  init,
  update,
};
