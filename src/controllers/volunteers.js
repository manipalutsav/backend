"use strict";

const VolunteerModel = require("../models/Volunteer");
const Deleted = require("../models/Deleted");
const { response } = require("../utils/constants");

exports.addVolunteer = async (req, res) => {
  try {
    const { name, registerNumber, phoneNumber, shirtSize, collegeId, type } = req.body;

    let MAX_VOLUNTEERS_PER_COLLEGE = 8;

    if (!name || name.length === 0) { throw response(400, "Please enter name."); }
    if (!registerNumber || registerNumber.length === 0) { throw response(400, "Please enter register number."); }
    if (!phoneNumber || phoneNumber.length === 0) { throw response(400, "Please enter phone number."); }
    if (!shirtSize || shirtSize.length === 0) { throw response(400, "Please select shirt size."); }
    if (!collegeId || collegeId.length === 0) { throw response(400, "Please select the college."); }
    if (!type || type.length === 0) { throw response(400, "Volunteer type is missing from context"); }

    if (![1, 4, 8].includes(req.user.type)) {
      throw response(403, `User does not have permission to add volunteers, required [1,4,8] provided: ${req.user.type}`);
    }

    if ([4, 8].includes(req.user.type) && req.user.college != collegeId) {
      throw response(403, "User cannot add volunteer of another college.");
    }

    let checkVolunteer = await VolunteerModel.findOne({ registerNumber, type });
    if (checkVolunteer) {
      throw response(400, `Volunteer with register number already exists for the type ${type}.`)
    }

    let check2Volunteer = await VolunteerModel.find({ collegeId, type });
    if (check2Volunteer.length == MAX_VOLUNTEERS_PER_COLLEGE) {
      throw response(400, `College already has ${MAX_VOLUNTEERS_PER_COLLEGE} volunteers for the type ${type}.`)
    }


    let volunteer = await VolunteerModel.create({
      name,
      registerNumber,
      phoneNumber,
      shirtSize,
      collegeId,
      type
    });

    return res.status(200).json(response(200, volunteer));

  } catch (error) {
    console.log(error);
    return res.status(error.status).json(error);
  }
};

exports.updateVolunteer = async (req, res) => {
  try {
    const id = req.params.volunteerId
    const { name, registerNumber, phoneNumber, shirtSize, collegeId, type } = req.body;
    if (!id || id.length === 0) { throw Error("Id is missing from request"); }
    if (!name || name.length === 0) { throw Error("Please enter name."); }
    if (!registerNumber || registerNumber.length === 0) { throw Error("Please enter register number."); }
    if (!phoneNumber || phoneNumber.length === 0) { throw Error("Please enter phone number."); }
    if (!shirtSize || shirtSize.length === 0) { throw Error("Please select shirt size."); }
    if (!collegeId || collegeId.length === 0) { throw Error("Please select the college."); }
    if (!type || type.length === 0) { throw response(400, "Volunteer type is missing from context"); }

    let volunteer = await VolunteerModel.findById(id);
    if (!volunteer) {
      throw Error("Could not find volunteer to update.")
    }
    if (![1, 4, 8].includes(req.user.type)) {
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
    volunteer.type = type;//this is unlikely

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
    const id = req.params.volunteerId
    if (!id || id.length === 0) { throw Error("Id is missing from request"); }
    let volunteer = await VolunteerModel.findById(id);
    if (!volunteer) {
      throw Error("Could not find volunteer to remove.")
    }

    if (![1, 4, 8].includes(req.user.type)) {
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
    await VolunteerModel.findByIdAndDelete(id);

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

exports.getVolunteer = async (req, res) => {
  try {

    const id = req.params.volunteerId
    if (!id || id.length === 0) { throw response(400, "Id is missing from request"); }

    if (![1, 4, 8].includes(req.user.type)) {
      throw response(403, "User does not have permission to view volunteers");
    }

    let filterOptions = { _id: id };
    if ([4, 8].includes(req.user.type)) {
      filterOptions = { ...filterOptions, collegeId: req.user.college };
    }

    let volunteer = await VolunteerModel.findOne(filterOptions);
    if (!volunteer) {
      throw response(404, "Could not find volunteer")
    }

    return res.json(response(200, volunteer));
  } catch (error) {
    return res.status(error.status).json(error);
  }
};


exports.getVolunteers = async (req, res) => {
  try {

    const type = req.params.type
    if (!type || type.length === 0) { throw response(400, "Type is missing from request"); }


    if (![1, 4, 8].includes(req.user.type)) {
      throw Error("User does not have permission to view volunteers");
    }

    let filterOptions = { type };
    if ([4, 8].includes(req.user.type)) {
      filterOptions = { ...filterOptions, collegeId: req.user.college };
    }

    let volunteers = await VolunteerModel.find(filterOptions);

    return res.json({
      status: 200,
      message: "Success",
      data: volunteers,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

