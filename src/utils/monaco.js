import * as Monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { VueWelcomeCode } from "../store/useFileStore";

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

let monacoEditor;
let mountEditor;
const editorInit = () => {
  mountEditor = document.querySelector("#editor");
  monacoEditor = Monaco.editor.create(mountEditor, {
    value: VueWelcomeCode,
    language: "html",
    fontSize: "16px",
    theme: "vs-dark",
  });
};

const editorResize = () => {
  const parentDiv = mountEditor.parentElement;
  monacoEditor.layout({ width: 0, height: 0 });
  window.requestAnimationFrame(() => {
    const rect = parentDiv.getBoundingClientRect();
    monacoEditor.layout({ width: rect.width, height: rect.height });
  });
};

export { monacoEditor, editorInit, Monaco, mountEditor, editorResize };
