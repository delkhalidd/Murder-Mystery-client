const checkAuth = async (requiredAccountType = null) => {
  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('userData');
  
  if (!token || !userData) {
    window.location.href = '/login?message=Please log in to access this page';
    return false;
  }
  
  try {
    const user = JSON.parse(userData);
    
    
    if (requiredAccountType !== null && user.account_type !== requiredAccountType) {
      window.location.href = '/unauthorised';
      return false;
    }
    
    
    try {
      const response = await fetch('http://localhost:3000/api/user/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        console.log('Token verification failed, but allowing access based on stored data');
      }
    } catch (fetchError) {
      console.log('Backend verification failed, allowing access based on stored data');
    }
    
    return true;
  } catch (error) {
    console.error('Auth check failed:', error);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = '/login?message=Authentication error';
    return false;
  }
};

const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  window.location.href = '/login?message=Logged out successfully';
};