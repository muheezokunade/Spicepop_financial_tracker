-- Seed initial data with zero values for fresh start

-- Insert categories with zero budgets
INSERT INTO categories (name, monthly_budget) VALUES
('Inventory', 0.00),
('Marketing', 0.00),
('Utilities', 0.00),
('Packaging', 0.00),
('Transportation', 0.00),
('Equipment', 0.00),
('Office Supplies', 0.00)
ON CONFLICT (name) DO UPDATE SET
monthly_budget = 0.00,
updated_at = CURRENT_TIMESTAMP;

-- Insert sample products (you can modify these as needed)
INSERT INTO products (name, sku, category, supplier, unit_price, quantity_in_stock) VALUES
('Paprika Powder', 'PP001', 'Spices', 'Spice World', 5200.00, 0),
('Cinnamon Sticks', 'CS002', 'Spices', 'Spice World', 3600.00, 0),
('Turmeric Powder', 'TP003', 'Spices', 'Golden Spice Co', 6400.00, 0),
('Black Pepper', 'BP004', 'Spices', 'Pepper Plus', 7600.00, 0),
('Cumin Seeds', 'CU005', 'Spices', 'Spice World', 4400.00, 0)
ON CONFLICT (sku) DO UPDATE SET
quantity_in_stock = 0,
updated_at = CURRENT_TIMESTAMP;

-- Clear any existing sales and expenses for fresh start
DELETE FROM sales;
DELETE FROM expenses;
