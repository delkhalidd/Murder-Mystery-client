import { getMyCases } from "./api";

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Student homepage loading…');
  await checkAuth(1);


  const stored = localStorage.getItem('userData');
  if (stored) {
    const { firstname } = JSON.parse(stored);
    document.getElementById('user_fname').textContent = firstname || '';
  }


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



  try {
    const cases = await getMyCases();
    const list  = document.getElementById('completedCasesList');
    list.innerHTML = '';
    if (cases.length) {
      cases.forEach(c => {
        const li = document.createElement('li');
        const a  = document.createElement('a');
        a.href        = `/game-playing?id=${c.id}`;
        li.textContent = c.title;
        a.appendChild(li);
        list.appendChild(a);
      });
    } else {
      list.innerHTML = '<li>No completed cases yet.</li>';
    }
  } catch (err) {
    console.error('Error loading completed cases:', err);
    document.getElementById('completedCasesList')
            .innerHTML = '<li>Error loading cases.</li>';
  }
});
