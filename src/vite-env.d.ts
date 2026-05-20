/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GOOGLE_MAPS_KEY: string;
  readonly VITE_ONESIGNAL_APP_ID?: string;
  /** Must match OneSignal dashboard Site URL; omit to auto-try current origin */
  readonly VITE_ONESIGNAL_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
