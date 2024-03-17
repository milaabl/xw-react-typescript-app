/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: "https://adminref.vultor.io/api";
  readonly VITE_API_REFERRAL_URL: "https://adminref.vultor.io/api";
  readonly VITE_API_KEY: string;
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
