<?php
// Welcher Endpoint? 'list' = Vogelliste, 'species' = einzelne Art
$endpoint = $_GET['endpoint'] ?? '';

if ($endpoint === 'list') {
    $url = 'https://www.vogelwarte.ch/wp-content/assets/json/bird/list_de.json';

} elseif ($endpoint === 'species') {
    $id = $_GET['id'] ?? '';

    // Nur reine Zahlen erlauben – verhindert Manipulation der URL
    if (!ctype_digit($id)) {
        http_response_code(400);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'Invalid id']);
        exit;
    }
    $url = "https://www.vogelwarte.ch/wp-content/assets/json/bird/species/{$id}_de.json";

} else {
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Unknown endpoint']);
    exit;
}

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