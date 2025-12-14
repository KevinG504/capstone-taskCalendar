const db = require('../db/database');

const COLLECTION = 'tasks';

class TaskService {
  
   // Get all tasks

  async getAllTasks(filters = {}) {
    let tasks = await db.getAll(COLLECTION);
    
    // Filter by priority 
    if (filters.priority) {
      tasks = tasks.filter(t => t.priority === filters.priority);
    }
    
    // Filter by status 
    if (filters.status) {
      tasks = tasks.filter(t => t.completed === (filters.status === 'completed'));
    }
    
    // Sort by due date
    tasks.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
    
    return tasks;
  }

   // Get single task by ID

  async getTaskById(id) {
    const task = await db.getById(COLLECTION, id);
    
    if (!task) {
      throw { status: 404, message: 'Task not found' };
    }
    
    return task;
  }

   //Create new task with validation

  async createTask(data) {
    if (!data.title || data.title.trim().length === 0) {
      throw { status: 400, message: 'Title is required' };
    }

    if (data.title.length > 100) {
      throw { status: 400, message: 'Title must be less than 100 characters' };
    }

    const validPriorities = ['low', 'medium', 'high'];
    if (data.priority && !validPriorities.includes(data.priority)) {
      throw { status: 400, message: 'Priority must be low, medium, or high' };
    }

    const task = {
      title: data.title.trim(),
      description: data.description ? data.description.trim() : '',
      dueDate: data.dueDate || null,
      priority: data.priority || 'medium',
      completed: false
    };

    return await db.create(COLLECTION, task);
  }
  //update task

  async updateTask(id, updates) {
    if (updates.title !== undefined) {
      if (!updates.title || updates.title.trim().length === 0) {
        throw { status: 400, message: 'Title cannot be empty' };
      }
      updates.title = updates.title.trim();
    }

    if (updates.priority) {
      const validPriorities = ['low', 'medium', 'high'];
      if (!validPriorities.includes(updates.priority)) {
        throw { status: 400, message: 'Priority must be low, medium, or high' };
      }
    }

    const task = await db.update(COLLECTION, id, updates);
    
    if (!task) {
      throw { status: 404, message: 'Task not found' };
    }
    
    return task;
  }

   //Toggle task completion status

  async toggleComplete(id) {
    const task = await db.getById(COLLECTION, id);
    
    if (!task) {
      throw { status: 404, message: 'Task not found' };
    }

    return await db.update(COLLECTION, id, {
      completed: !task.completed
    });
  }

  // Delete task
  
  async deleteTask(id) {
    const deleted = await db.delete(COLLECTION, id);
    
    if (!deleted) {
      throw { status: 404, message: 'Task not found' };
    }
    
    return true;
  }
}

module.exports = new TaskService();