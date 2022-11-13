import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { Console } from '../components/crafts';

describe('Console.vue', () => {
  it('Props testing', () => {
    const wrapper = mount(Console, {
      props: { error: Error("'aaa' is not defined.") },
    });
    expect(wrapper.text()).toContain("'aaa' is not defined.");
  });
});
