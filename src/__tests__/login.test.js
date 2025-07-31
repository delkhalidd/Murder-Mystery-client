import { beforeAll, describe, test, expect, afterAll, vi } from 'vitest';

describe('login page', () => {
  let mockDoc;
  const fakeDivs = {};

  beforeAll(async () => {
    
    
    mockDoc = vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (fakeDivs[id]) return fakeDivs[id];
      
      
      if (id === 'loginForm') {
        const form = document.createElement('form');
        form.id = id;
        
        const usernameInput = document.createElement('input');
        usernameInput.id = 'username';
        usernameInput.name = 'username';
        usernameInput.type = 'text';
        form.appendChild(usernameInput);
        
        const passwordInput = document.createElement('input');
        passwordInput.id = 'password';
        passwordInput.name = 'password';
        passwordInput.type = 'password';
        form.appendChild(passwordInput);
        
        document.body.append(form);
        return (fakeDivs[id] = form);
      }
      
      if (id === 'username') {
        const input = document.createElement('input');
        input.id = id;
        input.type = 'text';
        input.name = 'username';
        document.body.append(input);
        return (fakeDivs[id] = input);
      }
      
      if (id === 'password') {
        const input = document.createElement('input');
        input.id = id;
        input.type = 'password';
        input.name = 'password';
        document.body.append(input);
        return (fakeDivs[id] = input);
      }
      
     
      fakeDivs[id] = document.createElement('div');
      fakeDivs[id].id = id;
      document.body.append(fakeDivs[id]);
      return fakeDivs[id];
    });
  });

  test('loads login page elements', async () => {
    await import('../assets/js/login');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));
    
    console.log('Elements accessed:', Object.keys(fakeDivs));
    
    expect(Object.keys(fakeDivs).length).toBeGreaterThan(0);
  });

  test('handles successful teacher login', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await import('../assets/js/login');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    if (fakeDivs['loginForm'] && fakeDivs['username'] && fakeDivs['password']) {
      
      fakeDivs['username'].value = 'john_doe';
      fakeDivs['password'].value = 'test_user';
      
      const submitEvent = new Event('submit');
      fakeDivs['loginForm'].dispatchEvent(submitEvent);
      await new Promise(r => setTimeout(r, 2000));
      
      
      expect(alertSpy).toHaveBeenCalledWith('Welcome, Teacher!');
    }

    alertSpy.mockRestore();
  });

  test('handles successful student login', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await import('../assets/js/login');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    if (fakeDivs['loginForm'] && fakeDivs['username'] && fakeDivs['password']) {
      fakeDivs['username'].value = 'jane_doe';
      fakeDivs['password'].value = 'test_user';
      
      const submitEvent = new Event('submit');
      fakeDivs['loginForm'].dispatchEvent(submitEvent);
      await new Promise(r => setTimeout(r, 2000));
      
     
      expect(alertSpy).toHaveBeenCalledWith('Welcome, Student!');
    }

    alertSpy.mockRestore();
  });

  test('handles login failure', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await import('../assets/js/login');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    if (fakeDivs['loginForm'] && fakeDivs['username'] && fakeDivs['password']) {
      fakeDivs['username'].value = 'invalid_user';
      fakeDivs['password'].value = 'wrong_password';
      
      const submitEvent = new Event('submit');
      fakeDivs['loginForm'].dispatchEvent(submitEvent);
      await new Promise(r => setTimeout(r, 2000));
      
      
      expect(alertSpy).toHaveBeenCalled();
      const alertCall = alertSpy.mock.calls.find(call => 
        call[0].includes('Login failed') || call[0].includes('error')
      );
      expect(alertCall).toBeDefined();
    }

    alertSpy.mockRestore();
  });

  test('handles empty form submission', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await import('../assets/js/login');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    if (fakeDivs['loginForm'] && fakeDivs['username'] && fakeDivs['password']) {
      fakeDivs['username'].value = '';
      fakeDivs['password'].value = '';
      
      const submitEvent = new Event('submit');
      fakeDivs['loginForm'].dispatchEvent(submitEvent);
      await new Promise(r => setTimeout(r, 1500));
      
      
      expect(alertSpy).toHaveBeenCalled();
    }

    alertSpy.mockRestore();
  });

  test('handles token storage', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });


    window.localStorage.removeItem('authToken');
    window.localStorage.removeItem('userData');
    
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await import('../assets/js/login');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    if (fakeDivs['loginForm'] && fakeDivs['username'] && fakeDivs['password']) {
      fakeDivs['username'].value = 'john_doe';
      fakeDivs['password'].value = 'test_user';
      
      const submitEvent = new Event('submit');
      fakeDivs['loginForm'].dispatchEvent(submitEvent);
      await new Promise(r => setTimeout(r, 2000));
      
      
      const token = window.localStorage.getItem('authToken');
      const userData = window.localStorage.getItem('userData');
      
      expect(token).toBeTruthy();
      expect(userData).toBeTruthy();
      
      if (userData) {
        const parsedUser = JSON.parse(userData);
        expect(parsedUser.username).toBe('john_doe');
      }
    }

    alertSpy.mockRestore();
  });

  test('handles login redirect functionality', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    
    window.localStorage.setItem('loginRedirect', '/test-redirect');
    
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await import('../assets/js/login');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    if (fakeDivs['loginForm'] && fakeDivs['username'] && fakeDivs['password']) {
      fakeDivs['username'].value = 'john_doe';
      fakeDivs['password'].value = 'test_user';
      
      const submitEvent = new Event('submit');
      fakeDivs['loginForm'].dispatchEvent(submitEvent);
      await new Promise(r => setTimeout(r, 2000));
      
     
      const redirectTarget = window.localStorage.getItem('loginRedirect');
      expect(redirectTarget).toBe(null);
    }

    alertSpy.mockRestore();
    window.localStorage.removeItem('loginRedirect');
  });

  test('handles different token formats', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    window.localStorage.removeItem('authToken');
    window.localStorage.removeItem('userData');
    
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await import('../assets/js/login');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    if (fakeDivs['loginForm'] && fakeDivs['username'] && fakeDivs['password']) {
      fakeDivs['username'].value = 'john_doe';
      fakeDivs['password'].value = 'test_user';
      
      const submitEvent = new Event('submit');
      fakeDivs['loginForm'].dispatchEvent(submitEvent);
      await new Promise(r => setTimeout(r, 2000));
      
      
      const token = window.localStorage.getItem('authToken');
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    }

    alertSpy.mockRestore();
  });

  afterAll(() => {
    mockDoc?.mockRestore();
    window.localStorage.removeItem('authToken');
    window.localStorage.removeItem('userData');
    window.localStorage.removeItem('loginRedirect');
  });
});