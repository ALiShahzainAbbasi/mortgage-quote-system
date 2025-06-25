<?php
/**
 * Authentication Middleware
 * 
 * This file contains functions for authenticating requests.
 */

require_once __DIR__ . '/../utils/jwt.php';
require_once __DIR__ . '/../utils/response.php';

/**
 * Get the authorization header
 * 
 * @return string|null The authorization header or null if not found
 */
function getAuthorizationHeader() {
    $headers = null;
    
    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER['Authorization']);
    } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER['HTTP_AUTHORIZATION']);
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        $requestHeaders = array_combine(
            array_map('ucwords', array_keys($requestHeaders)),
            array_values($requestHeaders)
        );
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }
    
    return $headers;
}

/**
 * Get the bearer token from the authorization header
 * 
 * @return string|null The bearer token or null if not found
 */
function getBearerToken() {
    $headers = getAuthorizationHeader();
    
    if (!empty($headers)) {
        if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
            return $matches[1];
        }
    }
    
    return null;
}

/**
 * Authenticate the request
 * 
 * @return array|false The user data or false if not authenticated
 */
function authenticate() {
    $token = getBearerToken();
    
    if (!$token) {
        return false;
    }
    
    $payload = verifyJWT($token);
    
    if (!$payload) {
        return false;
    }
    
    return $payload;
}

/**
 * Require authentication for the request
 * 
 * @return array The user data
 */
function requireAuth() {
    $user = authenticate();
    
    if (!$user) {
        sendUnauthorized('Authentication required');
    }
    
    return $user;
}

/**
 * Require admin role for the request
 * 
 * @return array The user data
 */
function requireAdmin() {
    $user = requireAuth();
    if ($user['role'] !== 'admin' && $user['role'] !== 'broker') {
        sendUnauthorized('You do not have permission to perform this action.');
        exit;
    }
    return $user;
} 