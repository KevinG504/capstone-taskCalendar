const express = require('express');
const taskService = require('../services/taskService');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const filters = {
      priority: req.query.priority,
      status: req.query.status
    };
    
    const tasks = await taskService.getAllTasks(filters);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

 // Get single task by ID
router.get('/:id', async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    res.json(task);
  } catch (err) {
    next(err);
  }
});

 //Create new task
 
router.post('/', async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

 //Update existing task

router.put('/:id', async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);
    res.json(task);
  } catch (err) {
    next(err);
  }
});

 //Toggle task completion status
 
router.patch('/:id/toggle', async (req, res, next) => {
  try {
    const task = await taskService.toggleComplete(req.params.id);
    res.json(task);
  } catch (err) {
    next(err);
  }
});


 //Delete task
router.delete('/:id', async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;