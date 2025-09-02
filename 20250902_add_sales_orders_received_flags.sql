-- Migration: Add stock receive flags to sales_orders
-- - adds received_into_stock (TINYINT(1) DEFAULT 0) if missing
-- - ensures received_at exists and is NULLable (DATETIME NULL)
-- Safe/idempotent for MySQL 5.7+ using INFORMATION_SCHEMA + dynamic SQL

SET @db := DATABASE();

-- Add received_into_stock if it does not exist
SET @exists_col := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db
    AND TABLE_NAME = 'sales_orders'
    AND COLUMN_NAME = 'received_into_stock'
);
SET @sql := IF(@exists_col = 0,
  'ALTER TABLE `sales_orders`\n  ADD COLUMN `received_into_stock` TINYINT(1) NOT NULL DEFAULT 0 AFTER `my_status`;',
  'DO 0;'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Add received_at if it does not exist
SET @exists_col := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db
    AND TABLE_NAME = 'sales_orders'
    AND COLUMN_NAME = 'received_at'
);
SET @sql := IF(@exists_col = 0,
  'ALTER TABLE `sales_orders`\n  ADD COLUMN `received_at` DATETIME NULL DEFAULT NULL AFTER `received_by`;',
  'DO 0;'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Ensure received_at is NULLable (ok if already NULLable)
ALTER TABLE `sales_orders`
  MODIFY COLUMN `received_at` DATETIME NULL DEFAULT NULL;


