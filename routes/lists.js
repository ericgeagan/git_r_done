// External Modules
var express = require('express');
const req = require('express/lib/request');
var router = express.Router();
const bcrypt = require("bcryptjs")
const { isLoggedIn } = require('../utils.js')

// Internal Modules
const db = require('../db/models')
const { User, List, Task } = db
const { asyncHandler, csrfProtection, handleValidationErrors, check, validationResult } = require('../utils');
const { route } = require('.');
const app = require('../app');
const { requireAuth } = require('../auth')
// router.use(restoreUser)
//variable we might need

//route to get all lists
router.get('/', csrfProtection, asyncHandler(async(req, res) => {
  if (req.session.auth === undefined) {
    // If not logged in, and user clicks on the home icon
    res.redirect('../');
  }

  const userId = req.session.auth.userId

  // grab all lists from the db
  //const sessi = await db.Session.findAll()
  //  console.log(req.session.auth, "SESSION********************")
  const lists = await db.List.findAll( {where: { userId }})
  const tasks = await db.Task.findAll( {include: {model: List, where: {userId: userId}}})
  //maybe add titles or other variables later
  res.render('lists', {
    lists,
    tasks,
    userId
  })
}))
//Route to get new list form
router.get('/form', csrfProtection, isLoggedIn, asyncHandler(async(req, res) => {
  const userId = req.session.auth.userId;
  const createlist = await db.List.build();
  res.render('list-form', {
    title: 'New List',
    createlist,
    userId,
    csrfToken: req.csrfToken(),
  });
}));
//GET SPECIFIC LIST ROUTE
router.get('/:listId', csrfProtection, isLoggedIn, asyncHandler(async(req, res) => {
   //grab id from the params
   let listId = req.params.listId;
   const userId = req.session.auth.userId;


    //db queries
    const lists = await db.List.findAll({where: {userId, id: listId}})
    const tasks = await db.Task.findAll({where: {
        listId
    }})
    const list = await db.List.findByPk(listId)
    //maybe add titles or other variables later
    res.render('lists', {lists, list, tasks})
}))

//LIST VALIDATOR
  const listValidators = [
    check('name')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a value for List Name')
      .isLength({ max: 25 })
      .withMessage('List Name must not be more than 25 characters long'),
  ];

//LIST POST ROUTE
  router.post('/', csrfProtection, isLoggedIn, listValidators,
    asyncHandler(async (req, res) => {
      const userId = req.session.auth.userId;
      const {
        name
      } = req.body;

      const list = db.List.build({
        name,
        userId
      });

      const validatorErrors = validationResult(req);
      if (validatorErrors.isEmpty()) {
        await list.save();
        res.redirect('/lists');
      } else {
        const errors = validatorErrors.array().map((error) => error.msg);
        // const lists = await db.List.findAll( {where: { userId }});
        // const tasks = await db.Task.findAll( {include: {model: List, where: {userId: userId}}});
        res.render('list-form', {
          // lists,
          // tasks,
          errors,
          csrfToken: req.csrfToken(),
        });
      }
    }));


  router.get('/:id(\\d+)/edit', csrfProtection, isLoggedIn, asyncHandler( async ( req,res )=>{
    const listId = req.params.id;
    const list = await db.List.findByPk(listId);
    const userId = req.session.auth.userId;


    res.render('edit-list-form', {
      listName: list.name, 
      listId, 
      userId,
      csrfToken: req.csrfToken()
    })
  }))
  router.post('/:id(\\d+)/edit', csrfProtection, isLoggedIn, listValidators,
    asyncHandler(async (req, res) => {
      const listId = parseInt(req.params.id, 10);
      const listToUpdate = await db.List.findByPk(listId);
      const userId = req.session.auth.userId;

      const {
       name
      } = req.body;

      const list = {
        name,
        userId
      };

      const validatorErrors = validationResult(req);

      if (validatorErrors.isEmpty()) {
        await listToUpdate.update(list);
        res.redirect(`/lists`);
      } else {
        const errors = validatorErrors.array().map((error) => error.msg);
        res.render('edit-list-form', {
          listName: listToUpdate.name,
          listId,
          errors,
          csrfToken: req.csrfToken(),

        });
      }
    }));


  router.delete('/:id(\\d+)/delete', asyncHandler(async (req, res) => {
  // console.log('******************************HIT IT')
      const listId = parseInt(req.params.id, 10);
      const list = await db.List.findByPk(listId);
      const tasks = await db.Task.findAll({
        where: {
          listId
        }
      })
      if(list) {
        // console.log(tasks, "*********************tasks")
        tasks.forEach(task => task.destroy())
        list.destroy()
      } else {
        res.json({message: "failed to delete list"})
      }

    }));





module.exports = router;
