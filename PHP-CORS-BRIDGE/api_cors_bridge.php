<?php
// Erlaubte APIs (Whitelist – verhindert Missbrauch als offener Proxy)
$allowed = [
    'list'        => 'https://www.vogelwarte.ch/wp-content/assets/json/bird/list_de.json',
    'species_700' => 'https://www.vogelwarte.ch/wp-content/assets/json/bird/species/700_de.json',
];

// Parameter aus der URL lesen, z. B. ?endpoint=list
$key = $_GET['endpoint'] ?? '';
if (!isset($allowed[$key])) {
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Unknown endpoint']);
    exit;
}
$url = $allowed[$key];

// do request
$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 10,
    CURLOPT_FAILONERROR    => true,
]);
$response = curl_exec($ch);

// error handling
if ($response === false) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => curl_error($ch)]);
    curl_close($ch);
    exit;
}
curl_close($ch);

// return as JSON
header('Content-Type: application/json; charset=utf-8');
echo $response;