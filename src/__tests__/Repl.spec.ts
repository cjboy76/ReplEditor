import { describe, expect, it } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import Repl from '@/components/Repl.vue';

describe('Repl.vue', () => {
  it('Mount', () => {
    const wrapper = shallowMount(Repl);

    expect(wrapper).toBeTruthy();
  });
});
