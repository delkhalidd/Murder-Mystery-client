import {register} from "./api";

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const messageDiv = document.getElementById('message');

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();


      messageDiv.innerHTML = '';

      const userData = {
        firstname: document.getElementById('firstname').value,
        surnames: document.getElementById('surnames').value,
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        account_type: parseInt(document.getElementById('account_type').value)
      };

      try {
        messageDiv.innerHTML = '<p style="color: blue;">Registering...</p>';

        const result = await register(userData);
        console.log('Registration successful:', result);

        messageDiv.innerHTML = '<p style="color: green;">Registration successful! Redirecting to login...</p>';


        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);

      } catch (error) {
        messageDiv.innerHTML = `<p style="color: red;">Registration failed: ${error.message}</p>`;
      }
    });
  }
});
