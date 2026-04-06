import { supabase } from '../lib/supabase.js'

/**
 * 提交成績到排行榜
 * @param {{ name: string, email: string, timeMs: number }} data
 */
export async function submitScore({ name, email, timeMs }) {
  const { error } = await supabase
    .from('scores')
    .insert([{ name: name.trim(), email: email.trim().toLowerCase(), time_ms: timeMs }])

  if (error) throw new Error(error.message)
}

/**
 * 取得公開排行榜前 N 名（不含 Email）
 * @param {number} limit
 * @returns {Promise<Array<{ name: string, time_ms: number, created_at: string }>>}
 */
export async function getTopScores(limit = 10) {
  const { data, error } = await supabase
    .from('public_scores')
    .select('name, time_ms, created_at')
    .order('time_ms', { ascending: true })
    .limit(limit)

  if (error) throw new Error(error.message)
  return data ?? []
}

/**
 * 後台：取得含 Email 的完整成績（需密碼，經 Vercel 伺服器端驗證）
 * @param {string} password
 * @returns {Promise<Array>}
 */
export async function getAdminScores(password) {
  const res = await fetch('/api/admin-scores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? '查詢失敗')
  return json.data ?? []
}
