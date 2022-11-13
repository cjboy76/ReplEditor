import { setActivePinia, createPinia } from 'pinia';
import { useImportMap } from '../store/useFileStore';
import { describe, beforeEach, it, expect } from 'vitest';

describe('useImportMap', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('Actions: updateImportMap', () => {
    const store = useImportMap();
    expect(store.importMap).toBeTruthy();

    const testImportMap = `
    {
        "imports": {
          "vue": "https://unpkg.com/@vue/runtime-dom@3/dist/runtime-dom.esm-browser.js"
        }
    }
    `;

    store.updateImportMap(testImportMap);

    expect(store.importMap).toEqual(testImportMap);
  });
});
