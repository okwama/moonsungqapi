-- =====================================================
-- CRITICAL INDEXES FOR MARIADB/MYSQL
-- Date: 2025-09-28
-- Purpose: Add critical missing indexes (MariaDB compatible)
-- =====================================================

-- =====================================================
-- 1. SALESREP TABLE - LOGIN PERFORMANCE
-- =====================================================

-- Critical: Composite index for login queries (phoneNumber + status)
CREATE INDEX IF NOT EXISTS idx_salesrep_phone_status ON SalesRep (phoneNumber, status);

-- Critical: Composite index for user filtering by location
CREATE INDEX IF NOT EXISTS idx_salesrep_location ON SalesRep (countryId, region_id, route_id);

-- Important: Index for status filtering
CREATE INDEX IF NOT EXISTS idx_salesrep_status ON SalesRep (status);

-- =====================================================
-- 2. PRODUCTS TABLE - PRODUCT LOADING PERFORMANCE
-- =====================================================

-- Critical: Index for active products (most common query)
CREATE INDEX IF NOT EXISTS idx_products_active ON products (is_active);

-- Critical: Composite index for active products with category
CREATE INDEX IF NOT EXISTS idx_products_active_category ON products (is_active, category_id);

-- Important: Index for product name searches
CREATE INDEX IF NOT EXISTS idx_products_name ON products (product_name);

-- Important: Index for category filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category_id);

-- =====================================================
-- 3. CLIENTS TABLE - CLIENT DISCOUNT PERFORMANCE
-- =====================================================

-- Critical: Composite index for client lookup with discount
CREATE INDEX IF NOT EXISTS idx_clients_discount ON Clients (id, discountPercentage);

-- Important: Index for active clients
CREATE INDEX IF NOT EXISTS idx_clients_status ON Clients (status);

-- Important: Composite index for location-based queries
CREATE INDEX IF NOT EXISTS idx_clients_location ON Clients (region_id, route_id);

-- Important: Index for client name searches
CREATE INDEX IF NOT EXISTS idx_clients_name ON Clients (name);

-- =====================================================
-- 4. JOURNEYPLAN TABLE - JOURNEY QUERIES PERFORMANCE
-- =====================================================

-- Critical: Composite index for user + date queries (most common)
CREATE INDEX IF NOT EXISTS idx_journeyplan_user_date ON JourneyPlan (userId, date);

-- Critical: Composite index for user + status queries
CREATE INDEX IF NOT EXISTS idx_journeyplan_user_status ON JourneyPlan (userId, status);

-- Important: Composite index for date range queries
CREATE INDEX IF NOT EXISTS idx_journeyplan_date_status ON JourneyPlan (date, status);

-- Important: Index for client-based queries
CREATE INDEX IF NOT EXISTS idx_journeyplan_client ON JourneyPlan (clientId);

-- =====================================================
-- 5. STORE_INVENTORY TABLE - STOCK QUERIES PERFORMANCE
-- =====================================================

-- Critical: Index for product stock queries (most common)
CREATE INDEX IF NOT EXISTS idx_store_inventory_product ON store_inventory (product_id, quantity);

-- Important: Index for store-based queries
CREATE INDEX IF NOT EXISTS idx_store_inventory_store ON store_inventory (store_id);

-- =====================================================
-- 6. UPLIFTSALE TABLE - SALES QUERIES PERFORMANCE
-- =====================================================

-- Critical: Composite index for user + status queries
CREATE INDEX IF NOT EXISTS idx_upliftsale_user_status ON UpliftSale (userId, status);

-- Important: Composite index for client + status queries
CREATE INDEX IF NOT EXISTS idx_upliftsale_client_status ON UpliftSale (clientId, status);

-- Important: Index for date-based queries
CREATE INDEX IF NOT EXISTS idx_upliftsale_created ON UpliftSale (createdAt);

-- =====================================================
-- 7. UPLIFTSALEITEM TABLE - SALE ITEMS PERFORMANCE
-- =====================================================

-- Important: Composite index for sale + product queries
CREATE INDEX IF NOT EXISTS idx_upliftsaleitem_sale_product ON UpliftSaleItem (upliftSaleId, productId);

-- =====================================================
-- 8. VERIFICATION QUERIES
-- =====================================================

-- Check if indexes were created successfully
SHOW INDEX FROM SalesRep WHERE Key_name LIKE 'idx_%';
SHOW INDEX FROM products WHERE Key_name LIKE 'idx_%';
SHOW INDEX FROM Clients WHERE Key_name LIKE 'idx_%';
SHOW INDEX FROM JourneyPlan WHERE Key_name LIKE 'idx_%';
SHOW INDEX FROM store_inventory WHERE Key_name LIKE 'idx_%';
SHOW INDEX FROM UpliftSale WHERE Key_name LIKE 'idx_%';
SHOW INDEX FROM UpliftSaleItem WHERE Key_name LIKE 'idx_%';

-- =====================================================
-- 9. PERFORMANCE TESTING QUERIES
-- =====================================================

-- Test login query performance (should use idx_salesrep_phone_status)
EXPLAIN SELECT * FROM SalesRep WHERE phoneNumber = 'test' AND status = 1;

-- Test products query performance (should use idx_products_active)
EXPLAIN SELECT * FROM products WHERE is_active = 1;

-- Test journey plan query performance (should use idx_journeyplan_user_date)
EXPLAIN SELECT * FROM JourneyPlan WHERE userId = 1 AND date >= '2025-01-01';

-- Test client discount query performance (should use idx_clients_discount)
EXPLAIN SELECT * FROM Clients WHERE id = 1 AND discountPercentage > 0;

-- =====================================================
-- 10. INDEX MAINTENANCE
-- =====================================================

-- Update table statistics for better query planning
ANALYZE TABLE SalesRep;
ANALYZE TABLE products;
ANALYZE TABLE Clients;
ANALYZE TABLE JourneyPlan;
ANALYZE TABLE store_inventory;
ANALYZE TABLE UpliftSale;
ANALYZE TABLE UpliftSaleItem;

