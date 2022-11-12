import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Repl from '@/components/Repl.vue';
import { setActivePinia, createPinia } from 'pinia';
import { useFileStore } from '../store/useFileStore';

describe('Repl.vue', () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia());
  });

  it('Mount Repl.vue', () => {
    useFileStore();
    let el = document.createElement('canvas');
    console.log(el);
    const wrapper = mount(Repl);
    expect(wrapper).toBeTruthy();
  });
});
