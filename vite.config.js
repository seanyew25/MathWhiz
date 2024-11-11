// import { defineConfig } from "vite";
// import vue from "@vitejs/plugin-vue";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [vue()],
//   // resolve: {
//   //   alias: {
//   //     "~bootstrap": path.resolve(__dirname, "node_modules/bootstrap"),
//   //   },
//   // },
// });

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js',
      '@': '/src'
    }
  }
});
