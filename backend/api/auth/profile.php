<?php
/**
 * Profile Endpoint
 * 
 * This file handles retrieving the current user's profile.
 */

require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../models/User.php';

// Require authentication
$user = requireAuth();

// Get user data
$userData = getUserById($user['id']);

if (!$userData) {
    sendNotFound('User not found');
}

// Return success response
sendSuccess([
    'user' => [
        'id' => $userData['id'],
        'name' => $userData['name'],
        'email' => $userData['email'],
        'role' => $userData['role'],
        'created_at' => $userData['created_at']
    ]
], 'Profile retrieved successfully'); 