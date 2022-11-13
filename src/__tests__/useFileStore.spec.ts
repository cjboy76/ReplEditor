import { setActivePinia, createPinia } from 'pinia';
import { useFileStore } from '../store/useFileStore';
import { describe, beforeEach, it, expect } from 'vitest';
import { defaultHtml } from '../store/globalStatus';

describe('useFileStore Store', () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia());
  });

  it('create store with default value', () => {
    const store = useFileStore();
    expect(store.files['html']).toBeTruthy();
    expect(store.files['html'].code).toBe(defaultHtml);
  });

  it('Actions: store.updateFile', () => {
    const testStr = '<div> this is test string </div>';

    const store = useFileStore();

    store.updateFile(testStr, 'html');
    expect(store.files['html'].code).toBe(testStr);
  });

  it('Actions: store.updateCompiledFile', () => {
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
