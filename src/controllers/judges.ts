"use strict";

const JudgeModel = require("../models/Judge");

import { NextFunction, Request, Response } from "express";
import { Judge } from "../models/Judge";


const get = async (req: Request, res: Response) => {
  try {
    let judges = await JudgeModel.find();

    judges = judges.map((judge: Judge) => ({
      id: judge.id,
      name: judge.name,
      rounds: judge.rounds,
    }));

    return res.json({
      status: 200,
      message: "Success",
      data: judges,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({
        status: 400,
        message: "Bad Request",
      });
    }

    let judge = await JudgeModel.findOne({ name: req.body.name });

    if (judge) {
      if (req.body.round) {
        judge.rounds.push(req.body.round);
        await judge.save();
      }
    } else {
      judge = await JudgeModel.create({
        name: req.body.name,
        rounds: req.body.round ? [req.body.round] : [],
      });
    }

    return res.json({
      status: 200,
      message: "Success",
      data: {
        id: judge.id,
        name: judge.name,
        rounds: judge.rounds,
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

export default {
  get,
  create,
};
