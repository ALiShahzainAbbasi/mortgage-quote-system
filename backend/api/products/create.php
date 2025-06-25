<?php
/**
 * Create Product Endpoint
 * 
 * This file handles creating a new mortgage product.
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
require_once __DIR__ . '/../../utils/response.php';

// Require admin authentication
$user = requireAdmin();

// Get input data
$data = getJsonInput();
$data = sanitizeInput($data);

// Validate required fields
$required = [
    'lender_name', 
    'product_name', 
    'max_income_multiple', 
    'min_credit_score', 
    'min_deposit_percentage', 
    'employment_type', 
    'interest_rate', 
    'term_years'
];
$missing = validateRequired($data, $required);

if (!empty($missing)) {
    sendError('Missing required fields: ' . implode(', ', $missing));
}

// Validate numeric fields
$numericFields = [
    'max_income_multiple' => 'Maximum income multiple',
    'min_credit_score' => 'Minimum credit score',
    'min_deposit_percentage' => 'Minimum deposit percentage',
    'interest_rate' => 'Interest rate',
    'term_years' => 'Term years'
];

foreach ($numericFields as $field => $label) {
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

// Create product
$productId = createProduct($data);

if (!$productId) {
    sendError('Failed to create product');
}

// Get the created product
$product = getProductById($productId);

// Return success response
sendSuccess([
    'product' => $product
], 'Product created successfully', 201); 