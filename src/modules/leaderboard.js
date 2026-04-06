import { navigate } from '../lib/router.js'
import { getTopScores } from '../services/scoreService.js'
import { formatTime } from '../utils/timer.js'

export function mount(container) {
  container.innerHTML = `
    <div class="leaderboard-screen">
      <div class="lb-card">
        <button class="btn btn--ghost btn--sm lb-back" id="back-btn">← 首頁</button>
        <div class="lb-header">
          <span class="lb-trophy">🏆</span>
          <h1 class="lb-title">排行榜</h1>
          <p class="lb-subtitle">前 10 名最快找到威力的玩家</p>
        </div>
        <div id="lb-content" class="lb-content">
          <div class="lb-loading">載入中...</div>
        </div>
        <div class="lb-actions">
          <button class="btn btn--primary" id="play-btn">再玩一次 🕹️</button>
        </div>
      </div>
    </div>
  `

  container.querySelector('#back-btn').addEventListener('click', () => navigate('home'))
  container.querySelector('#play-btn').addEventListener('click', () => navigate('game/1'))

  loadLeaderboard(container)
}

async function loadLeaderboard(container) {
  const contentEl = container.querySelector('#lb-content')

  try {
    const scores = await getTopScores(10)

    if (!scores.length) {
      contentEl.innerHTML = `<p class="lb-empty">還沒有成績，快去成為第一名！</p>`
      return
    }

    contentEl.innerHTML = `
      <ol class="lb-list">
        ${scores.map((s, i) => `
          <li class="lb-item ${i === 0 ? 'lb-item--gold' : i === 1 ? 'lb-item--silver' : i === 2 ? 'lb-item--bronze' : ''}">
            <span class="lb-rank">${rankIcon(i + 1)}</span>
            <span class="lb-name">${escHtml(s.name)}</span>
            <span class="lb-time">${formatTime(s.time_ms)}</span>
          </li>
        `).join('')}
      </ol>
    `
  } catch (err) {
    contentEl.innerHTML = `
      <div class="lb-error">
        <p>無法載入排行榜</p>
        <p class="lb-error-detail">${escHtml(err.message)}</p>
        <button class="btn btn--ghost btn--sm" id="retry-lb">重試</button>
      </div>
    `
    container.querySelector('#retry-lb')?.addEventListener('click', () => loadLeaderboard(container))
  }
}

function rankIcon(rank) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `#${rank}`
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
