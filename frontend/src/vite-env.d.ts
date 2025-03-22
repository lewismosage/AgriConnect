// env.d.ts
interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// src/env.d.ts
interface ImportMetaEnv {
  VITE_API_URL: string;
}