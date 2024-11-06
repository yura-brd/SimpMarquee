// vite.config.js
import path from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { normalizePath } from 'vite'
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    outDir: 'dist',  // Убедитесь, что путь совпадает с outDir в tsconfig.json
    lib: {
      entry: path.resolve(__dirname, 'src/lib/main.ts'),
      name: 'SimpMarqueeLib',
      // formats: ['es', 'umd'],
      fileName: (format) => `simp-marquee.${format}.js`
    },
    rollupOptions: {
      // убедитесь, что исключили библиотеки, которые не надо собирать
      output: {
        globals: {
        },
        exports: 'named',
      }
    },
  },
  plugins: [
    viteTsconfigPaths(),
    viteStaticCopy({
      targets: [
        {
          src: 'types', // Указываем папку с типами
          dest: './'      // Копируем её в выходную директорию
        },
        {
          src: normalizePath(path.resolve(__dirname, './src/style.css')) ,
          dest: './'
        },
        {
          src: normalizePath(path.resolve(__dirname, './src/style.css')),
          dest: normalizePath(path.resolve(__dirname, './docs'))      // Копируем её в выходную директорию
        },
        {
          src: 'index.html',
          dest: normalizePath(path.resolve(__dirname, './docs'))      // Копируем её в выходную директорию
        },
      ]
    })
  ]
})
