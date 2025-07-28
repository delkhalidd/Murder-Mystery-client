const API_URL = 'http://localhost:3000/api';

const login = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    
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

const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || data.error || 'Registration failed');
    }
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};


document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      try {
        const result = await login(username, password);
        console.log('Login successful:', result);
        
        
        alert('Login successful!');
        window.location.href = '/'; 
        
      } catch (error) {
        alert('Login failed: ' + error.message);
      }
    });
  }
});

