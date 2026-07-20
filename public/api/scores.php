<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $limit = filter_input(INPUT_GET, 'limit', FILTER_VALIDATE_INT, ['options' => ['default' => 10, 'min_range' => 1, 'max_range' => 50]]);
    $statement = db()->prepare('SELECT name, time_ms, created_at FROM scores ORDER BY time_ms ASC, created_at ASC LIMIT :limit');
    $statement->bindValue(':limit', $limit, PDO::PARAM_INT);
    $statement->execute();
    jsonResponse(['data' => $statement->fetchAll(PDO::FETCH_ASSOC)]);
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonResponse(['error' => '不支援的請求方法。'], 405);

$body = readJsonBody();
$name = trim((string) ($body['name'] ?? ''));
$email = strtolower(trim((string) ($body['email'] ?? '')));
$timeMs = filter_var($body['timeMs'] ?? null, FILTER_VALIDATE_INT);
if ($name === '' || stringLength($name) > 50) jsonResponse(['error' => '名稱須為 1 至 50 個字元。'], 422);
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || stringLength($email) > 254) jsonResponse(['error' => '請輸入有效的 Email。'], 422);
if ($timeMs === false || $timeMs < 1 || $timeMs > 86400000) jsonResponse(['error' => '成績時間格式錯誤。'], 422);
try {
    $statement = db()->prepare('INSERT INTO scores (name, email, time_ms) VALUES (:name, :email, :time_ms)');
    $statement->execute([':name' => $name, ':email' => $email, ':time_ms' => $timeMs]);
    jsonResponse(['data' => ['saved' => true]], 201);
} catch (PDOException) {
    error_log('Score insert failed.');
    jsonResponse(['error' => '成績儲存失敗，請稍後再試。'], 500);
}
