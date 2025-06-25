<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';
include_once '../models/Quote.php';

$database = new Database();
$db = $database->getConnection();
if (!$db) {
    die(json_encode(["success" => false, "message" => "Database connection failed."]));
}

$quote = new Quote($db);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if(isset($data->action)) {
            switch($data->action) {
                case 'calculate':
                    if(!isset($data->product_id) || !isset($data->annual_income) || 
                       !isset($data->deposit_amount) || !isset($data->property_value) || 
                       !isset($data->term_years)) {
                        http_response_code(400);
                        echo json_encode(array("message" => "Missing required fields"));
                        exit();
                    }
                    
                    $result = $quote->calculateQuote($data);
                    echo json_encode($result);
                    break;
                    
                case 'save':
                    if(!isset($data->user_id) || !isset($data->quote_data)) {
                        http_response_code(400);
                        echo json_encode(array("message" => "Missing required fields"));
                        exit();
                    }
                    // If calculated fields are missing, calculate them
                    $qd = $data->quote_data;
                    if (
                        !isset($qd->loan_amount) ||
                        !isset($qd->interest_rate) ||
                        !isset($qd->monthly_payment) ||
                        !isset($qd->total_interest) ||
                        !isset($qd->total_payment)
                    ) {
                        // Calculate quote using the backend logic
                        $calcResult = $quote->calculateQuote($qd);
                        if (!$calcResult['success']) {
                            http_response_code(400);
                            echo json_encode(array("message" => $calcResult['message']));
                            exit();
                        }
                        // Merge calculated fields into quote_data
                        foreach ($calcResult['data'] as $key => $value) {
                            $qd->$key = $value;
                        }
                    }
                    if (!isset($qd->product_id)) {
                        $qd->product_id = null;
                    }
                    $result = $quote->saveQuote($data->user_id, $qd);
                    echo json_encode($result);
                    break;
                    
                case 'compare':
                    if(!isset($data->user_id) || !isset($data->quote_ids) || 
                       !is_array($data->quote_ids) || count($data->quote_ids) < 2) {
                        http_response_code(400);
                        echo json_encode(array("message" => "Invalid quote IDs for comparison"));
                        exit();
                    }
                    
                    $result = $quote->compareQuotes($data->quote_ids, $data->user_id);
                    echo json_encode($result);
                    break;
                    
                case 'eligible_products':
                    if(!isset($data->annual_income) || !isset($data->deposit_amount) || !isset($data->property_value) || !isset($data->term_years)) {
                        http_response_code(400);
                        echo json_encode(array("message" => "Missing required fields"));
                        exit();
                    }
                    require_once __DIR__ . '/../models/Product.php';
                    $allProducts = getAllProducts();
                    $eligibleProducts = [];
                    foreach ($allProducts as $product) {
                        // Eligibility checks
                        $minDeposit = ($product['min_deposit_percentage'] / 100) * $data->property_value;
                        $maxLoan = $data->annual_income * $product['max_income_multiple'];
                        $loanAmount = $data->property_value - $data->deposit_amount;
                        if (
                            $data->deposit_amount >= $minDeposit &&
                            $loanAmount <= $maxLoan
                        ) {
                            // Calculate mortgage details
                            $monthlyRate = ($product['interest_rate'] / 100) / 12;
                            $numPayments = $data->term_years * 12;
                            if ($monthlyRate > 0 && $numPayments > 0) {
                                $monthlyPayment = $loanAmount * ($monthlyRate * pow(1 + $monthlyRate, $numPayments)) / (pow(1 + $monthlyRate, $numPayments) - 1);
                            } else {
                                $monthlyPayment = $loanAmount / $numPayments;
                            }
                            $totalPayment = $monthlyPayment * $numPayments;
                            $totalInterest = $totalPayment - $loanAmount;
                            $eligibleProducts[] = array(
                                "product_id" => $product['id'],
                                "product_name" => $product['product_name'],
                                "lender_name" => $product['lender_name'],
                                "interest_rate" => $product['interest_rate'],
                                "loan_amount" => $loanAmount,
                                "monthly_payment" => $monthlyPayment,
                                "total_interest" => $totalInterest,
                                "total_payment" => $totalPayment,
                                "term_years" => $data->term_years
                            );
                        }
                    }
                    echo json_encode(["success" => true, "data" => $eligibleProducts]);
                    break;
                    
                case 'save_comparison':
                    if (!isset($data->user_id) || !isset($data->comparison_data) || !is_array($data->comparison_data) || count($data->comparison_data) === 0) {
                        http_response_code(400);
                        echo json_encode(["success" => false, "message" => "Missing or invalid comparison data."]);
                        exit();
                    }
                    // Save comparison as JSON
                    $user_id = $data->user_id;
                    $comparison_data = json_encode($data->comparison_data);
                    $db = $database->getConnection();
                    $stmt = $db->prepare("INSERT INTO saved_comparisons (user_id, comparison_data, created_at) VALUES (?, ?, NOW())");
                    $result = $stmt->execute([$user_id, $comparison_data]);
                    if ($result) {
                        echo json_encode(["success" => true, "message" => "Comparison saved successfully."]);
                    } else {
                        echo json_encode(["success" => false, "message" => "Failed to save comparison."]);
                    }
                    break;
                    
                case 'save_eligible_products':
                    if (!isset($data->user_id) || !isset($data->input_data) || !isset($data->products) || !is_array($data->products)) {
                        http_response_code(400);
                        echo json_encode(["success" => false, "message" => "Missing or invalid data."]);
                        exit();
                    }
                    $user_id = $data->user_id;
                    $input_data = json_encode($data->input_data);
                    $products = json_encode($data->products);
                    $db = $database->getConnection();
                    $stmt = $db->prepare("INSERT INTO saved_eligible_products (user_id, input_data, products, created_at) VALUES (?, ?, ?, NOW())");
                    $result = $stmt->execute([$user_id, $input_data, $products]);
                    if ($result) {
                        echo json_encode(["success" => true, "message" => "Eligible products saved successfully."]);
                    } else {
                        echo json_encode(["success" => false, "message" => "Failed to save eligible products."]);
                    }
                    break;
                    
                default:
                    http_response_code(400);
                    echo json_encode(array("message" => "Invalid action"));
                    break;
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Action is required"));
        }
        break;
        
    case 'GET':
        if(isset($_GET['user_id'])) {
            if(isset($_GET['action']) && $_GET['action'] === 'get_eligible_products') {
                $user_id = $_GET['user_id'];
                $db = $database->getConnection();
                $stmt = $db->prepare("SELECT * FROM saved_eligible_products WHERE user_id = ? ORDER BY created_at DESC");
                $stmt->execute([$user_id]);
                $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode(["success" => true, "data" => $rows]);
            } else if(isset($_GET['quote_id'])) {
                $result = $quote->getQuoteById($_GET['quote_id'], $_GET['user_id']);
                echo json_encode($result);
            } else {
                $result = $quote->getUserQuotes($_GET['user_id']);
                echo json_encode($result);
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "User ID is required"));
        }
        break;
        
    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        
        if(!isset($data->quote_id) || !isset($data->user_id)) {
            http_response_code(400);
            echo json_encode(array("message" => "Quote ID and User ID are required"));
            exit();
        }
        
        $result = $quote->deleteQuote($data->quote_id, $data->user_id);
        echo json_encode($result);
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->quote_id) || !isset($data->user_id) || !isset($data->quote_data)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Missing required fields"]);
            exit();
        }
        // Calculate fields if needed
        $qd = $data->quote_data;
        if (
            !isset($qd->loan_amount) ||
            !isset($qd->interest_rate) ||
            !isset($qd->monthly_payment) ||
            !isset($qd->total_interest) ||
            !isset($qd->total_payment)
        ) {
            require_once __DIR__ . '/../models/Quote.php';
            $quoteModel = new Quote($db);
            $calcResult = $quoteModel->calculateQuote($qd);
            if (!$calcResult['success']) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => $calcResult['message']]);
                exit();
            }
            foreach ($calcResult['data'] as $key => $value) {
                $qd->$key = $value;
            }
        }
        // Update the quote
        require_once __DIR__ . '/../models/Quote.php';
        $quoteModel = new Quote($db);
        $result = $quoteModel->updateQuote($data->quote_id, $data->user_id, $qd);
        echo json_encode($result);
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed"));
        break;
}
?> 