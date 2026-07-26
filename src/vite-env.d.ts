/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Gemini API key. When set, real AI chat/screening is enabled automatically. */
  readonly VITE_GEMINI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
