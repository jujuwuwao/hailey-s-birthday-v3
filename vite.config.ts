import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/hailey-s-birthday-v3/",   // ⭐ 关键
  plugins: [react()],
});
