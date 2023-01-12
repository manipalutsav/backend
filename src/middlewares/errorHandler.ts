"use strict";

import { NextFunction, Request, Response } from "express";


export default (err: any, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  let errorStatus = err.status || 500;

  res.status(errorStatus).json({
    status: errorStatus,
    message: res.locals.message,
  });

  next();
};
