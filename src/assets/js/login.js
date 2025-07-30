import {login} from "./api";
import {setCookie} from "./util";

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
        const result = await login(username, password);
        console.log('Login response:', result);


        let token = null;
        if (result.token) {
          token = result.token;
        } else if (result.access_token) {
          token = result.access_token;
        } else if (result.accessToken) {
          token = result.accessToken;
        }

        if (token) {
          localStorage.setItem('authToken', token);
          setCookie('authToken', token, 1);
          console.log('Token stored:', token.substring(0, 20) + '...');


          console.log('Skipping token validation test due to backend JWT issue');

        } else {
          throw new Error('No token received from server');
        }

        if (result.user) {
          localStorage.setItem('userData', JSON.stringify(result.user));
          console.log('User data stored:', result.user);

          const accountType = result.user.account_type;
          console.log('Account type:', accountType);

          const redirectTarget = window.localStorage.getItem("loginRedirect");
          if(redirectTarget){
            window.localStorage.removeItem("loginRedirect");
            window.location = redirectTarget;
          }else if (accountType === 0 || accountType === '0') {
            alert('Welcome, Teacher!');
            window.location.href = '/teacher-dashboard';
          } else if (accountType === 1 || accountType === '1') {
            alert('Welcome, Student!');
            window.location.href = '/student-homepage';
          } else {
            alert('Login successful!');
            window.location.href = '/';
          }
        } else {
          throw new Error('No user data received from server');
        }

      } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
      }
    });
  }
});

