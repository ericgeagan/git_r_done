const express = require('express');
const db = require('../db/models');
const {check, validationResult} = require('express-validator')

const router = express.Router();

// get all tasks
router.get('/lists', asyncHandler(async(req, res) => {
    //query to find username by userId
    const lists = db.List.findAll({include: ['tasks'], order: [['name', 'ASC']]});
    //const currentUser =
    res.render('lists',)
}))

module.exports = router;
