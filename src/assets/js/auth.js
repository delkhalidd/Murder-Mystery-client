const checkAuth = async (requiredAccountType = null) => {
  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('userData');

  console.log('Auth check - Token:', !!token, 'UserData:', !!userData);

  if (!token || !userData) {
    console.log('No token or userData found, redirecting to login');
    window.location.href = '/login?message=Please log in to access this page';
    return false;
  }

  try {
    const user = JSON.parse(userData);
    window.user = user;
    console.log('User data:', user);
    console.log('Required account type:', requiredAccountType, 'User account type:', user.account_type);


    if (requiredAccountType !== null && user.account_type !== requiredAccountType) {
      console.log('Account type mismatch, redirecting to unauthorised');
      window.location.href = '/unauthorised';
      return false;
    }


    console.log('Auth check passed');
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

export { checkAuth, logout };

window.checkAuth = checkAuth;
window.logout = logout;
