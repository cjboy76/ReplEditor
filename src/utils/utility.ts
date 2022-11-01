import type { editor as Editor } from 'monaco-editor';

export function debounce(fn: Function, n = 250) {
  let handle: any;
  return (...args: any[]) => {
    if (handle) clearTimeout(handle);
    handle = setTimeout(() => {
      fn(...args);
    }, n);
  };
}

export const resizeListener = (
  editor: Editor.IStandaloneCodeEditor,
  element: HTMLElement
) => {
  const parentDiv = element.parentElement;
  if (!parentDiv) return;
  editor.layout({ width: 0, height: 0 });
  window.requestAnimationFrame(() => {
    const rect = parentDiv.getBoundingClientRect();
    editor.layout({ width: rect.width, height: rect.height });
  });
};
