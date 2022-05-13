// External Modules
const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const { isLoggedIn } = require('../utils.js')

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
router.get('/form', csrfProtection, isLoggedIn, asyncHandler(async(req, res) => {
	const userId = req.session.auth.userId;
	const lists = await db.List.findAll({
		where: {userId}
	})
	const task = await db.Task.build();
		res.render('tasks-form', {
			title: 'New Task',
			lists,
			task,
			csrfToken: req.csrfToken(),
		});
  }));

// Get all tasks for a specific list -- passed to listScript.js
router.get('/list/:id(\\d+)', isLoggedIn, asyncHandler(async (req, res, next) => {
	const listId = parseInt(req.params.id)
	const tasks = await Task.findAll({
		where: {
			listId
		},
		order: [["createdAt", "DESC"]]
	})
	res.json({ tasks })
}))

// Get all tasks based on the currently logged in user-- passed to listScript.js
router.get('/user', isLoggedIn, asyncHandler(async (req, res, next) => {
	const userId = req.session.auth.userId
	const tasks = await Task.findAll({
		include: {
			model: List,
			where: {userId},
			order: [["createdAt", "DESC"]]
		},
		order: [["completed", "ASC"]] //order by completed or not

	})
	res.json({ tasks })
}))

// Get a single task
router.get('/:id(\\d+)', isLoggedIn, asyncHandler(async (req, res, next) => {
	const taskId = parseInt(req.params.id)
	const task = await Task.findByPk(taskId)
	res.json(task)
}))

// Create a single task
router.post('/', csrfProtection, isLoggedIn, taskValidators, asyncHandler(async (req, res) => {
	// console.log(req.body)
	const {
		name,
		priority,
		dueDate,
		startDate,
		completed,
		estimatedTime,
		note,
		listId
	} = req.body

	const validatorErrors = validationResult(req)
	console.log('aaaaaaaaaaa', typeof priority, typeof estimatedTime)

	if (validatorErrors.isEmpty()) {
		const task = await Task.create({
			name,
			priority: priority === '' ? null : priority,
			dueDate: dueDate === '' ? null : dueDate,
			startDate: startDate === '' ? null : startDate,
			completed: completed === 'on' ? true : false,
			estimatedTime: estimatedTime === '' ? null : estimatedTime,
			note,
			listId
		})
		res.redirect('/lists')
		// res.json(task)
	} else {
		const userId = req.session.auth.userId
		const lists = await db.List.findAll({ where: { userId }})

		const task = {
			name,
			priority,
			dueDate,
			startDate,
			completed,
			estimatedTime,
			note,
			listId
		}

		const errors = validatorErrors.array().map((error) => error.msg)
		res.render('tasks-form', {
			errors,
			csrfToken: req.csrfToken(),
			task,
			lists
		})
	}
}))

// Get update task form
router.get('/:id(\\d+)/edit', csrfProtection, isLoggedIn, asyncHandler(async (req, res, next) => {
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
router.post('/edit', csrfProtection, taskValidators, isLoggedIn,  asyncHandler(async (req, res, next) => {
	const {
		id,
		name,
		priority,
		dueDate,
		startDate,
		completed,
		estimatedTime,
		note,
		listId
	} = req.body

	console.log('aaaaaaaaaaa', typeof priority, typeof estimatedTime, typeof listId, listId)
	let task = await Task.findByPk(id)
	const validatorErrors = validationResult(req)

	if (validatorErrors.isEmpty()) {
		await task.update({
			name,
			priority: priority === '' ? null : priority,
			dueDate: dueDate === '' ? null : dueDate,
			startDate: startDate === '' ? null : startDate,
			completed: completed === 'on' ? true : false,
			estimatedTime: estimatedTime === '' ? null : estimatedTime,
			note,
			listId: parseInt(listId)
		})
		res.redirect(`/lists`);
		// res.json({ task })
	} else {
		const userId = req.session.auth.userId
		const lists = await db.List.findAll({ where: { userId }})

		task = {
			id,
			name,
			priority,
			dueDate,
			startDate,
			completed,
			estimatedTime,
			note,
			listId
		}

		const errors = validatorErrors.array().map((error) => error.msg)
		res.render('tasks-form-edit', {
			errors,
			csrfToken: req.csrfToken(),
			task,
			lists
		})
	}
}))

// Delete a single task
router.get('/:id(\\d+)/delete', isLoggedIn, asyncHandler(async (req, res, next) => {
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
