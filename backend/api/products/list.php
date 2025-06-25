<?php
/**
 * List Products Endpoint
 * 
 * This file handles listing all mortgage products.
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

require_once __DIR__ . '/../../models/Product.php';
require_once __DIR__ . '/../../utils/response.php';

// Get all products
$products = getAllProducts();

// Return success response
sendSuccess([
    'products' => $products
], 'Products retrieved successfully'); 