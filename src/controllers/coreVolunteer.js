"use strict";

const CoreVolunteerModel = require("../models/CoreVolunteer");
const Deleted = require("../models/Deleted");
const User = require("../models/User");

exports.addVolunteer = async (req, res) => {
  try {
    const { name, registerNumber, phoneNumber, shirtSize, collegeId } = req.body;
    if (!name || name.length === 0) { throw Error("Please enter name."); }
    if (!registerNumber || registerNumber.length === 0) { throw Error("Please enter register number."); }
    if (!phoneNumber || phoneNumber.length === 0) { throw Error("Please enter phone number."); }
    if (!shirtSize || shirtSize.length === 0) { throw Error("Please select shirt size."); }
    if (!collegeId || collegeId.length === 0) { throw Error("Please select the college."); }

    let checkVolunteer = await CoreVolunteerModel.findOne({ registerNumber });
    if (checkVolunteer) {
      throw Error("Volunteer with register number already exists.")
    }

    if ([1, 4, 8].includes(req.user.type)) {
      throw Error("User does not have permission to add volunteers");
    }

    if ([4, 8].includes(req.user.type) && req.user.college != collegeId) {
      throw Error("User cannot add volunteer of another college.");
    }

    let volunteer = await CoreVolunteerModel.create({
      name,
      registerNumber,
      phoneNumber,
      shirtSize,
      collegeId,
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

exports.updateVolunteer = async (req, res) => {
  try {
    const { id, name, registerNumber, phoneNumber, shirtSize, collegeId } = req.body;
    if (!id || id.length === 0) { throw Error("Id is missing from request"); }
    if (!name || name.length === 0) { throw Error("Please enter name."); }
    if (!registerNumber || registerNumber.length === 0) { throw Error("Please enter register number."); }
    if (!phoneNumber || phoneNumber.length === 0) { throw Error("Please enter phone number."); }
    if (!shirtSize || shirtSize.length === 0) { throw Error("Please select shirt size."); }
    if (!collegeId || collegeId.length === 0) { throw Error("Please select the college."); }
    let volunteer = await CoreVolunteerModel.findById(id);
    if (!volunteer) {
      throw Error("Could not find volunteer to update.")
    }
    if ([1, 4, 8].includes(req.user.type)) {
      throw Error("User does not have permission to update volunteers");
    }

    if ([4, 8].includes(req.user.type) && req.user.college != collegeId) {
      throw Error("User cannot update volunteer of another college.");
    }

    volunteer.name = name;
    volunteer.registerNumber = registerNumber;
    volunteer.phoneNumber = phoneNumber;
    volunteer.shirtSize = shirtSize;
    volunteer.collegeId = collegeId;

    await volunteer.save();

    return res.json({
      status: 200,
      message: "Success. Volunteer updated.",
      data: volunteer,
    });
  } catch (error) {
    return res.json({
      status: 400,
      message: error.message,
    });
  }
};

exports.deleteVolunteer = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id || id.length === 0) { throw Error("Id is missing from request"); }
    let volunteer = await CoreVolunteerModel.findById(id);
    if (!volunteer) {
      throw Error("Could not find volunteer to remove.")
    }

    if ([1, 4, 8].includes(req.user.type)) {
      throw Error("User does not have permission to delete volunteers");
    }
    if ([4, 8].includes(req.user.type) && req.user.college != volunteer.collegeId) {
      throw Error("User cannot remove volunteer of another college.");
    }

    let deleted = await Deleted.create({
      schema: "CoreVolunteer",
      date: new Date(),
      user: req.user._id,
      data: volunteer
    })
    await CoreVolunteerModel.findByIdAndDelete(id);

    return res.json({
      status: 200,
      message: "Success. Volunteer deleted.",
      data: deleted,
    });
  } catch (error) {
    return res.json({
      status: 400,
      message: error.message,
    });
  }
};

exports.getByCollege = async (req, res) => {
  try {

    if ([1, 4, 8].includes(req.user.type)) {
      throw Error("User does not have permission to view volunteers");
    }

    let volunteer = await CoreVolunteerModel.find({ collegeId: req.user.college });

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

exports.getAll = async (req, res) => {
  try {

    if (req.user.type != 1) {
      throw Error("Only Admins can fetch all volunteers");
    }

    let volunteer = await CoreVolunteerModel.find();

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
