import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from https://<user>.github.io/sobra-platform/ on GitHub Pages.
// Live on the custom domain nexstock.pt (root), so base is "/".
// Override with VITE_BASE=/sobra-platform/ for the project-pages URL.
export default defineConfig({
  base: process.env.VITE_BASE || "/",
  plugins: [react()],
});
