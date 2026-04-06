import { LEVELS, DEBUG_MODE } from '../config/levels.js'
import { getImagePercent, checkHit, targetToImgPx } from '../utils/hitDetection.js'
import { placeFoundMarker, playWrongClick } from '../utils/animation.js'
import { startTimer, getElapsedMs, stopTimer, formatTime } from '../utils/timer.js'
import { navigate } from '../lib/router.js'

export function mount(container, params) {
  const levelId = parseInt(params[0] ?? '1', 10)
  const level = LEVELS.find(l => l.id === levelId)

  if (!level) {
    navigate('home')
    return
  }

  // 第一關才重置計時器
  if (levelId === 1) startTimer()

  const foundIds = new Set()
  let timerInterval = null

  // ── 渲染畫面 ──────────────────────────────────────────
  container.innerHTML = `
    <div class="game-screen">
      <header class="game-header">
        <button class="btn btn--ghost btn--sm" id="back-btn">← 首頁</button>
        <div class="game-meta">
          <span class="game-level-name">${level.name}</span>
          <span class="game-timer" id="timer-display">00:00.00</span>
        </div>
        <div class="game-progress">
          <span id="found-count">0</span>/<span>${level.targets.length}</span>
        </div>
      </header>

      <div class="game-scene-wrap">
        <div class="game-scene" id="game-scene">
          <img
            class="game-scene__img"
            id="scene-img"
            src="${level.sceneImage}"
            alt="${level.name} 場景"
            draggable="false"
          />
        </div>
        <div class="game-hint" id="game-hint" aria-live="polite"></div>
      </div>

      <div class="game-levels-indicator">
        ${LEVELS.map(l => `
          <span class="level-dot ${l.id < levelId ? 'done' : l.id === levelId ? 'active' : ''}">
            ${l.id < levelId ? '✓' : l.id}
          </span>
        `).join('')}
      </div>
    </div>
  `

  const sceneEl = container.querySelector('#game-scene')
  const imgEl = container.querySelector('#scene-img')
  const timerEl = container.querySelector('#timer-display')
  const foundCountEl = container.querySelector('#found-count')

  // ── 計時器更新 ─────────────────────────────────────────
  timerInterval = setInterval(() => {
    timerEl.textContent = formatTime(getElapsedMs())
  }, 100)

  // ── Debug 模式：顯示目標位置 ────────────────────────────
  if (DEBUG_MODE) {
    imgEl.addEventListener('load', () => placeDebugMarkers(sceneEl, imgEl, level.targets))
    if (imgEl.complete) placeDebugMarkers(sceneEl, imgEl, level.targets)
  }

  // ── 點擊 / 觸碰事件 ────────────────────────────────────
  const handleInteraction = (event) => {
    event.preventDefault()

    const clickPos = getImagePercent(event, imgEl)
    if (clickPos.inBounds) console.log(`[座標] x: ${clickPos.x.toFixed(2)}, y: ${clickPos.y.toFixed(2)}`)
    if (!clickPos.inBounds) return

    // 點擊的畫面座標（用於動畫）
    const rect = sceneEl.getBoundingClientRect()
    const clientX = event.changedTouches ? event.changedTouches[0].clientX : event.clientX
    const clientY = event.changedTouches ? event.changedTouches[0].clientY : event.clientY
    const pxX = clientX - rect.left
    const pxY = clientY - rect.top

    // 只對尚未找到的目標做判斷
    const remaining = level.targets.filter(t => !foundIds.has(t.id))
    const result = checkHit(clickPos, remaining, imgEl)

    if (result.hit) {
      foundIds.add(result.target.id)
      foundCountEl.textContent = foundIds.size

      // 在目標實際位置畫紅色圈圈（手繪動畫）
      const markerPos = targetToImgPx(result.target, imgEl)
      placeFoundMarker(sceneEl, markerPos.x, markerPos.y)

      showHint(container, `🎉 找到了！${result.target.label}`, 'success')

      if (foundIds.size === level.targets.length) {
        setTimeout(() => finishLevel(levelId, timerInterval), 900)
      }
    } else {
      playWrongClick(sceneEl, pxX, pxY)
      showHint(container, '再仔細找找看...', 'error')
    }
  }

  sceneEl.addEventListener('click', handleInteraction)
  sceneEl.addEventListener('touchend', handleInteraction, { passive: false })

  // ── 返回按鈕 ────────────────────────────────────────────
  container.querySelector('#back-btn').addEventListener('click', () => {
    if (confirm('確定離開？計時將重置。')) {
      clearInterval(timerInterval)
      navigate('home')
    }
  })

  // 清理函式（路由離開時呼叫）
  return () => clearInterval(timerInterval)
}

// ── 輔助函式 ──────────────────────────────────────────────

function showHint(container, message, type = '') {
  const el = container.querySelector('#game-hint')
  el.textContent = message
  el.className = `game-hint game-hint--${type} game-hint--show`
  setTimeout(() => { el.className = 'game-hint' }, 1800)
}

function finishLevel(levelId, timerInterval) {
  clearInterval(timerInterval)
  const nextId = levelId + 1
  const hasNext = LEVELS.some(l => l.id === nextId)

  if (hasNext) {
    navigate(`game/${nextId}`)
  } else {
    const totalMs = stopTimer()
    navigate('complete')
    // totalMs 已存入 sessionStorage，complete 畫面讀取
    void totalMs
  }
}

function placeDebugMarkers(sceneEl, imgEl, targets) {
  targets.forEach(t => {
    const pos = targetToImgPx(t, imgEl)
    const el = document.createElement('div')
    el.className = 'debug-marker'
    el.style.left = `${pos.x}px`
    el.style.top = `${pos.y}px`
    el.title = `${t.label} (${t.x}, ${t.y})`
    sceneEl.appendChild(el)
  })
}
