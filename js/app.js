// Global app behavior: theme toggling, modals, toasts, and shared UI helpers.
const themeToggleButtons = document.querySelectorAll('.theme-toggle');
const toastElement = document.getElementById('toast');
const modalElement = document.getElementById('modal');
const confirmModal = document.getElementById('confirmModal');
const cancelModal = document.getElementById('cancelModal');
const confirmActionButton = document.getElementById('confirmModal') || document.getElementById('confirmDelete');
const cancelConfirm = document.getElementById('cancelConfirm');
const confirmDeleteButton = document.getElementById('confirmDelete');

function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  themeToggleButtons.forEach((button) => {
    button.textContent = theme === 'dark' ? '🌙' : '☀️';
  });
}

function initializeTheme() {
  const storedTheme = getThemePreference();
  applyTheme(storedTheme);
}

themeToggleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(nextTheme);
    saveThemePreference(nextTheme);
  });
});

function showToast(message) {
  if (!toastElement) return;
  toastElement.textContent = message;
  toastElement.classList.add('show');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toastElement.classList.remove('show'), 2200);
}

function openModal(title, message, callback) {
  const modal = modalElement || confirmModal;
  if (!modal) return;
  const titleEl = document.getElementById('modalTitle') || document.getElementById('confirmModalTitle');
  const messageEl = document.getElementById('modalMessage') || document.getElementById('confirmModalMessage');
  if (titleEl) titleEl.textContent = title;
  if (messageEl) messageEl.textContent = message;
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  if (callback && confirmActionButton) {
    confirmActionButton.onclick = () => {
      callback();
      closeModal();
    };
  }
}

function closeModal() {
  const modal = modalElement || confirmModal;
  if (!modal) return;
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
}

if (cancelModal) cancelModal.addEventListener('click', closeModal);
if (cancelConfirm) cancelConfirm.addEventListener('click', closeModal);
if (confirmDeleteButton) {
  confirmDeleteButton.addEventListener('click', () => {
    if (typeof window.deleteTaskConfirmCallback === 'function') {
      window.deleteTaskConfirmCallback();
    }
    closeModal();
  });
}

document.addEventListener('DOMContentLoaded', initializeTheme);
