import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000, // Specify the port you want to use
    allowedHosts: ["*", "wet-clouds-spend.loca.lt"],
  },
});
