const API_URL = 'http://localhost:3000/api';

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