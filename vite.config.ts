import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

// 루트의 *.html 파일을 자동으로 빌드 엔트리로 등록한다.
// 신규 서비스는 xxx.html 한 장만 추가하면 별도 설정 없이 독립 산출물이 생성된다.
const htmlEntries = Object.fromEntries(
  readdirSync(__dirname)
    .filter((file) => file.endsWith('.html'))
    .map((file) => [file.replace(/\.html$/, ''), resolve(__dirname, file)])
);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      input: htmlEntries
    }
  }
});
