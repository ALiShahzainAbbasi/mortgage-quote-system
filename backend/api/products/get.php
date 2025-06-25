<?php
/**
 * Get Product Endpoint
 * 
 * This file handles retrieving a single mortgage product.
 */

 header("Access-Control-Allow-Origin: *");
 header("Access-Control-Allow-Headers: Content-Type");
 header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

require_once __DIR__ . '/../../models/Product.php';

// Get product ID from URL
$productId = isset($_GET['id']) ? (int) $_GET['id'] : 0;

if ($productId <= 0) {
    sendError('Invalid product ID');
}

// Get product
$product = getProductById($productId);

if (!$product) {
    sendNotFound('Product not found');
}

// Return success response
sendSuccess([
    'product' => $product
], 'Product retrieved successfully'); 