<?php
/**
 * General Configuration
 * 
 * This file contains general configuration settings for the Mortgage System.
 */

// Application settings
define('APP_NAME', 'Mortgage System');
define('APP_VERSION', '1.0.0');
define('APP_ENV', 'development'); // 'development' or 'production'

// JWT settings for authentication
define('JWT_SECRET', 'your_super_secret_key_here');
define('JWT_EXPIRY', 60 * 60 * 24); // 1 day, or whatever you want

// API settings
define('API_VERSION', 'v1');
define('API_PREFIX', '/api/' . API_VERSION);

// Error reporting
if (APP_ENV === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Time zone
date_default_timezone_set('UTC');

// Session settings
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', APP_ENV === 'production' ? 1 : 0); 