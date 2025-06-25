<?php
require_once __DIR__ . '/../../config/config.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Login Endpoint
 * 
 * This file handles user login.
 */

require_once __DIR__ . '/../../utils/validation.php';
require_once __DIR__ . '/../../utils/jwt.php';
require_once __DIR__ . '/../../models/User.php';
require_once __DIR__ . '/../../utils/response.php';

// Get input data
$data = getJsonInput();
$data = sanitizeInput($data);

// Validate required fields
$required = ['email', 'password'];
$missing = validateRequired($data, $required);

if (!empty($missing)) {
    sendError('Missing required fields: ' . implode(', ', $missing));
}

// Validate email
if (!validateEmail($data['email'])) {
    sendError('Invalid email format');
}

// Verify credentials
$user = verifyCredentials($data['email'], $data['password']);

if (!$user) {
    sendError('Invalid email or password', 401);
}

// Generate JWT token
$token = generateJWT([
    'id' => $user['id'],
    'email' => $user['email'],
    'role' => $user['role']
]);

// Return success response with token
sendSuccess([
    'token' => $token,
    'user' => [
        'id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role']
    ]
], 'Login successful'); 