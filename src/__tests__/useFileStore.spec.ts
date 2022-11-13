import { setActivePinia, createPinia } from 'pinia';
import { useFileStore } from '../store/useFileStore';
import { describe, beforeEach, it, expect } from 'vitest';
import { defaultHtml } from '../store/globalStatus';

describe('useFileStore', () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia());
  });

  it('Create default value', () => {
    const store = useFileStore();
    expect(store.files['html']).toBeTruthy();
    expect(store.files['html'].code).toBe(defaultHtml);
  });

  it('Getters: getSFC', () => {
    const testJs = 'console.log("Hello World")';
    const store = useFileStore();

    expect(store.getSFC).not.toContain(testJs);

    store.updateFile(testJs, 'javascript');
    expect(store.getSFC).toContain(testJs);
  });

  it('Actions: updateFile', () => {
    const testStr = '<div> this is test string </div>';

    const store = useFileStore();

    store.updateFile(testStr, 'html');
    expect(store.files['html'].code).toBe(testStr);
  });

  it('Actions: updateCompiledFile', () => {
    const testCompile = {
      js: 'console.log("Hello World")',
      css: '',
      ssr: '',
    };

    const store = useFileStore();

    expect(store.files['html'].compiled.js).toBeFalsy();

    store.updateCompiledFile(testCompile, 'html');

    expect(store.files['html'].compiled).toEqual(testCompile);
  });
});
