const API_URL = 'http://localhost:3000/api';

const login = async (username, password) => {
  try {
    console.log('Attempting login for:', username);
    
    const response = await fetch(`${API_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
      body: JSON.stringify({ username, password })
    });

    console.log('Login response status:', response.status);
    const data = await response.json();
    console.log('Login response data:', data);
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || data.error || 'Login failed');
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

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
          
          if (accountType === 0 || accountType === '0') {
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

