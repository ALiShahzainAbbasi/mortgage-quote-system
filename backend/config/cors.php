<?php
/**
 * CORS Configuration
 * 
 * This file handles Cross-Origin Resource Sharing (CORS) for the API.
 */

// Allow requests from your frontend domain
$allowedOrigins = [
    'http://localhost:5173', // Vite default port
    'http://localhost:3000', // Alternative port
];

// Get the origin of the request
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Check if the origin is allowed
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}

// Allow credentials (cookies, authorization headers, etc.)
header('Access-Control-Allow-Credentials: true');

// Allow specific HTTP methods
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

// Allow specific headers
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Return early for preflight requests
    http_response_code(200);
    exit();
} 