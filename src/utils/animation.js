/**
 * 播放 5 層同心圓擴散動畫（命中威力時觸發）
 * @param {HTMLElement} container - position: relative 的容器
 * @param {number} x - 相對容器的 px X 座標
 * @param {number} y - 相對容器的 px Y 座標
 */
export function playRipple(container, x, y) {
  const CIRCLE_COUNT = 5
  const circles = []

  for (let i = 0; i < CIRCLE_COUNT; i++) {
    const el = document.createElement('div')
    el.className = 'ripple-circle'
    el.style.left = `${x}px`
    el.style.top = `${y}px`
    el.style.animationDelay = `${i * 100}ms`
    container.appendChild(el)
    circles.push(el)
  }

  // 動畫結束後移除 DOM
  setTimeout(() => circles.forEach(el => el.remove()), CIRCLE_COUNT * 100 + 900)
}

/**
 * 在場景上放置永久的「已找到」圓圈標記
 * @param {HTMLElement} container
 * @param {number} x - px X 座標
 * @param {number} y - px Y 座標
 * @param {string} label
 */
export function placeFoundMarker(container, x, y, label = '✓') {
  const el = document.createElement('div')
  el.className = 'found-marker'
  el.style.left = `${x}px`
  el.style.top = `${y}px`
  el.setAttribute('aria-label', `找到${label}`)
  container.appendChild(el)
}

/**
 * 播放錯誤點擊動畫（紅色 ✗ 淡出）
 * @param {HTMLElement} container
 * @param {number} x
 * @param {number} y
 */
export function playWrongClick(container, x, y) {
  const el = document.createElement('div')
  el.className = 'wrong-click'
  el.style.left = `${x}px`
  el.style.top = `${y}px`
  el.textContent = '✗'
  container.appendChild(el)
  setTimeout(() => el.remove(), 700)
}

/**
 * 設定首頁浮動裝飾的隨機動畫延遲（製造錯落飄動感）
 * @param {NodeListOf<Element>} elements
 */
export function startFloating(elements) {
  elements.forEach((el, i) => {
    el.style.animationDelay = `${(i * 0.65).toFixed(2)}s`
  })
}
