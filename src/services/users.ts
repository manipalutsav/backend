"use strict";

const UserModel = require("../models/User");
const hash = require("../utils/hash");

const create = async ({ name, email, mobile, type, passwordText, college }) => {
  try {

    let user = await UserModel.findOne({ email });

    if (user) {
      throw "Bad request. An account with that email already exist.";
    }

    let passwordHashed = await hash.generatePasswordHash(passwordText);

    user = await UserModel.create({
      name,
      email,
      mobile,
      type,
      password: passwordHashed,
      college,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      type: user.type,
      college: user.college,
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.poo(e);

    throw e;
  }
};

module.exports = {
  create
};
