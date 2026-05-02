<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost","root","","fuku");

if($conn->connect_error){
    die(json_encode(["error"=>"Database connection failed"]));
}

$products = [];

$productResult = $conn->query("SELECT * FROM products");

while($product = $productResult->fetch_assoc()){

    $product_id = $product["id"];


    $sizes = [];
    $sizeResult = $conn->query("SELECT size FROM product_sizes WHERE product_id = $product_id");

    while($row = $sizeResult->fetch_assoc()){
        $sizes[] = $row["size"];
    }


    $colors = [];
    $colorResult = $conn->query("SELECT color FROM product_colors WHERE product_id = $product_id");

    while($row = $colorResult->fetch_assoc()){
        $colors[] = $row["color"];
    }


    $product["sizes"] = $sizes;
    $product["colors"] = $colors;

    $products[] = $product;
}

echo json_encode($products);

$conn->close();

?>