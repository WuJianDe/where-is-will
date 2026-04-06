/**
 * 點擊偵測工具
 * 處理 object-fit: contain 產生的 letterbox / pillarbox 座標換算
 */

/**
 * 計算 object-fit: contain 的實際渲染區域
 * @param {HTMLImageElement} imgEl
 * @returns {{ renderedW: number, renderedH: number, offsetX: number, offsetY: number }}
 */
function getRenderedArea(imgEl) {
  const rect = imgEl.getBoundingClientRect()
  const containerW = rect.width
  const containerH = rect.height
  const naturalW = imgEl.naturalWidth || containerW
  const naturalH = imgEl.naturalHeight || containerH

  const naturalRatio = naturalW / naturalH
  const containerRatio = containerW / containerH

  let renderedW, renderedH, offsetX, offsetY

  if (naturalRatio > containerRatio) {
    // 寬貼合，上下 letterbox
    renderedW = containerW
    renderedH = containerW / naturalRatio
    offsetX = 0
    offsetY = (containerH - renderedH) / 2
  } else {
    // 高貼合，左右 pillarbox
    renderedH = containerH
    renderedW = containerH * naturalRatio
    offsetX = (containerW - renderedW) / 2
    offsetY = 0
  }

  return { renderedW, renderedH, offsetX, offsetY }
}

/**
 * 將點擊事件換算成圖片內的百分比座標
 * @param {MouseEvent|TouchEvent} event
 * @param {HTMLImageElement} imgEl
 * @returns {{ x: number, y: number, inBounds: boolean }}
 */
export function getImagePercent(event, imgEl) {
  const rect = imgEl.getBoundingClientRect()
  const { renderedW, renderedH, offsetX, offsetY } = getRenderedArea(imgEl)

  const clientX = event.changedTouches
    ? event.changedTouches[0].clientX
    : event.clientX
  const clientY = event.changedTouches
    ? event.changedTouches[0].clientY
    : event.clientY

  const relX = clientX - rect.left - offsetX
  const relY = clientY - rect.top - offsetY

  if (relX < 0 || relX > renderedW || relY < 0 || relY > renderedH) {
    return { x: 0, y: 0, inBounds: false }
  }

  return {
    x: (relX / renderedW) * 100,
    y: (relY / renderedH) * 100,
    inBounds: true,
  }
}

/**
 * 判斷百分比座標是否命中目標（使用長寬比修正距離，確保視覺上為圓形）
 * @param {{ x: number, y: number }} click
 * @param {Array<{ x: number, y: number, radius: number, id: string }>} targets
 * @param {HTMLImageElement} imgEl
 * @returns {{ hit: boolean, target?: object }}
 */
export function checkHit(click, targets, imgEl) {
  const { renderedW, renderedH } = getRenderedArea(imgEl)
  const aspectRatio = renderedW / (renderedH || 1)

  for (const target of targets) {
    const dx = click.x - target.x
    const dy = (click.y - target.y) * aspectRatio
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= target.radius) {
      return { hit: true, target }
    }
  }

  return { hit: false }
}

/**
 * 將目標百分比座標換算為相對 img 元素的 px 座標（含 letterbox offset）
 * @param {{ x: number, y: number }} target
 * @param {HTMLImageElement} imgEl
 * @returns {{ x: number, y: number }}
 */
export function targetToImgPx(target, imgEl) {
  const { renderedW, renderedH, offsetX, offsetY } = getRenderedArea(imgEl)
  return {
    x: offsetX + (target.x / 100) * renderedW,
    y: offsetY + (target.y / 100) * renderedH,
  }
}
