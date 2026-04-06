# 尋找小綠人 🟢

一款「找找看」風格的網頁小遊戲——在熱鬧的場景中找出藏身人群的小綠人！

## 功能介紹

### 🏠 首頁
- 背景圖片搭配 8 個浮動裝飾圖示（循環飄動動畫）
- 「開始遊戲」進入第一關
- 「排行榜」查看前 10 名

### 🎮 遊戲關卡（共 3 關）
- 每關場景圖中藏有 **5 個小綠人**，全部找到才能過關
- 點選正確位置：出現**毛筆感紅色手繪圓圈**動畫，標記位置並永久保留
- 點選錯誤位置：顯示紅色 ✗ 淡出提示
- 畫面頂部即時顯示**計時器**與找到數量進度
- 三關計時連續不中斷，完成所有關卡後跳轉通關畫面

### 🎉 通關畫面
- 顯示總完成時間（格式：`MM:SS.mm`）
- 輸入名稱與 Email 提交成績至排行榜
- 可跳過直接查看排行榜

### 🏆 排行榜
- 顯示前 10 名玩家名稱與完成時間
- 金／銀／銅牌視覺標示

### 🔐 後台管理
- 密碼保護（於 Vercel 環境變數設定）
- 顯示前 50 筆完整成績（名稱、Email、完成時間、提交時間）
- 資料透過 Vercel Serverless Function 查詢，Email 不暴露於前端

---

## 技術架構

| 項目 | 技術 |
|------|------|
| 前端 | Vite + Vanilla JS |
| 資料庫 | Supabase（PostgreSQL + RLS） |
| 部署 | Vercel |
| 路由 | Hash-based SPA（`#home` / `#game/1` / `#complete` 等） |

---

## 本機開發

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

複製 `.env.example` 為 `.env.local` 並填入：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=your-admin-password
```

### 3. 建立資料庫

在 Supabase SQL Editor 執行 `supabase/schema.sql`。

### 4. 啟動開發伺服器

```bash
npm run dev
```

開啟 [http://localhost:5173](http://localhost:5173)，`/api/` 路由由 Vite middleware 在本機處理，無需額外啟動 API server。

---

## 自訂關卡

編輯 `src/config/levels.js`：

```js
export const LEVELS = [
  {
    id: 1,
    name: '第一關：場景名稱',
    sceneImage: '/images/map1.png', // 圖片放在 public/images/
    targets: [
      { id: 'g1-1', label: '小綠人', x: 42.5, y: 38.2, radius: 5 },
      // x, y 為圖片的百分比座標（0~100）
      // radius 為命中容許半徑（百分比，建議 4~6）
    ],
  },
  // ...
]
```

### 如何找到座標

1. `npm run dev` 啟動後進入遊戲關卡
2. 點擊場景圖上的小綠人位置
3. 瀏覽器 Console 會印出：`[座標] x: 42.53, y: 38.21`
4. 將數值填入 `levels.js` 對應關卡的 `targets`

---

## 部署到 Vercel

1. 將專案推送到 GitHub
2. 在 Vercel 匯入 repo
3. 於 Vercel **Settings → Environment Variables** 新增以下 5 個變數：

| 變數名稱 | 說明 |
|----------|------|
| `VITE_SUPABASE_URL` | Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon public key |
| `SUPABASE_URL` | Supabase Project URL（後台 API 用） |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key（僅伺服器端） |
| `ADMIN_PASSWORD` | 後台管理密碼 |

4. 儲存後點選 **Redeploy** 使環境變數生效

---

## 專案結構

```
where-is-will/
├── api/
│   └── admin-scores.js      # Vercel Serverless Function（後台查詢）
├── public/images/           # 場景圖片
├── src/
│   ├── config/levels.js     # 關卡設定（座標、圖片路徑）
│   ├── lib/                 # router、supabase client
│   ├── modules/             # 各畫面模組
│   ├── services/            # Supabase 資料存取
│   ├── utils/               # 點擊偵測、計時器、動畫
│   └── styles/main.css
├── supabase/schema.sql      # 資料庫建置 SQL
├── .env.example
└── vercel.json
```
