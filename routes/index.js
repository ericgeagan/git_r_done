var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let userId = undefined
  if (req.session.auth) {
    userId = req.session.auth.userId
  }
  res.render('index', { 
    title: 'The app for people that get things done!',
    userId
  });
});

module.exports = router;
