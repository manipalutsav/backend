"use strict";

import { Request, Response } from "express";
import CoreVolunteerModel from "../models/CoreVolunteer";

export const addVolunteer = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    return res.json({
      status: 400,
      message: error.message,
    });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    let volunteer = await CoreVolunteerModel.find().populate({
      path: "college",
      model: "College",
    });

    res.json()

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
