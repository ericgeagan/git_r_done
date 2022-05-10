// External Modules
const express = require('express')
const router = express.Router()
const { check } = require('express-validator')

// Internal Modules
const db = require('../db/models')
const { Task } = db
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
	const createTask = await db.Task.build();
	res.render('tasks-form', {
	  title: 'New Task',
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
		priority,
		dueDate,
		startDate,
		repeating,
		completed,
		estimatedTime,
		note,
		listId
	})
	res.json(task)
}))

// Update a single task
router.put('/:id(\\d+)', taskValidators, handleValidationErrors, asyncHandler(async (req, res, next) => {
	const taskId = parseInt(req.params.id)
	const task = await Task.findByPk(taskId)
	if (task) {
		res.json({ task })
	} else {
		next(taskNotFoundError(taskId))
	}
}))

// Delete a single task
router.delete('/:id(\\d+)', asyncHandler(async (req, res, next) => {
	const taskId = parseInt(req.params.id)
	const task = await Task.findByPk(taskId)
	if (task) {
		await task.destroy()
		res.status(204).end()
	} else {
		next(taskNotFoundError(taskId))
	}
}))

module.exports = router
