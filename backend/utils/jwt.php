<?php
/**
 * JWT Utility
 * 
 * This file contains functions for handling JWT tokens.
 */

require_once __DIR__ . '/../config/config.php';

/**
 * Generate a JWT token
 * 
 * @param array $payload The data to encode in the token
 * @return string The generated JWT token
 */
function generateJWT($payload) {
    // Add standard claims
    $payload['iat'] = time(); // Issued at time
    $payload['exp'] = time() + JWT_EXPIRY; // Expiration time
    
    // Encode header
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $header = base64url_encode($header);
    
    // Encode payload
    $payload = json_encode($payload);
    $payload = base64url_encode($payload);
    
    // Create signature
    $signature = hash_hmac('sha256', "$header.$payload", JWT_SECRET, true);
    $signature = base64url_encode($signature);
    
    // Return the complete token
    return "$header.$payload.$signature";
}

/**
 * Verify a JWT token
 * 
 * @param string $token The JWT token to verify
 * @return array|false The decoded payload or false if invalid
 */
function verifyJWT($token) {
    // Split the token
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return false;
    }
    
    list($header, $payload, $signature) = $parts;
    
    // Verify signature
    $valid_signature = hash_hmac('sha256', "$header.$payload", JWT_SECRET, true);
    $valid_signature = base64url_encode($valid_signature);
    
    if ($signature !== $valid_signature) {
        return false;
    }
    
    // Decode payload
    $payload = base64url_decode($payload);
    $payload = json_decode($payload, true);
    
    // Check expiration
    if (isset($payload['exp']) && $payload['exp'] < time()) {
        return false;
    }
    
    return $payload;
}

/**
 * Base64URL encode
 * 
 * @param string $data The data to encode
 * @return string The encoded data
 */
function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

/**
 * Base64URL decode
 * 
 * @param string $data The data to decode
 * @return string The decoded data
 */
function base64url_decode($data) {
    return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
} 