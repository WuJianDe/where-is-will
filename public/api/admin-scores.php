<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonResponse(['error' => '不支援的請求方法。'], 405);
$body = readJsonBody();
$password = (string) ($body['password'] ?? '');
$config = config();
if ($password === '' || !hash_equals($config['adminPassword'], $password)) jsonResponse(['error' => '管理員密碼錯誤。'], 401);
try {
    $statement = db()->query('SELECT name, email, time_ms, created_at FROM scores ORDER BY time_ms ASC, created_at ASC LIMIT 50');
    jsonResponse(['data' => $statement->fetchAll(PDO::FETCH_ASSOC)]);
} catch (PDOException) {
    error_log('Admin score query failed.');
    jsonResponse(['error' => '目前無法讀取成績資料。'], 500);
}
