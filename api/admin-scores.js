const { createClient } = require('@supabase/supabase-js')

/**
 * Vercel Serverless Function - 後台成績查詢
 * 使用 Service Role Key 繞過 RLS，查詢含 Email 的完整資料
 * 密碼驗證在伺服器端進行，不暴露於前端
 */
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { password } = req.body ?? {}

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: '密碼錯誤' })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: '伺服器設定錯誤，請檢查環境變數' })
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  const { data, error } = await supabase
    .from('scores')
    .select('name, email, time_ms, created_at')
    .order('time_ms', { ascending: true })
    .limit(50)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({ data })
}
