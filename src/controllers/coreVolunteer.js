"use strict";

const CoreVolunteerModel = require("../models/CoreVolunteer");

exports.addVolunteer = async (req, res) => {
  try {
    const { name, registerNumber, shirtSize, college } = req.body;
    if (!name || name.length === 0) { throw Error("Please enter name."); }
    if (!registerNumber || registerNumber.length === 0) { throw Error("Please enter register number."); }
    if (!shirtSize || shirtSize.length === 0) { throw Error("Please select shirt size."); }
    if (!college || college.length === 0) { throw Error("Please select the college."); }
    let volunteer = await CoreVolunteerModel.create({
      name,
      registerNumber,
      shirtSize,
      college,
    });

    return res.json({
      status: 200,
      message: "Success. New Volunteer created.",
      data: volunteer,
    });
  } catch (error) {
    return res.json({
      status: 400,
      message: error.message,
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    let volunteer = await CoreVolunteerModel.find().populate({
      path: "college",
      model: "College",
    });;

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
