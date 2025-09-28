-- Migration: 2025_09_28_pricing_effective_outlet_offer.sql
-- Purpose: Create stored procedure to compute effective unit price with outlet (client) discount and active offer price
-- Safe to run multiple times: drops and recreates the procedure

DELIMITER //

DROP PROCEDURE IF EXISTS `sp_get_effective_price_outlet_offer` //
CREATE PROCEDURE `sp_get_effective_price_outlet_offer` (
  IN p_client_id INT,
  IN p_product_id INT,
  IN p_as_of_date DATE
)
BEGIN
  DECLARE v_regular_price DECIMAL(10,2) DEFAULT 0.00;
  DECLARE v_offer_price DECIMAL(10,2) DEFAULT NULL;
  DECLARE v_client_discount DOUBLE DEFAULT 0.0;
  DECLARE v_effective_price DECIMAL(10,2) DEFAULT 0.00;
  DECLARE v_is_offer_applied TINYINT(1) DEFAULT 0;
  DECLARE v_discount_applied DOUBLE DEFAULT 0.0;

  -- 1) Get base regular price from products.selling_price
  SELECT COALESCE(selling_price, 0.00)
    INTO v_regular_price
  FROM `products`
  WHERE id = p_product_id
  LIMIT 1;

  -- 2) Get outlet discountPercentage from Clients (applied first)
  SELECT COALESCE(discountPercentage, 0.0)
    INTO v_client_discount
  FROM `Clients`
  WHERE id = p_client_id
  LIMIT 1;

  SET v_discount_applied = v_client_discount;

  -- 3) Apply outlet discount to regular price first
  IF v_client_discount > 0 THEN
    SET v_effective_price = ROUND(v_regular_price * (1 - (v_client_discount / 100)), 2);
  ELSE
    SET v_effective_price = v_regular_price;
  END IF;

  -- 4) Get active offer discount percentage for client+product on date
  SELECT o.discount_percentage
    INTO v_offer_price
  FROM `offers` o
  WHERE o.product_id = p_product_id
    AND (o.client_id = p_client_id OR o.client_id IS NULL)
    AND o.is_active = 1
    AND (p_as_of_date BETWEEN o.valid_from AND (CASE WHEN o.valid_until = '0000-00-00' THEN p_as_of_date ELSE o.valid_until END))
  ORDER BY o.client_id DESC, o.valid_from DESC
  LIMIT 1;

  -- 5) Apply offer discount on top of outlet-discounted price
  IF v_offer_price IS NOT NULL AND v_offer_price > 0 THEN
    SET v_effective_price = ROUND(v_effective_price * (1 - (v_offer_price / 100)), 2);
    SET v_is_offer_applied = 1;
  ELSE
    SET v_is_offer_applied = 0;
  END IF;

  SELECT 
    p_client_id AS client_id,
    p_product_id AS product_id,
    v_regular_price AS regular_price,
    v_offer_price AS offer_discount_percentage,
    v_is_offer_applied AS is_offer_applied,
    v_discount_applied AS outlet_discount_percentage,
    v_effective_price AS effective_unit_price;
END //

DELIMITER ;


