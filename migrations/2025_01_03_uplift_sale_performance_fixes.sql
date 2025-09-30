-- =====================================================
-- UPLIFT SALE PERFORMANCE FIXES
-- =====================================================
-- This migration adds missing indexes and optimizations
-- to prevent hanging issues in uplift sale operations

-- =====================================================
-- 1. CLIENT STOCK TABLE OPTIMIZATIONS
-- =====================================================

-- Add composite index for client + product queries (most common lookup)
CREATE INDEX IF NOT EXISTS idx_clientstock_client_product ON ClientStock (clientId, productId);

-- Add index for product-based queries
CREATE INDEX IF NOT EXISTS idx_clientstock_product ON ClientStock (productId);

-- Add index for salesrep-based queries
CREATE INDEX IF NOT EXISTS idx_clientstock_salesrep ON ClientStock (salesrepId);

-- =====================================================
-- 2. PRODUCTS TABLE OPTIMIZATIONS
-- =====================================================

-- Critical: Index for active products (most common query)
CREATE INDEX IF NOT EXISTS idx_products_active ON products (isActive);

-- Critical: Composite index for active products with category
CREATE INDEX IF NOT EXISTS idx_products_active_category ON products (isActive, categoryId);

-- Important: Index for product name searches and ordering
CREATE INDEX IF NOT EXISTS idx_products_name ON products (productName);

-- Important: Index for category filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products (categoryId);

-- =====================================================
-- 3. STORE INVENTORY TABLE OPTIMIZATIONS
-- =====================================================

-- Critical: Composite index for product + store lookups
CREATE INDEX IF NOT EXISTS idx_store_inventory_product_store ON store_inventory (productId, storeId);

-- Critical: Index for active stores with inventory
CREATE INDEX IF NOT EXISTS idx_store_inventory_quantity ON store_inventory (quantity);

-- Important: Index for store-based queries
CREATE INDEX IF NOT EXISTS idx_store_inventory_store ON store_inventory (storeId);

-- =====================================================
-- 4. STORES TABLE OPTIMIZATIONS
-- =====================================================

-- Critical: Index for active stores
CREATE INDEX IF NOT EXISTS idx_stores_active ON stores (isActive);

-- Important: Index for store name searches
CREATE INDEX IF NOT EXISTS idx_stores_name ON stores (storeName);

-- =====================================================
-- 5. UPLIFT SALE TABLE OPTIMIZATIONS
-- =====================================================

-- Composite index for user + status queries (most common filtering)
CREATE INDEX IF NOT EXISTS idx_upliftsale_user_status ON UpliftSale (userId, status);

-- Composite index for client + status queries
CREATE INDEX IF NOT EXISTS idx_upliftsale_client_status ON UpliftSale (clientId, status);

-- Index for date-based queries
CREATE INDEX IF NOT EXISTS idx_upliftsale_created ON UpliftSale (createdAt);

-- Index for status-based queries
CREATE INDEX IF NOT EXISTS idx_upliftsale_status ON UpliftSale (status);

-- =====================================================
-- 3. UPLIFT SALE ITEM TABLE OPTIMIZATIONS
-- =====================================================

-- Composite index for sale + product queries
CREATE INDEX IF NOT EXISTS idx_upliftsaleitem_sale_product ON UpliftSaleItem (upliftSaleId, productId);

-- Index for product-based queries
CREATE INDEX IF NOT EXISTS idx_upliftsaleitem_product ON UpliftSaleItem (productId);

-- =====================================================
-- 4. OUTLET QUANTITY TRANSACTIONS TABLE OPTIMIZATIONS
-- =====================================================

-- Composite index for client + product + date queries
CREATE INDEX IF NOT EXISTS idx_outlet_transactions_client_product_date 
ON outlet_quantity_transactions (clientId, productId, transactionDate);

-- Composite index for client + transaction type
CREATE INDEX IF NOT EXISTS idx_outlet_transactions_client_type 
ON outlet_quantity_transactions (clientId, transactionType);

-- Index for reference-based queries
CREATE INDEX IF NOT EXISTS idx_outlet_transactions_reference 
ON outlet_quantity_transactions (referenceId, referenceType);

-- =====================================================
-- 5. PERFORMANCE IMPACT ANALYSIS
-- =====================================================

/*
EXPECTED PERFORMANCE IMPROVEMENTS:

1. CLIENT STOCK QUERIES:
   - Before: Full table scan for client + product lookups
   - After: Index seek on (clientId, productId)
   - Improvement: 10-100x faster

2. UPLIFT SALE QUERIES:
   - Before: Full table scan for user + status filtering
   - After: Index seek on (userId, status)
   - Improvement: 5-50x faster

3. STOCK DEDUCTION OPERATIONS:
   - Before: Full table scan for each stock lookup
   - After: Direct index access
   - Improvement: 20-200x faster

4. TRANSACTION LOGGING:
   - Before: Full table scan for reference lookups
   - After: Index seek on (referenceId, referenceType)
   - Improvement: 10-100x faster

5. DATE-BASED QUERIES:
   - Before: Full table scan with date filtering
   - After: Index range scan on createdAt
   - Improvement: 5-20x faster
*/

-- =====================================================
-- 6. VERIFICATION QUERIES
-- =====================================================

-- Check if indexes were created successfully
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME,
    INDEX_TYPE
FROM INFORMATION_SCHEMA.STATISTICS 
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME IN ('ClientStock', 'UpliftSale', 'UpliftSaleItem', 'outlet_quantity_transactions')
AND INDEX_NAME LIKE 'idx_%'
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;

-- =====================================================
-- 7. MONITORING QUERIES
-- =====================================================

-- Monitor slow queries related to uplift sales
-- Run this periodically to identify performance issues:

/*
-- Find slow queries on uplift sale tables
SELECT 
    DIGEST_TEXT as query,
    COUNT_STAR as executions,
    AVG_TIMER_WAIT/1000000000 as avg_time_seconds,
    MAX_TIMER_WAIT/1000000000 as max_time_seconds
FROM performance_schema.events_statements_summary_by_digest 
WHERE DIGEST_TEXT LIKE '%UpliftSale%' 
   OR DIGEST_TEXT LIKE '%ClientStock%'
   OR DIGEST_TEXT LIKE '%outlet_quantity_transactions%'
ORDER BY AVG_TIMER_WAIT DESC 
LIMIT 10;
*/
