import { navigate } from '../lib/router.js'
import { HOME_CONFIG } from '../config/levels.js'
import { startFloating } from '../utils/animation.js'
import { clearTimer } from '../utils/timer.js'

const DECORATIONS = [
  { emoji: '🔍', cls: 'deco-1' },
  { emoji: '❓', cls: 'deco-2' },
  { emoji: '⭐', cls: 'deco-3' },
  { emoji: '🎈', cls: 'deco-4' },
  { emoji: '👀', cls: 'deco-5' },
  { emoji: '🌟', cls: 'deco-6' },
  { emoji: '🕵️', cls: 'deco-7' },
  { emoji: '💫', cls: 'deco-8' },
]

export function mount(container) {
  clearTimer()

  container.innerHTML = `
    <div class="home-screen">
      <div class="home-bg" id="home-bg"></div>
      <div class="home-bg-overlay"></div>

      <div class="home-decorations" aria-hidden="true">
        ${DECORATIONS.map(d => `<span class="home-deco ${d.cls}">${d.emoji}</span>`).join('')}
      </div>

      <div class="home-content">
        <div class="home-logo">🕵️</div>
        <h1 class="home-title">${HOME_CONFIG.title}</h1>
        <p class="home-subtitle">${HOME_CONFIG.subtitle}</p>
        <div class="home-actions">
          <button class="btn btn--primary btn--lg" id="start-btn">
            <span>開始遊戲</span>
            <span class="btn__icon">▶</span>
          </button>
          <button class="btn btn--ghost" id="leaderboard-btn">
            🏆 排行榜
          </button>
        </div>
        <button class="btn btn--text btn--sm" id="admin-btn">後台管理</button>
      </div>
    </div>
  `

  // 設定背景圖（有圖用圖，無圖用漸層）
  const bgEl = container.querySelector('#home-bg')
  const img = new Image()
  img.onload = () => {
    bgEl.style.backgroundImage = `url('${HOME_CONFIG.backgroundImage}')`
  }
  img.src = HOME_CONFIG.backgroundImage

  startFloating(container.querySelectorAll('.home-deco'))

  container.querySelector('#start-btn').addEventListener('click', () => {
    navigate('game/1')
  })

  container.querySelector('#leaderboard-btn').addEventListener('click', () => {
    navigate('leaderboard')
  })

  container.querySelector('#admin-btn').addEventListener('click', () => {
    navigate('admin')
  })
}
