<?php
declare(strict_types=1);

function jsonResponse(array $data, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function readJsonBody(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') return [];
    try {
        $body = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        jsonResponse(['error' => '請求資料格式錯誤。'], 400);
    }
    return is_array($body) ? $body : [];
}

function config(): array
{
    $localConfig = __DIR__ . '/config.local.php';
    $local = is_file($localConfig) ? require $localConfig : [];
    if (!is_array($local)) jsonResponse(['error' => '伺服器設定格式錯誤。'], 500);
    $get = static function (string $key, ?string $default = null) use ($local): ?string {
        $value = $local[$key] ?? getenv($key);
        return $value === false || $value === null || $value === '' ? $default : (string) $value;
    };
    $config = [
        'host' => $get('DB_HOST', '127.0.0.1'), 'port' => $get('DB_PORT', '3306'),
        'name' => $get('DB_NAME'), 'user' => $get('DB_USER'), 'password' => $get('DB_PASSWORD'),
        'adminPassword' => $get('ADMIN_PASSWORD'),
    ];
    if (!$config['name'] || !$config['user'] || !$config['password'] || !$config['adminPassword']) {
        jsonResponse(['error' => '伺服器尚未完成資料庫或管理員設定。'], 500);
    }
    return $config;
}

function db(): PDO
{
    $config = config();
    try {
        return new PDO("mysql:host={$config['host']};port={$config['port']};dbname={$config['name']};charset=utf8mb4", $config['user'], $config['password'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false]);
    } catch (PDOException) {
        error_log('Score database connection failed.');
        jsonResponse(['error' => '目前無法連線資料庫。'], 503);
    }
}

function stringLength(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
}
