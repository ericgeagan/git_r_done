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
const { isAlreadyLoggedIn } = require('../utils.js')

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
router.get('/register', csrfProtection, isAlreadyLoggedIn, asyncHandler(async (req, res, next) => {
  const user = await db.User.build()
  res.render('user-register', {
    // title: 'Register',
    user,
    csrfToken: req.csrfToken()
  })
}))

// Create new user
router.post('/register', csrfProtection, registerValidators, asyncHandler(async (req, res, next) => {
  const { username, emailAddress, password, confirmPassword } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await db.User.build({
    username,
    email: emailAddress,
    hashedPassword
  })

  const validatorErrors = validationResult(req);
  // console.log(validatorErrors)
  if (validatorErrors.isEmpty()) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.hashedPassword = hashedPassword;
    await user.save();
    loginUser(req, res, user)
    // res.redirect('/users/login');
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

// Get random number between 0 and max (0 inclusive max exclusive)
function getRandomInt(max) {
  // Returns a random number between 0 and (max - 1)
  return Math.floor(Math.random() * max)
}

function getRandomQuote() {
  const quotes = [
    'The essence of being human is that one does not seek perfection.',
    'A year from now you may wish you had started today.',
    "Everything’s impossible until somebody does it."
  ]

  const authors = [
    'George Orwell',
    'Unknown',
    'Bruce Wayne'
  ]

  let index = getRandomInt(quotes.length)
  return {
    text: quotes[index],
    author: authors[index]
  }
}

function getRandomIcon() {
  const list = [
    'allen',
    'eric',
    'matt',
    'andrew'
  ]

  return list[getRandomInt(list.length)]
}

// Login Routes
router.get('/login', csrfProtection, isAlreadyLoggedIn, asyncHandler(async(req, res) => {
  res.render('user-login', {
    title: 'Login',
    csrfToken: req.csrfToken(),
    curatorIcon: getRandomIcon(),
    quote: getRandomQuote()
  });
}));


router.post('/login', csrfProtection, loginValidators,
asyncHandler(async (req, res, next) => {
  const {
    emailAddress,
    password,
  } = req.body;

  let errors = [];
  const validatorErrors = validationResult(req);

  if (emailAddress === '' || password === '') {
    errors.push('Login failed for the provided email address and password');
    // errors = validatorErrors.array().map((error) => error.msg);
    res.render('user-login', {
      title: 'Login',
      emailAddress,
      errors,
      curatorIcon: getRandomIcon(),
      quote: getRandomQuote(),
      csrfToken: req.csrfToken(),
    });
  }


  if (validatorErrors.isEmpty()) {
    // Attempt to get the user by their email address.
    const user = await db.User.findOne({ where: { email: emailAddress } });
    // console.log(`Logging in as: ${user}`)
    if (user !== null) {
      // If the user exists then compare their password
      // to the provided password.
      const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());
      // console.log(passwordMatch)
      if (passwordMatch) {
        // Correct Login
        loginUser(req, res, user);
      } else {
        // Incorrect password
        errors.push('Login failed for the provided email address and password');
        res.render('user-login', {
          title: 'Login',
          emailAddress,
          errors,
          curatorIcon: getRandomIcon(),
          quote: getRandomQuote(),
          csrfToken: req.csrfToken(),
        });
      }
    } else { 
     // Otherwise display an error message to the user. (Incorrect email)
    errors.push('Login failed for the provided email address and password');
    // console.log(`******** ${errors} *******`);
    // errors = validatorErrors.array().map((error) => error.msg);
    res.render('user-login', {
      title: 'Login',
      emailAddress,
      errors,
      curatorIcon: getRandomIcon(),
      quote: getRandomQuote(),
      csrfToken: req.csrfToken(),
    });
  }
}}));

// Log Out Route

router.get('/logout', asyncHandler(async(req, res) => {

  logoutUser(req, res);

  res.redirect('/users/login')
}))


//DEMO USER LOGIN ROUTE


router.get('/demologin', csrfProtection, isAlreadyLoggedIn, asyncHandler(async(req, res) => {
  const user = await db.User.findByPk(1)

  loginUser(req, res, user);


}));


module.exports = router;
