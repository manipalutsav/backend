"use strict";

const VolunteerModel = require("../models/Volunteer");

/**
 * Create function which adds a new volunteer detail
 * @param {object} req the request object
 * @param {object} res the response object
 * @param {function} next call the next handler in route
 * @returns {object} the response object
 */
exports.create = async (req, res) => {
  try {
    const { college, list } = req.body;
    let volunteer = await VolunteerModel.create({
      college,
      list,
    });

    return res.json({
      status: 200,
      message: "Success. New Volunteer created.",
      user_added: volunteer.name_v1,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: "Internal Server Error.",
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    let volunteer = await VolunteerModel.find();
    let list = [];
    volunteer.forEach(v => list.push(...v.list));

    return res.json({
      status: 200,
      message: "Success",
      data: list,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

exports.getAllWithCollegeId = async (req, res) => {
  try {
    let volunteer = await VolunteerModel.find();
    let list = [];
    volunteer.forEach(v => {
      const vlist = v.list.map(i => (i.college = v.college));
      list.push(...vlist);
    });

    return res.json({
      status: 200,
      message: "Success",
      data: volunteer,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

exports.getAllFromCollege = async (req, res) => {
  try {
    const { college } = req.body;
    let volunteer = await VolunteerModel.find({ college });
    let list = [];
    volunteer.forEach(v => {
      list.push(...v.list);
    });

    return res.json({
      status: 200,
      message: "Success",
      data: volunteer,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};
