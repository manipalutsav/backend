"use strict";

import createError from "http-errors";

export default (_req, _res, next) => {
  next(createError(404));
};
