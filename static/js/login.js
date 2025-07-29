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

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      try {
        const result = await login(username, password);
        console.log('Full login response:', JSON.stringify(result, null, 2)); 
        
        if (result.token) {
          localStorage.setItem('authToken', result.token);
        }
        if (result.user) {
          localStorage.setItem('userData', JSON.stringify(result.user));
          console.log('User object:', JSON.stringify(result.user, null, 2)); 
        }
        
        
        let accountType = null;
        
        if (result.user && result.user.account_type !== undefined) {
          accountType = result.user.account_type;
        } else if (result.account_type !== undefined) {
          accountType = result.account_type;
        } else if (result.user && result.user.accountType !== undefined) {
          accountType = result.user.accountType;
        } else if (result.user && result.user.role !== undefined) {
          accountType = result.user.role;
        }
        
        console.log('Found account type:', accountType, 'Type:', typeof accountType);
        
        if (accountType !== null && accountType !== undefined) {
          if (accountType === 0 || accountType === '0' || accountType === 'teacher') {
            alert('Welcome, Teacher!');
            window.location.href = '/teacher-dashboard';
          } else if (accountType === 1 || accountType === '1' || accountType === 'student') {
            alert('Welcome, Student!');
            window.location.href = '/student-homepage';
          } else {
            alert(`Login successful! Unknown account type: ${accountType}`);
            window.location.href = '/';
          }
        } else {
          console.log('No account_type found in result:', result);
          alert('Login successful! No account type found. Check console for response details.');
          window.location.href = '/';
        }
        
      } catch (error) {
        alert('Login failed: ' + error.message);
      }
    });
  }
});

