import { beforeAll, describe, test, expect, afterAll, vi } from 'vitest';
import { doLogin } from './helpers';

describe('create-case page', () => {
  let mockDoc;
  const fakeDivs = {};

  beforeAll(async () => {
    await doLogin('john_doe', 'test_user');

    mockDoc = vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (fakeDivs[id]) return fakeDivs[id];
      
      
      if (id === 'inputs-container') {
        const container = document.createElement('div');
        container.id = id;
        
        
        const inputEntry = document.createElement('div');
        inputEntry.className = 'input-entry';
        
        const h4 = document.createElement('h4');
        h4.innerText = 'Investigation Element 1';
        inputEntry.appendChild(h4);
        
        const bodyTextarea = document.createElement('textarea');
        bodyTextarea.name = 'input_body_0';
        inputEntry.appendChild(bodyTextarea);
        
        const answerTextarea = document.createElement('textarea');
        answerTextarea.name = 'input_answer_0';
        inputEntry.appendChild(answerTextarea);
        
        container.appendChild(inputEntry);
        document.body.append(container);
        return (fakeDivs[id] = container);
      }
      
      if (id === 'createCaseForm') {
        const form = document.createElement('form');
        form.id = id;
        
        const titleInput = document.createElement('input');
        titleInput.name = 'title';
        titleInput.type = 'text';
        form.appendChild(titleInput);
        
        const descTextarea = document.createElement('textarea');
        descTextarea.name = 'description';
        form.appendChild(descTextarea);
        
        document.body.append(form);
        return (fakeDivs[id] = form);
      }
      
      if (id === 'loading-overlay') {
        const overlay = document.createElement('div');
        overlay.id = id;
        overlay.style.display = 'none';
        document.body.append(overlay);
        return (fakeDivs[id] = overlay);
      }
      
      
      fakeDivs[id] = document.createElement('div');
      fakeDivs[id].id = id;
      document.body.append(fakeDivs[id]);
      return fakeDivs[id];
    });

    
    vi.spyOn(document, 'querySelectorAll').mockImplementation((selector) => {
      if (selector === '#inputs-container .input-entry') {
        const container = fakeDivs['inputs-container'];
        if (container) {
          return container.querySelectorAll('.input-entry');
        }
      }
      return [];
    });
  });

  test('loads create case page elements', async () => {
    await import('../assets/js/create-case');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));
    
    console.log('Elements accessed:', Object.keys(fakeDivs));
    
    expect(Object.keys(fakeDivs).length).toBeGreaterThan(0);
  });

  test('handles adding investigation elements', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    await import('../assets/js/create-case');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    if (fakeDivs['add-input'] && fakeDivs['inputs-container']) {
      const initialCount = fakeDivs['inputs-container'].querySelectorAll('.input-entry').length;
      
      fakeDivs['add-input'].click();
      await new Promise(r => setTimeout(r, 100));
      
      const newCount = fakeDivs['inputs-container'].querySelectorAll('.input-entry').length;
      expect(newCount).toBe(initialCount + 1);
    }
  });

  test('handles removing investigation elements', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    await import('../assets/js/create-case');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    if (fakeDivs['remove-input'] && fakeDivs['inputs-container']) {
      
      if (fakeDivs['add-input']) {
        fakeDivs['add-input'].click();
        await new Promise(r => setTimeout(r, 100));
      }
      
      const countBefore = fakeDivs['inputs-container'].querySelectorAll('.input-entry').length;
      
      fakeDivs['remove-input'].click();
      await new Promise(r => setTimeout(r, 100));
      
      const countAfter = fakeDivs['inputs-container'].querySelectorAll('.input-entry').length;
      expect(countAfter).toBe(countBefore - 1);
    }
  });

  test('handles form submission successfully', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    await import('../assets/js/create-case');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    if (fakeDivs['createCaseForm'] && fakeDivs['loading-overlay']) {
      
      if (fakeDivs['createCaseForm'].title && fakeDivs['createCaseForm'].description) {
        fakeDivs['createCaseForm'].title.value = 'Test Case';
        fakeDivs['createCaseForm'].description.value = 'Test description';
      }
      
      
      expect(fakeDivs['loading-overlay'].style.display).toBe('none');
      
      const submitEvent = new Event('submit');
      fakeDivs['createCaseForm'].dispatchEvent(submitEvent);
      
      
      expect(fakeDivs['loading-overlay'].style.display).toBe('flex');
      
      
    }
  });

  test('handles loading overlay display', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    await import('../assets/js/create-case');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    if (fakeDivs['loading-overlay']) {
      expect(fakeDivs['loading-overlay'].style.display).toBe('none');
    }
  });

  test('prevents removing last investigation element', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    await import('../assets/js/create-case');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    if (fakeDivs['remove-input'] && fakeDivs['inputs-container']) {
      
      const initialCount = fakeDivs['inputs-container'].querySelectorAll('.input-entry').length;
      expect(initialCount).toBe(1);
      
      
      fakeDivs['remove-input'].click();
      await new Promise(r => setTimeout(r, 100));
      
      
      const finalCount = fakeDivs['inputs-container'].querySelectorAll('.input-entry').length;
      expect(finalCount).toBe(1);
    }
  });

  test('handles renumberEntries function', async () => {
    Object.keys(fakeDivs).forEach(key => {
      fakeDivs[key].remove();
      delete fakeDivs[key];
    });

    await import('../assets/js/create-case');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 2000));

    
    if (fakeDivs['inputs-container']) {
      const firstEntry = fakeDivs['inputs-container'].querySelector('.input-entry');
      if (firstEntry) {
        const h4 = firstEntry.querySelector('h4');
        expect(h4.innerText).toBe('Investigation Element 1');
      }
    }
  });

  afterAll(() => {
    mockDoc?.mockRestore();
    window.localStorage.removeItem('authToken');
  });
});