<?php
/**
 * Database Configuration
 * 
 * This file contains the database connection settings for the Mortgage System.
 */

// Database credentials
define('DB_HOST', 'localhost');
define('DB_NAME', 'mortgage_system');
define('DB_USER', 'root');
define('DB_PASS', 'root12345');

// Create database connection
function getDbConnection() {
    try {
        $conn = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
            DB_USER,
            DB_PASS,
            array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)
        );
        return $conn;
    } catch(PDOException $e) {
        // Log the error (in a production environment, don't expose the error details)
        error_log('Database connection failed: ' . $e->getMessage());
        return null;
    }
}

class Database {
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
                DB_USER,
                DB_PASS,
                array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)
            );
        } catch(PDOException $exception) {
            error_log("Connection error: " . $exception->getMessage());
        }
        return $this->conn;
    }
} 