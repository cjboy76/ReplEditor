import {
  babelParse,
  MagicString,
  walk,
  walkIdentifiers,
  extractIdentifiers,
  isInDestructureAssignment,
  isStaticProperty,
} from '@vue/compiler-sfc';
import { defaultMainFile } from '../store/useFileStore';

const modulesKey = `__modules__`;
const exportKey = `__export__`;
const dynamicImportKey = `__dynamic_import__`;
const moduleKey = `__module__`;

function processModule(store, src, filename) {
  const s = new MagicString(src);
  const ast = babelParse(src, {
    sourceFilename: filename,
    sourceType: 'module',
  }).program.body;

  const idToImportMap = new Map();
  const declaredConst = new Set();
  const importedFiles = new Set();
  const importToIdMap = new Map();

  function defineImport(node, source) {
    const filename = source.replace(/^\.\/+/, '');
    if (!(filename in store.$state.files)) {
      throw new Error(`File "${filename}" does not exist.`);
    }
    if (importedFiles.has(filename)) {
      return importToIdMap.get(filename);
    }
    importedFiles.add(filename);
    const id = `__import_${importedFiles.size}__`;
    importToIdMap.set(filename, id);
    s.appendLeft(
      node.start,
      `const ${id} = ${modulesKey}[${JSON.stringify(filename)}]\n`
    );
    return id;
  }

  function defineExport(name, local = name) {
    s.append(`\n${exportKey}(${moduleKey}, "${name}", () => ${local})`);
  }

  // 0. instantiate module
  s.prepend(
    `const ${moduleKey} = ${modulesKey}[${JSON.stringify(
      filename
    )}] = { [Symbol.toStringTag]: "Module" }\n\n`
  );

  // 1. check all import statements and record id -> importName map
  for (const node of ast) {
    // import foo from 'foo' --> foo -> __import_foo__.default
    // import { baz } from 'foo' --> baz -> __import_foo__.baz
    // import * as ok from 'foo' --> ok -> __import_foo__
    if (node.type === 'ImportDeclaration') {
      const source = node.source.value;
      if (source.startsWith('./')) {
        const importId = defineImport(node, node.source.value);
        for (const spec of node.specifiers) {
          if (spec.type === 'ImportSpecifier') {
            idToImportMap.set(
              spec.local.name,
              `${importId}.${spec.imported.name}`
            );
          } else if (spec.type === 'ImportDefaultSpecifier') {
            idToImportMap.set(spec.local.name, `${importId}.default`);
          } else {
            // namespace specifier
            idToImportMap.set(spec.local.name, importId);
          }
        }
        s.remove(node.start, node.end);
      }
    }
  }

  // 2. check all export statements and define exports
  for (const node of ast) {
    // named exports
    if (node.type === 'ExportNamedDeclaration') {
      if (node.declaration) {
        if (
          node.declaration.type === 'FunctionDeclaration' ||
          node.declaration.type === 'ClassDeclaration'
        ) {
          // export function foo() {}
          defineExport(node.declaration.id.name);
        } else if (node.declaration.type === 'VariableDeclaration') {
          // export const foo = 1, bar = 2
          for (const decl of node.declaration.declarations) {
            for (const id of extractIdentifiers(decl.id)) {
              defineExport(id.name);
            }
          }
        }
        s.remove(node.start, node.declaration.start);
      } else if (node.source) {
        // export { foo, bar } from './foo'
        const importId = defineImport(node, node.source.value);
        for (const spec of node.specifiers) {
          defineExport(spec.exported.name, `${importId}.${spec.local.name}`);
        }
        s.remove(node.start, node.end);
      } else {
        // export { foo, bar }
        for (const spec of node.specifiers) {
          const local = spec.local.name;
          const binding = idToImportMap.get(local);
          defineExport(spec.exported.name, binding || local);
        }
        s.remove(node.start, node.end);
      }
    }

    // default export
    if (node.type === 'ExportDefaultDeclaration') {
      if ('id' in node.declaration && node.declaration.id) {
        // named hoistable/class exports
        // export default function foo() {}
        // export default class A {}
        const { name } = node.declaration.id;
        s.remove(node.start, node.start + 15);
        s.append(`\n${exportKey}(${moduleKey}, "default", () => ${name})`);
      } else {
        // anonymous default exports
        s.overwrite(node.start, node.start + 14, `${moduleKey}.default =`);
      }
    }

    // export * from './foo'
    if (node.type === 'ExportAllDeclaration') {
      const importId = defineImport(node, node.source.value);
      s.remove(node.start, node.end);
      s.append(`\nfor (const key in ${importId}) {
        if (key !== 'default') {
          ${exportKey}(${moduleKey}, key, () => ${importId}[key])
        }
      }`);
    }
  }

  // 3. convert references to import bindings
  for (const node of ast) {
    if (node.type === 'ImportDeclaration') continue;
    walkIdentifiers(node, (id, parent, parentStack) => {
      const binding = idToImportMap.get(id.name);
      if (!binding) {
        return;
      }
      if (isStaticProperty(parent) && parent.shorthand) {
        // let binding used in a property shorthand
        // { foo } -> { foo: __import_x__.foo }
        // skip for destructure patterns
        if (
          !parent.inPattern ||
          isInDestructureAssignment(parent, parentStack)
        ) {
          s.appendLeft(id.end, `: ${binding}`);
        }
      } else if (
        parent.type === 'ClassDeclaration' &&
        id === parent.superClass
      ) {
        if (!declaredConst.has(id.name)) {
          declaredConst.add(id.name);
          // locate the top-most node containing the class declaration
          const topNode = parentStack[1];
          s.prependRight(topNode.start, `const ${id.name} = ${binding};\n`);
        }
      } else {
        s.overwrite(id.start, id.end, binding);
      }
    });
  }

  // 4. convert dynamic imports
  walk(ast, {
    enter(node, parent) {
      if (node.type === 'Import' && parent.type === 'CallExpression') {
        const arg = parent.arguments[0];
        if (arg.type === 'StringLiteral' && arg.value.startsWith('./')) {
          s.overwrite(node.start, node.start + 6, dynamicImportKey);
          s.overwrite(
            arg.start,
            arg.end,
            JSON.stringify(arg.value.replace(/^\.\/+/, ''))
          );
        }
      }
    },
  });

  return [s.toString(), importedFiles];
}

