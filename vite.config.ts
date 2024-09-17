import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    viteCompression({
      verbose: true, // 输出压缩结果
      disable: false, // 是否禁用插件
      threshold: 10240, // 只有大于该值的资源会被压缩，单位是字节
      algorithm: "gzip",
      ext: ".gz",
    }),
  ],
  build: {
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks: {
          "vue-bundle": ["vue"],
          "naive-ui-bundle": ["naive-ui"],
        },
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
      },
      external: ["fsevents"],
    },
  },
});
