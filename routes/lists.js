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
    //  console.log(req.session.auth, "SESSION********************")
    const lists = await db.List.findAll()
    const tasks = await db.Task.findAll()
    //maybe add titles or other variables later
    res.render('lists', {lists, tasks})
}))
//Route to get new list form
router.get('/form', csrfProtection, asyncHandler(async(req, res) => {
  const createlist = await db.List.build();
  res.render('list-form', {
    // title: 'New List',
    createlist,
    csrfToken: req.csrfToken(),
  });
}));
//route to get list by list id/ name should show assoc tasks from requested list
router.get('/:listId', csrfProtection, asyncHandler(async(req, res) => {
   //grab id from the params
   let listId = req.params.listId

START DEBUGGING HERE
    //db queries
    const lists = await db.List.findAll()
    const tasks = await db.Task.findAll({where: {
        listId
    }})
    const list = await db.List.findByPk(listId)
    //maybe add titles or other variables later
    res.render('lists', {lists, list, tasks})
}))
//route to create new list

router.get('/', asyncHandler(async (req, res) => {
    const listId = parseInt(req.params.id, 10);
    const list = await db.List.findByPk(listId, { include: ['tasks'] });
    res.render('lists', { list });
  }));

  const listValidators = [
    check('listName')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a value for List Name')
      .isLength({ max: 50 })
      .withMessage('List Name must not be more than 50 characters long'),
  ];

// route to post new list
  router.post('/', csrfProtection, listValidators,
    asyncHandler(async (req, res) => {
      const {
        name
      } = req.body;

      const list = db.List.build({
        name,
        userId: req.params.listId
      });

      const validatorErrors = validationResult(req);

      if (validatorErrors.isEmpty()) {
        await list.save();
        res.redirect('/');
      } else {
        const errors = validatorErrors.array().map((error) => error.msg);
        res.render('lists', {
          list,
          errors,
          csrfToken: req.csrfToken(),
        });
      }
    }));
// route to get edit list
  router.get('/:id(\\d+)/edit', csrfProtection,
    asyncHandler(async (req, res) => {
      const listId = parseInt(req.params.id, 10);
      console.log('listId', listId, "9898989898")
      const list = await db.List.findByPk(listId);
      res.render('edit-list-form', {
        // title: 'Edit List',
        listId,
        list,
        csrfToken: req.csrfToken(),
      });
    }));
//route to post edit of list
  router.post('/:id(\\d+)/edit', csrfProtection, listValidators,
    asyncHandler(async (req, res) => {

      const listId = parseInt(req.params.id, 10);
      console.log(listId, "1111111101010101010100001010101")
      const listToUpdate = await db.List.findByPk(listId);

      const {
       name
      } = req.body;

      const list = {
        name,


      };

      const validatorErrors = validationResult(req);

      if (validatorErrors.isEmpty()) {
        await listToUpdate.update(list);
        res.redirect(`/lists/${listId}`); // THIS MAY NEED ATTENTION
      } else {
        const errors = validatorErrors.array().map((error) => error.msg);
        res.render('lists', {
          listId: 3,
          list: { ...list, id: listId },
          errors,
          csrfToken: req.csrfToken(),
        });
      }
    }));

//   router.get('/park/delete/:id(\\d+)', csrfProtection,
//     asyncHandler(async (req, res) => {
//       const parkId = parseInt(req.params.id, 10);
//       const park = await db.Park.findByPk(parkId);
//       res.render('park-delete', {
//         title: 'Delete Park',
//         park,
//         csrfToken: req.csrfToken(),
//       });
//     }));

  router.post('/:id(\\d+)/delete', csrfProtection,
// router.post('/lists/:id', csrfProtection,
  asyncHandler(async (req, res) => {
        console.log("DELETE ROUTE HIT")
      const listId = parseInt(req.params.id, 10);
      const list = await db.List.findByPk(listId);
      await list.destroy();
    //   res.redirect('/lists');
    res.send("DELETE")
    }));


module.exports = router;
