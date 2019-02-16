"use strict";

module.exports = (err, req, res, _next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  let errorStatus = err.status || 500;

  res.status(errorStatus).json({
    status: errorStatus,
    message: res.locals.message,
  });
};
