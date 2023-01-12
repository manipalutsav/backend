"use strict";

import { NextFunction, Request, Response } from "express";

module.exports = (_req: Request, _res: Response, next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.log("noop");
  next();
};
