<?php
/**
 * Update Product Endpoint
 * 
 * This file handles updating an existing mortgage product.
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/validation.php';
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

// Get input data
$data = getJsonInput();
$data = sanitizeInput($data);

// Validate at least one field is provided
if (empty($data)) {
    sendError('No fields to update');
}

// Validate numeric fields if provided
$numericFields = [
    'max_income_multiple' => 'Maximum income multiple',
    'min_credit_score' => 'Minimum credit score',
    'min_deposit_percentage' => 'Minimum deposit percentage',
    'interest_rate' => 'Interest rate',
    'term_years' => 'Term years'
];

foreach ($numericFields as $field => $label) {
    if (isset($data[$field])) {
        if (!is_numeric($data[$field])) {
            sendError("$label must be a number");
        }
        
        // Convert to float or integer as appropriate
        if (in_array($field, ['max_income_multiple', 'min_deposit_percentage', 'interest_rate'])) {
            $data[$field] = (float) $data[$field];
        } else {
            $data[$field] = (int) $data[$field];
        }
    }
}

// Update product
$result = updateProduct($productId, $data);

if (!$result) {
    sendError('Failed to update product');
}

// Get the updated product
$product = getProductById($productId);

// Return success response
sendSuccess([
    'product' => $product
], 'Product updated successfully'); 