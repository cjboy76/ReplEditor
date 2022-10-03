export function debounce(fn, n = 250) {
  let handle;
  return (...args) => {
    if (handle) clearTimeout(handle);
    handle = setTimeout(() => {
      fn(...args);
    }, n);
  };
}

export function appendListener(el, event, fn, useCapture = false) {
  if (!el) return;
  el.addEventListener(event, fn, useCapture);
}
export function removeListener(el, event, fn, useCapture = false) {
  if (!el) return;
  el.removeEventListener(event, fn, useCapture);
}
