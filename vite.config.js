import { defineConfig, loadEnv } from 'vite'
import { createRequire } from 'module'

const _require = createRequire(import.meta.url)

export default defineConfig(({ mode }) => {
  // 載入所有 .env.local 變數（包含非 VITE_ 前綴的伺服器端變數）
  const env = loadEnv(mode, process.cwd(), '')

  return {
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    plugins: [
      {
        name: 'local-api',
        configureServer(server) {
          // 讓 API handler 能讀到 .env.local 的環境變數
          Object.assign(process.env, env)

          // 模擬 Vercel serverless function：/api/admin-scores
          server.middlewares.use('/api/admin-scores', async (req, res) => {
            // 補上 Express 相容方法（Vite 用原生 Node.js res）
            res.status = (code) => { res.statusCode = code; return res }
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
            }

            const handler = _require('./api/admin-scores.js')
            await handler(req, res)
          })
        },
      },
    ],
  }
})
