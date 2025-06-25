<?php
/**
 * Delete Product Endpoint
 * 
 * This file handles deleting an existing mortgage product.
 */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../models/Product.php';

// Require admin authentication
$user = requireAdmin();

// Get product ID from URL
$productId = isset($_GET['id']) ? (int) $_GET['id'] : 0;

if ($productId <= 0) {
    sendError('Invalid product ID');
}

// Check if product exists
if (!productExists($productId)) {
    sendNotFound('Product not found');
}

// Delete product
$result = deleteProduct($productId);

if (!$result) {
    sendError('Failed to delete product');
}

// Return success response
sendSuccess(null, 'Product deleted successfully'); 