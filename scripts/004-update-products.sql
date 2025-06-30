-- Update products with more realistic spice business inventory
UPDATE products SET 
  name = 'Spice Mix - Hot Pepper Blend',
  category = 'Finished Products',
  quantity_in_stock = 25,
  unit_price = 1500.00
WHERE sku = 'PP001';

UPDATE products SET 
  name = 'Spice Mix - Suya Spice',
  category = 'Finished Products', 
  quantity_in_stock = 30,
  unit_price = 2000.00
WHERE sku = 'CS002';

UPDATE products SET 
  name = 'Spice Mix - Curry Blend',
  category = 'Finished Products',
  quantity_in_stock = 20,
  unit_price = 1800.00
WHERE sku = 'TP003';

UPDATE products SET 
  name = 'Spice Mix - Pepper Soup Spice',
  category = 'Finished Products',
  quantity_in_stock = 15,
  unit_price = 2500.00
WHERE sku = 'BP004';

UPDATE products SET 
  name = 'Spice Mix - Jollof Rice Seasoning',
  category = 'Finished Products',
  quantity_in_stock = 40,
  unit_price = 1200.00
WHERE sku = 'CU005';

-- Add some new products based on the raw materials purchased
INSERT INTO products (name, sku, category, supplier, unit_price, quantity_in_stock) VALUES
('Kilishi - Beef Jerky', 'KL001', 'Finished Products', 'Local Supplier', 3000.00, 12),
('Dried Fish Seasoning', 'DF001', 'Finished Products', 'Local Supplier', 2200.00, 18),
('Garlic Powder', 'GP001', 'Raw Materials', 'Local Supplier', 800.00, 50),
('Ginger Powder', 'GI001', 'Raw Materials', 'Local Supplier', 900.00, 45),
('Mixed Spice Blend', 'MS001', 'Finished Products', 'Spicepop', 1800.00, 35)
ON CONFLICT (sku) DO NOTHING;
