<?php
/**
 * Register Endpoint
 * 
 * This file handles user registration.
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../../utils/validation.php';
require_once __DIR__ . '/../../models/User.php';
require_once __DIR__ . '/../../utils/response.php';

// Get input data
$data = getJsonInput();
$data = sanitizeInput($data);

// Validate required fields
$required = ['name', 'email', 'password'];
$missing = validateRequired($data, $required);

if (!empty($missing)) {
    sendError('Missing required fields: ' . implode(', ', $missing));
}

// Validate email
if (!validateEmail($data['email'])) {
    sendError('Invalid email format');
}

// Validate password
if (!validatePassword($data['password'])) {
    sendError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
}

// Create user
$userId = createUser($data['name'], $data['email'], $data['password']);

if (!$userId) {
    sendError('Email already exists or registration failed');
}

// Get user data
$user = getUserById($userId);

// Return success response
sendSuccess([
    'user' => [
        'id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role']
    ]
], 'Registration successful', 201); 