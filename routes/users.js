// External Modules
var express = require('express');
const req = require('express/lib/request');
var router = express.Router();
const bcrypt = require("bcryptjs")

// Internal Modules
const db = require('../db/models')
const { User } = db
const { asyncHandler, csrfProtection, handleValidationErrors } = require('../utils');
const { route } = require('.');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

route.get('/register', csrfProtection, (req, res) => {
  const user = db.User.build()
  res.render('user-register', {
    // title: 'Register',
    user,
    csrfToken: req.csrfToken()
  })
})

router.post('/register', csrfProtection, handleValidationErrors, asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await db.User.create({
    username,
    email,
    hashedPassword
  })

}))

module.exports = router;
