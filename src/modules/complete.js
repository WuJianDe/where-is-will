import { navigate } from '../lib/router.js'
import { getTotalMs, formatTime } from '../utils/timer.js'
import { submitScore } from '../services/scoreService.js'

export function mount(container) {
  const totalMs = getTotalMs()

  if (!totalMs) {
    navigate('home')
    return
  }

  container.innerHTML = `
    <div class="complete-screen">
      <div class="complete-card">
        <div class="complete-trophy">🎉</div>
        <h1 class="complete-title">恭喜通關！</h1>
        <p class="complete-subtitle">你找到了所有的威力</p>

        <div class="complete-time-box">
          <span class="complete-time-label">完成時間</span>
          <span class="complete-time-value">${formatTime(totalMs)}</span>
        </div>

        <form class="complete-form" id="score-form" novalidate>
          <h2 class="complete-form-title">提交你的成績</h2>

          <div class="form-group">
            <label class="form-label" for="input-name">名稱</label>
            <input
              class="form-input"
              id="input-name"
              type="text"
              placeholder="你的名字"
              maxlength="50"
              required
              autocomplete="nickname"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="input-email">Email</label>
            <input
              class="form-input"
              id="input-email"
              type="email"
              placeholder="your@email.com"
              required
              autocomplete="email"
            />
          </div>

          <p class="form-note">Email 不會公開顯示於排行榜</p>

          <div id="form-error" class="form-error" aria-live="polite"></div>

          <button class="btn btn--primary btn--full" id="submit-btn" type="submit">
            提交成績
          </button>
        </form>

        <div class="complete-actions-bottom">
          <button class="btn btn--ghost" id="skip-btn">跳過，直接看排行榜</button>
          <button class="btn btn--text btn--sm" id="retry-btn">再玩一次</button>
        </div>
      </div>
    </div>
  `

  const form = container.querySelector('#score-form')
  const submitBtn = container.querySelector('#submit-btn')
  const errorEl = container.querySelector('#form-error')

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const name = container.querySelector('#input-name').value.trim()
    const email = container.querySelector('#input-email').value.trim()

    errorEl.textContent = ''

    if (!name) { errorEl.textContent = '請填寫名稱'; return }
    if (!email || !email.includes('@')) { errorEl.textContent = '請填寫有效的 Email'; return }

    submitBtn.disabled = true
    submitBtn.textContent = '提交中...'

    try {
      await submitScore({ name, email, timeMs: totalMs })
      navigate('leaderboard')
    } catch (err) {
      errorEl.textContent = `提交失敗：${err.message}`
      submitBtn.disabled = false
      submitBtn.textContent = '提交成績'
    }
  })

  container.querySelector('#skip-btn').addEventListener('click', () => {
    navigate('leaderboard')
  })

  container.querySelector('#retry-btn').addEventListener('click', () => {
    navigate('game/1')
  })
}
