// @ts-ignore
import hashId from 'hash-sum';
import {
  SFCDescriptor,
  BindingMetadata,
  shouldTransformRef,
  transformRef,
  parse,
  compileStyle,
  compileScript,
  rewriteDefault,
  compileTemplate,
} from '@vue/compiler-sfc';
import type { File } from '../types';
import type { FileStoreSGA } from '../store/useFileStore';

const COMP_IDENTIFIER = `__sfc__`;

export const transformSFC = async (
  store: FileStoreSGA,
  { code, filename }: File
) => {
  if (!code.trim()) return;

  if (filename.endsWith('.js')) {
    if (shouldTransformRef(code)) {
      code = transformRef(code, { filename }).code;
    }
    store.files[filename].compiled.js = code;
    return;
  }

  let clientCode = '';

  const { descriptor } = parse(code, {
    filename: filename,
    sourceMap: true,
  });

  const id = hashId(filename);
  const hasScoped = descriptor.styles.some((s) => s.scoped);

  const compiledScriptResult = await doCompileScript(descriptor, id);

  if (!compiledScriptResult) return;

  const [clientScript, bindings] = compiledScriptResult;

  clientCode += clientScript;

  if (descriptor.template && !descriptor.scriptSetup) {
    const clientTemplateResult = await doCompileTemplate(
      store,
      descriptor,
      id,
      bindings as BindingMetadata | undefined,
      false
    );

    if (!clientTemplateResult) {
      return;
    }
    clientCode += clientTemplateResult;
  }

  if (hasScoped) {
    clientCode += `\n${COMP_IDENTIFIER}.__scopeId = ${JSON.stringify(
      `data-v-${id}`
    )}`;
  }

  // style
  let css = '';
  for (const style of descriptor.styles) {
    const styleResult = compileStyle({
      source: style.content,
      filename: filename,
      id,
      scoped: style.scoped,
      // modules: !!style.module,
    });
    css += styleResult.code + '\n';
  }
  if (clientCode) {
    clientCode +=
      `\n${COMP_IDENTIFIER}.__file = ${JSON.stringify(filename)}` +
      `\nexport default ${COMP_IDENTIFIER}`;
  }

  store.updateCompiledFile(
    { js: clientCode.trimStart(), css: css.trim() },
    filename
  );
};

function doCompileTemplate(
  store: FileStoreSGA,
  descriptor: SFCDescriptor,
  id: string,
  bindingMetadata: BindingMetadata | undefined,
  ssr: boolean
) {
  const templateResult = compileTemplate({
    source: descriptor.template!.content,
    filename: descriptor.filename,
    id,
    scoped: descriptor.styles.some((s) => s.scoped),
    slotted: descriptor.slotted,
    ssr,
    ssrCssVars: descriptor.cssVars,
    isProd: false,
    compilerOptions: {
      bindingMetadata,
    },
  });
  if (templateResult.errors.length) {
    return;
  }

  const fnName = ssr ? `ssrRender` : `render`;

  let code =
    `\n${templateResult.code.replace(
      /\nexport (function|const) (render|ssrRender)/,
      `$1 ${fnName}`
    )}` + `\n${COMP_IDENTIFIER}.${fnName} = ${fnName}`;

  return code;
}

async function doCompileScript(descriptor: SFCDescriptor, id: string) {
  if (!descriptor.script && !descriptor.scriptSetup) {
    return [`\nconst ${COMP_IDENTIFIER} = {}`, undefined];
  }
  try {
    const compiledScript = await compileScript(descriptor, {
      inlineTemplate: true,
      id,
      templateOptions: {
        ssr: false,
      },
    });

    let outputCode = '';
    outputCode +=
      `\n` + rewriteDefault(compiledScript.content, COMP_IDENTIFIER);

    return [outputCode, compiledScript.bindings];
  } catch (e) {
    return;
  }
}
