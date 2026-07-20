export async function submitScore({ name, email, timeMs }) {
  await requestJson('/api/scores.php', {
    method: 'POST',
    body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), timeMs }),
  })
}

export async function getTopScores(limit = 10) {
  const result = await requestJson(`/api/scores.php?limit=${encodeURIComponent(limit)}`)
  return result.data ?? []
}

export async function getAdminScores(password) {
  const result = await requestJson('/api/admin-scores.php', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
  return result.data ?? []
}

async function requestJson(url, options = {}) {
  const headers = { Accept: 'application/json', ...options.headers }
  if (options.body) headers['Content-Type'] = 'application/json'

  let response
  try {
    response = await fetch(url, { ...options, headers })
  } catch {
    throw new Error('無法連線至成績服務。')
  }

  let result
  try {
    result = await response.json()
  } catch {
    throw new Error('成績服務回傳了無效資料。')
  }

  if (!response.ok) throw new Error(result.error ?? '資料處理失敗。')
  return result
}
