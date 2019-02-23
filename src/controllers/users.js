"use strict";

const UserModel = require("../models/User");
const { USER_TYPES } = require("../utils/constants");
const hash = require("../utils/hash");
const jwt = require("../utils/jwt");

const get = async (req, res, next) => {
  try {
    let user = await UserModel.findById(req.params.user);

    if (!user) return next();

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      type: user.type,
      college: user.college,
    });
  } catch (e) {
    console.error(e);
    next();
  }
};

const create = async (req, res, next) => {
  try {
    let requester = await UserModel.findById(req.body.requesterID);
    let isRealRequester = await hash.comparePasswordHash(req.body.requesterPassword, requester.password);

    if (!requester || !isRealRequester) {
      return res.status(403).json({
        status: 403,
        message: "Forbidden",
      });
    }

    if (requester.type !== USER_TYPES.ADMINISTRATOR
      && requester.type <= req.body.type) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
      });
    }

    let user = await UserModel.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).json({
        status: 400,
        message: "Bad request",
      });
    }

    let hashedPassword = await hash.generatePasswordHash(req.body.password);

    let userDocument = new UserModel({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile || null,
      type: req.body.type,
      password: hashedPassword,
      college: req.body.college || null,
    });

    await userDocument.save().
      then(user => {
        return res.json({
          status: 200,
          message: "New user created",
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            type: user.type,
            college: user.college,
          },
        });
      }).
      catch((e) => {
        console.error(e);

        return res.status(500).json({
          status: 500,
          message: "Internal Server Error",
        });
      });
  } catch (e) {
    console.error(e);
    next();
  }
};

const update = async (req, res, next) => {
  if (!req.body.oldUser || !req.body.newUser) {
    return res.status(400).json({
      status: 400,
      message : "Bad request",
    });
  }

  if (req.params.user !== req.body.oldUser.id) {
    return res.status(401).json({
      status: 401,
      message : "Unauthorized",
    });
  }

  let user = await UserModel.findById(req.params.user);

  if (!user) {
    return res.status(401).json({
      status: 401,
      message : "Unauthorized",
    });
  }

  let isValidPassword = await hash.comparePasswordHash(
    req.body.oldPassword,
    user.password
  );

  if (!isValidPassword) {
    return res.status(401).json({
      status: 401,
      message : "Unauthorized",
    });
  }

  if (user.name !== req.body.newUser.name) user.name = req.body.newUser.name;
  if (user.email !== req.body.newUser.email) user.email = req.body.newUser.email;
  if (user.mobile !== req.body.newUser.mobile) user.mobile = req.body.newUser.mobile;
  if (user.college !== req.body.newUser.college) user.college = req.body.newUser.college;

  await user.save().
    then(user => {
      const token = jwt.generateToken(user.email);

      return res.cookie("token", token).json({
        status: 200,
        message: "User details updated",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          type: user.type,
          college: user.college,
        },
      });
    }).
    catch((e) => {
      console.error(e);

      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    });
};

/**
 * Authenticate a user into the system
 * @param {object} req The request object
 * @param {object} res The response object
 * @returns {void}
 */
const login = async (req, res, next) => {
  let user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    return res.status(401).json({
      status: 401,
      message : "Unauthorized",
    });
  }

  let isValidPassword = await hash.comparePasswordHash(
    req.body.password,
    user.password
  );

  if (!isValidPassword) {
    return res.status(401).json({
      status: 401,
      message : "Unauthorized",
    });
  }

  const token = jwt.generateToken(user.email);

  res.cookie("token", token).json({
    status: 200,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      type: user.type,
      college: user.college,
    },
  });
};

module.exports = {
  get,
  create,
  update,
  login,
};
