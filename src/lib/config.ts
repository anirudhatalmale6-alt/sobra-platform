// Runtime configuration.
// On GitHub Pages we load Supabase credentials from /config.js (window.__SOBRA_CONFIG__)
// so keys can be swapped without rebuilding. Falls back to Vite env vars for local dev.

type SobraConfig = {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
};

declare global {
  interface Window {
    __SOBRA_CONFIG__?: SobraConfig;
  }
}

const runtime: SobraConfig =
  (typeof window !== "undefined" && window.__SOBRA_CONFIG__) || {};

export const SUPABASE_URL =
  runtime.supabaseUrl || (import.meta.env.VITE_SUPABASE_URL as string) || "";

export const SUPABASE_ANON_KEY =
  runtime.supabaseAnonKey ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  "";

// True when the backend is wired up. Until the client creates the Supabase
// project and we drop in config.js, the app runs in "preview" mode with
// local sample data so the interface is still fully browsable.
export const BACKEND_READY = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
