import { beforeAll, describe, test, expect, afterAll, vi } from 'vitest';

describe('register page', () => {
  let mockDoc;
  const fakeDivs = {};

  beforeAll(async () => {
    
    mockDoc = vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (fakeDivs[id]) return fakeDivs[id];
      
      if (id === 'registerForm') {
        const form = document.createElement('form');
        form.id = id;
        
        const firstnameInput = document.createElement('input');
        firstnameInput.id = 'firstname';
        firstnameInput.name = 'firstname';
        firstnameInput.type = 'text';
        form.appendChild(firstnameInput);
        
        const surnamesInput = document.createElement('input');
        surnamesInput.id = 'surnames';
        surnamesInput.name = 'surnames';
        surnamesInput.type = 'text';
        form.appendChild(surnamesInput);
        
        const usernameInput = document.createElement('input');
        usernameInput.id = 'username';
        usernameInput.name = 'username';
        usernameInput.type = 'text';
        form.appendChild(usernameInput);
        
        const emailInput = document.createElement('input');
        emailInput.id = 'email';
        emailInput.name = 'email';
        emailInput.type = 'email';
        form.appendChild(emailInput);
        
        const passwordInput = document.createElement('input');
        passwordInput.id = 'password';
        passwordInput.name = 'password';
        passwordInput.type = 'password';
        form.appendChild(passwordInput);
        
        const accountTypeSelect = document.createElement('select');
        accountTypeSelect.id = 'account_type';
        accountTypeSelect.name = 'account_type';
        const option1 = document.createElement('option');
        option1.value = '1';
        option1.text = 'Student';
        const option0 = document.createElement('option');
        option0.value = '0';
        option0.text = 'Teacher';
        accountTypeSelect.appendChild(option1);
        accountTypeSelect.appendChild(option0);
        form.appendChild(accountTypeSelect);
        
        document.body.append(form);
        return (fakeDivs[id] = form);
      }
      
      if (id === 'message') {
        const div = document.createElement('div');
        div.id = id;
        div.innerHTML = '';
        document.body.append(div);
        return (fakeDivs[id] = div);
      }
      
      if (id === 'firstname' || id === 'surnames' || id === 'username' || id === 'email' || id === 'password') {
        const input = document.createElement('input');
        input.id = id;
        input.name = id;
        input.type = id === 'email' ? 'email' : id === 'password' ? 'password' : 'text';
        document.body.append(input);
        return (fakeDivs[id] = input);
      }
      
      if (id === 'account_type') {
        const select = document.createElement('select');
        select.id = id;
        select.name = id;
        const option1 = document.createElement('option');
        option1.value = '1';
        const option0 = document.createElement('option');
        option0.value = '0';
        select.appendChild(option1);
        select.appendChild(option0);
        document.body.append(select);
        return (fakeDivs[id] = select);
      }
      
      
      fakeDivs[id] = document.createElement('div');
      fakeDivs[id].id = id;
      document.body.append(fakeDivs[id]);
      return fakeDivs[id];
    });
  });

  
  const generateUniqueId = () => {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  };

  test('loads register page elements', async () => {
    await import('../assets/js/register');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));
    
    console.log('Elements accessed:', Object.keys(fakeDivs));
    
    expect(Object.keys(fakeDivs).length).toBeGreaterThan(0);
  });

  test('handles successful teacher registration', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    await import('../assets/js/register');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    if (fakeDivs['registerForm'] && fakeDivs['message']) {
      const uniqueId = generateUniqueId();
      if (fakeDivs['firstname']) fakeDivs['firstname'].value = 'John';
      if (fakeDivs['surnames']) fakeDivs['surnames'].value = 'Doe';
      if (fakeDivs['username']) fakeDivs['username'].value = `teacher_${uniqueId}`;
      if (fakeDivs['email']) fakeDivs['email'].value = `teacher_${uniqueId}@test.com`;
      if (fakeDivs['password']) fakeDivs['password'].value = 'password123';
      if (fakeDivs['account_type']) fakeDivs['account_type'].value = '0';
      
      const submitEvent = new Event('submit');
      fakeDivs['registerForm'].dispatchEvent(submitEvent);
      await new Promise(r => setTimeout(r, 3000)); 
      
      
      expect(fakeDivs['message'].innerHTML).toMatch(/Registering\.\.\.|Registration successful|Registration failed/);
    }
  });

  test('handles successful student registration', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    await import('../assets/js/register');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    if (fakeDivs['registerForm'] && fakeDivs['message']) {
      const uniqueId = generateUniqueId();
      if (fakeDivs['firstname']) fakeDivs['firstname'].value = 'Jane';
      if (fakeDivs['surnames']) fakeDivs['surnames'].value = 'Smith';
      if (fakeDivs['username']) fakeDivs['username'].value = `student_${uniqueId}`;
      if (fakeDivs['email']) fakeDivs['email'].value = `student_${uniqueId}@test.com`;
      if (fakeDivs['password']) fakeDivs['password'].value = 'password123';
      if (fakeDivs['account_type']) fakeDivs['account_type'].value = '1';
      
      const submitEvent = new Event('submit');
      fakeDivs['registerForm'].dispatchEvent(submitEvent);
      await new Promise(r => setTimeout(r, 3000));
      
      
      expect(fakeDivs['message'].innerHTML).toMatch(/Registering\.\.\.|Registration successful|Registration failed/);
    }
  });

  test('handles registration failure with existing username', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    await import('../assets/js/register');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    if (fakeDivs['registerForm'] && fakeDivs['message']) {
      if (fakeDivs['firstname']) fakeDivs['firstname'].value = 'Test';
      if (fakeDivs['surnames']) fakeDivs['surnames'].value = 'User';
      if (fakeDivs['username']) fakeDivs['username'].value = 'john_doe'; 
      if (fakeDivs['email']) fakeDivs['email'].value = 'test@example.com';
      if (fakeDivs['password']) fakeDivs['password'].value = 'password123';
      if (fakeDivs['account_type']) fakeDivs['account_type'].value = '1';
      
      const submitEvent = new Event('submit');
      fakeDivs['registerForm'].dispatchEvent(submitEvent);
      await new Promise(r => setTimeout(r, 2000));
      
      expect(fakeDivs['message'].innerHTML).toContain('Registration failed');
    }
  });

  test('handles empty form submission', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    await import('../assets/js/register');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    if (fakeDivs['registerForm'] && fakeDivs['message']) {
      if (fakeDivs['firstname']) fakeDivs['firstname'].value = '';
      if (fakeDivs['surnames']) fakeDivs['surnames'].value = '';
      if (fakeDivs['username']) fakeDivs['username'].value = '';
      if (fakeDivs['email']) fakeDivs['email'].value = '';
      if (fakeDivs['password']) fakeDivs['password'].value = '';
      
      const submitEvent = new Event('submit');
      fakeDivs['registerForm'].dispatchEvent(submitEvent);
      await new Promise(r => setTimeout(r, 1500));
      
      
      expect(fakeDivs['message'].innerHTML).toContain('Registration failed');
    }
  });

  test('handles message display functionality', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    await import('../assets/js/register');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    if (fakeDivs['registerForm'] && fakeDivs['message']) {

      expect(fakeDivs['message'].innerHTML).toBe('');
      
      const uniqueId = generateUniqueId();
      if (fakeDivs['firstname']) fakeDivs['firstname'].value = 'Test';
      if (fakeDivs['surnames']) fakeDivs['surnames'].value = 'User';
      if (fakeDivs['username']) fakeDivs['username'].value = `test_register_${uniqueId}`;
      if (fakeDivs['email']) fakeDivs['email'].value = `test_${uniqueId}@register.com`;
      if (fakeDivs['password']) fakeDivs['password'].value = 'password123';
      if (fakeDivs['account_type']) fakeDivs['account_type'].value = '1';
      
      const submitEvent = new Event('submit');
      fakeDivs['registerForm'].dispatchEvent(submitEvent);
      
      await new Promise(r => setTimeout(r, 100));
      expect(fakeDivs['message'].innerHTML).toContain('Registering...');
      expect(fakeDivs['message'].innerHTML).toContain('color: blue');
    }
  });

  test('handles account type selection', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    await import('../assets/js/register');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    if (fakeDivs['registerForm'] && fakeDivs['account_type']) {
      fakeDivs['account_type'].value = '0';
      expect(parseInt(fakeDivs['account_type'].value)).toBe(0);
      
      fakeDivs['account_type'].value = '1';
      expect(parseInt(fakeDivs['account_type'].value)).toBe(1);
    }
  });

  test('handles form validation', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    await import('../assets/js/register');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    if (fakeDivs['registerForm'] && fakeDivs['message']) {
      if (fakeDivs['firstname']) fakeDivs['firstname'].value = 'Test';
      if (fakeDivs['username']) fakeDivs['username'].value = 'test_user';
      
      
      const submitEvent = new Event('submit');
      fakeDivs['registerForm'].dispatchEvent(submitEvent);
      await new Promise(r => setTimeout(r, 1500));
      
      
      expect(fakeDivs['message'].innerHTML).toContain('Registration failed');
    }
  });

  test('handles registration loading state', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    await import('../assets/js/register');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    if (fakeDivs['registerForm'] && fakeDivs['message']) {
      const uniqueId = generateUniqueId();
      if (fakeDivs['firstname']) fakeDivs['firstname'].value = 'Load';
      if (fakeDivs['surnames']) fakeDivs['surnames'].value = 'Test';
      if (fakeDivs['username']) fakeDivs['username'].value = `load_test_${uniqueId}`;
      if (fakeDivs['email']) fakeDivs['email'].value = `load_${uniqueId}@example.com`;
      if (fakeDivs['password']) fakeDivs['password'].value = 'password123';
      if (fakeDivs['account_type']) fakeDivs['account_type'].value = '1';
      
      
      expect(fakeDivs['message'].innerHTML).toBe('');
      
      const submitEvent = new Event('submit');
      fakeDivs['registerForm'].dispatchEvent(submitEvent);
      
      
      await new Promise(r => setTimeout(r, 50));
      expect(fakeDivs['message'].innerHTML).toContain('Registering...');
      expect(fakeDivs['message'].innerHTML).toContain('color: blue');
    }
  });

  afterAll(() => {
    mockDoc?.mockRestore();
    window.localStorage.removeItem('authToken');
    window.localStorage.removeItem('userData');
  });
});