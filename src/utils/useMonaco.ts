import { editor } from "monaco-editor";
import darktheme from "theme-vitesse/themes/vitesse-dark.json";
import lightTheme from "theme-vitesse/themes/vitesse-light.json";
import type { editor as Editor } from "monaco-editor";

function useMonaco(
  element: HTMLElement,
  language: string,
  options?: Editor.IStandaloneEditorConstructionOptions
) {
  // @ts-ignore
  editor.defineTheme("vitesse-dark", darktheme);
  // @ts-ignore
  editor.defineTheme("vitesse-light", lightTheme);

  const monacoEditor = editor.create(element, {
    language,
    theme: "vitesse-light",
    minimap: {
      enabled: false,
    },
    ...options,
  });

  return monacoEditor;
}

export { useMonaco };
