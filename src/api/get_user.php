<?php

set_error_handler(function($errno, $errstr, $errfile, $errline) {
    header("Content-Type: application/json");
    http_response_code(500);
    echo json_encode(["error" => "PHP Error: $errstr in $errfile on line $errline"]);
    exit();
});

register_shutdown_function(function() {
    $err = error_get_last();
    if ($err && in_array($err['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        header("Content-Type: application/json");
        http_response_code(500);
        echo json_encode(["error" => "Fatal PHP Error: " . $err['message']]);
    }
});

ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "db.php";

if (!isset($_GET["id"]) || !is_numeric($_GET["id"])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid or missing user ID"]);
    exit();
}

$id = intval($_GET["id"]);

$stmt = $conn->prepare("
    SELECT 
        u.id,
        u.name,
        COALESCE(d.email, '')    AS email,
        COALESCE(d.phone, '')    AS phone,
        COALESCE(d.region, '')   AS region,
        COALESCE(d.province, '') AS province,
        COALESCE(d.city, '')     AS city,
        COALESCE(d.barangay, '') AS barangay,
        COALESCE(d.street, '')   AS street
    FROM users u
    LEFT JOIN user_details d ON d.user_id = u.id
    WHERE u.id = ?
");

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Prepare failed: " . $conn->error]);
    exit();
}

$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["error" => "User not found"]);
    exit();
}

echo json_encode($result->fetch_assoc());

$stmt->close();
$conn->close();