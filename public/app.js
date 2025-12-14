const API_BASE = '/api/tasks';
let currentFilter = 'all';

// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const formMessage = document.getElementById('formMessage');
const filterBtns = document.querySelectorAll('.filter-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
  // Form submission
  taskForm.addEventListener('submit', handleCreateTask);

  // Filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      loadTasks();
    });
  });
}

// Load and display tasks
async function loadTasks() {
  showLoading();
  
  try {
    // Build query params based on filter
    let url = API_BASE;
    if (currentFilter === 'active') {
      url += '?status=active';
    } else if (currentFilter === 'completed') {
      url += '?status=completed';
    } else if (currentFilter === 'high') {
      url += '?priority=high';
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to load tasks');
    }

    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    showError(error.message);
  }
}

// Create new task
async function handleCreateTask(e) {
  e.preventDefault();
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  setButtonLoading(submitBtn, true);
  clearMessage();

  const taskData = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    dueDate: document.getElementById('dueDate').value || null,
    priority: document.getElementById('priority').value
  };

  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message);
    }

    // Success
    showMessage('Task created successfully!', 'success');
    taskForm.reset();
    loadTasks();
  } catch (error) {
    showMessage(error.message, 'error');
  } finally {
    setButtonLoading(submitBtn, false);
  }
}

// Toggle task completion
async function toggleTask(id, currentStatus) {
  try {
    const response = await fetch(`${API_BASE}/${id}/toggle`, {
      method: 'PATCH'
    });

    if (!response.ok) {
      throw new Error('Failed to toggle task');
    }

    loadTasks();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Delete task
async function deleteTask(id) {
  if (!confirm('Are you sure you want to delete this task?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    loadTasks();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Render tasks to DOM
function renderTasks(tasks) {
  if (tasks.length === 0) {
    taskList.innerHTML = '<div class="empty">No tasks found. Create one above!</div>';
    return;
  }

  taskList.innerHTML = tasks.map(task => `
    <div class="task ${task.completed ? 'completed' : ''}">
      <div class="task-header">
        <div class="task-title">${escapeHtml(task.title)}</div>
        <span class="task-priority ${task.priority}">${task.priority}</span>
      </div>
      
      ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
      
      <div class="task-meta">
        ${task.dueDate ? `<span>📅 Due: ${formatDate(task.dueDate)}</span>` : ''}
        <span>Created: ${formatDate(task.createdAt)}</span>
      </div>
      
      <div class="task-actions">
        <button class="btn-toggle" onclick="toggleTask('${task.id}', ${task.completed})">
          ${task.completed ? 'Reopen' : 'Complete'}
        </button>
        <button class="btn-delete" onclick="deleteTask('${task.id}')">
          Delete
        </button>
      </div>
    </div>
  `).join('');
}

// Helper: Show loading state
function showLoading() {
  taskList.innerHTML = '<div class="loading">Loading tasks...</div>';
}

// Helper: Show error in task list
function showError(message) {
  taskList.innerHTML = `<div class="empty">Error: ${escapeHtml(message)}</div>`;
}

// Helper: Show form message
function showMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `message ${type}`;
  
  if (type === 'success') {
    setTimeout(() => {
      formMessage.className = 'message';
    }, 3000);
  }
}

// Helper: Clear form message
function clearMessage() {
  formMessage.className = 'message';
}

// Helper: Set button loading state
function setButtonLoading(button, isLoading) {
  const text = button.querySelector('.btn-text');
  const loading = button.querySelector('.btn-loading');
  
  if (isLoading) {
    text.style.display = 'none';
    loading.style.display = 'inline';
    button.disabled = true;
  } else {
    text.style.display = 'inline';
    loading.style.display = 'none';
    button.disabled = false;
  }
}

// Helper: Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Helper: Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}