/// <reference types="vite/client" />

declare module 'uuid'

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  readonly NODE_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}