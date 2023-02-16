"use strict";

const jwt = require("../utils/jwt");
const UserModel = require("../models/User");
const { HTTP_STATUS } = require("../utils/constants");
import { NextFunction, Request, Response } from "express";
import { UserRequest } from "../interfaces";


export default async (req: UserRequest, res: Response, next: NextFunction) => {
  if (req.url === "/users/login" && req.method === "POST") return next();
  if (req.url.startsWith("/intruder/") && req.method === "GET") return next();

  let token;
  const bearer = req.get("Authorization");
  if (bearer) token = bearer;
  else token = req.cookies && req.cookies.token;

  if (!token) return res.status(401).json(HTTP_STATUS[401]);

  try {
    let payload = await jwt.verifyToken(token);

    let user = await UserModel.findById(payload.id);

    if (!user) res.status(401).json(HTTP_STATUS[401]);

    if (user.id !== payload.id
      || user.email !== payload.email
      || user.password !== payload.password
      || user.type !== payload.type) res.status(401).json(HTTP_STATUS[401]);

    req.user = user;

    next();
  } catch (e) {
    // eslint-disable-next-line no-console
    //@ts-ignore
    console.log(e);

    res.status(401).json(HTTP_STATUS[401]);
  }
};
