// External Modules
const express = require('express')
const router = express.Router()
const { check } = require('express-validator')

// Internal Modules
const db = require('../db/models')
const { Task, List } = db
const { asyncHandler, csrfProtection, handleValidationErrors } = require('../utils')

const taskNotFoundError = (taskId) => {
	const err = new Error(`A task with id ${taskId} could not be found`)
	err.title = 'Tweet not found'
	err.status = 404
	return err
}

// Task validation
const taskValidators = [
	check('name')
		.exists({ checkFalsy: true })
		.withMessage('Please provide a value for the name')
		.isLength({ max: 25 })
		.withMessage('Name must not be more than 25 characters long'),
	check('note')
		.isLength({ max: 280 })
		.withMessage("Note must not be more than 280 characters long")
]

//Get new task form
router.get('/form', csrfProtection, asyncHandler(async(req, res) => {
	const lists = await db.List.findAll()
	const createTask = await db.Task.build();
		res.render('tasks-form', {
			title: 'New Task',
			lists,
			createTask,
			csrfToken: req.csrfToken(),
		});
  }));

// Get all tasks for a specific list
router.get('/list/:id(\\d+)', asyncHandler(async (req, res, next) => {
	const listId = parseInt(req.params.id)
	const tasks = await Task.findAll({
		where: {
			listId
		},
		order: [["createdAt", "DESC"]]
	})
	res.json({ tasks })
}))

// Get a single task
router.get('/:id(\\d+)', asyncHandler(async (req, res, next) => {
	const taskId = parseInt(req.params.id)
	const task = await Task.findByPk(taskId)
	res.json(task)
}))

// Create a single task
router.post('/', taskValidators, handleValidationErrors, asyncHandler(async (req, res) => {
	// console.log(req.body)
	const { 
		name, 
		priority, 
		dueDate, 
		startDate, 
		repeating, 
		completed, 
		estimatedTime, 
		note, 
		listId 
	} = req.body
	const task = await Task.create({ 
		name, 
		priority: priority === '' ? null : priority, 
		dueDate: dueDate === '' ? null : dueDate, 
		startDate: startDate === '' ? null : startDate, 
		repeating: repeating === 'on' ? true : false, 
		completed: completed === 'on' ? true : false, 
		estimatedTime: estimatedTime === '' ? null : estimatedTime, 
		note, 
		listId 
	})
	res.redirect('/lists')
	// res.json(task)
}))

// Get update task form
router.get('/:id(\\d+)/edit', csrfProtection, asyncHandler(async (req, res, next) => {
	const taskId = parseInt(req.params.id)
	const userId = req.session.auth.userId
	const lists = await db.List.findAll({ where: { userId }})
	const task = await Task.findByPk(taskId)
	res.render('tasks-form-edit', {
		title: 'New Task',
		taskId,
		lists,
		task,
		csrfToken: req.csrfToken(),
	});
}))

// Update a single task
router.post('/edit', taskValidators, handleValidationErrors, asyncHandler(async (req, res, next) => {
	const { 
		id,
		name, 
		priority, 
		dueDate, 
		startDate, 
		repeating, 
		completed, 
		estimatedTime, 
		note, 
		listId
	} = req.body
	const task = await Task.findByPk(id)
	await task.update({ 
		name, 
		priority: priority === '' ? null : priority, 
		dueDate: dueDate === '' ? null : dueDate, 
		startDate: startDate === '' ? null : startDate, 
		repeating: repeating === 'on' ? true : false, 
		completed: completed === 'on' ? true : false, 
		estimatedTime: estimatedTime === '' ? null : estimatedTime, 
		note, 
		listId 
	})
	if (task) {
		res.redirect(`/lists`);
		// res.json({ task })
	} else {
		next(taskNotFoundError(taskId))
	}
}))

// Delete a single task
router.get('/:id(\\d+)/delete', asyncHandler(async (req, res, next) => {
	const taskId = parseInt(req.params.id)
	const task = await Task.findByPk(taskId)
	task.destroy();
	res.redirect('/lists')
}))

// Delete a single task
// router.delete('/:id(\\d+)/delete', asyncHandler(async (req, res, next) => {
// 	const taskId = parseInt(req.params.id)
// 	const task = await Task.findByPk(taskId)
// 	if (task) {
// 		await task.destroy()
// 		res.status(204).end()
// 	} else {
// 		next(taskNotFoundError(taskId))
// 	}
// }))

module.exports = router
