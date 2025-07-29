const API_URL = 'http://localhost:3000/api';

let inputCount = 1;


const createCase = async (caseData) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/case`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify(caseData)
    });

    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || data.error || 'Case creation failed');
    }
  } catch (error) {
    console.error('Case creation failed:', error);
    throw error;
  }
};


const createQuestions = async (caseId, teacherInputs) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/case/${caseId}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify(teacherInputs)
    });

    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || data.error || 'Questions creation failed');
    }
  } catch (error) {
    console.error('Questions creation failed:', error);
    throw error;
  }
};


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
  
  
  inputDiv.querySelector('.remove-input').addEventListener('click', () => {
    inputDiv.remove();
  });
};


const collectFormData = (form) => {
  const formData = new FormData(form);
  
  
  const caseData = {
    title: formData.get('title'),
    description: formData.get('description')
  };
  
  
  const teacherInputs = [];
  
  
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
  const form = document.getElementById('createCaseForm');
  const messageDiv = document.getElementById('message');
  const addInputBtn = document.getElementById('add-input');
  
  
  addInputBtn.addEventListener('click', addInput);
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      messageDiv.innerHTML = '<p style="color: blue;">Creating case...</p>';
      
      const { caseData, teacherInputs } = collectFormData(form);
      console.log('Case data:', caseData);
      console.log('Teacher inputs:', teacherInputs);
      
      
      if (!caseData.title.trim()) {
        throw new Error('Please enter a case title');
      }
      
      if (teacherInputs.length < 1) {
        throw new Error('Please add at least 1 investigation element');
      }
      
      
      const caseResult = await createCase(caseData);
      console.log('Case created:', caseResult);
      
      messageDiv.innerHTML = '<p style="color: blue;">Case created! Adding investigation elements...</p>';
      
      
      const questionsResult = await createQuestions(caseResult.id, teacherInputs);
      console.log('Questions created:', questionsResult);
      
      messageDiv.innerHTML = `
        <div style="color: green; padding: 1rem; background: #d4edda; border-radius: 4px;">
          <p><strong>Case created successfully!</strong></p>
          <p><strong>Case ID:</strong> ${caseResult.id}</p>
          <p><strong>Invite Token:</strong> <code>${caseResult.invite_token || 'Will be generated'}</code></p>
          <p>Investigation elements are being processed by AI. This may take a moment.</p>
          <p>Redirecting to dashboard...</p>
        </div>
      `;
      
      setTimeout(() => {
        window.location.href = '/teacher-dashboard';
      }, 5000);
      
    } catch (error) {
      messageDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
  });
});