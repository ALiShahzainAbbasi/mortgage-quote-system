<?php
/**
 * Mortgage System API
 * 
 * This is the main entry point for the API.
 */

// Load configuration files
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/utils/response.php';

// Set content type to JSON
header('Content-Type: application/json');

// Get the request method and URI
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove API prefix from URI
$uri = str_replace(API_PREFIX, '', $uri);

// Simple routing based on URI and method
switch ($uri) {
    case '/auth/login':
        if ($method === 'POST') {
            require __DIR__ . '/api/auth/login.php';
        } else {
            sendError('Method not allowed', 405);
        }
        break;
        
    case '/auth/register':
        if ($method === 'POST') {
            require __DIR__ . '/api/auth/register.php';
        } else {
            sendError('Method not allowed', 405);
        }
        break;
        
    case '/auth/logout':
        if ($method === 'POST') {
            require __DIR__ . '/api/auth/logout.php';
        } else {
            sendError('Method not allowed', 405);
        }
        break;
        
    case '/auth/profile':
        if ($method === 'GET') {
            require __DIR__ . '/api/auth/profile.php';
        } else {
            sendError('Method not allowed', 405);
        }
        break;
        
    case '/products':
        if ($method === 'GET') {
            require __DIR__ . '/api/products/list.php';
        } elseif ($method === 'POST') {
            require __DIR__ . '/api/products/create.php';
        } else {
            sendError('Method not allowed', 405);
        }
        break;
        
    case '/products/get':
        if ($method === 'GET') {
            require __DIR__ . '/api/products/get.php';
        } else {
            sendError('Method not allowed', 405);
        }
        break;
        
    case '/products/update':
        if ($method === 'PUT') {
            require __DIR__ . '/api/products/update.php';
        } else {
            sendError('Method not allowed', 405);
        }
        break;
        
    case '/products/delete':
        if ($method === 'DELETE') {
            require __DIR__ . '/api/products/delete.php';
        } else {
            sendError('Method not allowed', 405);
        }
        break;
        
    case '/quotes/calculate':
        if ($method === 'POST') {
            require __DIR__ . '/api/quotes/calculate.php';
        } else {
            sendError('Method not allowed', 405);
        }
        break;
        
    case '/quotes/save':
        if ($method === 'POST') {
            require __DIR__ . '/api/quotes/save.php';
        } else {
            sendError('Method not allowed', 405);
        }
        break;
        
    case '/quotes/compare':
        if ($method === 'GET') {
            require __DIR__ . '/api/quotes/compare.php';
        } else {
            sendError('Method not allowed', 405);
        }
        break;
        
    default:
        sendNotFound('Endpoint not found');
        break;
} 