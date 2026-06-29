import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
});


// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     host: true,
//     allowedHosts: ["whiny-abdomen-flagstick.ngrok-free.dev", "localhost"],
//     proxy: {
//       "/api": {
//         target: "http://localhost:5000",
//         changeOrigin: true,
//         secure: false,
//       },
//       "/socket.io": {
//         target: "http://localhost:5000",
//         ws: true,
//       },
//     },
//   },
// });
