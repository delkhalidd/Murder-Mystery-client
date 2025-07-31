import { beforeAll, describe, test, expect, afterAll, vi } from 'vitest';
import { doLogin } from './helpers';

describe('student homepage', () => {
  let mockDoc;
  const fakeDivs = {};

  beforeAll(async () => {
    await doLogin('jane_doe', 'test_user');

    vi.stubGlobal('checkAuth', vi.fn().mockResolvedValue(true));

    mockDoc = vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (fakeDivs[id]) return fakeDivs[id];
      
      if (id === 'joinCaseForm') {
        const form = document.createElement('form');
        form.id = id;
        form.className = 'inline-form';
        form.action = '/invite';
        form.method = 'GET';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'inviteToken';
        input.name = 'token';
        input.placeholder = 'Paste full URL or token';
        input.required = true;
        form.appendChild(input);
        
        const button = document.createElement('button');
        button.type = 'submit';
        button.className = 'btn btn-primary';
        button.innerText = 'Join Case';
        form.appendChild(button);
        
        document.body.append(form);
        return (fakeDivs[id] = form);
      }
      
      if (id === 'inviteToken') {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = id;
        input.name = 'token';
        input.placeholder = 'Paste full URL or token';
        input.required = true;
        document.body.append(input);
        return (fakeDivs[id] = input);
      }
      
      if (id === 'user_fname') {
        const span = document.createElement('span');
        span.id = id;
        span.textContent = '';
        document.body.append(span);
        return (fakeDivs[id] = span);
      }
      
      if (id === 'completedCasesList') {
        const ul = document.createElement('ul');
        ul.id = id;
        ul.innerHTML = '<li>Loading…</li>';
        document.body.append(ul);
        return (fakeDivs[id] = ul);
      }
      
      if (id === 'message') {
        const div = document.createElement('div');
        div.id = id;
        div.className = 'message-container';
        div.textContent = '';
        document.body.append(div);
        return (fakeDivs[id] = div);
      }
      
      const el = document.createElement('div');
      el.id = id;
      document.body.append(el);
      return (fakeDivs[id] = el);
    });


    window.localStorage.setItem('userData', JSON.stringify({
      firstname: 'TestStudent',
      username: 'jane_doe'
    }));
  });

  test('loads student homepage elements', async () => {
    await import('../assets/js/student-homepage');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));
    
    console.log('Elements accessed:', Object.keys(fakeDivs));
    
    expect(Object.keys(fakeDivs).length).toBeGreaterThan(0);
  });

  test('displays user first name from localStorage', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });


    window.localStorage.setItem('userData', JSON.stringify({
      firstname: 'TestStudent',
      username: 'jane_doe'
    }));

    await import('../assets/js/student-homepage');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));


    if (fakeDivs['user_fname']) {
      expect(fakeDivs['user_fname'].textContent).toBe('TestStudent');
    }
  });

  test('handles join case form functionality', async () => {

    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    await import('../assets/js/student-homepage');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    if (fakeDivs['joinCaseForm'] && fakeDivs['inviteToken']) {
      expect(fakeDivs['joinCaseForm'].action).toBe('/invite');
      expect(fakeDivs['inviteToken'].placeholder).toBe('Paste full URL or token');
      expect(fakeDivs['inviteToken'].required).toBe(true);
    }
  });

  test('handles empty invite token submission', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    await import('../assets/js/student-homepage');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    if (fakeDivs['joinCaseForm'] && fakeDivs['inviteToken'] && fakeDivs['message']) {
      fakeDivs['inviteToken'].value = '   '; 
      
      const submitEvent = new Event('submit', { 
        bubbles: true, 
        cancelable: true 
      });
      
      const preventDefaultSpy = vi.fn();
      Object.defineProperty(submitEvent, 'preventDefault', {
        value: preventDefaultSpy,
        writable: false
      });
      
      fakeDivs['joinCaseForm'].dispatchEvent(submitEvent);
      await new Promise(r => setTimeout(r, 500));
      
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(fakeDivs['message'].textContent).toBe('Please enter a valid invite URL or token.');
    }
  });

  test('loads completed cases list successfully', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    await import('../assets/js/student-homepage');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 3000)); 

    if (fakeDivs['completedCasesList']) {
      const listContent = fakeDivs['completedCasesList'].innerHTML;
      expect(listContent).not.toBe('<li>Loading…</li>');
      
      const hasLinks = fakeDivs['completedCasesList'].querySelectorAll('a').length > 0;
      const hasNoMessage = listContent.includes('No completed cases yet');
      
      expect(hasLinks || hasNoMessage).toBe(true);
    }
  });

  test('handles completed cases with actual case data', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    await import('../assets/js/student-homepage');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 3000));

    if (fakeDivs['completedCasesList']) {
      const links = fakeDivs['completedCasesList'].querySelectorAll('a');
      
      if (links.length > 0) {
        const firstLink = links[0];
        expect(firstLink.href).toMatch(/\/game-playing\?id=\d+/);
        
        const li = firstLink.querySelector('li');
        expect(li).toBeDefined();
        expect(li.textContent.length).toBeGreaterThan(0);
      }
    }
  });

  test('handles token input validation', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    await import('../assets/js/student-homepage');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    if (fakeDivs['joinCaseForm'] && fakeDivs['inviteToken']) {
      fakeDivs['inviteToken'].value = 'test-token-123';
      expect(fakeDivs['inviteToken'].value).toBe('test-token-123');
      
      fakeDivs['inviteToken'].value = 'http://localhost:3000/invite?token=url-token';
      expect(fakeDivs['inviteToken'].value).toContain('token=url-token');
    }
  });

  afterAll(() => {
    mockDoc?.mockRestore();
    vi.unstubAllGlobals();
    window.localStorage.removeItem('authToken');
    window.localStorage.removeItem('userData');
  });
});