import { describe, expect, it } from 'vitest';
import { useMonaco } from '../utils/useMonaco';

describe('useMonaco', () => {
  it('Return instance with correct properties', () => {
    const el = document.createElement('div');
    const testEditor = useMonaco(el, 'html', {
      value: 'Hello World',
    });
    expect(testEditor.getModel()?.getValue()).toBe('Hello World');
  });
});
