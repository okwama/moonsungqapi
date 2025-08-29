-- Commission System Tables Migration
-- This script creates the necessary tables for the commission system

-- Table structure for commission_configs
CREATE TABLE `commission_configs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tier_name` varchar(100) NOT NULL,
  `min_amount` decimal(15,2) NOT NULL,
  `max_amount` decimal(15,2) DEFAULT NULL,
  `commission_amount` decimal(10,2) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_tier_name` (`tier_name`),
  KEY `idx_min_amount` (`min_amount`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for daily_commissions
CREATE TABLE `daily_commissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sales_rep_id` int(11) NOT NULL,
  `commission_date` date NOT NULL,
  `daily_sales_amount` decimal(15,2) NOT NULL,
  `commission_amount` decimal(10,2) NOT NULL,
  `commission_tier` varchar(100) NOT NULL,
  `sales_count` int(11) DEFAULT 0,
  `status` varchar(20) DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_daily_commission` (`sales_rep_id`, `commission_date`),
  KEY `idx_sales_rep_id` (`sales_rep_id`),
  KEY `idx_commission_date` (`commission_date`),
  KEY `idx_status` (`status`),
  KEY `idx_commission_tier` (`commission_tier`),
  CONSTRAINT `fk_daily_commissions_sales_rep` FOREIGN KEY (`sales_rep_id`) REFERENCES `SalesRep` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default commission configurations
INSERT INTO `commission_configs` (`tier_name`, `min_amount`, `max_amount`, `commission_amount`, `description`) VALUES
('Bronze Tier', 0.00, 14999.99, 0.00, 'No commission for sales below 15,000'),
('Silver Tier', 15000.00, 19999.99, 500.00, '500 commission for sales 15,000 - 19,999'),
('Gold Tier', 20000.00, NULL, 1000.00, '1000 commission for sales 20,000 and above');

-- Add indexes for better performance
CREATE INDEX `idx_commission_configs_active` ON `commission_configs` (`is_active`, `min_amount`);
CREATE INDEX `idx_daily_commissions_period` ON `daily_commissions` (`sales_rep_id`, `commission_date`, `status`);
CREATE INDEX `idx_daily_commissions_summary` ON `daily_commissions` (`sales_rep_id`, `status`, `commission_amount`);

-- Add comments for documentation
ALTER TABLE `commission_configs` COMMENT = 'Commission tier configurations for sales reps';
ALTER TABLE `daily_commissions` COMMENT = 'Daily commission records for sales reps';
