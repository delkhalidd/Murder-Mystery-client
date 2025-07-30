import {API_URL} from "./const";

export const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    throw new Error('No authentication token found');
  }

  const defaultOptions = {
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json',
      ...options.headers
    },
    credentials: 'include'
  };

  const response = await fetch(url, { ...defaultOptions, ...options });


  if (response.status === 401) {
    console.log('Auth failed (401), redirecting to login');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = '/login?message=Session expired, please log in again';
    throw new Error('Authentication failed');
  }


  if (response.status === 403) {
    console.log('Access forbidden (403) for:', url);
    throw new Error('Access forbidden');
  }

  return response;
};

export const register = async (userData) => {
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
}

export const login = async (username, password) => {
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

// Function to create a new case using authenticated request
export const createCase = async (caseData) => {
  try {
    console.log('Creating case with data:', caseData);


    const response = await makeAuthenticatedRequest(`${API_URL}/case`, {
      method: 'POST',
      body: JSON.stringify(caseData)
    });

    console.log('Create case response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('Create case response data:', data);
      return data;
    } else {
      let errorMessage = 'Case creation failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.log('Error data:', errorData);
      } catch (e) {
        console.log('Could not parse error response');
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Case creation failed:', error);
    throw error;
  }
};

export const createQuestions = async (caseId, teacherInputs) => {
  try {
    console.log('Creating questions for case', caseId, 'with inputs:', teacherInputs);

    const response = await makeAuthenticatedRequest(`${API_URL}/case/${caseId}/questions`, {
      method: 'POST',
      body: JSON.stringify(teacherInputs)
    });

    console.log('Create questions response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('Create questions response data:', data);
      return data;
    } else {
      let errorMessage = 'Questions creation failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.log('Error data:', errorData);
      } catch (e) {
        console.log('Could not parse error response');
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Questions creation failed:', error);
    throw error;
  }
};

export const getMyCases = () => {
  return makeAuthenticatedRequest(`${API_URL}/case/mine`).then(r=>r.json());
}

export const getCaseDetails = async (caseId) => {
  try {
    const response = await makeAuthenticatedRequest(`${API_URL}/case/${caseId}`, {
      method: 'GET'
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Failed to load case details');
    }
  } catch (error) {
    console.error('Load case details failed:', error);
    throw error;
  }
};

export const getCaseAnalytics = async (caseId) => {
  try {
    const response = await makeAuthenticatedRequest(`${API_URL}/case/${caseId}/analytics`, {
      method: 'GET'
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Failed to load case details');
    }
  } catch (error) {
    console.error('Load case details failed:', error);
    throw error;
  }
};

export const getCaseByInvite = async (token) => {
  try {
    const response = await makeAuthenticatedRequest(`${API_URL}/case/invite/${token}`, {
      method: 'GET'
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Failed to load case details');
    }
  } catch (error) {
    console.error('Load case details failed:', error);
    throw error;
  }
};

export const acceptCase = async (token) => {
  try {
    const response = await makeAuthenticatedRequest(`${API_URL}/case/invite/${token}`, {
      method: 'POST'
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Failed to accept case: ' + await response.json().then(r=>r.message));
    }
  } catch (error) {
    console.error('Load case details failed:', error);
    throw error;
  }
}

export const getQuestionsStatus = async (caseId) => {
  try {
    const response = await makeAuthenticatedRequest(`${API_URL}/case/${caseId}/questions/status`, {
      method: 'GET'
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Failed to load questions status');
    }
  } catch (error) {
    console.error('Load questions status failed:', error);
    throw error;
  }
};
