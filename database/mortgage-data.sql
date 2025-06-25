-- Create Database


CREATE DATABASE IF NOT EXISTS mortgage_system;
USE mortgage_system;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'broker') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Mortgage Products Table
CREATE TABLE IF NOT EXISTS mortgage_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lender_name VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    max_income_multiple FLOAT NOT NULL,
    min_credit_score INT NOT NULL,
    min_deposit_percentage FLOAT NOT NULL,
    employment_type VARCHAR(255),
    interest_rate FLOAT NOT NULL,
    term_years INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Mortgage Quotes Table
CREATE TABLE IF NOT EXISTS mortgage_quotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    income FLOAT NOT NULL,
    outgoings FLOAT NOT NULL,
    loan_amount FLOAT NOT NULL,
    monthly_payment FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES mortgage_products(id) ON DELETE CASCADE
);
  
-- Create Saved Quotes Table
CREATE TABLE IF NOT EXISTS saved_quotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    annual_income DECIMAL(12, 2) NOT NULL,
    deposit_amount DECIMAL(12, 2) NOT NULL,
    property_value DECIMAL(12, 2) NOT NULL,
    loan_amount DECIMAL(12, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    term_years INT NOT NULL,
    monthly_payment DECIMAL(12, 2) NOT NULL,
    total_interest DECIMAL(12, 2) NOT NULL,
    total_payment DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES mortgage_products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE saved_comparisons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    comparison_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE saved_eligible_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    input_data JSON NOT NULL,
    products JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Dummy Users
INSERT INTO users (name, email, password, role) VALUES
('John Doe', 'john@example.com', '$2y$10$e8C1fhUszEjG96PdTFiUKO2lURaOv/Cuc67nMXRnygkDEu6/Akkuq', 'customer'), -- Password: 12345678
('Jane Smith', 'jane@example.com', '$2y$10$e8C1fhUszEjG96PdTFiUKO2lURaOv/Cuc67nMXRnygkDEu6/Akkuq', 'customer'), -- Password: 12345678
('Broker Admin', 'broker@example.com', '$2y$10$e8C1fhUszEjG96PdTFiUKO2lURaOv/Cuc67nMXRnygkDEu6/Akkuq', 'broker'); -- Password: 12345678

-- Insert Dummy Mortgage Products
INSERT INTO mortgage_products (lender_name, product_name, max_income_multiple, min_credit_score, min_deposit_percentage, employment_type, interest_rate, term_years) VALUES
('Blue Bank', 'First Time Buyer Special', 4.5, 650, 10.0, 'Full-time', 3.2, 25),
('Green Mortgage Co.', 'Eco-Friendly Mortgage', 5.0, 620, 15.0, 'Full-time', 2.9, 30),
('Safe Lenders', 'Secure Plus Plan', 4.0, 700, 20.0, 'Part-time', 3.5, 20);

INSERT INTO mortgage_products
(lender_name, product_name, max_income_multiple, min_credit_score, min_deposit_percentage, employment_type, interest_rate, term_years, created_at)
VALUES
('HomeFirst Bank', 'Starter Mortgage', 4, 600, 10, 'Full-time', 3.2, 25, NOW()),
('Trusty Loans', 'Family Plan', 5, 650, 15, 'Full-time', 2.8, 30, NOW()),
('Urban Finance', 'City Saver', 4.5, 620, 12, 'Part-time', 3.0, 20, NOW()),
('Secure Homes', 'Safe Path', 6, 700, 8, 'Full-time', 2.5, 25, NOW());

-- Insert Dummy Mortgage Quotes
INSERT INTO mortgage_quotes (user_id, product_id, income, outgoings, loan_amount, monthly_payment) VALUES
(1, 1, 45000, 1200, 180000, 850),
(1, 2, 45000, 1200, 200000, 950),
(2, 3, 55000, 1500, 220000, 1100);

-- Insert Dummy Saved Quotes
INSERT INTO saved_quotes (user_id, quote_id, is_favorite) VALUES
(1, 1, TRUE),  -- John saved his first quote as favorite
(1, 2, FALSE), -- John saved his second quote
(2, 3, TRUE);  -- Jane saved her quote as favorite

SELECT * from users;
SELECT * from mortgage_products;
SELECT * from mortgage_quotes;
SELECT * from saved_quotes;

ALTER TABLE saved_quotes MODIFY COLUMN product_id INT NULL;



