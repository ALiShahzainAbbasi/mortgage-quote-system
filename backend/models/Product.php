<?php
/**
 * Product Model
 * 
 * This file contains functions for mortgage product-related operations.
 */

require_once __DIR__ . '/../config/database.php';

/**
 * Get all mortgage products
 * 
 * @return array Array of mortgage products
 */
function getAllProducts() {
    $db = getDbConnection();
    if (!$db) {
        return [];
    }
    
    $stmt = $db->prepare('SELECT * FROM mortgage_products ORDER BY created_at DESC');
    $stmt->execute();
    
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

/**
 * Get a mortgage product by ID
 * 
 * @param int $id The product ID
 * @return array|false The product data or false if not found
 */
function getProductById($id) {
    $db = getDbConnection();
    if (!$db) {
        return false;
    }
    
    $stmt = $db->prepare('SELECT * FROM mortgage_products WHERE id = ?');
    $stmt->execute([$id]);
    
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

/**
 * Create a new mortgage product
 * 
 * @param array $data The product data
 * @return int|false The new product ID or false on failure
 */
function createProduct($data) {
    $db = getDbConnection();
    if (!$db) {
        return false;
    }
    
    $sql = 'INSERT INTO mortgage_products (
        lender_name, 
        product_name, 
        max_income_multiple, 
        min_credit_score, 
        min_deposit_percentage, 
        employment_type, 
        interest_rate, 
        term_years
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
    $stmt = $db->prepare($sql);
    $result = $stmt->execute([
        $data['lender_name'],
        $data['product_name'],
        $data['max_income_multiple'],
        $data['min_credit_score'],
        $data['min_deposit_percentage'],
        $data['employment_type'],
        $data['interest_rate'],
        $data['term_years']
    ]);
    
    if ($result) {
        return $db->lastInsertId();
    }
    
    return false;
}

/**
 * Update a mortgage product
 * 
 * @param int $id The product ID
 * @param array $data The product data to update
 * @return bool Whether the update was successful
 */
function updateProduct($id, $data) {
    $db = getDbConnection();
    if (!$db) {
        return false;
    }
    
    $allowedFields = [
        'lender_name', 
        'product_name', 
        'max_income_multiple', 
        'min_credit_score', 
        'min_deposit_percentage', 
        'employment_type', 
        'interest_rate', 
        'term_years'
    ];
    
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
    $sql = 'UPDATE mortgage_products SET ' . implode(', ', $updates) . ' WHERE id = ?';
    
    $stmt = $db->prepare($sql);
    return $stmt->execute($params);
}

/**
 * Delete a mortgage product
 * 
 * @param int $id The product ID
 * @return bool Whether the deletion was successful
 */
function deleteProduct($id) {
    $db = getDbConnection();
    if (!$db) {
        return false;
    }
    
    $stmt = $db->prepare('DELETE FROM mortgage_products WHERE id = ?');
    return $stmt->execute([$id]);
}

/**
 * Check if a product exists
 * 
 * @param int $id The product ID
 * @return bool Whether the product exists
 */
function productExists($id) {
    $db = getDbConnection();
    if (!$db) {
        return false;
    }
    
    $stmt = $db->prepare('SELECT COUNT(*) FROM mortgage_products WHERE id = ?');
    $stmt->execute([$id]);
    
    return $stmt->fetchColumn() > 0;
} 