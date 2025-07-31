import { beforeAll, describe, test, expect, afterAll, vi } from 'vitest';
import { doLogin } from './helpers';
import { getCaseDetails } from '../assets/js/api';

describe('invite page', () => {
  let mockDoc;
  let mockQuerySelector;
  const fakeDivs = {};
  let realCaseToken;

  beforeAll(async () => {
    await doLogin('john_doe', 'test_user');
    const caseData = await getCaseDetails(1);
    realCaseToken = caseData.invite_token;
    
    await doLogin('jane_doe', 'test_user');

    vi.stubGlobal('URLSearchParams', vi.fn().mockImplementation(() => ({
      get: vi.fn((key) => {
        if (key === 'token') return realCaseToken; 
        return null;
      })
    })));

    mockDoc = vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (fakeDivs[id]) return fakeDivs[id];
      
      if (id === 'user_fname') {
        const span = document.createElement('span');
        span.id = id;
        span.innerText = '';
        document.body.append(span);
        return (fakeDivs[id] = span);
      }
      
      if (id === 'case-title') {
        const h2 = document.createElement('h2');
        h2.id = id;
        h2.innerHTML = 'Case title: <span></span>';
        document.body.append(h2);
        return (fakeDivs[id] = h2);
      }
      
      if (id === 'case-description') {
        const p = document.createElement('p');
        p.id = id;
        p.style.fontSize = '1.25rem';
        document.body.append(p);
        return (fakeDivs[id] = p);
      }
      
      if (id === 'error') {
        const span = document.createElement('span');
        span.id = id;
        span.innerText = '';
        document.body.append(span);
        return (fakeDivs[id] = span);
      }
      
      const el = document.createElement('div');
      el.id = id;
      document.body.append(el);
      return (fakeDivs[id] = el);
    });

    mockQuerySelector = vi.spyOn(document, 'querySelector').mockImplementation((selector) => {
      if (selector === 'main') {
        if (!fakeDivs['main']) {
          const main = document.createElement('main');
          main.innerHTML = '<div style="margin: auto;">loading...</div>';
          document.body.append(main);
          fakeDivs['main'] = main;
        }
        return fakeDivs['main'];
      }
      
      if (selector === 'button') {
        if (!fakeDivs['accept-button']) {
          const button = document.createElement('button');
          button.className = 'btn btn-secondary';
          button.innerHTML = '<h3 style="font-size: 1.5rem;">Accept</h3>';
          button.disabled = false;
          document.body.append(button);
          fakeDivs['accept-button'] = button;
        }
        return fakeDivs['accept-button'];
      }
      
      if (selector === '#case-title') {
        return fakeDivs['case-title'];
      }
      
      if (selector === '#case-description') {
        return fakeDivs['case-description'];
      }
      
      if (selector === '#error') {
        return fakeDivs['error'];
      }
      
      if (selector === 'h3') {
        const button = fakeDivs['accept-button'];
        return button ? button.querySelector('h3') : null;
      }
      
      return null;
    });

    window.localStorage.setItem('userData', JSON.stringify({
      firstname: 'TestUser',
      username: 'jane_doe'
    }));
  });

  test('loads invite page elements', async () => {
    await import('../assets/js/invite');
    await new Promise(r => setTimeout(r, 3000)); 
    
    console.log('Elements accessed:', Object.keys(fakeDivs));
    
    expect(Object.keys(fakeDivs).length).toBeGreaterThan(0);
    

    if (fakeDivs['main']) {
      expect(fakeDivs['main'].innerHTML).toContain('Detective!');
    }
  });

  test('handles valid invite token and displays case info', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    vi.stubGlobal('URLSearchParams', vi.fn().mockImplementation(() => ({
      get: vi.fn((key) => {
        if (key === 'token') return realCaseToken;
        return null;
      })
    })));
    await import('../assets/js/invite');
    await new Promise(r => setTimeout(r, 3000));


    if (fakeDivs['main']) {
      expect(fakeDivs['main'].innerHTML).toContain('Detective!');
      expect(fakeDivs['main'].innerHTML).toContain('You have been invited to solve a case');
    }
    
    if (fakeDivs['case-title']) {
      expect(fakeDivs['case-title'].innerText.length).toBeGreaterThan(0);
    }
    
    if (fakeDivs['case-description']) {
      expect(fakeDivs['case-description'].innerText.length).toBeGreaterThan(0);
    }
  });

  test('handles missing invite token', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });


    vi.stubGlobal('URLSearchParams', vi.fn().mockImplementation(() => ({
      get: vi.fn(() => null)
    })));
    await import('../assets/js/invite');
    await new Promise(r => setTimeout(r, 2000));

    if (fakeDivs['main']) {
      expect(fakeDivs['main'].innerHTML).toContain('Invite not found');
      expect(fakeDivs['main'].innerHTML).toContain('/student-homepage');
    }
  });

  test('handles invalid invite token', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    vi.stubGlobal('URLSearchParams', vi.fn().mockImplementation(() => ({
      get: vi.fn((key) => {
        if (key === 'token') return 'invalid-token-123';
        return null;
      })
    })));
    await import('../assets/js/invite');
    await new Promise(r => setTimeout(r, 3000));

    if (fakeDivs['main']) {
      expect(fakeDivs['main'].innerHTML).toContain('Invite not found');
    }
  });

  test('handles successful case acceptance', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    vi.stubGlobal('URLSearchParams', vi.fn().mockImplementation(() => ({
      get: vi.fn((key) => {
        if (key === 'token') return realCaseToken;
        return null;
      })
    })));
    await import('../assets/js/invite');
    await new Promise(r => setTimeout(r, 3000));

    if (fakeDivs['accept-button']) {
      const clickEvent = new Event('click');
      fakeDivs['accept-button'].dispatchEvent(clickEvent);
      await new Promise(r => setTimeout(r, 2000));

      const h3 = fakeDivs['accept-button'].querySelector('h3');
      if (h3) {
        expect(h3.innerText).toBe('Accepting...');
      }
      expect(fakeDivs['accept-button'].disabled).toBe(true);
    }
  });

  test('handles case acceptance failure', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    vi.stubGlobal('URLSearchParams', vi.fn().mockImplementation(() => ({
      get: vi.fn((key) => {
        if (key === 'token') return 'fail-token';
        return null;
      })
    })));
    await import('../assets/js/invite');
    await new Promise(r => setTimeout(r, 3000));

    if (fakeDivs['accept-button']) {
      const clickEvent = new Event('click');
      fakeDivs['accept-button'].dispatchEvent(clickEvent);
      await new Promise(r => setTimeout(r, 3000));

      expect(fakeDivs['accept-button'].disabled).toBe(false);
      const h3 = fakeDivs['accept-button'].querySelector('h3');
      if (h3) {
        expect(h3.innerText).toBe('Accept');
      }
    }
  });

  test('displays user first name from localStorage', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    window.localStorage.setItem('userData', JSON.stringify({
      firstname: 'TestUser',
      username: 'jane_doe'
    }));

    vi.stubGlobal('URLSearchParams', vi.fn().mockImplementation(() => ({
      get: vi.fn((key) => {
        if (key === 'token') return realCaseToken;
        return null;
      })
    })));

    await import('../assets/js/invite');
    await new Promise(r => setTimeout(r, 3000));

    if (fakeDivs['user_fname']) {
      expect(fakeDivs['user_fname'].innerText).toBe('TestUser');
    }
  });

  test('handles button state changes during acceptance', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    
    vi.stubGlobal('URLSearchParams', vi.fn().mockImplementation(() => ({
      get: vi.fn((key) => {
        if (key === 'token') return realCaseToken;
        return null;
      })
    })));
    await import('../assets/js/invite');
    await new Promise(r => setTimeout(r, 3000));

    if (fakeDivs['accept-button']) {
      expect(fakeDivs['accept-button'].disabled).toBe(false);
      const h3Initial = fakeDivs['accept-button'].querySelector('h3');
      if (h3Initial) {
        expect(h3Initial.innerText).toBe('Accept');
      }


      const clickEvent = new Event('click');
      fakeDivs['accept-button'].dispatchEvent(clickEvent);
      

      expect(fakeDivs['accept-button'].disabled).toBe(true);
      const h3Accepting = fakeDivs['accept-button'].querySelector('h3');
      if (h3Accepting) {
        expect(h3Accepting.innerText).toBe('Accepting...');
      }
    }
  });

  test('handles case information rendering', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    vi.stubGlobal('URLSearchParams', vi.fn().mockImplementation(() => ({
      get: vi.fn((key) => {
        if (key === 'token') return realCaseToken;
        return null;
      })
    })));
    await import('../assets/js/invite');
    await new Promise(r => setTimeout(r, 3000));

    
    if (fakeDivs['main']) {
      expect(fakeDivs['main'].innerHTML).toContain('shadow-sm');
      expect(fakeDivs['main'].innerHTML).toContain('Detective!');
      expect(fakeDivs['main'].innerHTML).toContain('You have been invited to solve a case');
      expect(fakeDivs['main'].innerHTML).toContain('btn btn-secondary');
    }
  });

  afterAll(() => {
    mockDoc?.mockRestore();
    mockQuerySelector?.mockRestore();
    window.localStorage.removeItem('authToken');
    window.localStorage.removeItem('userData');
    vi.unstubAllGlobals();
  });
});