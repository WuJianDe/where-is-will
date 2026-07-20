# 找找小綠人

一款適合手機與桌機遊玩的三關找物遊戲。玩家需在熱鬧場景中找出小綠人；每關完成後累計總時間，並可選擇提交成績至排行榜。

## 遊戲特色

- 三個高解析手繪場景，每關有 5 個隱藏目標
- 以點擊／觸控操作，並依圖片實際顯示範圍計算命中位置
- 全程計時、完成成績提交與公開排行榜
- 受密碼保護的管理頁面，可查閱含 Email 的完整成績
- 場景圖片採用 WebP，減少首次載入流量約 89%

## 技術架構

| 範圍 | 技術 |
| --- | --- |
| 前端 | Vite + Vanilla JavaScript |
| API | PHP 8 + PDO |
| 資料庫 | MySQL / MariaDB |
| 路由 | Hash SPA (`#home`、`#game/1`、`#complete`) |

前端 API 使用同網域相對路徑，因此可部署於網域根目錄或子目錄。例如部署於 `/where-is-will/` 時，API 會使用 `/where-is-will/api/scores.php`。

## 本機開發

```bash
npm install
npm run dev
```

Vite 開發伺服器只處理前端。需要測試 PHP API 時，請將 `dist` 部署到具備 PHP 與 MySQL 的 Web Server，或自行以 Apache / Nginx + PHP-FPM 提供網站。

## MySQL 初始化

在 Cloudways 的資料庫管理工具（例如 phpMyAdmin）選取目標資料庫後，執行：

```sql
mysql/schema.sql
```

此操作會建立 `where_is_will_scores` 資料表與排行榜索引。

## Cloudways 部署

1. 在專案根目錄執行 `npm run build`。
2. 將 `dist/` **內的所有內容**上傳到網站目錄。例如子目錄部署可上傳至 `public_html/where-is-will/`；不要把 `dist` 再包成另一層目錄。
3. 在伺服器 Web Root 的 `api/` 目錄建立 `config.local.php`，以 `api/config.local.example.php` 為範本。
4. 將以下資料填入 `config.local.php`：資料庫名稱、使用者、密碼，以及另外設定一組強管理員密碼。
5. 在目標資料庫執行 `mysql/schema.sql`。
6. 確認 PHP 已啟用 `pdo_mysql` 擴充套件，然後開啟網站測試送出成績與排行榜。

`config.local.php` 不會被 Git 追蹤。請勿把資料庫密碼、管理員密碼寫入 JavaScript、提交到 Git，或放在可公開下載的文字檔中。

### 資料庫主機

程式預設使用 `127.0.0.1:3306`。若 Cloudways Access Details 顯示不同的 MySQL Host 或 Port，請在 `config.local.php` 覆寫 `DB_HOST` 或 `DB_PORT`。

## API

| Endpoint | Method | 功能 |
| --- | --- | --- |
| `/api/scores.php` | `GET` | 讀取前 1–50 名公開排行榜，不含 Email |
| `/api/scores.php` | `POST` | 新增名稱、Email、完成時間 |
| `/api/admin-scores.php` | `POST` | 使用管理員密碼讀取前 50 筆完整成績 |

API 使用 PDO 預備敘述、伺服器端輸入驗證與泛用錯誤訊息，避免將資料庫細節或機密資訊回傳給瀏覽器。

## 專案結構

```
public/
  api/                    # 隨 Vite build 複製到 dist/api 的 PHP API
src/
  config/levels.js        # 關卡與目標座標
  modules/                # 頁面模組
  services/scoreService.js
mysql/schema.sql          # MySQL 建表 SQL
```
