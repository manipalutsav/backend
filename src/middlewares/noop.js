"use strict";

module.exports = (_req, _res, next) => {
  console.log("noop");
  next();
};
