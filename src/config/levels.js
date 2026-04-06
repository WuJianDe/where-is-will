/**
 * =============================================
 * 關卡設定檔 - 修改此檔案自訂遊戲內容
 * =============================================
 *
 * 座標說明：
 *   x, y 為相對於圖片的百分比（0 = 左/上，100 = 右/下）
 *   radius 為容許誤差半徑（百分比），建議 3~6
 *
 * 如何找座標：
 *   1. 設定 DEBUG_MODE = true
 *   2. npm run dev
 *   3. 在遊戲場景中點擊威力，console 會印出座標
 *   4. 將座標填入下方 targets，再把 DEBUG_MODE 改回 false
 *
 * 如何替換圖片：
 *   1. 將圖片放入 public/images/
 *   2. 修改 sceneImage 路徑
 *   3. 更新 targets 座標
 * =============================================
 */

// 開發除錯模式：顯示目標位置標記 + console 印出點擊座標
export const DEBUG_MODE = false

export const HOME_CONFIG = {
  // 首頁背景圖路徑（放在 public/images/）
  backgroundImage: '/images/home-bg.svg',
  title: '威力在哪裡？',
  subtitle: '找出藏在人群中的神秘人物',
}

export const LEVELS = [
  {
    id: 1,
    name: '第一關：熱鬧的公園',
    sceneImage: '/images/level-1.svg',
    targets: [
      {
        id: 'will-1',
        label: '威力',
        x: 42.5, // 圖片寬度百分比
        y: 38.2, // 圖片高度百分比
        radius: 5, // 命中半徑（百分比）
      },
    ],
  },
  {
    id: 2,
    name: '第二關：繁忙的市場',
    sceneImage: '/images/level-2.svg',
    targets: [
      {
        id: 'will-2',
        label: '威力',
        x: 65.3,
        y: 55.7,
        radius: 5,
      },
    ],
  },
  {
    id: 3,
    name: '第三關：沙灘派對',
    sceneImage: '/images/level-3.svg',
    targets: [
      {
        id: 'will-3',
        label: '威力',
        x: 28.9,
        y: 71.4,
        radius: 5,
      },
    ],
  },
]
