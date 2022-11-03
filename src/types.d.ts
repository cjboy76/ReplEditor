import type { Ref } from 'vue';

export interface VueModeInjectType {
  vueMode: Ref<boolean>;
  setVueMode: (value: boolean) => void;
}

export type File = {
  filename: FileName;
  code: string;
  compiled: {
    js?: string;
    css?: string;
    ssr?: string;
  };
};
export type FileName = 'html' | 'css' | 'javascript' | 'JSON' | 'App.vue';
export type Files = Record<FileName, File>;
