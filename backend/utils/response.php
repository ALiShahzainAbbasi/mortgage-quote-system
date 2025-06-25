<?php
/**
 * Response Utility
 * 
 * This file contains functions for generating standardized API responses.
 */

/**
 * Send a success response
 * 
 * @param mixed $data The data to send
 * @param string $message Optional success message
 * @param int $statusCode HTTP status code (default: 200)
 * @return void
 */
function sendSuccess($data, $message = 'Success', $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode([
        'success' => true,
        'message' => $message,
        'data' => $data
    ]);
    exit();
}

/**
 * Send an error response
 * 
 * @param string $message Error message
 * @param int $statusCode HTTP status code (default: 400)
 * @param mixed $errors Optional additional error details
 * @return void
 */
function sendError($message, $statusCode = 400, $errors = null) {
    http_response_code($statusCode);
    echo json_encode([
        'success' => false,
        'message' => $message,
        'errors' => $errors
    ]);
    exit();
}

/**
 * Send a not found response
 * 
 * @param string $message Optional custom message
 * @return void
 */
function sendNotFound($message = 'Resource not found') {
    sendError($message, 404);
}

/**
 * Send an unauthorized response
 * 
 * @param string $message Optional custom message
 * @return void
 */
function sendUnauthorized($message = 'Unauthorized access') {
    sendError($message, 401);
}

/**
 * Send a forbidden response
 * 
 * @param string $message Optional custom message
 * @return void
 */
function sendForbidden($message = 'Access forbidden') {
    sendError($message, 403);
} 