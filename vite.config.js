import { defineConfig } from 'vite'

export default defineConfig({
  // Allow deployment at either the domain root or an application subdirectory.
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
