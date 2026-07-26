import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  root: "pages",
  base: "/amidental-shine-refresh/",
  publicDir: "../public",
  plugins: [tsconfigPaths(), tailwindcss(), react()],
  build: {
    outDir: "../dist-pages",
    emptyOutDir: true,
  },
});
