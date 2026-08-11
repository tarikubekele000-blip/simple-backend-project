// Profile and settings UI interactions.
document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const profileForm = document.querySelector('.profile-form');
  const profileName = document.querySelector('.profile-header h2');
  const profileEmail = document.querySelector('.profile-header p');

  if (darkModeToggle) {
    darkModeToggle.checked = getThemePreference() === 'dark';
    darkModeToggle.addEventListener('change', () => {
      const nextTheme = darkModeToggle.checked ? 'dark' : 'light';
      applyTheme(nextTheme);
      saveThemePreference(nextTheme);
    });
  }

  if (profileForm) {
    profileForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(profileForm);
      const profile = {
        name: formData.get('name') || ' tariku bekele',
        email: formData.get('email') || 'tarik@gmail.com',
        school: formData.get('school') || 'ifa boru High School',
        grade: formData.get('grade') || 'Grade 12'
      };
      saveProfile(profile);
      if (profileName) profileName.textContent = profile.name;
      if (profileEmail) profileEmail.textContent = profile.email;
      showToast('Profile updated.');
    });
  }
});
