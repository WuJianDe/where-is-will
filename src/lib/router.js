/** @type {Record<string, (container: HTMLElement, params: string[]) => (() => void) | void>} */
const routes = {}
let currentCleanup = null

/**
 * 註冊路由
 * @param {string} path - hash 路徑（不含 #）
 * @param {Function} handler - (container, params) => cleanupFn | void
 */
export function registerRoute(path, handler) {
  routes[path] = handler
}

/**
 * 導航到指定頁面
 * @param {string} hash - 例如 'home', 'game/1', 'leaderboard'
 */
export function navigate(hash) {
  window.location.hash = hash
}

/** 初始化路由，監聽 hashchange，回傳清理函式 */
export function initRouter() {
  const handleRoute = () => {
    const raw = window.location.hash.slice(1) || 'home'
    const [path, ...params] = raw.split('/')

    if (currentCleanup) {
      currentCleanup()
      currentCleanup = null
    }

    const container = document.getElementById('app')
    container.innerHTML = ''

    const handler = routes[path]
    if (handler) {
      const cleanup = handler(container, params)
      currentCleanup = cleanup ?? null
    } else {
      container.innerHTML = `
        <div class="error-page">
          <h2>找不到頁面</h2>
          <a href="#home" class="btn btn--primary">回首頁</a>
        </div>`
    }
  }

  window.addEventListener('hashchange', handleRoute)
  handleRoute()

  return () => window.removeEventListener('hashchange', handleRoute)
}
