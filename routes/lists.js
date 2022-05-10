// External Modules
var express = require('express');
const req = require('express/lib/request');
var router = express.Router();
const bcrypt = require("bcryptjs")


// Internal Modules
const db = require('../db/models')
const { User, List, Task } = db
const { asyncHandler, csrfProtection, handleValidationErrors, check, validationResult } = require('../utils');
const { route } = require('.');
const app = require('../app');
const { requireAuth } = require('../auth')
// router.use(restoreUser)
//variable we might need
//const currentUserId = req.session.auth
//route to get all lists
router.get('/', csrfProtection, asyncHandler(async(req, res) => {
    // grab all lists from the db
    //const sessi = await db.Session.findAll()
     console.log(req.session.auth, "SESSION********************")
    const lists = await db.List.findAll()
    const tasks = await db.Task.findAll()
    //maybe add titles or other variables later
    res.render('lists', {lists, tasks})
}))

module.exports = router;
