// External Modules
var express = require('express');
const req = require('express/lib/request');
var router = express.Router();
const bcrypt = require("bcryptjs")


// Internal Modules
const db = require('../db/models')
const { User } = db
const { asyncHandler, csrfProtection, handleValidationErrors, check, validationResult } = require('../utils');
const { route } = require('.');
const { loginUser, restoreUser, logoutUser } = require('../auth.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Validators

const loginValidators = [
  check('emailAddress')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Email Address'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password'),
];

const registerValidators = [
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Username')
    .isLength({ max: 50 })
    .withMessage('Username must not be more than 50 characters long'),
  check('emailAddress')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Email Address')
    .isLength({ max: 255 })
    .withMessage('Email Address must not be more than 255 characters long')
    .isEmail()
    .withMessage('Email Address is not a valid email'),
  check('password')
  .exists({ checkFalsy: true })
  .withMessage('Please provide a value for Password')
  .isLength({ max: 50 })
  .withMessage('Password must not be more than 50 characters long')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
  .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'),
  check('confirmPassword')
  .exists({ checkFalsy: true })
  .withMessage('Please provide a value for Confirm Password')
  .isLength({ max: 50 })
  .withMessage('Confirm Password must not be more than 50 characters long')
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Confirm Password does not match Password');
    }
    return true;
  })
];



// Register Route
router.get('/register', csrfProtection, (req, res) => {
  const user = db.User.build()
  res.render('user-register', {
    // title: 'Register',
    user,
    errors: {},
    csrfToken: req.csrfToken()
  })
})

router.post('/register', csrfProtection, registerValidators, asyncHandler(async (req, res, next) => {
  const { username, emailAddress, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await db.User.build({
    username,
    email: emailAddress,
    hashedPassword
  })

  const validatorErrors = validationResult(req);
  console.log(validatorErrors)
  if (validatorErrors.isEmpty()) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.hashedPassword = hashedPassword;
    await user.save();
    res.redirect('/');
  } else {
    const errors = validatorErrors.array().map((error) => error.msg);
    res.render('user-register', {
      title: 'Register',
      user,
      errors,
      csrfToken: req.csrfToken(),
    });
  }


}))





// Login Routes
router.get('/login', csrfProtection, (req, res) => {
  res.render('user-login', {
    title: 'Login',
    csrfToken: req.csrfToken(),
  });
});


router.post('/login', csrfProtection, loginValidators,
asyncHandler(async (req, res) => {
  const {
    emailAddress,
    password,
  } = req.body;

  let errors = [];
  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()) {
    // Attempt to get the user by their email address.
    const user = await db.User.findOne({ where: { email: emailAddress } });
    // console.log(user)
    if (user !== null) {
      // If the user exists then compare their password
      // to the provided password.
      const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());
      // console.log(passwordMatch)
      if (passwordMatch) {
        loginUser(req, res, user);
        // return res.redirect('/');
      }
    }

    // Otherwise display an error message to the user.
    errors.push('Login failed for the provided email address and password');
  } else {
    errors = validatorErrors.array().map((error) => error.msg);
  }

  res.render('user-login', {
    title: 'Login',
    emailAddress,
    errors,
    csrfToken: req.csrfToken(),
  });
}));

// Log Out Route

router.post('/logout', (req, res) => {
  logoutUser(req, res);
  res.redirect('/login')
})


module.exports = router;
