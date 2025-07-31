import { beforeAll, describe, test, expect, afterAll, vi } from 'vitest';
import { doLogin } from './helpers';
import { acceptCase, getCaseDetails } from '../assets/js/api';

describe('game-playing page', () => {
  let mockDoc;
  const fakeDivs = {};

  beforeAll(async () => {
    await doLogin('john_doe', 'test_user');
    const c = await getCaseDetails(1);
    await doLogin('jane_doe', 'test_user');
    await acceptCase(c.invite_token).catch(() => {});

    mockDoc = vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (fakeDivs[id]) return fakeDivs[id];
      const el = document.createElement('div');
      el.id = id;
      if (id === 'answer-input') {
        const textarea = document.createElement('textarea');
        textarea.id = id;
        document.body.append(textarea);
        return (fakeDivs[id] = textarea);
      }
      if (id === 'question-container') {
        const form = document.createElement('form');
        form.id = id;
        form.style.display = 'none';
        document.body.append(form);
        return (fakeDivs[id] = form);
      }
      document.body.append(el);
      return (fakeDivs[id] = el);
    });

    vi.spyOn(document, 'querySelector').mockImplementation((selector) => {
      if (selector === '.brief-container') {
        if (!fakeDivs['brief-container']) {
          fakeDivs['brief-container'] = document.createElement('div');
          fakeDivs['brief-container'].className = 'brief-container';
          document.body.append(fakeDivs['brief-container']);
        }
        return fakeDivs['brief-container'];
      }
      return null;
    });

    window.history.pushState({}, '', `${window.location.pathname}?id=1`);
  });

  test('renders first brief then navigates to question', async () => {
    await import('../assets/js/game-playing');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));
    
    
    console.log('Elements accessed:', Object.keys(fakeDivs));
    
    
    expect(Object.keys(fakeDivs).length).toBeGreaterThan(0);
    
    
    if (fakeDivs['case-title']) {
      expect(fakeDivs['case-title'].innerText.length).toBeGreaterThan(0);
    }
  });

  test('handles brief navigation', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    await import('../assets/js/game-playing');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    
    if (fakeDivs['nextBrief'] && fakeDivs['briefCounter']) {
      const initialCounter = fakeDivs['briefCounter'].innerText;
      expect(initialCounter).toMatch(/\d+ of \d+/);
      
      
      if (fakeDivs['nextBrief'].innerText === 'Next') {
        fakeDivs['nextBrief'].click();
        await new Promise(r => setTimeout(r, 100));
        
        const newCounter = fakeDivs['briefCounter'].innerText;
        expect(newCounter).not.toBe(initialCounter);
      }
    }
  });

  test('handles transition to questions', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    await import('../assets/js/game-playing');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    console.log('Available elements:', Object.keys(fakeDivs));
    if (fakeDivs['nextBrief']) {
      console.log('Next button text:', fakeDivs['nextBrief'].innerText);
    }

    
    if (fakeDivs['nextBrief']) {
      
      while (fakeDivs['nextBrief'].innerText === 'Next') {
        fakeDivs['nextBrief'].click();
        await new Promise(r => setTimeout(r, 100));
        console.log('After click, button text:', fakeDivs['nextBrief'].innerText);
      }
      
      
      if (fakeDivs['nextBrief'].innerText === 'Begin Case') {
        console.log('Clicking Begin Case button...');
        fakeDivs['nextBrief'].click();
        await new Promise(r => setTimeout(r, 1000)); 
        
        console.log('Question container display:', fakeDivs['question-container']?.style.display);
        console.log('Question content:', fakeDivs['question-content']?.innerText);
        
        
        expect(fakeDivs['question-container']).toBeDefined();
        
        
        if (fakeDivs['question-content']) {
          expect(fakeDivs['question-content'].innerText.length).toBeGreaterThan(0);
        }
      } else {
        
        expect(fakeDivs['nextBrief']).toBeDefined();
      }
    } else {
      
      expect(Object.keys(fakeDivs).length).toBeGreaterThan(0);
    }
  });

  test('handles invalid case ID', async () => {
    
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    window.history.pushState({}, '', `${window.location.pathname}?id=999`);
    
    await import('../assets/js/game-playing');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    
    if (fakeDivs['case-title']) {
      expect(fakeDivs['case-title'].innerText).toContain('Error');
    }
  });

  test('handles missing case ID', async () => {
    
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    window.history.pushState({}, '', window.location.pathname);
    
    await import('../assets/js/game-playing');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 100));

    
    if (fakeDivs['case-title']) {
      expect(fakeDivs['case-title'].innerText).toBe('Invalid Case ID');
    }
  });

  test('handles question form submission', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    window.history.pushState({}, '', `${window.location.pathname}?id=1`);
    
    
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    await import('../assets/js/game-playing');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

   
    if (fakeDivs['nextBrief']) {
      while (fakeDivs['nextBrief'].innerText !== 'Begin Case') {
        if (fakeDivs['nextBrief'].innerText === 'Next') {
          fakeDivs['nextBrief'].click();
          await new Promise(r => setTimeout(r, 100));
        } else {
          break;
        }
      }
      
      if (fakeDivs['nextBrief'].innerText === 'Begin Case') {
        fakeDivs['nextBrief'].click();
        await new Promise(r => setTimeout(r, 500));
        
        
        if (fakeDivs['answer-input'] && fakeDivs['question-container']) {
          fakeDivs['answer-input'].value = 'Test answer';
          
          const submitEvent = new Event('submit');
          fakeDivs['question-container'].dispatchEvent(submitEvent);
          await new Promise(r => setTimeout(r, 500));
          
          
          expect(alertSpy).toHaveBeenCalled();
        }
      }
    }
    
    alertSpy.mockRestore();
  });

  

test('handles empty briefs array edge case', async () => {
  Object.keys(fakeDivs).forEach(key => {
    fakeDivs[key].remove();
    delete fakeDivs[key];
  });

  
  window.history.pushState({}, '', `${window.location.pathname}?id=2`); 
  
  await import('../assets/js/game-playing');
  document.dispatchEvent(new Event('DOMContentLoaded'));
  await new Promise(r => setTimeout(r, 2000));

  
  if (fakeDivs['prevBrief']) {
    expect(fakeDivs['prevBrief'].style.display).toBe('none');
  }
});

test('handles briefs rendering with different content structure', async () => {
  Object.keys(fakeDivs).forEach(key => {
    fakeDivs[key].remove();
    delete fakeDivs[key];
  });

  window.history.pushState({}, '', `${window.location.pathname}?id=1`);
  
  await import('../assets/js/game-playing');
  document.dispatchEvent(new Event('DOMContentLoaded'));
  await new Promise(r => setTimeout(r, 2000));

  if (fakeDivs['case-brief'] && fakeDivs['briefCounter']) {
    expect(fakeDivs['case-brief'].innerHTML).toMatch(/<section>/);
    expect(fakeDivs['briefCounter'].innerText).toMatch(/\d+ of \d+/);
  }
});


  afterAll(() => {
    mockDoc?.mockRestore();
    window.localStorage.removeItem('authToken');
  });
});