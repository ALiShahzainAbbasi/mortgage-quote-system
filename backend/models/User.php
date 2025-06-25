<?php
/**
 * User Model
 * 
 * This file contains functions for user-related operations.
 */

require_once __DIR__ . '/../config/database.php';

/**
 * Get a user by ID
 * 
 * @param int $id The user ID
 * @return array|false The user data or false if not found
 */
function getUserById($id) {
    $db = getDbConnection();
    if (!$db) {
        return false;
    }
    
    $stmt = $db->prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?');
    $stmt->execute([$id]);
    
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

/**
 * Get a user by email
 * 
 * @param string $email The user email
 * @return array|false The user data or false if not found
 */
function getUserByEmail($email) {
    $db = getDbConnection();
    if (!$db) {
        return false;
    }
    
    $stmt = $db->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$email]);
    
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

/**
 * Create a new user
 * 
 * @param string $name The user name
 * @param string $email The user email
 * @param string $password The user password
 * @param string $role The user role (default: 'customer')
 * @return int|false The new user ID or false on failure
 */
function createUser($name, $email, $password, $role = 'customer') {
    $db = getDbConnection();
    if (!$db) {
        return false;
    }
    
    // Check if email already exists
    if (getUserByEmail($email)) {
        return false;
    }
    
    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $db->prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
    $result = $stmt->execute([$name, $email, $hashedPassword, $role]);
    
    if ($result) {
        return $db->lastInsertId();
    } else {
        error_log('User insert failed: ' . implode(' | ', $stmt->errorInfo()));
    }
    
    return false;
}

/**
 * Verify user credentials
 * 
 * @param string $email The user email
 * @param string $password The user password
 * @return array|false The user data or false if credentials are invalid
 */
function verifyCredentials($email, $password) {
    $user = getUserByEmail($email);
    
    if (!$user) {
        return false;
    }
    
    if (!password_verify($password, $user['password'])) {
        return false;
    }
    
    // Remove password from user data
    unset($user['password']);
    
    return $user;
}

/**
 * Update user profile
 * 
 * @param int $id The user ID
 * @param array $data The user data to update
 * @return bool Whether the update was successful
 */
function updateUser($id, $data) {
    $db = getDbConnection();
    if (!$db) {
        return false;
    }
    
    $allowedFields = ['name', 'email'];
    $updates = [];
    $params = [];
    
    foreach ($data as $field => $value) {
        if (in_array($field, $allowedFields)) {
            $updates[] = "$field = ?";
            $params[] = $value;
        }
    }
    
    if (empty($updates)) {
        return false;
    }
    
    $params[] = $id;
    $sql = 'UPDATE users SET ' . implode(', ', $updates) . ' WHERE id = ?';
    
    $stmt = $db->prepare($sql);
    return $stmt->execute($params);
} 