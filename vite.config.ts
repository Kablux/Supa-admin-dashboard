import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: true,
      filename: "dist/stats.html",
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("leaflet.heat")) return undefined;

          if (id.includes("node_modules")) {
            // Material UI in its own chunk (it's heavy)
            if (id.includes("@mui")) {
              return "vendor-mui";
            }
            // React + ecosystem
            if (
              id.includes("react") ||
              id.includes("react-router") ||
              id.includes("@reduxjs")
            ) {
              return "vendor-react";
            }
            // Everything else third-party
            return "vendor";
          }
        },
      },
    },
  },
});
