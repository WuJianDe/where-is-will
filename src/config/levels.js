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
export const DEBUG_MODE = false;

export const HOME_CONFIG = {
  // 首頁背景圖路徑（放在 public/images/）
  backgroundImage: "images/home-bg.webp",
  title: "尋找小綠人",
  subtitle: "找出藏在人群中的小綠人",
};

export const LEVELS = [
  {
    id: 1,
    name: "第一關：熱鬧的公園",
    sceneImage: "images/map1.webp",
    targets: [
      { id: "will-1-1", label: "小綠人", x: 29.7, y: 3.59, radius: 5 },
      { id: "will-1-2", label: "小綠人", x: 52.86, y: 31.52, radius: 5 },
      { id: "will-1-3", label: "小綠人", x: 64.07, y: 26.87, radius: 5 },
      { id: "will-1-4", label: "小綠人", x: 46.79, y: 66.07, radius: 5 },
      { id: "will-1-5", label: "小綠人", x: 96.95, y: 5.34, radius: 5 },
    ],
  },
  {
    id: 2,
    name: "第二關：繁忙的市場",
    sceneImage: "images/map2.webp",
    targets: [
      { id: "will-2-1", label: "小綠人", x: 8.37, y: 57.55, radius: 5 },
      { id: "will-2-2", label: "小綠人", x: 41.69, y: 50.96, radius: 5 },
      { id: "will-2-3", label: "小綠人", x: 89.52, y: 27.02, radius: 5 },
      { id: "will-2-4", label: "小綠人", x: 91.56, y: 66.55, radius: 5 },
      { id: "will-2-5", label: "小綠人", x: 99.01, y: 37.79, radius: 5 },
    ],
  },
  {
    id: 3,
    name: "第三關：沙灘派對",
    sceneImage: "images/map3.webp",
    targets: [
      { id: "will-3-1", label: "小綠人", x: 2.55, y: 55.46, radius: 5 },
      { id: "will-3-2", label: "小綠人", x: 61.13, y: 48.55, radius: 5 },
      { id: "will-3-3", label: "小綠人", x: 30.9, y: 53.7, radius: 5 },
      { id: "will-3-4", label: "小綠人", x: 90.77, y: 62.37, radius: 5 },
      { id: "will-3-5", label: "小綠人", x: 88.4, y: 91.61, radius: 5 },
    ],
  },
];
