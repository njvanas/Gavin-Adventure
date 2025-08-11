import { defineConfig } from "vite";

export default defineConfig({
  // Set the base path to your repo name so assets resolve correctly on GitHub Pages
  base: "/Gavin-Adventure/",
  server: {
    port: 5173,
  },
  build: {
    outDir: "dist",
  },
});