function processFile(store, file, processed, seen) {
  if (seen.has(file)) {
    return [];
  }
  seen.add(file);

  let [js, importedFiles] = processModule(
    store,
    store.files[file].compiled.js,
    file
  );

  // append css
  if (store.files[file].compiled.css) {
    js += `\nwindow.__css__ += ${JSON.stringify(
      store.files[file].compiled.css
    )}`;
  }
  // crawl child imports
  if (importedFiles.size) {
    for (const imported of importedFiles) {
      processFile(store, imported, processed, seen);
    }
  }
  // push self
  processed.push(js);
}

export function vueCompiler(store) {
  const seen = new Set();
  const processed = [];
  processFile(store, defaultMainFile, processed, seen);

  // also add css files that are not imported
  for (const filename in store.files) {
    if (filename.endsWith('.css')) {
      const file = store.files[filename];
      if (!seen.has(file)) {
        processed.push(
          `\nwindow.__css__ += ${JSON.stringify(file.compiled.css)}`
        );
      }
    }
  }

  return processed;
}

export function rawCompiler(store) {
  let processed = [];
  for (const name in store.files) {
    processed.push(rawProcessor(store.files[name]));
  }
  return processed;
}

function rawProcessor({ fileName, code }) {
  if (fileName === 'html') {
    return `document.body.innerHTML = ${JSON.stringify(code)}`;
  }

  if (fileName === 'javascript') {
    return code.replaceAll('"', "'");
  }

  if (fileName === 'css') {
    return `window.__css__ = '${code.replace(/(\r\n|\n|\r)/gm, '')}'`;
  }
  return '';
}
