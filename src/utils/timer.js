const SESSION_START_KEY = 'will_start_ms'
const SESSION_TOTAL_KEY = 'will_total_ms'

/** 開始計時（第一關呼叫） */
export function startTimer() {
  sessionStorage.setItem(SESSION_START_KEY, Date.now().toString())
  sessionStorage.removeItem(SESSION_TOTAL_KEY)
}

/** 停止計時並存入總時間（最後一關通關後呼叫） */
export function stopTimer() {
  const startMs = getStartMs()
  const total = Date.now() - startMs
  sessionStorage.setItem(SESSION_TOTAL_KEY, total.toString())
  return total
}

/** 取得開始時間戳（ms） */
export function getStartMs() {
  return parseInt(sessionStorage.getItem(SESSION_START_KEY) ?? Date.now().toString(), 10)
}

/** 取得目前已過毫秒數 */
export function getElapsedMs() {
  return Date.now() - getStartMs()
}

/** 取得儲存的總時間 */
export function getTotalMs() {
  return parseInt(sessionStorage.getItem(SESSION_TOTAL_KEY) ?? '0', 10)
}

/** 清除遊戲計時資料 */
export function clearTimer() {
  sessionStorage.removeItem(SESSION_START_KEY)
  sessionStorage.removeItem(SESSION_TOTAL_KEY)
}

/**
 * 格式化毫秒為 MM:SS.mm
 * @param {number} ms
 * @returns {string}
 */
export function formatTime(ms) {
  if (!ms || ms <= 0) return '00:00.00'
  const totalSec = Math.floor(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  const centisec = Math.floor((ms % 1000) / 10)
  return (
    String(min).padStart(2, '0') +
    ':' +
    String(sec).padStart(2, '0') +
    '.' +
    String(centisec).padStart(2, '0')
  )
}
