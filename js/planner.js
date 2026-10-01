/* ==========================================================================
   ACADEMIC PLANNER JAVASCRIPT
   ========================================================================== */

const STORAGE_KEY = 'ols_academic_tasks';

// Initial default tasks matching the mockup design
const DEFAULT_TASKS = [
  { id: 1, title: 'Study HTML & CSS', dueDate: '2025-04-20', displayDate: 'Apr 20, 2025', completed: false },
  { id: 2, title: 'Complete JavaScript project', dueDate: '2025-04-25', displayDate: 'Apr 25, 2025', completed: false },
  { id: 3, title: 'Read Cybersecurity materials', dueDate: '2025-04-30', displayDate: 'Apr 30, 2025', completed: true },
  { id: 4, title: 'Prepare for exams', dueDate: '2025-05-05', displayDate: 'May 5, 2025', completed: false },
  { id: 5, title: 'Work on portfolio website', dueDate: '2025-05-10', displayDate: 'May 10, 2025', completed: false }
];

let tasks = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  initPlanner();
});

function initPlanner() {
  loadTasks();
  setupFilterTabs();
  setupTaskForm();
  renderTasks();
}

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      tasks = JSON.parse(saved);
    } catch (e) {
      tasks = [...DEFAULT_TASKS];
    }
  } else {
    tasks = [...DEFAULT_TASKS];
    saveTasks();
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function formatDate(dateString) {
  if (!dateString) return 'No date';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  return dateString;
}

function setupTaskForm() {
  const form = document.getElementById('task-form');
  const titleInput = document.getElementById('task-title');
  const dateInput = document.getElementById('task-due-date');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const dueDate = dateInput.value;

    if (!title) {
      window.showToast?.('Please enter a task title', 'error');
      return;
    }

    const newTask = {
      id: Date.now(),
      title: title,
      dueDate: dueDate,
      displayDate: dueDate ? formatDate(dueDate) : 'No due date',
      completed: false
    };

    tasks.unshift(newTask);
    saveTasks();
    renderTasks();

    titleInput.value = '';
    dateInput.value = '';
    window.showToast?.('Task added successfully!', 'success');
  });
}

function setupFilterTabs() {
  const filterBtns = document.querySelectorAll('.filter-tab');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter') || 'all';
      renderTasks();
    });
  });
}

function toggleTaskStatus(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
  window.showToast?.('Task deleted', 'success');
}

function updateStats() {
  const totalEl = document.getElementById('total-count');
  const pendingEl = document.getElementById('pending-count');
  const completedEl = document.getElementById('completed-count');

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  if (totalEl) totalEl.textContent = total;
  if (pendingEl) pendingEl.textContent = pending;
  if (completedEl) completedEl.textContent = completed;
}

function renderTasks() {
  const taskListEl = document.getElementById('tasks-list');
  if (!taskListEl) return;

  updateStats();

  let filteredTasks = tasks;
  if (currentFilter === 'pending') {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(t => t.completed);
  }

  if (filteredTasks.length === 0) {
    taskListEl.innerHTML = `
      <div class="empty-tasks">
        <p><i class="fa-solid fa-list-check" style="font-size: 2rem; margin-bottom: 8px; display: block; opacity: 0.5;"></i>No tasks found in this view.</p>
      </div>
    `;
    return;
  }

  taskListEl.innerHTML = filteredTasks.map(task => `
    <div class="task-row ${task.completed ? 'completed-task' : ''}">
      <input 
        type="checkbox" 
        class="task-checkbox" 
        aria-label="Mark task as completed" 
        ${task.completed ? 'checked' : ''} 
        onchange="toggleTaskStatus(${task.id})"
      />
      <div class="task-title-text">${escapeHtml(task.title)}</div>
      <div class="task-date-text">
        <i class="fa-regular fa-calendar" style="font-size: 0.75rem; margin-right: 4px; opacity: 0.7;"></i>
        ${task.displayDate || formatDate(task.dueDate)}
      </div>
      <div>
        <span class="status-badge ${task.completed ? 'completed' : 'pending'}">
          ${task.completed ? 'Completed' : 'Pending'}
        </span>
      </div>
      <button class="task-delete-btn" onclick="deleteTask(${task.id})" title="Delete Task" aria-label="Delete Task">
        <i class="fa-regular fa-trash-can"></i>
      </button>
    </div>
  `).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Attach to window for inline HTML event handlers
window.toggleTaskStatus = toggleTaskStatus;
window.deleteTask = deleteTask;
