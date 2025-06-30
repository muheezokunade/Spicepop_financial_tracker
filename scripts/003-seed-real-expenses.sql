-- Clear existing data and insert real expenses
DELETE FROM expenses;
DELETE FROM sales;

-- Update categories with proper names and budgets
UPDATE categories SET name = 'Packaging', monthly_budget = 100000.00 WHERE name = 'Inventory';
UPDATE categories SET name = 'Logistics', monthly_budget = 50000.00 WHERE name = 'Transportation';
UPDATE categories SET name = 'Raw Materials', monthly_budget = 500000.00 WHERE name = 'Equipment';
UPDATE categories SET name = 'Asset', monthly_budget = 100000.00 WHERE name = 'Office Supplies';

-- Insert all the real expenses
INSERT INTO expenses (date, category, description, amount) VALUES
('2025-05-03', 'Packaging', 'Ziplock bag', 2500.00),
('2025-05-03', 'Packaging', 'Ziplock bag', 2500.00),
('2025-05-03', 'Packaging', 'Ziplock bag', 2000.00),
('2025-05-03', 'Packaging', 'Ziplock bag', 20000.00),
('2025-05-03', 'Packaging', 'Bottles', 4000.00),
('2025-05-03', 'Logistics', 'Delivery ibadan', 15000.00),
('2025-05-03', 'Raw Materials', 'chili pepper', 7000.00),
('2025-05-03', 'Raw Materials', 'Kilishi', 60000.00),
('2025-05-03', 'Asset', 'scale', 22000.00),
('2025-05-03', 'Asset', 'Seal Gun', 25000.00),
('2025-05-03', 'Raw Materials', 'Bag', 1000.00),
('2025-05-03', 'Packaging', 'Bottles', 4000.00),
('2025-05-03', 'Packaging', 'Seal nylon', 1000.00),
('2025-05-03', 'Raw Materials', 'chili pepper', 2000.00),
('2025-05-03', 'Raw Materials', 'Ginger', 13000.00),
('2025-05-03', 'Raw Materials', 'Garlic', 5000.00),
('2025-05-03', 'Raw Materials', 'Oninin Flakes', 5000.00),
('2025-05-03', 'Raw Materials', 'All Spice', 9000.00),
('2025-05-03', 'Raw Materials', 'Kulikuli', 10000.00),
('2025-05-03', 'Raw Materials', 'Coriander', 7000.00),
('2025-05-03', 'Raw Materials', 'Negro Pepper', 2000.00),
('2025-05-03', 'Raw Materials', 'Grinding', 2000.00),
('2025-05-03', 'Raw Materials', 'Clove', 10000.00),
('2025-05-03', 'Raw Materials', 'Dried Iru', 6000.00),
('2025-05-03', 'Raw Materials', 'African Nutmeg', 9000.00),
('2025-05-03', 'Logistics', 'Delivery from Ibadan', 5000.00),
('2025-05-03', 'Packaging', 'Seal Nylon', 3500.00),
('2025-05-03', 'Packaging', 'Carton', 25000.00),
('2025-05-03', 'Raw Materials', 'Catfish', 54500.00),
('2025-05-03', 'Raw Materials', 'Yam', 36000.00),
('2025-05-03', 'Raw Materials', '10kg Rice', 48000.00),
('2025-05-03', 'Raw Materials', '2 congo of Rice', 11000.00),
('2025-05-03', 'Raw Materials', 'Spagg', 38000.00),
('2025-05-03', 'Raw Materials', 'Beans', 42000.00),
('2025-05-03', 'Raw Materials', 'Veg.oil', 52000.00),
('2025-05-03', 'Raw Materials', 'Semo', 15600.00),
('2025-05-03', 'Raw Materials', 'Garri', 19200.00),
('2025-05-03', 'Raw Materials', 'Milo s', 10500.00),
('2025-05-03', 'Raw Materials', 'Milo b', 13400.00),
('2025-05-03', 'Raw Materials', 'Milk s', 12600.00),
('2025-05-03', 'Raw Materials', 'Milk b', 18600.00),
('2025-05-03', 'Raw Materials', '3-in-1 Custard', 23200.00),
('2025-05-03', 'Raw Materials', 'Knorr', 14000.00),
('2025-05-03', 'Raw Materials', 'Salt', 4200.00),
('2025-05-03', 'Raw Materials', 'Panla', 10000.00),
('2025-05-03', 'Raw Materials', 'Garri', 4800.00),
('2025-05-03', 'Raw Materials', 'Spagg', 10000.00),
('2025-06-03', 'Raw Materials', 'Paid myself', 6000.00),
('2025-06-10', 'Marketing', 'Data', 5000.00),
('2025-06-11', 'Marketing', 'Airtime', 500.00),
('2025-06-24', 'Marketing', 'Paid Ad', 2200.00),
('2025-06-28', 'Raw Materials', 'mummy''s salary', 5000.00);

-- Update category budgets based on actual spending patterns
UPDATE categories SET monthly_budget = 150000.00 WHERE name = 'Packaging';
UPDATE categories SET monthly_budget = 30000.00 WHERE name = 'Logistics';
UPDATE categories SET monthly_budget = 800000.00 WHERE name = 'Raw Materials';
UPDATE categories SET monthly_budget = 80000.00 WHERE name = 'Asset';
UPDATE categories SET monthly_budget = 20000.00 WHERE name = 'Marketing';
UPDATE categories SET monthly_budget = 50000.00 WHERE name = 'Utilities';
