"use strict";

import CollegeModel, { College } from "../models/College";
import TeamModel from "../models/Team";
import ParticipantModel from "../models/Participant";
import { Request, Response } from "express";

/**
 * Create a college object in the DB
 * @param {Request} req the request object
 * @param {Response} res the response object
 * @returns {object} the response object
 */
const create = async (req: Request, res: Response) => {
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
    });

    return res.status(200).json({
      status: 200,
      message: "Success. New college created.",
      data: {
        id: college.id,
        name: college.name,
        location: college.location,
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
const get = async (req: Request, res: Response) => {
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
const getAll = async (req: Request, res: Response) => {
  try {
    let colleges = await CollegeModel.find() as College[];

    colleges = colleges.map(college => ({
      id: college.id,
      name: college.name,
      location: college.location,
    })) as College[];

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
const getParticipants = async (req: Request, res: Response) => {
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
const getTeams = async (req: Request, res: Response) => {
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

export default {
  create,
  get,
  getAll,
  getParticipants,
  getTeams,
};
