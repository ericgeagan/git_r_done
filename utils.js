const csrf = require('csurf');
const { check, validationResult } = require('express-validator');
const req = require('express/lib/request');
const { rmSync } = require('fs');

const csrfProtection = csrf({ cookie: true });

const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);

const isLoggedIn = (req, res, next) => {
  if (req.session.auth === undefined) {
    return res.redirect('/users/login');
  } else {
    return next();
  }
}

const isAlreadyLoggedIn = (req, res, next) => {
  if (req.session.auth) {
    return res.redirect('/lists')
  } else {
    return next();
  }
}

const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    return next(err);
  }
  next();
};

module.exports = {
  csrfProtection,
  asyncHandler,
	handleValidationErrors,
  check,
  validationResult,
  isLoggedIn,
  isAlreadyLoggedIn
};
