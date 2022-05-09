const req = require('express/lib/request'); //global request
const db = require('./db/models');

const loginUser = (req, res, user) => {
    req.session.auth = {
        userId: user.id,
    }
    req.session.save(() => {
        res.redirect('/')
    })
}
const restoreUser = async (req, res, next) => {
    console.log(req.session)
    // log the session obj to the console
    if(req.session.auth) {
        const {userId} = req.session.auth;
//try this
        try {
            //find the user by the user id
            const user = await db.User.findByPk(userId);
            //if the user exists
            if(user) {
                // write to response object
                res.locals.authenticated = true;
                res.locals.user = user;
            }
        } catch (err) {
            // if user not found throw err write false/ next
            res.locals.authenticated = false;
            next(err);
        }
    } else {
        res.locals.authenticated = false;
        next
    }
}
const logoutUser = (req, res) => {
    delete req.session.auth;
}

module.exports = {
    loginUser,
    restoreUser,
    logoutUser
}