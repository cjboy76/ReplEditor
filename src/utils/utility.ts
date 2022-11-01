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

export function appendListener(
  el: any,
  event: keyof HTMLElementEventMap | Event,
  fn: () => void,
  useCapture = false
) {
  if (!el) return;
  el.addEventListener(event, fn, useCapture);
}
export function removeListener(
  el: any,
  event: keyof HTMLElementEventMap,
  fn: () => void,
  useCapture = false
) {
  if (!el) return;
  el.removeEventListener(event, fn, useCapture);
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
