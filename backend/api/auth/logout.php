<?php
/**
 * Logout Endpoint
 * 
 * This file handles user logout.
 */

require_once __DIR__ . '/../../middleware/auth.php';

// Require authentication
$user = requireAuth();

// In a real-world application, you might want to:
// 1. Blacklist the token
// 2. Clear any server-side sessions
// 3. Send a response to the client to clear local storage/cookies

// For this simple implementation, we'll just return a success response
sendSuccess(null, 'Logout successful'); 