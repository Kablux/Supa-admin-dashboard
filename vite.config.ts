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
          if (id.includes("node_modules")) {
            // Put Material UI in its own chunk (it's usually heavy)
            if (id.includes("@mui")) {
              return "vendor-mui";
            }
            // Put React and standard ecosystem libraries in another
            if (
              id.includes("react") ||
              id.includes("react-router") ||
              id.includes("@reduxjs")
            ) {
              return "vendor-react";
            }
            // Put all other third-party packages in a general vendor chunk
            return "vendor";
          }
        },
      },
    },
  },
});
