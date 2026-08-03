import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from https://<user>.github.io/sobra-platform/ on GitHub Pages.
// Override with VITE_BASE=/ for other hosts (e.g. a custom domain / Vercel).
export default defineConfig({
  base: process.env.VITE_BASE || "/sobra-platform/",
  plugins: [react()],
});
