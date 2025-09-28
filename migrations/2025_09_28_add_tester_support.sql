-- Migration: 2025_09_28_add_tester_support.sql
-- Purpose: Add tester support to products and sales_order_items, plus index and triggers
-- Safe to run multiple times: includes checks where supported

START TRANSACTION;

-- 1) Add is_tester to products
ALTER TABLE `products`
  ADD COLUMN `is_tester` TINYINT(1) NOT NULL DEFAULT 1 AFTER `image_url`;

-- Ensure existing rows are enabled for testers
UPDATE `products` SET `is_tester` = 1;

-- Ensure column default is 1 in case of prior existence with different default
ALTER TABLE `products`
  MODIFY `is_tester` TINYINT(1) NOT NULL DEFAULT 1;

-- 2) Add is_tester to sales_order_items
ALTER TABLE `sales_order_items`
  ADD COLUMN `is_tester` TINYINT(1) NOT NULL DEFAULT 0 AFTER `shipped_quantity`;

-- 3) Helpful index for filtering tester lines per order
CREATE INDEX `idx_so_items_order_tester` ON `sales_order_items`(`sales_order_id`, `is_tester`);

-- 4) Triggers to enforce tester rules
DELIMITER //

DROP TRIGGER IF EXISTS `bi_sales_order_items_tester` //
CREATE TRIGGER `bi_sales_order_items_tester`
BEFORE INSERT ON `sales_order_items`
FOR EACH ROW
BEGIN
  IF NEW.is_tester = 1 THEN
    SET NEW.quantity = 1;
    SET NEW.unit_price = 0;
    SET NEW.tax_amount = 0;
    SET NEW.total_price = 0;
    SET NEW.net_price = 0;
  END IF;
END //

DROP TRIGGER IF EXISTS `bu_sales_order_items_tester` //
CREATE TRIGGER `bu_sales_order_items_tester`
BEFORE UPDATE ON `sales_order_items`
FOR EACH ROW
BEGIN
  IF NEW.is_tester = 1 THEN
    SET NEW.quantity = 1;
    SET NEW.unit_price = 0;
    SET NEW.tax_amount = 0;
    SET NEW.total_price = 0;
    SET NEW.net_price = 0;
  END IF;
END //

DELIMITER ;

COMMIT;
