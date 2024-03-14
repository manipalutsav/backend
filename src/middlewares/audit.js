"use strict";

const AuditModel = require("../models/Audit");

module.exports = async (req, res, next) => {
  res.on("finish", async () => {
    if (req.method == "GET")
      return;
    let { method, url, baseUrl, user } = req;
    let entry = {
      method,
      url: `${baseUrl}/${url}`,
      user: user ? user.email : "(unknown)",
      time: new Date()
    };
    try {
      await AuditModel.create(entry);
    }
    catch (e) {
      console.log("Audit Log failed", e);
    }
  });
  next();
};
