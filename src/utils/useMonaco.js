import { editor } from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import darktheme from 'theme-vitesse/themes/vitesse-dark.json';
import lightTheme from 'theme-vitesse/themes/vitesse-light.json';

async function loadMonacoEnv() {
  try {
    self.MonacoEnvironment = {
      getWorker(_, label) {
        if (label === 'json') {
          return new jsonWorker();
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
          return new cssWorker();
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
          return new htmlWorker();
        }
        if (label === 'typescript' || label === 'javascript') {
          return new tsWorker();
        }
        return new editorWorker();
      },
    };
  } catch (error) {
    throw error;
  }
}

function useMonaco(element, language, args) {
  loadMonacoEnv();
  editor.defineTheme('vitesse-dark', darktheme);
  editor.defineTheme('vitesse-light', lightTheme);

  const monacoEditor = editor.create(element, {
    language,
    theme: 'vitesse-light',
    minimap: {
      enabled: false,
    },
    ...args,
  });

  return monacoEditor;
}

export { useMonaco };
