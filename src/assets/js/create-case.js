
let inputCount = 1;

// Function to create a new case using authenticated request
const createCase = async (caseData) => {
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


const createQuestions = async (caseId, teacherInputs) => {
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

// Add new input entry
const addInput = () => {
  const container = document.getElementById('inputs-container');
  const inputDiv = document.createElement('div');
  inputDiv.className = 'input-entry';
  inputDiv.innerHTML = `
    <h4>Investigation Element ${inputCount + 1}</h4>
    <div class="form-group">
      <label>Scenario/Situation:</label>
      <textarea name="input_body_${inputCount}" rows="3" required></textarea>
    </div>
    <div class="form-group">
      <label>Correct Conclusion/Answer:</label>
      <textarea name="input_answer_${inputCount}" rows="2" required></textarea>
    </div>
    <button type="button" class="btn btn-danger remove-input">Remove Element</button>
  `;
  
  container.appendChild(inputDiv);
  inputCount++;
  
  // Add remove functionality
  inputDiv.querySelector('.remove-input').addEventListener('click', () => {
    inputDiv.remove();
  });
};

// Collect form data in the format your backend expects
const collectFormData = (form) => {
  const formData = new FormData(form);
  
  // Case data for the first API call
  const caseData = {
    title: formData.get('title'),
    description: formData.get('description'),
    brief: formData.get('brief') // Add the case brief
  };
  
  // Teacher inputs for the second API call
  const teacherInputs = [];
  
  // Collect teacher inputs
  for (let i = 0; i < inputCount; i++) {
    const body = formData.get(`input_body_${i}`);
    if (body) {
      teacherInputs.push({
        body: body,
        answer: formData.get(`input_answer_${i}`)
      });
    }
  }
  
  return { caseData, teacherInputs };
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('Create case script loaded');
  console.log('API_URL available:', typeof API_URL !== 'undefined' ? API_URL : 'NOT FOUND');
  
  const form = document.getElementById('createCaseForm');
  const messageDiv = document.getElementById('message');
  const addInputBtn = document.getElementById('add-input');
  
  console.log('Form elements found:', {
    form: !!form,
    messageDiv: !!messageDiv,
    addInputBtn: !!addInputBtn
  });
  
  if (!form) {
    console.error('createCaseForm not found!');
    return;
  }
  
  // Add event listener for adding more input fields
  if (addInputBtn) {
    addInputBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Add input button clicked');
      addInput();
    });
  }
  
  // Add event listener for form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Create case form submitted!');
    
    try {
      messageDiv.innerHTML = '<p style="color: blue;">Creating case...</p>';
      
      const { caseData, teacherInputs } = collectFormData(form);
      console.log('Case data:', caseData);
      console.log('Teacher inputs:', teacherInputs);
      
      // Validate data
      if (!caseData.title || !caseData.title.trim()) {
        throw new Error('Please enter a case title');
      }
      
      if (!caseData.brief || !caseData.brief.trim()) {
        throw new Error('Please enter a case brief');
      }
      
      if (teacherInputs.length < 1) {
        throw new Error('Please add at least 1 investigation element');
      }
      
      // Validate each teacher input
      for (let i = 0; i < teacherInputs.length; i++) {
        if (!teacherInputs[i].body || !teacherInputs[i].body.trim()) {
          throw new Error(`Please fill in the scenario for investigation element ${i + 1}`);
        }
        if (!teacherInputs[i].answer || !teacherInputs[i].answer.trim()) {
          throw new Error(`Please fill in the answer for investigation element ${i + 1}`);
        }
      }
      
      // Step 1: Create the case
      console.log('Step 1: Creating case...');
      const caseResult = await createCase(caseData);
      console.log('Case created:', caseResult);
      
      messageDiv.innerHTML = '<p style="color: blue;">Case created! Adding investigation elements...</p>';
      
      // Step 2: Add teacher inputs/questions
      console.log('Step 2: Adding questions...');
      const questionsResult = await createQuestions(caseResult.id, teacherInputs);
      console.log('Questions created:', questionsResult);
      
      messageDiv.innerHTML = `
        <div style="color: green; padding: 1rem; background: #d4edda; border-radius: 4px;">
          <p><strong>Case created successfully!</strong></p>
          <p><strong>Case ID:</strong> ${caseResult.id}</p>
          <p><strong>Invite Token:</strong> <code>${caseResult.invite_token || 'Will be generated'}</code></p>
          <p>Investigation elements are being processed by AI. This may take a moment.</p>
          <p>Redirecting to dashboard in 5 seconds...</p>
        </div>
      `;
      
      setTimeout(() => {
        window.location.href = '/teacher-dashboard';
      }, 5000);
      
    } catch (error) {
      console.error('Case creation error:', error);
      
      // Provide more specific error messages
      let userFriendlyMessage = error.message;
      
      if (error.message === 'Access forbidden') {
        userFriendlyMessage = 'You do not have permission to create cases. Please check that you are logged in as a teacher.';
      } else if (error.message.includes('Authentication failed')) {
        userFriendlyMessage = 'Your session has expired. Please log in again.';
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
      
      messageDiv.innerHTML = `<p style="color: red;">Error: ${userFriendlyMessage}</p>`;
    }
  });
});