<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "Not logged in"]);
    exit();
}

$conn = new mysqli("localhost", "root", "", "fuku");

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $_SESSION['user_id']; 

$name     = $data["name"] ?? "";
$email    = $data["email"] ?? "";
$phone    = $data["phone"] ?? "";
$region   = $data["region"] ?? "";
$province = $data["province"] ?? "";
$city     = $data["city"] ?? "";
$barangay = $data["barangay"] ?? "";
$street   = $data["street"] ?? "";

$stmt = $conn->prepare("UPDATE users SET name=? WHERE id=?");
$stmt->bind_param("si", $name, $user_id);
$stmt->execute();

$stmt2 = $conn->prepare("
INSERT INTO user_details (user_id, email, phone, region, province, city, barangay, street)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
email=VALUES(email),
phone=VALUES(phone),
region=VALUES(region),
province=VALUES(province),
city=VALUES(city),
barangay=VALUES(barangay),
street=VALUES(street)
");

$stmt2->bind_param("isssssss",
  $user_id, $email, $phone, $region, $province, $city, $barangay, $street
);

$stmt2->execute();

echo json_encode([
  "success" => true,
  "message" => "Updated"
]);