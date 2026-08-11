// Dashboard metrics and recent task summary.
document.addEventListener('DOMContentLoaded', () => {
  const totalTasksEl = document.getElementById('totalTasks');
  const completedTasksEl = document.getElementById('completedTasks');
  const pendingTasksEl = document.getElementById('pendingTasks');
  const overdueTasksEl = document.getElementById('overdueTasks');
  const progressBar = document.getElementById('progressBar');
  const progressLabel = document.getElementById('progressLabel');
  const todayTasks = document.getElementById('todayTasks');
  const recentTasksTable = document.getElementById('recentTasksTable');

  const tasks = getTasks();
  const completed = tasks.filter((task) => task.status === 'Completed').length;
  const pending = tasks.filter((task) => task.status === 'Pending').length;
  const overdue = tasks.filter((task) => task.status !== 'Completed' && new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0)).length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  if (totalTasksEl) totalTasksEl.textContent = tasks.length;
  if (completedTasksEl) completedTasksEl.textContent = completed;
  if (pendingTasksEl) pendingTasksEl.textContent = pending;
  if (overdueTasksEl) overdueTasksEl.textContent = overdue;
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (progressLabel) progressLabel.textContent = `${progress}%`;

  const todaysDate = new Date().toISOString().slice(0, 10);
  const todayList = tasks.filter((task) => task.dueDate === todaysDate);

  if (todayTasks) {
    if (!todayList.length) {
      todayTasks.innerHTML = '<li class="empty-state">No tasks due today.</li>';
    } else {
      todayTasks.innerHTML = todayList
        .map((task) => `<li>${task.title} · ${task.priority}</li>`)
        .join('');
    }
  }

  if (recentTasksTable) {
    const recent = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    if (!recent.length) {
      recentTasksTable.innerHTML = '<tr><td colspan="5" class="empty-state">No tasks yet.</td></tr>';
    } else {
      recentTasksTable.innerHTML = recent
        .map((task) => `
          <tr>
            <td>${task.title}</td>
            <td>${task.subject}</td>
            <td>${task.priority}</td>
            <td>${task.status}</td>
            <td>${task.dueDate}</td>
          </tr>
        `)
        .join('');
    }
  }
});
