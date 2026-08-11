// Task management logic for adding, editing, deleting, filtering, and sorting tasks.
const taskModal = document.getElementById('taskModal');
const openTaskModalButton = document.getElementById('openTaskModal');
const closeTaskModalButton = document.getElementById('closeTaskModal');
const taskForm = document.getElementById('taskForm');
const taskIdInput = document.getElementById('taskId');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const subjectInput = document.getElementById('subject');
const categoryInput = document.getElementById('category');
const priorityInput = document.getElementById('priority');
const dueDateInput = document.getElementById('dueDate');
const statusInput = document.getElementById('status');
const tasksContainer = document.getElementById('tasksContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const priorityFilter = document.getElementById('priorityFilter');
const sortSelect = document.getElementById('sortSelect');
const taskModalTitle = document.getElementById('taskModalTitle');

let tasks = getTasks();
let taskToDeleteId = null;

function createTask(task) {
  return {
    id: task.id || crypto.randomUUID(),
    title: task.title,
    description: task.description || '',
    subject: task.subject,
    category: task.category,
    priority: task.priority,
    dueDate: task.dueDate,
    status: task.status || 'Pending',
    createdAt: task.createdAt || new Date().toISOString()
  };
}

function renderTasks() {
  if (!tasksContainer) return;

  const searchValue = searchInput?.value.toLowerCase() || '';
  const categoryValue = categoryFilter?.value || 'all';
  const priorityValue = priorityFilter?.value || 'all';
  const sortValue = sortSelect?.value || 'dueDate';

  let filtered = [...tasks].filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchValue) || task.subject.toLowerCase().includes(searchValue);
    const matchesCategory = categoryValue === 'all' || task.category === categoryValue;
    const matchesPriority = priorityValue === 'all' || task.priority === priorityValue;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  filtered.sort((a, b) => {
    if (sortValue === 'title') return a.title.localeCompare(b.title);
    if (sortValue === 'createdAt') return new Date(b.createdAt) - new Date(a.createdAt);
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  if (!filtered.length) {
    tasksContainer.innerHTML = '<div class="empty-state">No tasks match your filters yet. Add one to get started.</div>';
    return;
  }

  tasksContainer.innerHTML = filtered
    .map((task) => {
      const completed = task.status === 'Completed';
      const overdue = !completed && new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);
      return `
        <article class="task-card ${completed ? 'completed' : ''}">
          <span class="tag">${task.category}</span>
          <h3>${task.title}</h3>
          <p>${task.description || 'No description provided.'}</p>
          <p><strong>Subject:</strong> ${task.subject}</p>
          <p><strong>Priority:</strong> ${task.priority}</p>
          <p><strong>Due:</strong> ${task.dueDate}</p>
          <p><strong>Status:</strong> ${task.status}</p>
          <p class="muted">${overdue ? 'Overdue' : 'On track'}</p>
          <div class="task-actions">
            <button data-action="toggle" data-id="${task.id}">${completed ? 'Mark Pending' : 'Mark Complete'}</button>
            <button data-action="edit" data-id="${task.id}">Edit</button>
            <button data-action="delete" data-id="${task.id}">Delete</button>
          </div>
        </article>
      `;
    })
    .join('');
}

function resetTaskForm() {
  taskForm.reset();
  taskIdInput.value = '';
  taskModalTitle.textContent = 'Add Task';
}

function openTaskModal(task = null) {
  if (!taskModal) return;
  taskModal.classList.add('show');
  taskModal.setAttribute('aria-hidden', 'false');
  if (task) {
    taskModalTitle.textContent = 'Edit Task';
    taskIdInput.value = task.id;
    titleInput.value = task.title;
    descriptionInput.value = task.description || '';
    subjectInput.value = task.subject;
    categoryInput.value = task.category;
    priorityInput.value = task.priority;
    dueDateInput.value = task.dueDate;
    statusInput.value = task.status;
  } else {
    resetTaskForm();
  }
}

function closeTaskModal() {
  if (!taskModal) return;
  taskModal.classList.remove('show');
  taskModal.setAttribute('aria-hidden', 'true');
}

function saveTask(event) {
  event.preventDefault();
  const payload = {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    subject: subjectInput.value.trim(),
    category: categoryInput.value,
    priority: priorityInput.value,
    dueDate: dueDateInput.value,
    status: statusInput.value
  };

  if (!payload.title || !payload.subject || !payload.dueDate) {
    showToast('Please fill in all required fields.');
    return;
  }

  if (taskIdInput.value) {
    tasks = tasks.map((task) => (task.id === taskIdInput.value ? { ...task, ...payload } : task));
    showToast('Task updated successfully.');
  } else {
    tasks = [...tasks, createTask(payload)];
    showToast('Task added successfully.');
  }

  saveTasks(tasks);
  renderTasks();
  closeTaskModal();
  resetTaskForm();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks(tasks);
  renderTasks();
  showToast('Task deleted.');
}

function toggleTaskStatus(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
      return { ...task, status: nextStatus };
    }
    return task;
  });
  saveTasks(tasks);
  renderTasks();
}

function attachTaskEvents() {
  openTaskModalButton?.addEventListener('click', () => openTaskModal());
  closeTaskModalButton?.addEventListener('click', closeTaskModal);
  taskForm?.addEventListener('submit', saveTask);

  tasksContainer?.addEventListener('click', (event) => {
    const target = event.target;
    const action = target.dataset.action;
    const id = target.dataset.id;

    if (action === 'delete') {
      taskToDeleteId = id;
      window.deleteTaskConfirmCallback = () => deleteTask(id);
      openModal('Delete Task', 'Delete this task permanently?', () => deleteTask(id));
    }

    if (action === 'edit') {
      const task = tasks.find((item) => item.id === id);
      if (task) openTaskModal(task);
    }

    if (action === 'toggle') {
      toggleTaskStatus(id);
    }
  });

  [searchInput, categoryFilter, priorityFilter, sortSelect].forEach((element) => {
    element?.addEventListener('input', renderTasks);
    element?.addEventListener('change', renderTasks);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  tasks = getTasks();
  renderTasks();
  attachTaskEvents();
});
