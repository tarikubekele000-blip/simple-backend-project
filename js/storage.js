// Shared storage helpers for persisting app data in localStorage.
const STORAGE_KEYS = {
  tasks: 'student-task-manager.tasks',
  profile: 'student-task-manager.profile',
  theme: 'student-task-manager.theme'
};

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn('Unable to read storage:', error);
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getTasks() {
  return readStorage(STORAGE_KEYS.tasks, []);
}

function saveTasks(tasks) {
  writeStorage(STORAGE_KEYS.tasks, tasks);
}

function getProfile() {
  return readStorage(STORAGE_KEYS.profile, {
    name: ' tariku bekele',
    email: 'tarik@gmail.com',
    school: 'ifaa boruu High School',
    grade: 'Grade 12'
  });
}

function saveProfile(profile) {
  writeStorage(STORAGE_KEYS.profile, profile);
}

function getThemePreference() {
  return readStorage(STORAGE_KEYS.theme, 'light');
}

function saveThemePreference(theme) {
  writeStorage(STORAGE_KEYS.theme, theme);
}
