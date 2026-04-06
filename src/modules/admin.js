import { navigate } from '../lib/router.js'
import { getAdminScores } from '../services/scoreService.js'
import { formatTime } from '../utils/timer.js'

export function mount(container) {
  container.innerHTML = `
    <div class="admin-screen">
      <div class="admin-card">
        <button class="btn btn--ghost btn--sm admin-back" id="back-btn">← 首頁</button>
        <h1 class="admin-title">🔐 後台管理</h1>

        <form class="admin-login" id="login-form">
          <div class="form-group">
            <label class="form-label" for="admin-pw">管理密碼</label>
            <div class="admin-pw-row">
              <input
                class="form-input"
                id="admin-pw"
                type="password"
                placeholder="請輸入密碼"
                required
                autocomplete="current-password"
              />
              <button class="btn btn--primary" type="submit" id="login-btn">登入</button>
            </div>
          </div>
          <div id="login-error" class="form-error" aria-live="polite"></div>
        </form>

        <div id="admin-content" class="admin-content" hidden></div>
      </div>
    </div>
  `

  container.querySelector('#back-btn').addEventListener('click', () => navigate('home'))

  const form = container.querySelector('#login-form')
  const errorEl = container.querySelector('#login-error')
  const loginBtn = container.querySelector('#login-btn')

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const pw = container.querySelector('#admin-pw').value
    if (!pw) return

    loginBtn.disabled = true
    loginBtn.textContent = '驗證中...'
    errorEl.textContent = ''

    try {
      const scores = await getAdminScores(pw)
      form.hidden = true
      renderAdminTable(container.querySelector('#admin-content'), scores)
    } catch (err) {
      errorEl.textContent = err.message
      loginBtn.disabled = false
      loginBtn.textContent = '登入'
    }
  })
}

function renderAdminTable(contentEl, scores) {
  contentEl.hidden = false

  if (!scores.length) {
    contentEl.innerHTML = `<p class="lb-empty">目前沒有成績資料</p>`
    return
  }

  const rows = scores.map((s, i) => `
    <tr>
      <td class="admin-td admin-td--rank">${i + 1}</td>
      <td class="admin-td">${escHtml(s.name)}</td>
      <td class="admin-td admin-td--email">${escHtml(s.email)}</td>
      <td class="admin-td admin-td--time">${formatTime(s.time_ms)}</td>
      <td class="admin-td admin-td--date">${formatDate(s.created_at)}</td>
    </tr>
  `).join('')

  contentEl.innerHTML = `
    <p class="admin-count">共 ${scores.length} 筆成績（依完成時間排序）</p>
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>名稱</th>
            <th>Email</th>
            <th>完成時間</th>
            <th>提交時間</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `
}

function formatDate(iso) {
  if (!iso) return '-'
  try {
    return new Date(iso).toLocaleString('zh-TW', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
