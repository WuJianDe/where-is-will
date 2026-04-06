const SVG_NS = 'http://www.w3.org/2000/svg'
const CIRCLE_R = 34
const CIRCLE_SIZE = (CIRCLE_R + 16) * 2
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R

/**
 * 在目標位置畫一個毛筆感紅色圈圈
 * - feTurbulence 製造筆觸不均勻感
 * - stroke-dashoffset 動畫模擬筆畫過程
 * - 隨機旋轉角度，每個圈都略有不同
 */
export function placeFoundMarker(container, x, y) {
  const filterId = `brush-${Date.now()}`
  const rotation = -12 + Math.random() * 24 // 隨機 -12° ~ +12°

  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.classList.add('drawn-circle')
  svg.setAttribute('width', CIRCLE_SIZE)
  svg.setAttribute('height', CIRCLE_SIZE)
  svg.setAttribute('viewBox', `0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`)
  svg.style.left = `${x}px`
  svg.style.top = `${y}px`
  svg.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`

  // 毛筆紋理濾鏡
  const defs = document.createElementNS(SVG_NS, 'defs')
  const filter = document.createElementNS(SVG_NS, 'filter')
  filter.setAttribute('id', filterId)
  filter.setAttribute('x', '-20%')
  filter.setAttribute('y', '-20%')
  filter.setAttribute('width', '140%')
  filter.setAttribute('height', '140%')

  const turbulence = document.createElementNS(SVG_NS, 'feTurbulence')
  turbulence.setAttribute('type', 'turbulence')
  turbulence.setAttribute('baseFrequency', '0.035')
  turbulence.setAttribute('numOctaves', '3')
  turbulence.setAttribute('result', 'noise')

  const displacement = document.createElementNS(SVG_NS, 'feDisplacementMap')
  displacement.setAttribute('in', 'SourceGraphic')
  displacement.setAttribute('in2', 'noise')
  displacement.setAttribute('scale', '5')
  displacement.setAttribute('xChannelSelector', 'R')
  displacement.setAttribute('yChannelSelector', 'G')

  filter.appendChild(turbulence)
  filter.appendChild(displacement)
  defs.appendChild(filter)
  svg.appendChild(defs)

  const circle = document.createElementNS(SVG_NS, 'circle')
  circle.classList.add('drawn-circle__path')
  circle.setAttribute('cx', CIRCLE_SIZE / 2)
  circle.setAttribute('cy', CIRCLE_SIZE / 2)
  circle.setAttribute('r', CIRCLE_R)
  circle.setAttribute('filter', `url(#${filterId})`)
  circle.style.strokeDasharray = CIRCUMFERENCE
  circle.style.strokeDashoffset = CIRCUMFERENCE

  svg.appendChild(circle)
  container.appendChild(svg)
}

/**
 * 播放錯誤點擊動畫（紅色 ✗ 淡出）
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
 * 設定首頁浮動裝飾的隨機動畫延遲
 */
export function startFloating(elements) {
  elements.forEach((el, i) => {
    el.style.animationDelay = `${(i * 0.65).toFixed(2)}s`
  })
}
