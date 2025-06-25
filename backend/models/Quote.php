<?php
/**
 * Quote Model
 * 
 * This file contains functions for mortgage quote-related operations.
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/Product.php';

class Quote {
    private $conn;
    private $table_name = "saved_quotes";
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function calculateQuote($data) {
        // If product_id is not set or is null, use a default interest rate
        if (!isset($data->product_id) || $data->product_id === null) {
            $interest_rate = 5.0; // Default interest rate
        } else {
            // Get product details
            $product_query = "SELECT interest_rate FROM mortgage_products WHERE id = ?";
            $stmt = $this->conn->prepare($product_query);
            $stmt->execute([$data->product_id]);
            $product = $stmt->fetch(PDO::FETCH_ASSOC);
            if(!$product) {
                return array("success" => false, "message" => "Product not found");
            }
            $interest_rate = $product['interest_rate'];
        }
        // Calculate loan amount
        $loan_amount = $data->property_value - $data->deposit_amount;
        // Calculate monthly interest rate
        $monthly_rate = ($interest_rate / 100) / 12;
        // Calculate number of payments
        $num_payments = $data->term_years * 12;
        // Calculate monthly payment using the mortgage payment formula
        if ($monthly_rate > 0 && $num_payments > 0) {
            $monthly_payment = $loan_amount * ($monthly_rate * pow(1 + $monthly_rate, $num_payments)) / (pow(1 + $monthly_rate, $num_payments) - 1);
        } else {
            $monthly_payment = $loan_amount / $num_payments;
        }
        // Calculate total payment and interest
        $total_payment = $monthly_payment * $num_payments;
        $total_interest = $total_payment - $loan_amount;
        return array(
            "success" => true,
            "data" => array(
                "loan_amount" => $loan_amount,
                "monthly_payment" => $monthly_payment,
                "total_interest" => $total_interest,
                "total_payment" => $total_payment,
                "term_years" => $data->term_years,
                "interest_rate" => $interest_rate
            )
        );
    }
    
    public function saveQuote($user_id, $quote_data) {
        $query = "INSERT INTO " . $this->table_name . "
                (user_id, product_id, annual_income, deposit_amount, property_value,
                loan_amount, interest_rate, term_years, monthly_payment, total_interest,
                total_payment, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
        
        $stmt = $this->conn->prepare($query);
        $result = $stmt->execute([
            $user_id,
            $quote_data->product_id,
            $quote_data->annual_income,
            $quote_data->deposit_amount,
            $quote_data->property_value,
            $quote_data->loan_amount,
            $quote_data->interest_rate,
            $quote_data->term_years,
            $quote_data->monthly_payment,
            $quote_data->total_interest,
            $quote_data->total_payment
        ]);
        
        if($result) {
            return array(
                "success" => true,
                "message" => "Quote saved successfully",
                "quote_id" => $this->conn->lastInsertId()
            );
        }
        
        return array(
            "success" => false,
            "message" => "Unable to save quote"
        );
    }
    
    public function getUserQuotes($user_id) {
        $query = "SELECT q.*, p.product_name as product_name 
                FROM " . $this->table_name . " q
                LEFT JOIN mortgage_products p ON q.product_id = p.id
                WHERE q.user_id = ?
                ORDER BY q.created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$user_id]);
        $quotes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return array(
            "success" => true,
            "data" => $quotes
        );
    }
    
    public function getQuoteById($quote_id, $user_id) {
        $query = "SELECT q.*, p.product_name as product_name 
                FROM " . $this->table_name . " q
                LEFT JOIN mortgage_products p ON q.product_id = p.id
                WHERE q.id = ? AND q.user_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$quote_id, $user_id]);
        $quote = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if(!$quote) {
            return array(
                "success" => false,
                "message" => "Quote not found"
            );
        }
        
        return array(
            "success" => true,
            "data" => $quote
        );
    }
    
    public function deleteQuote($quote_id, $user_id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ? AND user_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $result = $stmt->execute([$quote_id, $user_id]);
        
        if($result) {
            return array(
                "success" => true,
                "message" => "Quote deleted successfully"
            );
        }
        
        return array(
            "success" => false,
            "message" => "Unable to delete quote"
        );
    }
    
    public function compareQuotes($quote_ids, $user_id) {
        $placeholders = str_repeat('?,', count($quote_ids) - 1) . '?';
        $query = "SELECT q.*, p.product_name as product_name 
                FROM " . $this->table_name . " q
                LEFT JOIN mortgage_products p ON q.product_id = p.id
                WHERE q.id IN ($placeholders) AND q.user_id = ?";
        
        $params = array_merge($quote_ids, array($user_id));
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        $quotes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if(count($quotes) < 2) {
            return array(
                "success" => false,
                "message" => "Not enough quotes to compare"
            );
        }
        
        return array(
            "success" => true,
            "data" => $quotes
        );
    }
    
    public function updateQuote($quote_id, $user_id, $quote_data) {
        $query = "UPDATE " . $this->table_name . "
                  SET annual_income = ?, deposit_amount = ?, property_value = ?, term_years = ?,
                      loan_amount = ?, interest_rate = ?, monthly_payment = ?, total_interest = ?, total_payment = ?, updated_at = NOW()
                  WHERE id = ? AND user_id = ?";
        $stmt = $this->conn->prepare($query);
        $result = $stmt->execute([
            $quote_data->annual_income,
            $quote_data->deposit_amount,
            $quote_data->property_value,
            $quote_data->term_years,
            $quote_data->loan_amount,
            $quote_data->interest_rate,
            $quote_data->monthly_payment,
            $quote_data->total_interest,
            $quote_data->total_payment,
            $quote_id,
            $user_id
        ]);
        if ($result) {
            return ["success" => true, "message" => "Quote updated successfully"];
        }
        return ["success" => false, "message" => "Unable to update quote"];
    }
}
?> 