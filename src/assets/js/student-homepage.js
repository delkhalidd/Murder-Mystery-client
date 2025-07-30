document.addEventListener('DOMContentLoaded', async () => {
  console.log('Student homepage loading…');
  await checkAuth(1);

  const joinForm = document.getElementById('joinCaseForm');
  joinForm.addEventListener('submit', e => {
    e.preventDefault();

    const raw = document.getElementById('inviteToken').value.trim();
    let token = raw;
    try {
      const url = new URL(raw, window.location.origin);
      token = url.searchParams.get('token') || raw;
    } catch (_) {
    }

    if (!token) {
      document.getElementById('message')
              .textContent = 'Please enter a valid invite URL or token.';
      return;
    }

    window.location.href = '/invite?token=' + encodeURIComponent(token);
  });
});