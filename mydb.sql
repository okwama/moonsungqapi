-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 12, 2025 at 06:53 PM
-- Server version: 10.6.22-MariaDB-cll-lve
-- PHP Version: 8.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `impulsep_gq`
--

-- --------------------------------------------------------

--
-- Table structure for table `account_category`
--

CREATE TABLE `account_category` (
  `id` int(3) NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `account_ledger`
--

CREATE TABLE `account_ledger` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `reference_type` varchar(50) DEFAULT NULL,
  `reference_id` int(11) DEFAULT NULL,
  `debit` decimal(15,2) DEFAULT 0.00,
  `credit` decimal(15,2) DEFAULT 0.00,
  `running_balance` decimal(15,2) DEFAULT 0.00,
  `status` enum('in pay','confirmed') DEFAULT 'in pay',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `account_types`
--

CREATE TABLE `account_types` (
  `id` int(11) NOT NULL,
  `account_type` varchar(100) NOT NULL,
  `account_category` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `allowed_ips`
--

CREATE TABLE `allowed_ips` (
  `id` int(11) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assets`
--

CREATE TABLE `assets` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `purchase_date` date NOT NULL,
  `purchase_value` decimal(15,2) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `asset_types`
--

CREATE TABLE `asset_types` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `checkin_time` datetime DEFAULT NULL,
  `checkout_time` datetime DEFAULT NULL,
  `checkin_latitude` decimal(10,8) DEFAULT NULL,
  `checkin_longitude` decimal(11,8) DEFAULT NULL,
  `checkout_latitude` decimal(10,8) DEFAULT NULL,
  `checkout_longitude` decimal(11,8) DEFAULT NULL,
  `checkin_location` varchar(255) DEFAULT NULL,
  `checkout_location` varchar(255) DEFAULT NULL,
  `checkin_ip` varchar(45) DEFAULT NULL,
  `checkout_ip` varchar(45) DEFAULT NULL,
  `status` int(2) NOT NULL DEFAULT 1,
  `type` enum('regular','overtime','leave') NOT NULL DEFAULT 'regular',
  `total_hours` decimal(5,2) DEFAULT NULL,
  `overtime_hours` decimal(5,2) NOT NULL DEFAULT 0.00,
  `is_late` tinyint(1) NOT NULL DEFAULT 0,
  `late_minutes` int(11) NOT NULL DEFAULT 0,
  `device_info` text DEFAULT NULL,
  `timezone` varchar(50) NOT NULL DEFAULT 'UTC',
  `shift_start` time DEFAULT NULL,
  `shift_end` time DEFAULT NULL,
  `is_early_departure` tinyint(1) NOT NULL DEFAULT 0,
  `early_departure_minutes` int(11) NOT NULL DEFAULT 0,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Category`
--

CREATE TABLE `Category` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Category`
--

INSERT INTO `Category` (`id`, `name`) VALUES
(1, 'Lipstick'),
(2, 'Lashes');

-- --------------------------------------------------------

--
-- Table structure for table `CategoryPriceOption`
--

CREATE TABLE `CategoryPriceOption` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `label` varchar(100) NOT NULL,
  `value` decimal(15,2) NOT NULL,
  `value_tzs` decimal(15,2) NOT NULL,
  `value_ngn` decimal(15,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chart_of_accounts`
--

CREATE TABLE `chart_of_accounts` (
  `id` int(11) NOT NULL,
  `account_name` varchar(100) NOT NULL,
  `account_code` varchar(20) NOT NULL,
  `account_type` int(11) NOT NULL,
  `parent_account_id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `chart_of_accounts`
--

INSERT INTO `chart_of_accounts` (`id`, `account_name`, `account_code`, `account_type`, `parent_account_id`, `description`, `created_at`, `updated_at`, `is_active`) VALUES
(3, 'Fixtures and Fittings', '003000', 4, 1, '', '2025-06-15 13:19:13', '2025-07-07 18:00:36', 1),
(4, 'Land and Buildings', '004000', 4, 1, '', '2025-06-15 13:20:02', '2025-07-07 18:00:36', 1),
(5, 'Motor Vehicles', '005000', 4, 1, '', '2025-06-15 13:21:08', '2025-07-07 18:00:36', 1),
(6, 'Office equipment (inc computer equipment)\n', '006000', 4, 1, '', '2025-06-15 13:26:32', '2025-07-07 18:00:36', 1),
(7, 'Plant and Machinery', '007000', 4, 1, '', '2025-06-15 13:27:13', '2025-07-07 18:00:36', 1),
(8, 'Intangible Assets -ERP & Sales App', '008000', 5, 1, '', '2025-06-15 13:28:15', '2025-07-07 18:00:36', 1),
(9, 'Biological Assets', '009000', 5, 1, '', '2025-06-15 13:28:54', '2025-07-07 18:00:36', 1),
(10, 'Stock', '100001', 6, 1, '', '2025-06-15 13:30:13', '2025-07-07 18:00:36', 1),
(11, 'Stock Interim (Received)', '100002', 6, 1, '', '2025-06-15 13:30:59', '2025-07-07 18:00:36', 1),
(12, 'Debtors Control Account', '110000', 7, 1, ' | Last invoice: INV-3-1751913238102 | Last invoice: INV-2-1751918138904 | Last invoice: INV-3-1751996124894 | Last invoice: INV-2-1752309325399 | Last invoice: INV-2-1752320810962', '2025-06-15 13:32:13', '2025-07-07 18:00:36', 1),
(13, 'Debtors Control Account (POS)', '110001', 7, 1, '', '2025-06-15 13:33:00', '2025-07-07 18:00:36', 1),
(14, 'Other debtors', '110002', 7, 1, '', '2025-06-15 14:39:31', '2025-07-07 18:00:36', 1),
(15, 'Prepayments', '110003', 8, 1, '', '2025-06-15 14:40:01', '2025-07-07 18:00:36', 1),
(16, 'Purchase Tax Control Account', '110004', 6, 1, '', '2025-06-15 14:41:11', '2025-07-07 18:00:36', 1),
(17, 'WithHolding Tax Advance on', '110005', 6, 1, '', '2025-06-15 14:41:56', '2025-07-07 18:00:36', 1),
(18, 'Bank Suspense Account', '110006', 6, 1, '', '2025-06-15 14:42:24', '2025-07-07 18:00:36', 1),
(19, 'Outstanding Receipts', '110007', 7, 1, '', '2025-06-15 14:42:57', '2025-07-07 18:00:36', 1),
(20, 'Outstanding Payments', '110008', 6, 1, '', '2025-06-15 14:43:27', '2025-07-07 18:00:36', 1),
(21, 'DTB KES', '120001', 9, 1, '', '2025-06-15 14:44:02', '2025-07-07 18:00:36', 1),
(22, 'DTB USD', '120002', 9, 1, '', '2025-06-15 14:44:41', '2025-07-07 18:00:36', 1),
(23, 'M-pesa', '120003', 9, 1, '', '2025-06-15 14:45:07', '2025-07-07 18:00:36', 1),
(24, 'Cash', '120004', 9, 1, '', '2025-06-15 14:45:26', '2025-07-07 18:00:36', 1),
(25, 'DTB-PICTURES PAYMENTS', '120005', 9, 1, '', '2025-06-15 14:46:11', '2025-07-07 18:00:36', 1),
(26, 'ABSA', '120006', 9, 1, '', '2025-06-15 14:46:42', '2025-07-07 18:00:36', 1),
(27, 'SANLAM MMF-USD', '120007', 9, 1, '', '2025-06-15 14:47:26', '2025-07-07 18:00:36', 1),
(28, 'ABSA-USD', '120008', 9, 1, '', '2025-06-15 14:47:49', '2025-07-07 18:00:36', 1),
(29, 'ECO BANK KES', '120009', 9, 1, '', '2025-06-15 14:48:23', '2025-07-07 18:00:36', 1),
(30, 'Accounts Payables', '210000', 10, 2, '', '2025-06-15 14:50:18', '2025-07-07 18:00:36', 1),
(31, 'Other Creditors', '210002', 11, 2, '', '2025-06-15 14:50:56', '2025-07-07 18:00:36', 1),
(32, 'Accrued Liabilities', '210003', 11, 2, '', '2025-06-15 14:51:26', '2025-07-07 18:00:36', 1),
(33, 'Company Credit Card', '210004', 12, 2, '', '2025-06-15 14:51:55', '2025-07-07 18:00:36', 1),
(34, 'Bad debt provision', '210005', 11, 2, '', '2025-06-15 14:52:40', '2025-07-07 18:00:36', 1),
(35, 'Sales Tax Control Account', '210006', 11, 2, '', '2025-06-15 14:53:12', '2025-07-07 18:00:36', 1),
(36, 'Withholding Tax Payable', '210007', 11, 2, '', '2025-06-15 14:53:51', '2025-07-07 18:00:36', 1),
(37, 'PAYE', '210008', 10, 2, '', '2025-06-15 14:54:27', '2025-07-07 18:00:36', 1),
(38, 'Net Wages', '210009', 10, 2, '', '2025-06-15 14:55:05', '2025-07-07 18:00:36', 1),
(39, 'NSSF', '210010', 10, 2, '', '2025-06-15 14:55:32', '2025-07-07 18:00:36', 1),
(40, 'NHIF', '210011', 10, 2, '', '2025-06-15 14:56:11', '2025-07-07 18:00:36', 1),
(41, 'AHL', '210012', 10, 2, '', '2025-06-15 14:56:42', '2025-07-07 18:00:36', 1),
(42, 'Due To and From Directors', '210013', 11, 2, '', '2025-06-15 14:57:16', '2025-07-07 18:00:36', 1),
(43, 'Due To and From Related Party- MSP', '210014', 11, 2, '', '2025-06-15 14:57:46', '2025-07-07 18:00:36', 1),
(44, 'Due To Other Parties', '210015', 11, 2, '', '2025-06-15 14:58:11', '2025-07-07 18:00:36', 1),
(45, 'Corporation Tax', '210016', 10, 2, '', '2025-06-15 14:58:35', '2025-07-07 18:00:36', 1),
(46, 'Wage After Tax: Accrued Liabilities', '210022', 10, 2, '', '2025-06-15 14:58:59', '2025-07-07 18:00:36', 1),
(47, 'Due To and From Related Party- GQ', '210024', 11, 2, '', '2025-06-15 14:59:52', '2025-07-07 18:00:36', 1),
(48, 'Due To and From Woosh Intl- TZ', '210034', 11, 2, '', '2025-06-15 15:00:20', '2025-07-07 18:00:36', 1),
(49, 'Share Capital', '300001', 13, 3, '', '2025-06-15 15:00:43', '2025-07-07 18:00:36', 1),
(50, 'Retained Earnings', '300002', 13, 3, '', '2025-06-15 15:01:19', '2025-07-07 18:00:36', 1),
(51, 'Other reserves', '300003', 13, 3, '', '2025-06-15 15:01:39', '2025-07-07 18:00:36', 1),
(52, 'Capital', '300004', 13, 3, '', '2025-06-15 15:01:59', '2025-07-07 18:00:36', 1),
(53, 'Sales Revenue', '400001', 14, 4, '', '2025-06-15 15:02:21', '2025-07-07 18:00:36', 1),
(54, 'GOLD PUFF SALES', '400002', 14, 4, '', '2025-06-15 15:02:50', '2025-07-07 18:00:36', 1),
(55, 'WILD LUCY SALES', '400003', 14, 4, '', '2025-06-15 15:03:15', '2025-07-07 18:00:36', 1),
(56, 'Cash Discount Gain', '400004', 19, 0, '', '2025-06-15 15:04:54', '2025-07-07 18:00:36', 1),
(57, 'Profits/Losses on disposals of assets', '400005', 14, 4, '', '2025-06-15 15:05:26', '2025-07-07 18:00:36', 1),
(58, 'Other Income', '400006', 19, 0, '', '2025-06-15 15:05:48', '2025-07-07 18:00:36', 1),
(59, 'GOLD PUFF RECHARGEABLE SALES', '400007', 14, 4, '', '2025-06-15 15:06:13', '2025-07-07 18:00:36', 1),
(60, 'GOLD POUCH 5 DOT SALES', '400008', 14, 4, '', '2025-06-15 15:06:37', '2025-07-07 18:00:36', 1),
(61, 'GOLD POUCH 3 DOT SALES', '400009', 14, 4, '', '2025-06-15 15:07:14', '2025-07-07 18:00:36', 1),
(62, 'GOLD PUFF 3000 PUFFS RECHARGEABLE SALES', '400010', 14, 4, '', '2025-06-15 15:07:39', '2025-07-07 18:00:36', 1),
(63, 'Cost of sales 1', '500000', 15, 5, '', '2025-06-15 15:08:06', '2025-07-07 18:00:36', 1),
(64, 'Cost of sales 2', '500001', 15, 5, '', '2025-06-15 15:08:26', '2025-07-07 18:00:36', 1),
(65, 'GOLD PUFF COST OF SALES', '500002', 15, 5, '', '2025-06-15 15:08:53', '2025-07-07 18:00:36', 1),
(66, 'WILD LUCY COST OF SALES', '500003', 15, 5, '', '2025-06-15 15:09:13', '2025-07-07 18:00:36', 1),
(67, 'Other costs of sales - Vapes Write Offs', '500004', 15, 5, '', '2025-06-15 15:09:36', '2025-07-07 18:00:36', 1),
(68, 'Other costs of sales', '500005', 15, 5, '', '2025-06-15 15:09:59', '2025-07-07 18:00:36', 1),
(69, 'Freight and delivery - COS E-Cigarette', '500006', 15, 5, '', '2025-06-15 15:10:25', '2025-07-07 18:00:36', 1),
(70, 'Discounts given - COS', '500007', 15, 5, '', '2025-06-15 15:10:45', '2025-07-07 18:00:36', 1),
(71, 'Direct labour - COS', '500008', 15, 5, '', '2025-06-15 15:11:07', '2025-07-07 18:00:36', 1),
(72, 'Commissions and fees', '500009', 15, 5, '', '2025-06-15 15:11:30', '2025-07-07 18:00:36', 1),
(73, 'Bar Codes/ Stickers', '500010', 15, 5, '', '2025-06-15 15:12:01', '2025-07-07 18:00:36', 1),
(74, 'GOLD PUFF RECHARGEABLE COST OF SALES', '500011', 15, 5, '', '2025-06-15 15:12:35', '2025-07-07 18:00:36', 1),
(75, 'Rebates,Price Diff & Discounts', '500012', 15, 5, '', '2025-06-15 15:12:55', '2025-07-07 18:00:36', 1),
(76, 'GOLD POUCH 5 DOT COST OF SALES', '500013', 15, 5, '', '2025-06-15 15:13:17', '2025-07-07 18:00:36', 1),
(77, 'GOLD POUCH 3 DOT COST OF SALES', '500014', 15, 5, '', '2025-06-15 15:13:38', '2025-07-07 18:00:36', 1),
(78, 'GOLD PUFF 3000 PUFFS RECHARGEABLE COST OF SALES', '500015', 15, 5, '', '2025-06-15 15:14:02', '2025-07-07 18:00:36', 1),
(79, 'Vehicle Washing', '510001', 16, 5, '', '2025-06-15 15:31:22', '2025-07-07 18:00:36', 1),
(80, 'Vehicle R&M', '510002', 16, 5, '', '2025-06-15 15:31:49', '2025-07-07 18:00:36', 1),
(81, 'Vehicle Parking Fee', '510003', 16, 5, '', '2025-06-15 15:32:15', '2025-07-07 18:00:36', 1),
(82, 'Vehicle Insurance fee', '510004', 16, 5, '', '2025-06-15 15:32:47', '2025-07-07 18:00:36', 1),
(83, 'Vehicle fuel cost', '510005', 16, 5, '', '2025-06-15 15:33:09', '2025-07-07 18:00:36', 1),
(84, 'Driver Services', '510006', 16, 5, '', '2025-06-15 15:33:35', '2025-07-07 18:00:36', 1),
(85, 'Travel expenses - selling expenses', '510007', 16, 5, '', '2025-06-15 15:34:04', '2025-07-07 18:00:36', 1),
(86, 'Travel expenses - Sales Fuel Allowance', '510008', 16, 5, '', '2025-06-15 15:34:30', '2025-07-07 18:00:36', 1),
(87, 'Travel expenses - Sales Car Lease', '510009', 16, 5, '', '2025-06-15 15:35:05', '2025-07-07 18:00:36', 1),
(88, 'Travel expenses - Other Travel Expenses', '510010', 16, 5, '', '2025-06-15 15:35:55', '2025-07-07 18:00:36', 1),
(89, 'Travel expenses- General Fuel Allowance', '510011', 16, 5, '', '2025-06-15 15:36:51', '2025-07-07 18:00:36', 1),
(90, 'Travel expenses - General Car Lease', '510012', 16, 5, '', '2025-06-15 15:37:20', '2025-07-07 18:00:36', 1),
(91, 'Travel Expense- General and admin expenses', '510013', 16, 5, '', '2025-06-15 15:37:46', '2025-07-07 18:00:36', 1),
(92, 'Mpesa handling fee', '510014', 16, 5, '', '2025-06-15 15:38:09', '2025-07-07 18:00:36', 1),
(93, 'Other Types of Expenses-Advertising Expenses', '510015', 16, 5, '', '2025-06-15 15:38:34', '2025-07-07 18:00:36', 1),
(94, 'Merchandize', '510016', 16, 5, '', '2025-06-15 15:38:58', '2025-07-07 18:00:36', 1),
(95, 'Influencer Payment', '510017', 16, 5, '', '2025-06-15 15:39:20', '2025-07-07 18:00:36', 1),
(96, 'Advertizing Online', '510018', 16, 5, '', '2025-06-15 15:39:41', '2025-07-07 18:00:36', 1),
(97, 'Trade Marketing Costs', '510019', 16, 5, '', '2025-06-15 15:40:05', '2025-07-07 18:00:36', 1),
(98, 'Activation', '510020', 16, 5, '', '2025-06-15 15:40:25', '2025-07-07 18:00:36', 1),
(99, 'Other selling expenses', '510021', 16, 5, '', '2025-06-15 15:40:47', '2025-07-07 18:00:36', 1),
(100, 'Other general and administrative expenses', '510022', 16, 5, '', '2025-06-15 15:41:08', '2025-07-07 18:00:36', 1),
(101, 'Rent or Lease of Apartments', '510023', 16, 5, '', '2025-06-15 15:41:30', '2025-07-07 18:00:36', 1),
(102, 'Penalty & Interest Account', '510024', 16, 5, '', '2025-06-15 15:41:58', '2025-07-07 18:00:36', 1),
(103, 'Dues and subscriptions', '510025', 16, 5, '', '2025-06-15 15:42:19', '2025-07-07 18:00:36', 1),
(104, 'Utilities (Electricity and Water)', '510026', 16, 5, '', '2025-06-15 15:42:43', '2025-07-07 18:00:36', 1),
(105, 'Telephone and postage', '510027', 16, 5, '', '2025-06-15 15:43:13', '2025-07-07 18:00:36', 1),
(106, 'Stationery and printing', '510028', 16, 5, '', '2025-06-15 15:43:33', '2025-07-07 18:00:36', 1),
(107, 'Service Fee', '510029', 16, 5, '', '2025-06-15 15:43:54', '2025-07-07 18:00:36', 1),
(108, 'Repairs and Maintenance', '510030', 16, 5, '', '2025-06-15 15:44:15', '2025-07-07 18:00:36', 1),
(109, 'Rent or lease payments', '510031', 16, 5, '', '2025-06-15 15:44:45', '2025-07-07 18:00:36', 1),
(110, 'Office Internet', '510032', 16, 5, '', '2025-06-15 15:45:05', '2025-07-07 18:00:36', 1),
(111, 'Office decoration Expense', '510033', 16, 5, '', '2025-06-15 15:45:26', '2025-07-07 18:00:36', 1),
(112, 'Office Cleaning and Sanitation', '510034', 16, 5, '', '2025-06-15 15:45:51', '2025-07-07 18:00:36', 1),
(113, 'IT Development', '510035', 16, 5, '', '2025-06-15 15:46:12', '2025-07-07 18:00:36', 1),
(114, 'Insurance - Liability', '510036', 16, 5, '', '2025-06-15 15:46:34', '2025-07-07 18:00:36', 1),
(115, 'Business license fee', '510037', 16, 5, '', '2025-06-15 15:46:58', '2025-07-07 18:00:36', 1),
(116, 'Other Legal and Professional Fees', '510038', 16, 5, '', '2025-06-15 15:47:31', '2025-07-07 18:00:36', 1),
(117, 'IT Expenses', '510039', 16, 5, '', '2025-06-15 15:47:51', '2025-07-07 18:00:36', 1),
(118, 'Recruitment fee', '510040', 16, 5, '', '2025-06-15 15:48:18', '2025-07-07 18:00:36', 1),
(119, 'Payroll Expenses(Before Tax)', '510041', 16, 5, '', '2025-06-15 15:48:44', '2025-07-07 18:00:36', 1),
(120, 'Outsourced Labor Services', '510042', 16, 5, '', '2025-06-15 15:49:07', '2025-07-07 18:00:36', 1),
(121, 'NSSF ( Company Paid)', '510043', 16, 5, '', '2025-06-15 15:49:34', '2025-07-07 18:00:36', 1),
(122, 'Employee welfare', '510044', 16, 5, '', '2025-06-15 15:49:56', '2025-07-07 18:00:36', 1),
(123, 'Bonus & Allowance', '510045', 16, 5, '', '2025-06-15 15:50:19', '2025-07-07 18:00:36', 1),
(124, 'Affordable Housing Levy (AHL)', '510046', 16, 5, '', '2025-06-15 15:50:43', '2025-07-07 18:00:36', 1),
(125, 'Income tax expense', '510047', 16, 5, '', '2025-06-15 15:51:05', '2025-07-07 18:00:36', 1),
(126, 'Team Building', '510048', 16, 5, '', '2025-06-15 15:51:28', '2025-07-07 18:00:36', 1),
(127, 'Meetings', '510049', 16, 5, '', '2025-06-15 15:51:55', '2025-07-07 18:00:36', 1),
(128, 'Meals and entertainment', '510050', 16, 5, '', '2025-06-15 15:52:20', '2025-07-07 18:00:36', 1),
(129, 'Interest expense', '510051', 16, 5, '', '2025-06-15 15:52:40', '2025-07-07 18:00:36', 1),
(130, 'Bad debts', '510052', 17, 0, '', '2025-06-15 15:53:05', '2025-07-07 18:00:36', 1),
(131, 'Bank handling fee', '510054', 16, 5, '', '2025-06-15 15:53:29', '2025-07-07 18:00:36', 1),
(132, 'Patents & Trademarks Depreciation', '520001', 17, 0, '', '2025-06-15 15:54:02', '2025-07-07 18:00:36', 1),
(133, 'Fixtures and fittings Depreciation', '520002', 16, 5, '', '2025-06-15 15:54:23', '2025-07-07 18:00:36', 1),
(134, 'Land and buildings Depreciation', '520003', 17, 0, '', '2025-06-15 15:54:45', '2025-07-07 18:00:36', 1),
(135, 'Motor vehicles Depreciation', '520004', 17, 0, '', '2025-06-15 15:55:09', '2025-07-07 18:00:36', 1),
(136, 'Office equipment (inc computer equipment) Depreciation', '520005', 17, 0, '', '2025-06-15 15:55:35', '2025-07-07 18:00:36', 1),
(137, 'Plant and machinery Depreciation', '520006', 17, 0, '', '2025-06-15 15:55:58', '2025-07-07 18:00:36', 1),
(138, 'Undistributed Profits/Losses', '999999', 18, 3, '', '2025-06-15 15:56:19', '2025-07-07 18:00:36', 1),
(139, 'Accumulated Depreciation', '520007', 17, 0, NULL, '2025-07-08 06:19:04', '2025-07-08 06:19:04', 1),
(140, 'Accounts Receivable', '1100', 2, 0, 'Amounts owed by customers for goods or services provided | Last invoice: INV-2-1752321159077 | Last invoice: INV-2-1752397570019 | Last invoice: INV-2-1752649457669', '2025-07-12 09:40:18', '2025-07-12 09:40:18', 1),
(141, 'PAYE Payable', '37', 2, 0, NULL, '2025-08-10 10:32:21', '2025-08-10 10:32:21', 1),
(142, 'Net Wages', '38', 5, 0, NULL, '2025-08-10 10:32:21', '2025-08-10 10:32:21', 1),
(143, 'NSSF Payable', '39', 2, 0, NULL, '2025-08-10 10:32:21', '2025-08-10 10:32:21', 1),
(144, 'NHIF Payable', '40', 2, 0, NULL, '2025-08-10 10:32:21', '2025-08-10 10:32:21', 1);

-- --------------------------------------------------------

--
-- Table structure for table `chart_of_accounts1`
--

CREATE TABLE `chart_of_accounts1` (
  `id` int(11) NOT NULL,
  `account_code` varchar(20) NOT NULL,
  `account_name` varchar(100) NOT NULL,
  `account_type` enum('asset','liability','equity','revenue','expense') NOT NULL,
  `parent_account_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_rooms`
--

CREATE TABLE `chat_rooms` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `is_group` tinyint(1) DEFAULT 0,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_room_members`
--

CREATE TABLE `chat_room_members` (
  `id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ClientAssignment`
--

CREATE TABLE `ClientAssignment` (
  `id` int(11) NOT NULL,
  `outletId` int(11) NOT NULL,
  `salesRepId` int(11) NOT NULL,
  `assignedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `status` varchar(191) NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ClientAssignment`
--

INSERT INTO `ClientAssignment` (`id`, `outletId`, `salesRepId`, `assignedAt`, `status`) VALUES
(1, 1, 63, '2025-06-25 15:16:10.359', 'active'),
(2, 19, 63, '2025-06-25 15:16:10.375', 'active'),
(3, 2, 79, '2025-06-25 15:16:10.375', 'active'),
(4, 3, 82, '2025-06-25 15:16:10.375', 'active'),
(5, 4, 67, '2025-06-25 15:16:10.375', 'active'),
(6, 6, 86, '2025-06-25 15:16:10.375', 'active'),
(7, 7, 81, '2025-06-25 15:16:10.375', 'active'),
(8, 8, 64, '2025-06-25 15:16:10.375', 'active'),
(9, 9, 71, '2025-06-25 15:16:10.375', 'active'),
(10, 11, 84, '2025-06-25 15:16:10.375', 'active'),
(11, 12, 72, '2025-06-25 15:16:10.375', 'active'),
(12, 13, 73, '2025-06-25 15:16:10.375', 'active'),
(13, 15, 70, '2025-06-25 15:16:10.375', 'active'),
(14, 16, 68, '2025-06-25 15:16:10.375', 'active'),
(15, 17, 65, '2025-06-25 15:16:10.375', 'active'),
(16, 18, 74, '2025-06-25 15:16:10.375', 'active'),
(17, 20, 78, '2025-06-25 15:16:10.375', 'active'),
(18, 21, 77, '2025-06-25 15:16:10.375', 'active'),
(19, 22, 75, '2025-06-25 15:16:10.375', 'active'),
(20, 1, 3, '2025-06-25 15:16:10.359', 'active'),
(21, 19, 2, '2025-08-11 20:19:42.347', 'active'),
(22, 22, 2, '2025-08-11 20:19:42.539', 'active'),
(23, 20, 2, '2025-08-11 20:20:48.252', 'inactive'),
(24, 7, 2, '2025-08-11 20:20:48.296', 'inactive');

-- --------------------------------------------------------

--
-- Table structure for table `Clients`
--

CREATE TABLE `Clients` (
  `id` int(11) NOT NULL,
  `salesRepId` int(11) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `address` varchar(191) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `balance` decimal(11,2) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `region_id` int(11) NOT NULL,
  `region` varchar(191) NOT NULL,
  `outlet_account` int(11) NOT NULL,
  `route_id` int(11) DEFAULT NULL,
  `route_name` varchar(191) DEFAULT NULL,
  `route_id_update` int(11) DEFAULT NULL,
  `route_name_update` varchar(100) DEFAULT NULL,
  `contact` varchar(191) NOT NULL,
  `tax_pin` varchar(191) DEFAULT NULL,
  `location` varchar(191) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `client_type` int(11) DEFAULT NULL,
  `countryId` int(11) NOT NULL,
  `added_by` int(11) DEFAULT NULL,
  `created_at` datetime(3) DEFAULT current_timestamp(3),
  `discountPercentage` double DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Clients`
--

INSERT INTO `Clients` (`id`, `salesRepId`, `name`, `address`, `latitude`, `longitude`, `balance`, `email`, `region_id`, `region`, `outlet_account`, `route_id`, `route_name`, `route_id_update`, `route_name_update`, `contact`, `tax_pin`, `location`, `status`, `client_type`, `countryId`, `added_by`, `created_at`, `discountPercentage`) VALUES
(1, 63, 'MINISO SARIT', 'Kenya', -1.2607772, 36.8016888, 0.00, NULL, 0, '', 1, NULL, 'WESTLANDS', 44, 'DODOMA', 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(2, 79, 'MINISO WESTGATE', 'Kenya', -1.2570443, 36.803133, NULL, NULL, 0, '', 1, NULL, NULL, NULL, NULL, 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(3, 82, 'MINISO HUB', 'Kenya', -1.3204357, 36.7038018, NULL, NULL, 0, '', 1, NULL, NULL, NULL, NULL, 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(4, 67, 'MINISO JUNCTION', 'Kenya', NULL, NULL, NULL, NULL, 0, '', 1, NULL, NULL, NULL, NULL, 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(5, NULL, 'MINISO YAYA', 'Kenya', -1.2930186, 36.7876109, NULL, NULL, 0, '', 1, NULL, NULL, NULL, NULL, 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(6, 86, 'MINISO SOUTHFIELD', 'Kenya', -1.3287807, 36.8906387, NULL, NULL, 0, '', 1, NULL, NULL, NULL, NULL, 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(7, 81, 'MINISO BBS', 'Kenya', 0, 0, 0.00, NULL, 0, '', 1, NULL, NULL, NULL, NULL, 'notprovided', '', NULL, 1, 2, 1, NULL, '2025-06-22 13:23:45.095', 25),
(8, 64, 'MINISO GARDEN CITY', 'Kenya', -1.2327165, 36.8785436, NULL, NULL, 0, '', 1, NULL, NULL, NULL, NULL, 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(9, 71, 'MINISO TRM', 'Kenya', -1.2196795, 36.8885403, NULL, NULL, 0, '', 1, NULL, NULL, NULL, NULL, 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(10, NULL, 'MINISO NORD', 'Kenya', NULL, NULL, NULL, NULL, 0, '', 1, NULL, NULL, NULL, NULL, 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(11, 84, 'MINISO RUNDA', 'Kenya', -1.2182119, 36.8089887, NULL, NULL, 0, '', 1, NULL, NULL, NULL, NULL, 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(12, 72, 'MINISO TWO RIVERS', 'Kenya', -1.2107912, 36.7952337, NULL, NULL, 0, '', 1, NULL, NULL, NULL, NULL, 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(13, 73, 'MINISO VILLAGE MARKET', 'Kenya', -1.2293818, 36.8047495, NULL, NULL, 0, '', 1, NULL, NULL, NULL, NULL, 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(14, NULL, 'MINISO UNITED MALL', 'Kenya', -0.0983823, 34.7625269, NULL, NULL, 0, '', 1, NULL, NULL, NULL, NULL, 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(15, 70, 'MINISO RUPAS', 'Kenya', NULL, NULL, NULL, NULL, 0, '', 1, NULL, NULL, NULL, NULL, 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(16, 68, 'MINISO LIKONI', 'Kenya', -4.1027192, 39.6454038, NULL, NULL, 0, '', 1, NULL, NULL, NULL, NULL, 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(17, 65, 'MINISO CITY MALL', 'Kenya', -4.0195589, 39.7210391, NULL, NULL, 0, '', 1, NULL, NULL, NULL, NULL, 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(18, 74, 'MINISO PROMINADE', 'Kenya', -4.0378888, 39.7064404, NULL, NULL, 0, '', 1, NULL, NULL, NULL, NULL, 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(19, 63, 'GOODLIFE SARIT', 'Kenya', -1.2607772, 36.8016888, NULL, NULL, 0, '', 2, 1, 'k', 1, 'k', 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 38),
(20, 78, 'GOODLIFE VILLAGE MARKET', 'Kenya', -1.2293818, 36.8047495, NULL, NULL, 0, '', 2, NULL, NULL, NULL, NULL, 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 38),
(21, 77, 'GOODLIFE GARDEN CITY', 'Kenya', -1.2327165, 36.8785436, NULL, NULL, 0, '', 2, NULL, NULL, 39, 'NAIROBI/MURANGA/KIRINYAGA', 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 38),
(22, 75, 'GOODLIFE TRM', 'Kenya', -1.2196795, 36.8885403, NULL, NULL, 0, '', 2, NULL, NULL, NULL, NULL, 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 38),
(23, NULL, 'AURORA CAPITAL CENTER', 'Kenya', -1.3164177, 36.8346625, 4845.00, NULL, 0, '', 3, 1, 'k', 1, 'k', 'notprovided', '123', NULL, 1, 2, 1, NULL, '2025-06-22 13:23:45.095', 40);

-- --------------------------------------------------------

--
-- Table structure for table `ClientStock`
--

CREATE TABLE `ClientStock` (
  `id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `clientId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `salesrepId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ClientStock`
--

INSERT INTO `ClientStock` (`id`, `quantity`, `clientId`, `productId`, `salesrepId`) VALUES
(1, 10, 22, 17, 2),
(2, 10, 22, 18, 2),
(3, 10, 22, 21, 2),
(4, 10, 22, 22, 2);

-- --------------------------------------------------------

--
-- Table structure for table `client_ledger`
--

CREATE TABLE `client_ledger` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `description` text NOT NULL,
  `reference_type` varchar(20) NOT NULL,
  `reference_id` int(11) NOT NULL,
  `debit` decimal(15,2) DEFAULT 0.00,
  `credit` decimal(15,2) DEFAULT 0.00,
  `running_balance` decimal(15,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `client_ledger`
--

INSERT INTO `client_ledger` (`id`, `client_id`, `date`, `description`, `reference_type`, `reference_id`, `debit`, `credit`, `running_balance`, `created_at`) VALUES
(1, 23, '2025-08-12', 'Invoice - INV-6', 'sales_order', 6, 995.00, 0.00, 995.00, '2025-08-12 10:18:49'),
(2, 23, '2025-08-12', 'Invoice - INV-7', 'sales_order', 7, 3850.00, 0.00, 4845.00, '2025-08-12 13:21:02');

-- --------------------------------------------------------

--
-- Table structure for table `client_payments`
--

CREATE TABLE `client_payments` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `invoice_id` int(11) DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `payment_date` datetime NOT NULL DEFAULT current_timestamp(),
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Country`
--

CREATE TABLE `Country` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `status` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Country`
--

INSERT INTO `Country` (`id`, `name`, `status`) VALUES
(1, 'Kenya', 0);

-- --------------------------------------------------------

--
-- Table structure for table `credit_notes`
--

CREATE TABLE `credit_notes` (
  `id` int(11) NOT NULL,
  `credit_note_number` varchar(50) NOT NULL,
  `client_id` int(11) NOT NULL,
  `original_invoice_id` int(11) DEFAULT NULL,
  `credit_note_date` date NOT NULL,
  `total_amount` decimal(15,2) DEFAULT 0.00,
  `subtotal` decimal(11,2) NOT NULL,
  `tax_amount` decimal(11,2) NOT NULL,
  `reason` text NOT NULL,
  `status` enum('draft','issued','cancelled') DEFAULT 'draft',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `received_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `credit_note_items`
--

CREATE TABLE `credit_note_items` (
  `id` int(11) NOT NULL,
  `credit_note_id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit_price` decimal(15,2) NOT NULL,
  `total_price` decimal(15,2) NOT NULL,
  `reason` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `customer_code` varchar(20) NOT NULL,
  `company_name` varchar(100) NOT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `tax_id` varchar(50) DEFAULT NULL,
  `payment_terms` int(11) DEFAULT 30,
  `credit_limit` decimal(15,2) DEFAULT 0.00,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `country_id` int(11) DEFAULT NULL,
  `region_id` int(11) DEFAULT NULL,
  `route_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `distributors_targets`
--

CREATE TABLE `distributors_targets` (
  `id` int(11) NOT NULL,
  `sales_rep_id` int(11) NOT NULL,
  `vapes_targets` int(11) DEFAULT 0,
  `pouches_targets` int(11) DEFAULT 0,
  `new_outlets_targets` int(11) DEFAULT 0,
  `target_month` varchar(7) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `start_date` date NOT NULL,
  `end_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_contracts`
--

CREATE TABLE `employee_contracts` (
  `id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `renewed_from` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_documents`
--

CREATE TABLE `employee_documents` (
  `id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_warnings`
--

CREATE TABLE `employee_warnings` (
  `id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `issued_by` varchar(100) DEFAULT NULL,
  `issued_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faulty_products_items`
--

CREATE TABLE `faulty_products_items` (
  `id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `fault_comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faulty_products_reports`
--

CREATE TABLE `faulty_products_reports` (
  `id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `reported_by` int(11) NOT NULL,
  `reported_date` date NOT NULL,
  `status` enum('Reported','Under Investigation','Being Repaired','Repaired','Replaced','Disposed','Closed') DEFAULT 'Reported',
  `assigned_to` int(11) DEFAULT NULL,
  `resolution_notes` text DEFAULT NULL,
  `document_url` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `FeedbackReport`
--

CREATE TABLE `FeedbackReport` (
  `comment` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `clientId` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `FeedbackReport`
--

INSERT INTO `FeedbackReport` (`comment`, `createdAt`, `clientId`, `id`, `userId`) VALUES
('test', '2025-08-12 15:46:10.107', 23, 1, 2),
('c', '2025-08-12 16:57:39.958', 19, 3, 2),
('test', '2025-08-12 17:03:49.249', 19, 4, 2),
('test', '2025-08-12 18:42:45.961', 19, 5, 2),
('ggg', '2025-08-12 18:46:13.963', 19, 6, 2),
('d', '2025-08-12 18:53:30.418', 19, 7, 2);

-- --------------------------------------------------------

--
-- Table structure for table `hr_calendar_tasks`
--

CREATE TABLE `hr_calendar_tasks` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT '',
  `description` text DEFAULT NULL,
  `status` enum('Pending','In Progress','Completed') DEFAULT 'Pending',
  `assigned_to` varchar(100) DEFAULT NULL,
  `text` varchar(255) NOT NULL,
  `recurrence_type` enum('none','daily','weekly','monthly') DEFAULT 'none',
  `recurrence_end` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `hr_calendar_tasks`
--

INSERT INTO `hr_calendar_tasks` (`id`, `date`, `title`, `description`, `status`, `assigned_to`, `text`, `recurrence_type`, `recurrence_end`, `created_at`, `updated_at`) VALUES
(1, '2025-08-12', 'testing', 'test here', 'Pending', 'Benjamin Okwama', '', 'none', NULL, '2025-08-11 18:42:13', '2025-08-12 11:25:10');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_receipts`
--

CREATE TABLE `inventory_receipts` (
  `id` int(11) NOT NULL,
  `purchase_order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `received_quantity` int(11) NOT NULL,
  `received_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `received_by` int(11) NOT NULL DEFAULT 1,
  `unit_cost` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_cost` decimal(15,2) NOT NULL DEFAULT 0.00,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory_transactions`
--

CREATE TABLE `inventory_transactions` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `amount_in` decimal(12,2) DEFAULT 0.00,
  `amount_out` decimal(12,2) DEFAULT 0.00,
  `balance` decimal(12,2) DEFAULT 0.00,
  `date_received` datetime NOT NULL,
  `store_id` int(11) NOT NULL,
  `unit_cost` decimal(11,2) NOT NULL,
  `total_cost` decimal(11,2) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `inventory_transactions`
--

INSERT INTO `inventory_transactions` (`id`, `product_id`, `reference`, `amount_in`, `amount_out`, `balance`, `date_received`, `store_id`, `unit_cost`, `total_cost`, `staff_id`, `created_at`) VALUES
(1, 2, 'Manual Stock Update', 5196.00, 0.00, 5196.00, '2025-08-12 14:39:43', 1, 0.00, 0.00, 1, '2025-08-12 12:39:43'),
(2, 1, 'Manual Stock Update', 4508.00, 0.00, 4508.00, '2025-08-12 14:41:51', 1, 0.00, 0.00, 1, '2025-08-12 12:41:51'),
(3, 27, 'Manual Stock Update', 104.00, 0.00, 104.00, '2025-08-12 14:43:41', 1, 0.00, 0.00, 1, '2025-08-12 12:43:41'),
(4, 28, 'Manual Stock Update', 216.00, 0.00, 216.00, '2025-08-12 14:43:59', 1, 0.00, 0.00, 1, '2025-08-12 12:43:59'),
(5, 19, 'Manual Stock Update', 348.00, 0.00, 348.00, '2025-08-12 14:44:18', 1, 0.00, 0.00, 1, '2025-08-12 12:44:18'),
(6, 20, 'Manual Stock Update', 59.00, 0.00, 59.00, '2025-08-12 14:44:34', 1, 0.00, 0.00, 1, '2025-08-12 12:44:34'),
(7, 25, 'Manual Stock Update', 105.00, 0.00, 105.00, '2025-08-12 14:45:00', 1, 0.00, 0.00, 1, '2025-08-12 12:45:00'),
(8, 24, 'Manual Stock Update', 236.00, 0.00, 236.00, '2025-08-12 14:45:25', 1, 0.00, 0.00, 1, '2025-08-12 12:45:25'),
(9, 23, 'Manual Stock Update', 348.00, 0.00, 348.00, '2025-08-12 14:45:49', 1, 0.00, 0.00, 1, '2025-08-12 12:45:49'),
(10, 24, 'Manual Stock Update', 145.00, 0.00, 381.00, '2025-08-12 14:46:13', 1, 0.00, 0.00, 1, '2025-08-12 12:46:13'),
(11, 21, 'Manual Stock Update', 293.00, 0.00, 293.00, '2025-08-12 14:46:35', 1, 0.00, 0.00, 1, '2025-08-12 12:46:35'),
(12, 22, 'Manual Stock Update', 239.00, 0.00, 239.00, '2025-08-12 14:46:58', 1, 0.00, 0.00, 1, '2025-08-12 12:46:58'),
(13, 11, 'Manual Stock Update', 1217.00, 0.00, 1217.00, '2025-08-12 15:13:20', 1, 0.00, 0.00, 1, '2025-08-12 13:13:20'),
(14, 13, 'Manual Stock Update', 464.00, 0.00, 464.00, '2025-08-12 15:13:36', 1, 0.00, 0.00, 1, '2025-08-12 13:13:36'),
(15, 10, 'Manual Stock Update', 1033.00, 0.00, 1033.00, '2025-08-12 15:13:52', 1, 0.00, 0.00, 1, '2025-08-12 13:13:52'),
(16, 12, 'Manual Stock Update', 1614.00, 0.00, 1614.00, '2025-08-12 15:14:11', 1, 0.00, 0.00, 1, '2025-08-12 13:14:11'),
(17, 14, 'Manual Stock Update', 1642.00, 0.00, 1642.00, '2025-08-12 15:14:36', 1, 0.00, 0.00, 1, '2025-08-12 13:14:36'),
(18, 8, 'Manual Stock Update', 1575.00, 0.00, 1575.00, '2025-08-12 15:14:57', 1, 0.00, 0.00, 1, '2025-08-12 13:14:57'),
(19, 7, 'Manual Stock Update', 1189.00, 0.00, 1189.00, '2025-08-12 15:15:14', 1, 0.00, 0.00, 1, '2025-08-12 13:15:14'),
(20, 3, 'Manual Stock Update', 3916.00, 0.00, 3916.00, '2025-08-12 15:15:43', 1, 0.00, 0.00, 1, '2025-08-12 13:15:43'),
(21, 15, 'Manual Stock Update', 2081.00, 0.00, 2081.00, '2025-08-12 15:16:07', 1, 0.00, 0.00, 1, '2025-08-12 13:16:07'),
(22, 15, 'Manual Stock Update', 3410.00, 0.00, 5491.00, '2025-08-12 15:16:38', 1, 0.00, 0.00, 1, '2025-08-12 13:16:38'),
(23, 5, 'Manual Stock Update', 2553.00, 0.00, 2553.00, '2025-08-12 15:17:41', 1, 0.00, 0.00, 1, '2025-08-12 13:17:41'),
(24, 4, 'Manual Stock Update', 3034.00, 0.00, 3034.00, '2025-08-12 15:17:53', 1, 0.00, 0.00, 1, '2025-08-12 13:17:53'),
(25, 6, 'Manual Stock Update', 3528.00, 0.00, 3528.00, '2025-08-12 15:18:27', 1, 0.00, 0.00, 1, '2025-08-12 13:18:27');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_transfers`
--

CREATE TABLE `inventory_transfers` (
  `id` int(11) NOT NULL,
  `from_store_id` int(11) NOT NULL,
  `to_store_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` decimal(12,2) NOT NULL,
  `transfer_date` datetime NOT NULL,
  `staff_id` int(11) NOT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `journal_entries`
--

CREATE TABLE `journal_entries` (
  `id` int(11) NOT NULL,
  `entry_number` varchar(20) NOT NULL,
  `entry_date` date NOT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `total_debit` decimal(15,2) DEFAULT 0.00,
  `total_credit` decimal(15,2) DEFAULT 0.00,
  `status` enum('draft','posted','cancelled') DEFAULT 'draft',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `journal_entries`
--

INSERT INTO `journal_entries` (`id`, `entry_number`, `entry_date`, `reference`, `description`, `total_debit`, `total_credit`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'JE-INV-6-17549939307', '2025-08-12', 'INV-6', 'Invoice created from order - SO-000006', 995.00, 995.00, 'posted', 1, '2025-08-12 10:18:49', '2025-08-12 10:18:49'),
(2, 'JE-INV-7-17550048632', '2025-08-12', 'INV-7', 'Invoice created from order - SO-000007', 3850.00, 3850.00, 'posted', 1, '2025-08-12 13:21:02', '2025-08-12 13:21:02');

-- --------------------------------------------------------

--
-- Table structure for table `journal_entry_lines`
--

CREATE TABLE `journal_entry_lines` (
  `id` int(11) NOT NULL,
  `journal_entry_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `debit_amount` decimal(15,2) DEFAULT 0.00,
  `credit_amount` decimal(15,2) DEFAULT 0.00,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `journal_entry_lines`
--

INSERT INTO `journal_entry_lines` (`id`, `journal_entry_id`, `account_id`, `debit_amount`, `credit_amount`, `description`) VALUES
(1, 1, 140, 995.00, 0.00, 'Invoice INV-6'),
(2, 1, 3, 0.00, 857.76, 'Sales revenue for invoice INV-6'),
(3, 2, 140, 3850.00, 0.00, 'Invoice INV-7'),
(4, 2, 3, 0.00, 3318.97, 'Sales revenue for invoice INV-7');

-- --------------------------------------------------------

--
-- Table structure for table `JourneyPlan`
--

CREATE TABLE `JourneyPlan` (
  `id` int(11) NOT NULL,
  `date` datetime(3) NOT NULL,
  `time` varchar(191) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `clientId` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `checkInTime` datetime(3) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `imageUrl` varchar(191) DEFAULT NULL,
  `notes` varchar(191) DEFAULT NULL,
  `checkoutLatitude` double DEFAULT NULL,
  `checkoutLongitude` double DEFAULT NULL,
  `checkoutTime` datetime(3) DEFAULT NULL,
  `showUpdateLocation` tinyint(1) NOT NULL DEFAULT 1,
  `routeId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `JourneyPlan`
--

INSERT INTO `JourneyPlan` (`id`, `date`, `time`, `userId`, `clientId`, `status`, `checkInTime`, `latitude`, `longitude`, `imageUrl`, `notes`, `checkoutLatitude`, `checkoutLongitude`, `checkoutTime`, `showUpdateLocation`, `routeId`) VALUES
(9, '2025-08-12 18:45:46.120', '18:45:46', 2, 19, 3, '2025-08-12 18:45:54.846', -1.3008978450663726, 36.777742416894895, 'https://res.cloudinary.com/otienobryan/image/upload/v1755013556/whoosh/uploads/upload_1755013554757_2.jpg', NULL, -1.3008978450663726, 36.777742416894895, '2025-08-12 18:46:34.026', 1, NULL),
(10, '2025-08-12 18:52:38.746', '18:52:38', 2, 19, 3, '2025-08-12 18:52:51.646', -1.3008978450663726, 36.777742416894895, 'https://res.cloudinary.com/otienobryan/image/upload/v1755013973/whoosh/uploads/upload_1755013969744_2.jpg', NULL, -1.3008978450663726, 36.777742416894895, '2025-08-12 18:53:33.385', 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `key_account_targets`
--

CREATE TABLE `key_account_targets` (
  `id` int(11) NOT NULL,
  `sales_rep_id` int(11) NOT NULL,
  `vapes_targets` int(11) DEFAULT 0,
  `pouches_targets` int(11) DEFAULT 0,
  `new_outlets_targets` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `target_month` varchar(7) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `LeaveRequestSummary`
--

CREATE TABLE `LeaveRequestSummary` (
  `id` int(11) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `leave_type_id` int(11) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_half_day` tinyint(1) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `attachment_url` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','rejected','cancelled') DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `employee_type_id` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `applied_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `employee_name` varchar(255) DEFAULT NULL,
  `employee_email` varchar(255) DEFAULT NULL,
  `employee_phone` varchar(50) DEFAULT NULL,
  `leave_type_name` varchar(100) DEFAULT NULL,
  `leave_type_default_days` int(11) DEFAULT NULL,
  `approver_name` varchar(255) DEFAULT NULL,
  `total_days_requested` int(9) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leaves`
--

CREATE TABLE `leaves` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `leaveType` varchar(191) NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `reason` varchar(191) NOT NULL,
  `attachment` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leaves`
--

INSERT INTO `leaves` (`id`, `userId`, `leaveType`, `startDate`, `endDate`, `reason`, `attachment`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'Annual Leave', '2025-08-12 00:00:00.000', '2025-08-22 00:00:00.000', 'just a round test', NULL, 'PENDING', '2025-08-12 17:06:36.471', '0000-00-00 00:00:00.000');

-- --------------------------------------------------------

--
-- Table structure for table `leave_balances`
--

CREATE TABLE `leave_balances` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `leave_type_id` int(11) NOT NULL,
  `year` int(4) NOT NULL,
  `total_days` int(11) NOT NULL DEFAULT 0,
  `used_days` int(11) NOT NULL DEFAULT 0,
  `remaining_days` int(11) NOT NULL DEFAULT 0,
  `carried_over_days` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leave_balances`
--

INSERT INTO `leave_balances` (`id`, `employee_id`, `leave_type_id`, `year`, `total_days`, `used_days`, `remaining_days`, `carried_over_days`, `created_at`, `updated_at`) VALUES
(1, 8, 1, 2025, 21, 0, 21, 0, '2025-07-18 13:54:34', '2025-07-18 13:54:34'),
(2, 8, 2, 2025, 14, 0, 14, 0, '2025-07-18 13:54:34', '2025-07-18 13:54:34'),
(3, 8, 3, 2025, 90, 0, 90, 0, '2025-07-18 13:54:34', '2025-07-18 13:54:34'),
(4, 8, 4, 2025, 14, 0, 14, 0, '2025-07-18 13:54:34', '2025-07-18 13:54:34'),
(5, 8, 5, 2025, 5, 0, 5, 0, '2025-07-18 13:54:34', '2025-07-18 13:54:34'),
(6, 8, 6, 2025, 10, 0, 10, 0, '2025-07-18 13:54:34', '2025-07-18 13:54:34'),
(7, 8, 7, 2025, 0, 0, 0, 0, '2025-07-18 13:54:34', '2025-07-18 13:54:34'),
(8, 8, 8, 2025, 0, 0, 0, 0, '2025-07-18 13:54:34', '2025-07-18 13:54:34');

-- --------------------------------------------------------

--
-- Table structure for table `leave_requests`
--

CREATE TABLE `leave_requests` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `leave_type_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_half_day` tinyint(1) NOT NULL DEFAULT 0,
  `reason` varchar(255) DEFAULT NULL,
  `attachment_url` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','rejected','cancelled') NOT NULL DEFAULT 'pending',
  `approved_by` int(11) DEFAULT NULL,
  `employee_type_id` int(11) DEFAULT NULL,
  `salesrep` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `applied_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leave_requests`
--

INSERT INTO `leave_requests` (`id`, `employee_id`, `leave_type_id`, `start_date`, `end_date`, `is_half_day`, `reason`, `attachment_url`, `status`, `approved_by`, `employee_type_id`, `salesrep`, `notes`, `applied_at`, `created_at`, `updated_at`) VALUES
(1, NULL, 1, '2025-08-12', '2025-08-22', 0, 'just a round test', NULL, 'pending', NULL, NULL, 2, NULL, '2025-08-12 17:06:37', '2025-08-12 15:06:37', '2025-08-12 15:06:37');

-- --------------------------------------------------------

--
-- Table structure for table `leave_types`
--

CREATE TABLE `leave_types` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `default_days` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leave_types`
--

INSERT INTO `leave_types` (`id`, `name`, `description`, `default_days`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Annual Leave', 'Regular annual leave entitlement', 21, 1, '2025-07-18 13:39:49', '2025-07-18 13:39:49'),
(2, 'Sick Leave', 'Medical and health-related leave', 14, 1, '2025-07-18 13:39:49', '2025-07-18 13:39:49'),
(3, 'Maternity Leave', 'Leave for expecting mothers', 90, 1, '2025-07-18 13:39:49', '2025-07-18 13:39:49'),
(4, 'Paternity Leave', 'Leave for new fathers', 14, 1, '2025-07-18 13:39:49', '2025-07-18 13:39:49'),
(5, 'Bereavement Leave', 'Leave for family bereavement', 5, 0, '2025-07-18 13:39:49', '2025-08-12 15:04:55'),
(6, 'Study Leave', 'Leave for educational purposes', 10, 0, '2025-07-18 13:39:49', '2025-08-12 15:04:59'),
(7, 'Unpaid Leave', 'Leave without pay', 0, 0, '2025-07-18 13:39:49', '2025-08-12 15:05:02'),
(8, 'Public Holiday', 'Official public holidays', 0, 0, '2025-07-18 13:39:49', '2025-08-12 15:05:06');

-- --------------------------------------------------------

--
-- Table structure for table `LoginHistory`
--

CREATE TABLE `LoginHistory` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `timezone` varchar(191) DEFAULT 'UTC',
  `duration` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT 0,
  `sessionEnd` varchar(191) DEFAULT NULL,
  `sessionStart` varchar(191) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `LoginHistory`
--

INSERT INTO `LoginHistory` (`id`, `userId`, `timezone`, `duration`, `status`, `sessionEnd`, `sessionStart`) VALUES
(2242, 2, 'Africa/Nairobi', 0, 1, NULL, '2025-08-12 17:20:50.000');

-- --------------------------------------------------------

--
-- Table structure for table `managers`
--

CREATE TABLE `managers` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phoneNumber` varchar(20) NOT NULL,
  `managerType` enum('retail','distribution','key_account') NOT NULL,
  `managerTypeId` tinyint(3) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `country` varchar(100) DEFAULT NULL,
  `region_id` int(3) NOT NULL,
  `region` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `my_assets`
--

CREATE TABLE `my_assets` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(50) NOT NULL,
  `asset_name` varchar(255) NOT NULL,
  `asset_type` varchar(100) NOT NULL,
  `purchase_date` date NOT NULL,
  `location` varchar(255) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `document_url` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `my_receipts`
--

CREATE TABLE `my_receipts` (
  `id` int(11) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `receipt_date` date NOT NULL,
  `document_path` varchar(500) NOT NULL,
  `original_filename` varchar(255) NOT NULL,
  `file_size` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `NoticeBoard`
--

CREATE TABLE `NoticeBoard` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `content` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `countryId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notices`
--

CREATE TABLE `notices` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `country_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` tinyint(3) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `notices`
--

INSERT INTO `notices` (`id`, `title`, `content`, `country_id`, `created_at`, `status`) VALUES
(1, 'test', 'testing', 1, '2025-08-11 18:41:51', 0);

-- --------------------------------------------------------

--
-- Table structure for table `outlet_categories`
--

CREATE TABLE `outlet_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `out_of_office_requests`
--

CREATE TABLE `out_of_office_requests` (
  `id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `reason` varchar(255) NOT NULL,
  `comment` text DEFAULT NULL,
  `status` enum('pending','approved','declined') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `payment_number` varchar(20) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `purchase_order_id` int(11) DEFAULT NULL,
  `payment_date` date NOT NULL,
  `payment_method` enum('cash','check','bank_transfer','credit_card') NOT NULL,
  `reference_number` varchar(50) DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `account_id` int(11) DEFAULT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `status` enum('in pay','confirmed') DEFAULT 'in pay'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payroll_history`
--

CREATE TABLE `payroll_history` (
  `id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `pay_date` date NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ProductReport`
--

CREATE TABLE `ProductReport` (
  `productName` varchar(191) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `comment` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `clientId` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `productId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ProductReport`
--

INSERT INTO `ProductReport` (`productName`, `quantity`, `comment`, `createdAt`, `clientId`, `id`, `userId`, `productId`) VALUES
('GLAMAOUR QUEEN EYELASHES Rounded Volumizing', 10, '', '2025-08-12 15:45:19.761', 23, 1, 2, 26),
('GLAMAOUR QUEEN EYEBROW PENCIL Black', 110, '', '2025-08-12 16:05:01.176', 19, 2, 2, 17),
('GLAMAOUR QUEEN LIQUID LIPSTICK Wildnight', 10, 'test\n', '2025-08-12 17:03:25.496', 19, 4, 2, 9),
('GLAMAOUR QUEEN EYEBROW PENCIL Black', 10, '', '2025-08-12 18:42:31.562', 19, 5, 2, 17),
('GLAMAOUR QUEEN EYELASHES Naked Sexy', 10, '', '2025-08-12 18:42:31.562', 19, 6, 2, 19),
('GLAMAOUR QUEEN LIQUID LIPSTICK No limit', 10, '', '2025-08-12 18:42:31.562', 19, 7, 2, 14),
('GLAMAOUR QUEEN EYEBROW PENCIL Black', 20, '', '2025-08-12 18:46:01.478', 19, 8, 2, 17),
(NULL, NULL, NULL, '2025-08-12 17:53:20.970', 19, 9, 2, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `product_code` varchar(20) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `unit_of_measure` varchar(20) DEFAULT 'PCS',
  `cost_price` decimal(10,2) DEFAULT 0.00,
  `selling_price` decimal(10,2) DEFAULT 0.00,
  `tax_type` enum('16%','zero_rated','exempted') DEFAULT '16%',
  `reorder_level` int(11) DEFAULT 0,
  `current_stock` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `image_url` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `product_code`, `product_name`, `description`, `category_id`, `category`, `unit_of_measure`, `cost_price`, `selling_price`, `tax_type`, `reorder_level`, `current_stock`, `is_active`, `created_at`, `updated_at`, `image_url`) VALUES
(1, 'GQ001', 'GLAMAOUR QUEEN HIGHLIGHTER Deser Rose Pink Gold', NULL, 1, 'Highlighters', 'PCS', 2500.00, 2500.00, '16%', 0, 0, 1, '2025-06-22 11:39:41', '2025-06-22 12:38:00', 'https://ik.imagekit.io/bja2qwwdjjy/glamour_JpRmrZIDQN.webp?updatedAt=1745913190192'),
(2, 'GQ002', 'GLAMAOUR QUEEN HIGHLIGHTER Deser Rose Gold', NULL, 1, 'Highlighters', 'PCS', 2500.00, 2500.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-22 12:38:00', ''),
(3, 'GQ003', 'GLAMAOUR QUEEN LIQUID EYELINER Black', '', 2, 'Eyeliners', 'PCS', 1600.00, 1600.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-25 08:25:47', 'https://citlogisticssystems.com/glamour_queen/upload/products/product_3_1750839947.png'),
(4, 'GQ004', 'GLAMAOUR QUEEN EYESHADOW PALETTE Sunset Sahara', '', 3, 'Eyeshadows', 'PCS', 3850.00, 3850.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-25 08:26:33', 'https://citlogisticssystems.com/glamour_queen/upload/products/product_4_1750839993.png'),
(5, 'GQ005', 'GLAMAOUR QUEEN EYESHADOW PALETTE Sunrise Kilimanjaro', '', 3, 'Eyeshadows', 'PCS', 3850.00, 3850.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-25 08:26:52', 'https://citlogisticssystems.com/glamour_queen/upload/products/product_5_1750840012.png'),
(6, 'GQ006', 'GLAMAOUR QUEEN EYESHADOW PALETTE Midnight Nile', NULL, 3, 'Eyeshadows', 'PCS', 3850.00, 3850.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-22 12:38:00', ''),
(7, 'GQ007', 'GLAMAOUR QUEEN LIQUID LIPSTICK Crush On You', NULL, 4, 'Lipsticks', 'PCS', 2450.00, 2450.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-22 12:38:00', ''),
(8, 'GQ008', 'GLAMAOUR QUEEN LIQUID LIPSTICK Crazy In Love', NULL, 4, 'Lipsticks', 'PCS', 2450.00, 2450.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-22 12:38:00', ''),
(9, 'GQ009', 'GLAMAOUR QUEEN LIQUID LIPSTICK Wildnight', NULL, 4, 'Lipsticks', 'PCS', 2450.00, 2450.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-22 12:38:00', ''),
(10, 'GQ010', 'GLAMAOUR QUEEN LIQUID LIPSTICK Bitterness Kiss', NULL, 4, 'Lipsticks', 'PCS', 2450.00, 2450.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-22 12:38:00', ''),
(11, 'GQ011', 'GLAMAOUR QUEEN LIQUID LIPSTICK Don\'t Shush Me', NULL, 4, 'Lipsticks', 'PCS', 2450.00, 2450.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-22 12:38:00', ''),
(12, 'GQ012', 'GLAMAOUR QUEEN LIQUID LIPSTICK Say My Name', NULL, 4, 'Lipsticks', 'PCS', 2450.00, 2450.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-22 12:38:00', ''),
(13, 'GQ013', 'GLAMAOUR QUEEN LIQUID LIPSTICK Boss In Skirt', NULL, 4, 'Lipsticks', 'PCS', 2450.00, 2450.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-22 12:38:00', ''),
(14, 'GQ014', 'GLAMAOUR QUEEN LIQUID LIPSTICK No limit', NULL, 4, 'Lipsticks', 'PCS', 2450.00, 2450.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-22 12:38:00', ''),
(15, 'GQ015', 'GLAMAOUR QUEEN INTERSTELLAR Colour Changing Lip Balm', NULL, 5, 'Lip Balms', 'PCS', 1100.00, 1100.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-22 12:38:00', ''),
(16, 'GQ016', 'GLAMAOUR QUEEN INTERSTELLAR Moisturizing Lip Balm', NULL, 5, 'Lip Balms', 'PCS', 1000.00, 1000.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-22 12:38:00', ''),
(17, 'GQ017', 'GLAMAOUR QUEEN EYEBROW PENCIL Black', '', 6, 'Eyebrows', 'PCS', 1400.00, 1400.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-25 08:15:56', './upload/products/product_17_1750839356.jpg'),
(18, 'GQ018', 'GLAMAOUR QUEEN EYEBROW PENCIL Deep Brown', '', 6, 'Eyebrows', 'PCS', 1400.00, 1400.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-25 08:21:20', 'https://citlogisticssystems.com/glamour_queen/upload/products/product_18_1750839680.jpg'),
(19, 'GQ019', 'GLAMAOUR QUEEN EYELASHES Naked Sexy', NULL, 7, 'Eyelashes', 'PCS', 995.00, 995.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-22 12:38:00', ''),
(20, 'GQ020', 'GLAMAOUR QUEEN EYELASHES Naked Natural', '', 7, 'Eyelashes', 'PCS', 995.00, 995.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-25 08:28:20', 'https://citlogisticssystems.com/glamour_queen/upload/products/product_20_1750840100.png'),
(21, 'GQ021', 'GLAMAOUR QUEEN EYELASHES Doll Natural', NULL, 7, 'Eyelashes', 'PCS', 995.00, 995.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-22 12:38:00', ''),
(22, 'GQ022', 'GLAMAOUR QUEEN EYELASHES Doll Volumizing', NULL, 7, 'Eyelashes', 'PCS', 995.00, 995.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-22 12:38:00', ''),
(23, 'GQ023', 'GLAMAOUR QUEEN EYELASHES Drama Lengthening', NULL, 7, 'Eyelashes', 'PCS', 995.00, 995.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-22 12:38:00', ''),
(24, 'GQ024', 'GLAMAOUR QUEEN EYELASHES Drama Volumizing', NULL, 7, 'Eyelashes', 'PCS', 995.00, 995.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-22 12:38:00', ''),
(25, 'GQ025', 'GLAMAOUR QUEEN EYELASHES Rounded Lengthening', NULL, 7, 'Eyelashes', 'PCS', 995.00, 995.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-22 12:38:00', ''),
(26, 'GQ026', 'GLAMAOUR QUEEN EYELASHES Rounded Volumizing', NULL, 7, 'Eyelashes', 'PCS', 995.00, 995.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-22 12:38:00', ''),
(27, 'GQ027', 'GLAMAOUR QUEEN EYELASHES Flared Lengthening', NULL, 7, 'Eyelashes', 'PCS', 995.00, 995.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-22 12:38:00', ''),
(28, 'GQ028', 'GLAMAOUR QUEEN EYELASHES Flared Volumizing', NULL, 7, 'Eyelashes', 'PCS', 995.00, 995.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-22 12:38:00', ''),
(29, 'GQ029', 'GLAMAOUR QUEEN GLAM SAFARI GLOW GLAM LASHES Waridi', NULL, 8, 'Glam Lashes', 'PCS', 1100.00, 1100.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-22 12:38:00', ''),
(30, 'GQ030', 'GLAMAOUR QUEEN GLAM SAFARI GLOW GLAM LASHES Nuru', NULL, 8, 'Glam Lashes', 'PCS', 1000.00, 1000.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-22 12:38:00', ''),
(31, 'GQ031', 'GLAMAOUR QUEEN GLAM SAFARI GLOW GLAM LASHES Nibusu', NULL, 8, 'Glam Lashes', 'PCS', 1100.00, 1100.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-06-22 12:38:00', '');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_orders`
--

CREATE TABLE `purchase_orders` (
  `id` int(11) NOT NULL,
  `po_number` varchar(20) NOT NULL,
  `invoice_number` varchar(200) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `order_date` date NOT NULL,
  `expected_delivery_date` date DEFAULT NULL,
  `status` enum('draft','sent','received','cancelled') DEFAULT 'draft',
  `subtotal` decimal(15,2) DEFAULT 0.00,
  `tax_amount` decimal(15,2) DEFAULT 0.00,
  `total_amount` decimal(15,2) DEFAULT 0.00,
  `amount_paid` decimal(11,2) NOT NULL,
  `balance` decimal(11,2) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_order_items`
--

CREATE TABLE `purchase_order_items` (
  `id` int(11) NOT NULL,
  `purchase_order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(15,2) NOT NULL,
  `received_quantity` int(11) DEFAULT 0,
  `tax_amount` decimal(15,2) DEFAULT 0.00,
  `tax_type` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `receipts`
--

CREATE TABLE `receipts` (
  `id` int(11) NOT NULL,
  `receipt_number` varchar(20) NOT NULL,
  `client_id` int(11) NOT NULL,
  `invoice_number` int(50) NOT NULL,
  `sales_order_id` int(11) DEFAULT NULL,
  `receipt_date` date NOT NULL,
  `payment_method` enum('cash','check','bank_transfer','credit_card') NOT NULL,
  `reference_number` varchar(50) DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` enum('draft','in pay','confirmed','cancelled') DEFAULT 'draft',
  `account_id` int(11) DEFAULT NULL,
  `reference` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Regions`
--

CREATE TABLE `Regions` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `countryId` int(11) NOT NULL,
  `status` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Regions`
--

INSERT INTO `Regions` (`id`, `name`, `countryId`, `status`) VALUES
(1, 'Nairobi', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `retail_targets`
--

CREATE TABLE `retail_targets` (
  `id` int(11) NOT NULL,
  `sales_rep_id` int(11) NOT NULL,
  `vapes_targets` int(11) DEFAULT 0,
  `pouches_targets` int(11) DEFAULT 0,
  `new_outlets_targets` int(11) DEFAULT 0,
  `target_month` varchar(7) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `start_date` date NOT NULL,
  `end_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Riders`
--

CREATE TABLE `Riders` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `contact` varchar(191) NOT NULL,
  `id_number` varchar(191) NOT NULL,
  `company_id` int(11) NOT NULL,
  `company` varchar(191) NOT NULL,
  `status` int(11) DEFAULT NULL,
  `password` varchar(191) DEFAULT NULL,
  `device_id` varchar(191) DEFAULT NULL,
  `device_name` varchar(191) DEFAULT NULL,
  `device_status` varchar(191) DEFAULT NULL,
  `token` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Riders`
--

INSERT INTO `Riders` (`id`, `name`, `contact`, `id_number`, `company_id`, `company`, `status`, `password`, `device_id`, `device_name`, `device_status`, `token`) VALUES
(1, 'Rider 1', '0712345678', '12345678', 0, '', NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(119) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`) VALUES
(1, 'SALES_REP'),
(2, 'RELIEVER');

-- --------------------------------------------------------

--
-- Table structure for table `routes`
--

CREATE TABLE `routes` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `region` int(11) NOT NULL,
  `region_name` varchar(100) NOT NULL,
  `country_id` int(11) NOT NULL,
  `country_name` varchar(100) NOT NULL,
  `leader_id` int(11) NOT NULL,
  `leader_name` varchar(100) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `routes`
--

INSERT INTO `routes` (`id`, `name`, `region`, `region_name`, `country_id`, `country_name`, `leader_id`, `leader_name`, `status`) VALUES
(1, 'CBD/HURLINGHAM/KILIMANI', 1, 'Nairobi', 1, 'Kenya', 1, 'Benjamin', 1),
(2, 'THIKA RD/KASARANI/TRM/RUIRU/KIMBO/JUJA', 1, 'Nairobi', 1, 'Kenya', 1, 'Benjamin', 1),
(3, 'Narok /Maasai Mara', 1, 'Nairobi', 1, '', 0, '', 1),
(4, 'NAIVASHA/NYANDARUA/GILGIL/NYAHURURU', 0, '', 1, '', 0, '', 1),
(5, 'COAST', 0, '', 1, '', 0, '', 1),
(6, 'MACHAKOS', 0, '', 1, '', 0, '', 1),
(7, 'NAKURU EAST/NAKURU WEST', 0, '', 1, '', 0, '', 1),
(8, 'ELDORET/KITALE/BUNGOMA', 0, '', 1, '', 0, '', 1),
(9, 'ARUSHA/DODOMA/DAR ES SALAAM', 0, '', 1, '', 0, '', 1),
(10, 'DIANI/UKUNDA', 0, '', 1, '', 0, '', 1),
(11, 'MOMBASA RD/OUTERING/SOUTH B/UTAWALA/BURUBURU', 0, '', 1, '', 0, '', 1),
(12, 'BAMBURI/MTAWAPA/NYALI', 0, '', 1, '', 0, '', 1),
(13, 'SOUTH B/LANGATA/RONGAI/MADARAKA', 0, '', 1, '', 0, '', 1),
(14, 'MSA RD/KITENGELA/ATHI RIVER/BELLEVUE/MACHAKOS TOWN', 0, '', 1, '', 0, '', 1),
(15, 'KAHAWA WEST/JUJA/THIKA/KENOL', 0, '', 1, '', 0, '', 1),
(16, 'PARKLANDS/RUAKA/LIMURU RD/BANANA/EASTLEIGH/PANGANI', 0, '', 1, '', 0, '', 1),
(17, 'JOGOO RD/KAYOLE/KANGUNDO RD/ OUTERING RD', 0, '', 1, '', 0, '', 1),
(18, 'MOMBASA ', 0, '', 1, '', 0, '', 1),
(19, 'NGONG RD/LENANA RD/KILIMANI/CBD/KAREN', 0, '', 1, '', 0, '', 1),
(20, 'KISII/OYUGIS/HOMABAY', 0, '', 1, '', 0, '', 1),
(21, 'KAYOLE/DONHOLM/EMBAKASI/UTAWALA', 0, '', 1, '', 0, '', 1),
(22, 'DONHOL/FEDHA/UTAWALA/MLOLONGO/ATHI RIVER/KITENGELA', 0, '', 1, '', 0, '', 1),
(23, 'NORTHERN BYPASS/RUAKA/MIREMA/CBD', 0, '', 1, '', 0, '', 1),
(24, 'BULBUL/VET/NGONG TOWN/KISERIAN/MATASIA/RONGAI', 0, '', 1, '', 0, '', 1),
(25, 'KIAMBU RD/KIAMBU TOWN/LIMURU ', 0, '', 1, '', 0, '', 1),
(26, 'EMBU TOWN/CHUKA/KERUGOYA/MWEA/KUTUS', 0, '', 1, '', 0, '', 1),
(27, 'MERU/ISIOLO/MAKUTANO', 0, '', 1, '', 0, '', 1),
(28, 'KISUMU TOWN/AHERO-KISUMU/KISUMU-MASENO', 0, '', 1, '', 0, '', 1),
(29, 'NYERI TOWN/KARATINA/OTHAYA', 0, '', 1, '', 0, '', 1),
(30, 'WAIYAKI WAY/WESTLANDS/KIKUYU/KITUSURU', 0, '', 1, '', 0, '', 1),
(31, 'KITUI', 0, '', 1, '', 0, '', 1),
(32, 'WESTLANDS/KITUSURU/KILELESHWA/LAVINGTON', 0, '', 1, '', 0, '', 1),
(33, 'KAKAMEGA/MUMIAS', 0, '', 1, '', 0, '', 1),
(34, 'WAIYAKI WAY/KIKUYU RD/NAIROBI-NAKURU HIGHWAY/REDHILL', 0, '', 1, '', 0, '', 1),
(35, 'KILIFI/MALINDI/WATAMU', 0, '', 1, '', 0, '', 1),
(36, 'NANYUKI', 0, '', 1, '', 0, '', 1),
(37, 'BOMAS/LANGATA RD/NAIROBI WEST/SOUTH C', 0, '', 1, '', 0, '', 1),
(38, 'KAREN/KERARAPON/BULBUL/ZAMBIA', 0, '', 1, '', 0, '', 1),
(39, 'NAIROBI/MURANGA/KIRINYAGA', 0, '', 1, '', 0, '', 1),
(40, 'RUIRU/MARURUI/KIAMBU RD/RIDGEWAYS', 0, '', 1, '', 0, '', 1),
(41, 'KAMAKIS/KAHAWA SUKARI/MOUNTAIN MALL/SURVEY', 0, '', 1, '', 0, '', 1),
(42, 'NAKURU EAST/NAKURU WEST', 0, '', 1, '', 0, '', 1),
(43, 'DAR ES SALAAM', 0, '', 1, '', 0, '', 1),
(44, 'DODOMA', 0, '', 1, '', 0, '', 1),
(45, 'ARUSHA', 0, '', 1, '', 0, '', 1),
(46, 'MURANGA/SAGANA/KENOL', 0, '', 1, '', 0, '', 1),
(47, 'MOSHI', 0, '', 1, '', 0, '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `salesclient_payment`
--

CREATE TABLE `salesclient_payment` (
  `id` int(11) NOT NULL,
  `clientId` int(11) NOT NULL,
  `amount` double NOT NULL,
  `invoicefileUrl` varchar(191) DEFAULT NULL,
  `date` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `status` varchar(191) DEFAULT NULL,
  `payment_method` varchar(191) DEFAULT NULL,
  `salesrepId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `SalesRep`
--

CREATE TABLE `SalesRep` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phoneNumber` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `countryId` int(11) NOT NULL,
  `country` varchar(191) NOT NULL,
  `region_id` int(11) NOT NULL,
  `region` varchar(191) NOT NULL,
  `route_id` int(11) NOT NULL,
  `route` varchar(100) NOT NULL,
  `route_id_update` int(11) NOT NULL,
  `route_name_update` varchar(100) NOT NULL,
  `visits_targets` int(11) NOT NULL,
  `new_clients` int(11) NOT NULL,
  `role_id` int(11) DEFAULT 1,
  `manager_type` int(11) NOT NULL,
  `status` int(11) DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `retail_manager` int(11) NOT NULL,
  `key_channel_manager` int(11) NOT NULL,
  `distribution_manager` int(11) NOT NULL,
  `photoUrl` varchar(191) DEFAULT '',
  `managerId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `SalesRep`
--

INSERT INTO `SalesRep` (`id`, `name`, `email`, `phoneNumber`, `password`, `countryId`, `country`, `region_id`, `region`, `route_id`, `route`, `route_id_update`, `route_name_update`, `visits_targets`, `new_clients`, `role_id`, `manager_type`, `status`, `createdAt`, `updatedAt`, `retail_manager`, `key_channel_manager`, `distribution_manager`, `photoUrl`, `managerId`) VALUES
(2, 'Benjamin Okwama', 'bennjiokwama@gmail.com', '0706166875', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 1, 'k', 39, 'NAIROBI/MURANGA/KIRINYAGA', 0, 0, 2, 0, 1, '2025-06-22 11:43:02.490', '2025-07-24 09:07:41.206', 0, 0, 0, 'https://res.cloudinary.com/otienobryan/image/upload/v1750596234/whoosh/profile_photos/1750596232967-profile.png', NULL),
(3, 'Joseph Okwamas', 'jose@gmail.com', '0711376366', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 1, 'Kilimani', 44, 'DODOMA', 0, 0, 1, 0, 1, '2025-06-22 12:54:08.149', '2025-06-22 21:25:11.297', 0, 0, 0, 'https://res.cloudinary.com/otienobryan/image/upload/v1750627510/whoosh/profile_photos/1750627510743-profile.png', NULL),
(60, 'MILKA WAMBUI KAMAU', 'Kamaumilka12@gmail.com', '0715388907', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(61, 'MARY GATHONI MAINA', 'gabbygathoni2020@gmail.com', '0701432625', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(62, 'Gladwell Njuka Mbugua', 'njukambugua003@gmail.com', '0708698469', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(63, 'SARAH KIGAMWA', 'Sarahkigamwa94@gmail.com', '0794410122', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(64, 'FAITH NDUNGE', 'fndunge084@gmail.com', '0707498138', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(65, 'NINA KANGAI MICHENI', 'ninakangai1@gmail.com', '079864354', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(66, 'MAGDALENA WANJIRU', 'magdalenawanjiru72@gmail.com', '0704187193', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-07-24 13:20:56.290', 0, 0, 0, 'https://res.cloudinary.com/otienobryan/image/upload/v1753363236/whoosh/profile_photos/1753363236290-profile.jpg', NULL),
(67, 'Blessing Inawedi', 'blessinginawedi@gmail.com', '0705898877', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(68, 'Mercy Marion Chepng\'eno', 'mercymarion0@gmail.com', '0726818317', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(69, 'VERONICAH NJERI GACHERU', 'veronicagacheru244@gmail.com', '0769552599', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(70, 'RUTH NJERI MURIGI', 'ruthmurigi33@gmail.com', '0720366028', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(71, 'ALICE MUTHONI WANYOIKE', 'aliceevelyn254@gmail.com', '0798996031', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(72, 'MARY WANJIKU NJOKI', 'njokimary75@gmail.com', '0727931220', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(73, 'VERNER AMBALA', 'venamissy78@gmail.com', '0748896253', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(74, 'FATMA RAMADHAN', 'fatmahr26@gmail.com', '0702339559', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(75, 'TABITHA MUKULU WAMBUA', 'tabbytabz98@gmail.com', '0706011876', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(76, 'STACY AKINYI', 'ochielstaicy001@gmail.com', '0746015959', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(77, 'JECINTA ATIENO', 'jecintak952@gmail.com', '0715453567', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(78, 'EVE NGANGA', 'evenganga88@gmail.com', '0745638757', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(79, 'EUNICE NDUKU MUTIA', 'prettyndushi@gmail.com', '0718100124', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(80, 'KHADIJA', 'khadija.reliever@placeholder.com', '0712345678', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 5, 'COAST', 0, 0, 2, 0, 1, '2025-06-25 10:08:34.000', '2025-06-26 04:32:30.509', 0, 0, 0, '', NULL),
(81, 'SUSAN NYAMBURA NDUNGU', 'nsuziepesh@gmail.com', '0115331662', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(82, 'GRACE MWENDE KATA', 'aishakata@gmail.com', '0714692441', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(83, 'HANNAH', 'hannah.reliever@placeholder.com', '0723456789', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(84, 'DORIS AYUMA ASHUNDU', 'dorisayuma352@gmail.com', '0710808489', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(85, 'PAMELA', 'pamela.reliever@placeholder.com', '0734567890', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(86, 'SPHILIAN KERUBO MOGAKA', 'mogakashilian@gmail.com', '0797232452', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(87, 'FRUMENCE MAGDALENA SHIYO', 'frumence.reliever@placeholder.com', '0708144980', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(88, 'Pamela adhiambo', 'adhiambopamela26@gmail.com', '0706778462', '$2b$10$kcOv1l/tlEk4SFHZjS6Bzu0WEooohNjlaOTrXHqVfSjODiI5Tj7sG', 1, 'Kenya', 1, 'Nairobi', 1, 'Kilimani', 1, 'Kilimani', 0, 0, 1, 0, 1, '2025-07-23 21:25:38.386', '2025-07-23 21:27:16.780', 0, 0, 0, 'https://res.cloudinary.com/otienobryan/image/upload/v1753306036/whoosh/profile_photos/1753306036330-profile.jpg', NULL),
(89, 'Chagadwa Valencia', 'valenciachagadwa@gmail.com', '0743924259', '$2b$10$Hx.MHg2HV7YXd3K.0fSEpeQ6zQ0v7a.m.uu.o63RYYW0PdGdz.ivC', 1, 'Kenya', 1, 'Nairobi', 1, 'Kilimani', 1, 'Kilimani', 0, 0, 1, 0, 1, '2025-07-24 05:50:44.496', '2025-07-24 06:40:59.221', 0, 0, 0, 'https://res.cloudinary.com/otienobryan/image/upload/v1753339258/whoosh/profile_photos/1753339258802-profile.jpg', NULL),
(90, 'Juliet Nduati', 'loisejuliet@gmail.com', '0798153264', '$2b$10$D9eCnlc09.OZ25cNgPaXD.vwQR6whfetvd6Vv/2GxHyyXzb1FaKCO', 1, 'Kenya', 1, 'Nairobi', 1, 'Kilimani', 1, 'Kilimani', 0, 0, 1, 0, 1, '2025-07-24 06:02:55.806', '2025-07-24 07:18:13.293', 0, 0, 0, '', NULL),
(91, 'Felicia Wambui', 'shareyourmail@here.com', '0782119519', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(92, 'Densy Wambui Ndungu', 'ndunguwambui032@gmail.com', '0710410836', '$2b$10$DnnoZiavf6cIgS3PY7.06.11P3u0ut21W9G4UIc8PCsO5NBogewOC', 1, 'Kenya', 1, 'Nairobi', 1, 'Kilimani', 1, 'Kilimani', 0, 0, 1, 0, 1, '2025-07-24 08:32:21.999', '2025-07-24 08:32:21.999', 0, 0, 0, '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sales_orders`
--

CREATE TABLE `sales_orders` (
  `id` int(11) NOT NULL,
  `so_number` varchar(20) NOT NULL,
  `client_id` int(11) NOT NULL,
  `order_date` date NOT NULL,
  `expected_delivery_date` date DEFAULT NULL,
  `subtotal` decimal(15,2) DEFAULT 0.00,
  `tax_amount` decimal(15,2) DEFAULT 0.00,
  `total_amount` decimal(15,2) DEFAULT 0.00,
  `net_price` decimal(11,2) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `salesrep` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `rider_id` int(11) DEFAULT NULL,
  `assigned_at` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `recepients_name` varchar(255) DEFAULT NULL,
  `recepients_contact` varchar(255) DEFAULT NULL,
  `dispatched_by` int(11) DEFAULT NULL,
  `status` enum('draft','confirmed','shipped','delivered','cancelled','in payment','paid') DEFAULT 'draft',
  `my_status` tinyint(3) NOT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `received_by` int(11) NOT NULL,
  `received_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `sales_orders`
--

INSERT INTO `sales_orders` (`id`, `so_number`, `client_id`, `order_date`, `expected_delivery_date`, `subtotal`, `tax_amount`, `total_amount`, `net_price`, `notes`, `created_by`, `salesrep`, `created_at`, `updated_at`, `rider_id`, `assigned_at`, `recepients_name`, `recepients_contact`, `dispatched_by`, `status`, `my_status`, `delivered_at`, `received_by`, `received_at`) VALUES
(1, 'INV-1', 23, '2025-08-10', NULL, 3318.97, 531.03, 3850.00, 0.00, '', 1, NULL, '2025-08-11 18:43:28', '2025-08-12 08:31:17', 1, '2025-08-12 03:52:23', NULL, NULL, 1, 'confirmed', 3, NULL, 0, '0000-00-00 00:00:00'),
(2, 'INV-2', 21, '2025-08-12', NULL, 948.28, 151.72, 1100.00, 0.00, NULL, 1, NULL, '2025-08-12 08:32:37', '2025-08-12 08:32:58', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'confirmed', 3, NULL, 0, '0000-00-00 00:00:00'),
(3, 'INV-3', 21, '2025-08-12', NULL, 948.28, 151.72, 1100.00, 0.00, NULL, 1, NULL, '2025-08-12 08:45:16', '2025-08-12 09:26:53', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'confirmed', 1, NULL, 0, '0000-00-00 00:00:00'),
(4, 'INV-4', 23, '2025-08-12', NULL, 3318.97, 531.03, 3850.00, 0.00, NULL, 1, NULL, '2025-08-12 09:53:35', '2025-08-12 10:14:55', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'confirmed', 1, NULL, 0, '0000-00-00 00:00:00'),
(5, 'INV-5', 23, '2025-08-12', NULL, 857.76, 137.24, 995.00, 0.00, NULL, 1, NULL, '2025-08-12 10:09:00', '2025-08-12 10:09:57', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'confirmed', 1, NULL, 0, '0000-00-00 00:00:00'),
(6, 'INV-6', 23, '2025-08-12', NULL, 857.76, 137.24, 995.00, 0.00, NULL, 1, NULL, '2025-08-12 10:18:40', '2025-08-12 10:18:49', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'confirmed', 1, NULL, 0, '0000-00-00 00:00:00'),
(7, 'INV-7', 23, '2025-08-12', NULL, 3318.97, 531.03, 3850.00, 0.00, NULL, 1, NULL, '2025-08-12 13:20:49', '2025-08-12 13:21:01', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'confirmed', 1, NULL, 0, '0000-00-00 00:00:00'),
(8, 'SO-2025-0001', 22, '2025-08-12', NULL, 857.76, 137.24, 995.00, 995.00, NULL, NULL, 2, '2025-08-12 14:59:21', '2025-08-12 14:59:21', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `sales_order_items`
--

CREATE TABLE `sales_order_items` (
  `id` int(11) NOT NULL,
  `sales_order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `tax_amount` decimal(11,2) NOT NULL,
  `total_price` decimal(15,2) NOT NULL,
  `tax_type` enum('16%','zero_rated','exempted') DEFAULT '16%',
  `net_price` decimal(11,2) NOT NULL,
  `shipped_quantity` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `sales_order_items`
--

INSERT INTO `sales_order_items` (`id`, `sales_order_id`, `product_id`, `quantity`, `unit_price`, `tax_amount`, `total_price`, `tax_type`, `net_price`, `shipped_quantity`) VALUES
(2, 1, 4, 1, 3850.00, 531.03, 3850.00, '16%', 3850.00, 0),
(3, 2, 31, 1, 1100.00, 151.72, 1100.00, '16%', 1100.00, 0),
(4, 3, 31, 1, 1100.00, 151.72, 1100.00, '16%', 1100.00, 0),
(5, 4, 6, 1, 3850.00, 531.03, 3850.00, '16%', 3850.00, 0),
(6, 5, 26, 1, 995.00, 137.24, 995.00, '16%', 995.00, 0),
(7, 6, 23, 1, 995.00, 137.24, 995.00, '16%', 995.00, 0),
(8, 7, 4, 1, 3850.00, 531.03, 3850.00, '16%', 3850.00, 0),
(9, 8, 21, 1, 995.00, 137.24, 995.00, '', 995.00, 0);

-- --------------------------------------------------------

--
-- Table structure for table `sales_rep_managers`
--

CREATE TABLE `sales_rep_managers` (
  `id` int(11) NOT NULL,
  `sales_rep_id` int(11) NOT NULL,
  `manager_id` int(11) NOT NULL,
  `manager_type` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales_rep_manager_assignments`
--

CREATE TABLE `sales_rep_manager_assignments` (
  `id` int(11) NOT NULL,
  `sales_rep_id` int(11) NOT NULL,
  `manager_id` int(11) NOT NULL,
  `manager_type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `photo_url` varchar(255) NOT NULL,
  `empl_no` varchar(50) NOT NULL,
  `id_no` varchar(50) NOT NULL,
  `role` varchar(255) NOT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `business_email` varchar(255) DEFAULT NULL,
  `department_email` varchar(255) DEFAULT NULL,
  `salary` decimal(11,2) DEFAULT NULL,
  `employment_type` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_active` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`id`, `name`, `photo_url`, `empl_no`, `id_no`, `role`, `phone_number`, `password`, `department`, `business_email`, `department_email`, `salary`, `employment_type`, `created_at`, `updated_at`, `is_active`) VALUES
(1, 'Bryan', '', '', '', 'sales', NULL, '$2a$10$me0dzhAfGglEGPhcK/34BuWmhYW3USYy3SeMbe46CQop102Yq./1S', NULL, NULL, NULL, NULL, '', '2025-08-11 14:16:09', '2025-08-11 14:18:02', 0),
(2, 'admins', '', '', '', 'admin', NULL, '$2a$10$me0dzhAfGglEGPhcK/34BuWmhYW3USYy3SeMbe46CQop102Yq./1S', NULL, NULL, NULL, NULL, '', '2025-08-12 02:41:40', '2025-08-12 02:41:55', 0),
(3, 'stock', '', '', '', 'stock', NULL, '$2a$10$me0dzhAfGglEGPhcK/34BuWmhYW3USYy3SeMbe46CQop102Yq./1S', NULL, NULL, NULL, NULL, '', '2025-08-12 02:42:55', '2025-08-12 02:43:13', 0),
(4, 'Mariah Wanyoike', '', '', '', 'sales', NULL, '$2a$10$me0dzhAfGglEGPhcK/34BuWmhYW3USYy3SeMbe46CQop102Yq./1S', NULL, NULL, NULL, NULL, '', '2025-08-12 08:26:30', '2025-08-12 08:26:46', 0);

-- --------------------------------------------------------

--
-- Table structure for table `staff_tasks`
--

CREATE TABLE `staff_tasks` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `completed_at` datetime DEFAULT NULL,
  `is_completed` tinyint(1) NOT NULL DEFAULT 0,
  `priority` varchar(50) NOT NULL DEFAULT 'medium',
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `staff_id` int(11) NOT NULL,
  `assigned_by_id` int(11) DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stock_takes`
--

CREATE TABLE `stock_takes` (
  `id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `take_date` date NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stock_take_items`
--

CREATE TABLE `stock_take_items` (
  `id` int(11) NOT NULL,
  `stock_take_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `system_quantity` int(11) NOT NULL,
  `counted_quantity` int(11) NOT NULL,
  `difference` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE `stores` (
  `id` int(11) NOT NULL,
  `store_code` varchar(20) NOT NULL,
  `store_name` varchar(100) NOT NULL,
  `address` text DEFAULT NULL,
  `country_id` int(11) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`id`, `store_code`, `store_name`, `address`, `country_id`, `is_active`, `created_at`) VALUES
(1, '', 'Delta Corner', NULL, 0, 1, '2025-08-12 10:49:02');

-- --------------------------------------------------------

--
-- Table structure for table `store_inventory`
--

CREATE TABLE `store_inventory` (
  `id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `store_inventory`
--

INSERT INTO `store_inventory` (`id`, `store_id`, `product_id`, `quantity`, `updated_at`) VALUES
(1, 1, 2, 5196, '2025-08-12 12:39:43'),
(2, 1, 1, 4508, '2025-08-12 12:41:51'),
(3, 1, 27, 104, '2025-08-12 12:43:41'),
(4, 1, 28, 216, '2025-08-12 12:43:59'),
(5, 1, 19, 348, '2025-08-12 12:44:18'),
(6, 1, 20, 59, '2025-08-12 12:44:34'),
(7, 1, 25, 105, '2025-08-12 12:45:00'),
(8, 1, 24, 381, '2025-08-12 12:46:13'),
(9, 1, 23, 348, '2025-08-12 12:45:49'),
(10, 1, 21, 293, '2025-08-12 12:46:35'),
(11, 1, 22, 239, '2025-08-12 12:46:58'),
(12, 1, 11, 1217, '2025-08-12 13:13:20'),
(13, 1, 13, 464, '2025-08-12 13:13:35'),
(14, 1, 10, 1033, '2025-08-12 13:13:52'),
(15, 1, 12, 1614, '2025-08-12 13:14:11'),
(16, 1, 14, 1642, '2025-08-12 13:14:36'),
(17, 1, 8, 1575, '2025-08-12 13:14:57'),
(18, 1, 7, 1189, '2025-08-12 13:15:14'),
(19, 1, 3, 3916, '2025-08-12 13:15:43'),
(20, 1, 15, 5491, '2025-08-12 13:16:38'),
(21, 1, 5, 2553, '2025-08-12 13:17:41'),
(22, 1, 4, 3034, '2025-08-12 13:17:53'),
(23, 1, 6, 3528, '2025-08-12 13:18:27');

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL,
  `supplier_code` varchar(20) NOT NULL,
  `company_name` varchar(100) NOT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `tax_id` varchar(50) DEFAULT NULL,
  `payment_terms` int(11) DEFAULT 30,
  `credit_limit` decimal(15,2) DEFAULT 0.00,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplier_ledger`
--

CREATE TABLE `supplier_ledger` (
  `id` int(11) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `reference_type` varchar(50) DEFAULT NULL,
  `reference_id` int(11) DEFAULT NULL,
  `debit` decimal(15,2) DEFAULT 0.00,
  `credit` decimal(15,2) DEFAULT 0.00,
  `running_balance` decimal(15,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `targets`
--

CREATE TABLE `targets` (
  `id` int(11) NOT NULL,
  `salesRepId` int(11) NOT NULL,
  `targetType` varchar(50) NOT NULL,
  `targetValue` int(11) NOT NULL,
  `currentValue` int(11) DEFAULT 0,
  `targetMonth` varchar(7) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `progress` int(11) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `completedAt` datetime(3) DEFAULT NULL,
  `isCompleted` tinyint(1) NOT NULL DEFAULT 0,
  `priority` varchar(191) NOT NULL DEFAULT 'medium',
  `status` varchar(191) NOT NULL DEFAULT 'pending',
  `salesRepId` int(11) NOT NULL,
  `assignedById` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `termination_letters`
--

CREATE TABLE `termination_letters` (
  `id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `termination_date` date NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Token`
--

CREATE TABLE `Token` (
  `id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `salesRepId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `expiresAt` datetime(3) NOT NULL,
  `blacklisted` tinyint(1) NOT NULL DEFAULT 0,
  `lastUsedAt` datetime(3) DEFAULT NULL,
  `tokenType` varchar(10) NOT NULL DEFAULT 'access'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `UpliftSale`
--

CREATE TABLE `UpliftSale` (
  `id` int(11) NOT NULL,
  `clientId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `status` int(2) NOT NULL,
  `totalAmount` double NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `comment` varchar(119) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `UpliftSale`
--

INSERT INTO `UpliftSale` (`id`, `clientId`, `userId`, `status`, `totalAmount`, `createdAt`, `updatedAt`, `comment`) VALUES
(1, 19, 2, 0, 0, '2025-08-12 17:54:03.892', '0000-00-00 00:00:00.000', ''),
(2, 19, 2, 0, 10000, '2025-08-12 18:04:01.610', '0000-00-00 00:00:00.000', ''),
(3, 22, 2, 0, 100, '2025-08-12 18:06:50.689', '0000-00-00 00:00:00.000', ''),
(4, 19, 2, 0, 202, '2025-08-12 18:16:21.597', '0000-00-00 00:00:00.000', '');

-- --------------------------------------------------------

--
-- Table structure for table `UpliftSaleItem`
--

CREATE TABLE `UpliftSaleItem` (
  `id` int(11) NOT NULL,
  `upliftSaleId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unitPrice` double NOT NULL,
  `total` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `UpliftSaleItem`
--

INSERT INTO `UpliftSaleItem` (`id`, `upliftSaleId`, `productId`, `quantity`, `unitPrice`, `total`, `createdAt`) VALUES
(1, 3, 22, 1, 100, 100, '2025-08-12 18:06:50.931'),
(2, 4, 22, 1, 2, 2, '2025-08-12 18:16:21.868'),
(3, 4, 21, 1, 200, 200, '2025-08-12 18:16:22.128');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `role` enum('admin','user','rider') DEFAULT 'user',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `avatar_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_devices`
--

CREATE TABLE `user_devices` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `device_id` varchar(100) NOT NULL,
  `device_name` varchar(100) DEFAULT NULL,
  `device_type` enum('android','ios','web') NOT NULL,
  `device_model` varchar(100) DEFAULT NULL,
  `os_version` varchar(50) DEFAULT NULL,
  `app_version` varchar(20) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 0,
  `last_used` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User device registration for attendance security. is_active: 0=pending approval, 1=approved';

-- --------------------------------------------------------

--
-- Table structure for table `versions`
--

CREATE TABLE `versions` (
  `id` int(11) NOT NULL,
  `version` varchar(20) NOT NULL,
  `build_number` int(11) NOT NULL,
  `min_required_version` varchar(20) DEFAULT '1.0.0',
  `force_update` tinyint(1) DEFAULT 0,
  `update_message` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `VisibilityReport`
--

CREATE TABLE `VisibilityReport` (
  `comment` varchar(191) DEFAULT NULL,
  `imageUrl` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `clientId` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `VisibilityReport`
--

INSERT INTO `VisibilityReport` (`comment`, `imageUrl`, `createdAt`, `clientId`, `id`, `userId`) VALUES
('', 'https://res.cloudinary.com/otienobryan/image/upload/v1755006952/whoosh/uploads/upload_1755006950886_2.jpg', '2025-08-12 16:55:53.375', 19, 8, 2),
('', 'https://res.cloudinary.com/otienobryan/image/upload/v1755007423/whoosh/uploads/upload_1755007421239_2.jpg', '2025-08-12 17:03:43.712', 19, 9, 2),
('', 'https://res.cloudinary.com/otienobryan/image/upload/v1755013361/whoosh/uploads/upload_1755013359398_2.jpg', '2025-08-12 18:42:42.136', 19, 10, 2),
('', 'https://res.cloudinary.com/otienobryan/image/upload/v1755013569/whoosh/uploads/upload_1755013567532_2.jpg', '2025-08-12 18:46:09.810', 19, 11, 2),
('d', NULL, '2025-08-12 18:53:25.574', 19, 12, 2);

-- --------------------------------------------------------

--
-- Table structure for table `warning_letters`
--

CREATE TABLE `warning_letters` (
  `id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `warning_date` date NOT NULL,
  `warning_type` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account_category`
--
ALTER TABLE `account_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `account_ledger`
--
ALTER TABLE `account_ledger`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `account_types`
--
ALTER TABLE `account_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `allowed_ips`
--
ALTER TABLE `allowed_ips`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_ip_address` (`ip_address`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `assets`
--
ALTER TABLE `assets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `asset_types`
--
ALTER TABLE `asset_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_staff_date` (`staff_id`,`date`),
  ADD KEY `idx_staff_id` (`staff_id`),
  ADD KEY `idx_date` (`date`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_checkin_time` (`checkin_time`),
  ADD KEY `idx_checkout_time` (`checkout_time`),
  ADD KEY `idx_staff_date_range` (`staff_id`,`date`),
  ADD KEY `idx_attendance_staff_status` (`staff_id`,`status`),
  ADD KEY `idx_attendance_date_status` (`date`,`status`),
  ADD KEY `idx_attendance_created_at` (`created_at`);

--
-- Indexes for table `Category`
--
ALTER TABLE `Category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `CategoryPriceOption`
--
ALTER TABLE `CategoryPriceOption`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `chart_of_accounts`
--
ALTER TABLE `chart_of_accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chart_of_accounts1`
--
ALTER TABLE `chart_of_accounts1`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `account_code` (`account_code`),
  ADD KEY `parent_account_id` (`parent_account_id`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Indexes for table `chat_rooms`
--
ALTER TABLE `chat_rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `chat_room_members`
--
ALTER TABLE `chat_room_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `ClientAssignment`
--
ALTER TABLE `ClientAssignment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ClientAssignment_outletId_salesRepId_key` (`outletId`,`salesRepId`),
  ADD KEY `ClientAssignment_salesRepId_idx` (`salesRepId`),
  ADD KEY `ClientAssignment_outletId_idx` (`outletId`);

--
-- Indexes for table `Clients`
--
ALTER TABLE `Clients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Clients_countryId_fkey` (`countryId`),
  ADD KEY `Clients_salesRepId_fkey` (`salesRepId`);

--
-- Indexes for table `ClientStock`
--
ALTER TABLE `ClientStock`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ClientStock_clientId_productId_key` (`clientId`,`productId`),
  ADD KEY `ClientStock_productId_fkey` (`productId`),
  ADD KEY `sale` (`salesrepId`);

--
-- Indexes for table `client_ledger`
--
ALTER TABLE `client_ledger`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_client_ledger_client` (`client_id`);

--
-- Indexes for table `client_payments`
--
ALTER TABLE `client_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_client_payments_account` (`account_id`);

--
-- Indexes for table `Country`
--
ALTER TABLE `Country`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `credit_notes`
--
ALTER TABLE `credit_notes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `credit_note_number` (`credit_note_number`),
  ADD KEY `idx_client_id` (`client_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_credit_note_date` (`credit_note_date`),
  ADD KEY `idx_credit_note_number` (`credit_note_number`);

--
-- Indexes for table `credit_note_items`
--
ALTER TABLE `credit_note_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_credit_note_id` (`credit_note_id`),
  ADD KEY `idx_invoice_id` (`invoice_id`),
  ADD KEY `idx_product_id` (`product_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `customer_code` (`customer_code`),
  ADD KEY `country_id` (`country_id`),
  ADD KEY `region_id` (`region_id`),
  ADD KEY `route_id` (`route_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `distributors_targets`
--
ALTER TABLE `distributors_targets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sales_rep_id` (`sales_rep_id`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee_contracts`
--
ALTER TABLE `employee_contracts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `staff_id` (`staff_id`),
  ADD KEY `renewed_from` (`renewed_from`);

--
-- Indexes for table `employee_documents`
--
ALTER TABLE `employee_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `employee_warnings`
--
ALTER TABLE `employee_warnings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `faulty_products_items`
--
ALTER TABLE `faulty_products_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_report_id` (`report_id`),
  ADD KEY `idx_product_id` (`product_id`);

--
-- Indexes for table `faulty_products_reports`
--
ALTER TABLE `faulty_products_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_store_id` (`store_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_reported_date` (`reported_date`),
  ADD KEY `idx_reported_by` (`reported_by`),
  ADD KEY `idx_assigned_to` (`assigned_to`);

--
-- Indexes for table `FeedbackReport`
--
ALTER TABLE `FeedbackReport`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FeedbackReport_userId_idx` (`userId`),
  ADD KEY `FeedbackReport_clientId_idx` (`clientId`);

--
-- Indexes for table `hr_calendar_tasks`
--
ALTER TABLE `hr_calendar_tasks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inventory_receipts`
--
ALTER TABLE `inventory_receipts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_order_id` (`purchase_order_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `store_id` (`store_id`),
  ADD KEY `fk_inventory_receipts_received_by` (`received_by`);

--
-- Indexes for table `inventory_transactions`
--
ALTER TABLE `inventory_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `store_id` (`store_id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `inventory_transfers`
--
ALTER TABLE `inventory_transfers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `from_store_id` (`from_store_id`),
  ADD KEY `to_store_id` (`to_store_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `journal_entries`
--
ALTER TABLE `journal_entries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `entry_number` (`entry_number`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `journal_entry_lines`
--
ALTER TABLE `journal_entry_lines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `journal_entry_id` (`journal_entry_id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `JourneyPlan`
--
ALTER TABLE `JourneyPlan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `JourneyPlan_routeId_fkey` (`routeId`);

--
-- Indexes for table `key_account_targets`
--
ALTER TABLE `key_account_targets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sales_rep_id` (`sales_rep_id`);

--
-- Indexes for table `leaves`
--
ALTER TABLE `leaves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `leaves_userId_fkey` (`userId`);

--
-- Indexes for table `leave_balances`
--
ALTER TABLE `leave_balances`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_employee_leave_type_year` (`employee_id`,`leave_type_id`,`year`),
  ADD KEY `idx_employee_id` (`employee_id`),
  ADD KEY `idx_leave_type_id` (`leave_type_id`),
  ADD KEY `idx_year` (`year`),
  ADD KEY `idx_employee_year` (`employee_id`,`year`),
  ADD KEY `idx_leave_balances_employee_type` (`employee_id`,`leave_type_id`),
  ADD KEY `idx_leave_balances_year_type` (`year`,`leave_type_id`);

--
-- Indexes for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_employee_leave_overlap` (`employee_id`,`leave_type_id`,`start_date`,`end_date`),
  ADD KEY `idx_employee_id` (`employee_id`),
  ADD KEY `idx_leave_type_id` (`leave_type_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_start_date` (`start_date`),
  ADD KEY `idx_end_date` (`end_date`),
  ADD KEY `idx_approved_by` (`approved_by`),
  ADD KEY `idx_employee_status` (`employee_id`,`status`),
  ADD KEY `idx_date_range` (`start_date`,`end_date`),
  ADD KEY `idx_leave_requests_employee_status_date` (`employee_id`,`status`,`start_date`),
  ADD KEY `idx_leave_requests_type_status` (`leave_type_id`,`status`),
  ADD KEY `idx_leave_requests_created_at` (`created_at`),
  ADD KEY `leave_requests_salesrep_id_fkey` (`salesrep`);

--
-- Indexes for table `leave_types`
--
ALTER TABLE `leave_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `idx_name` (`name`);

--
-- Indexes for table `LoginHistory`
--
ALTER TABLE `LoginHistory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `LoginHistory_userId_idx` (`userId`),
  ADD KEY `LoginHistory_userId_status_idx` (`userId`,`status`),
  ADD KEY `LoginHistory_sessionStart_idx` (`sessionStart`),
  ADD KEY `LoginHistory_sessionEnd_idx` (`sessionEnd`),
  ADD KEY `LoginHistory_userId_sessionStart_idx` (`userId`,`sessionStart`),
  ADD KEY `LoginHistory_status_sessionStart_idx` (`status`,`sessionStart`);

--
-- Indexes for table `managers`
--
ALTER TABLE `managers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `my_assets`
--
ALTER TABLE `my_assets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `asset_code` (`asset_code`),
  ADD KEY `idx_asset_code` (`asset_code`),
  ADD KEY `idx_asset_type` (`asset_type`),
  ADD KEY `idx_supplier_id` (`supplier_id`),
  ADD KEY `idx_purchase_date` (`purchase_date`),
  ADD KEY `idx_location` (`location`);

--
-- Indexes for table `my_receipts`
--
ALTER TABLE `my_receipts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplier_id` (`supplier_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `NoticeBoard`
--
ALTER TABLE `NoticeBoard`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notices`
--
ALTER TABLE `notices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `outlet_categories`
--
ALTER TABLE `outlet_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `out_of_office_requests`
--
ALTER TABLE `out_of_office_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payment_number` (`payment_number`),
  ADD KEY `supplier_id` (`supplier_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `fk_payments_purchase_order` (`purchase_order_id`);

--
-- Indexes for table `payroll_history`
--
ALTER TABLE `payroll_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `ProductReport`
--
ALTER TABLE `ProductReport`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ProductReport_userId_idx` (`userId`),
  ADD KEY `ProductReport_clientId_idx` (`clientId`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_code` (`product_code`);

--
-- Indexes for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `po_number` (`po_number`),
  ADD KEY `supplier_id` (`supplier_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_order_id` (`purchase_order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `receipts`
--
ALTER TABLE `receipts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `receipt_number` (`receipt_number`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `fk_receipts_sales_order` (`sales_order_id`),
  ADD KEY `fk_receipts_client` (`client_id`);

--
-- Indexes for table `Regions`
--
ALTER TABLE `Regions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Regions_name_countryId_key` (`name`,`countryId`),
  ADD KEY `Regions_countryId_fkey` (`countryId`);

--
-- Indexes for table `retail_targets`
--
ALTER TABLE `retail_targets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sales_rep_id` (`sales_rep_id`);

--
-- Indexes for table `Riders`
--
ALTER TABLE `Riders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `routes`
--
ALTER TABLE `routes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `salesclient_payment`
--
ALTER TABLE `salesclient_payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ClientPayment_clientId_fkey` (`clientId`),
  ADD KEY `ClientPayment_userId_fkey` (`salesrepId`);

--
-- Indexes for table `SalesRep`
--
ALTER TABLE `SalesRep`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `SalesRep_email_key` (`email`),
  ADD UNIQUE KEY `SalesRep_phoneNumber_key` (`phoneNumber`),
  ADD KEY `SalesRep_countryId_fkey` (`countryId`),
  ADD KEY `SalesRep_managerId_idx` (`managerId`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `sales_orders`
--
ALTER TABLE `sales_orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `so_number` (`so_number`),
  ADD KEY `fk_sales_orders_client` (`client_id`),
  ADD KEY `salesrep_rel` (`salesrep`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `sales_order_items`
--
ALTER TABLE `sales_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sales_order_id` (`sales_order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `sales_rep_managers`
--
ALTER TABLE `sales_rep_managers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sales_rep_id` (`sales_rep_id`),
  ADD KEY `manager_id` (`manager_id`);

--
-- Indexes for table `sales_rep_manager_assignments`
--
ALTER TABLE `sales_rep_manager_assignments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_assignment` (`sales_rep_id`,`manager_type`),
  ADD KEY `manager_id` (`manager_id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staff_tasks`
--
ALTER TABLE `staff_tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_staff_id` (`staff_id`),
  ADD KEY `idx_assigned_by_id` (`assigned_by_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_priority` (`priority`);

--
-- Indexes for table `stock_takes`
--
ALTER TABLE `stock_takes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `store_id` (`store_id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `stock_take_items`
--
ALTER TABLE `stock_take_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stock_take_id` (`stock_take_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `store_code` (`store_code`),
  ADD KEY `country_re` (`country_id`);

--
-- Indexes for table `store_inventory`
--
ALTER TABLE `store_inventory`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `store_id` (`store_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `supplier_code` (`supplier_code`);

--
-- Indexes for table `supplier_ledger`
--
ALTER TABLE `supplier_ledger`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplier_id` (`supplier_id`);

--
-- Indexes for table `targets`
--
ALTER TABLE `targets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_salesRepId` (`salesRepId`),
  ADD KEY `idx_targetType` (`targetType`),
  ADD KEY `idx_targetMonth` (`targetMonth`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tasks_assignedById_idx` (`assignedById`),
  ADD KEY `tasks_salesRepId_fkey` (`salesRepId`);

--
-- Indexes for table `termination_letters`
--
ALTER TABLE `termination_letters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `Token`
--
ALTER TABLE `Token`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Token_userId_fkey` (`salesRepId`),
  ADD KEY `idx_token_value` (`token`(64)),
  ADD KEY `idx_token_cleanup` (`expiresAt`,`blacklisted`),
  ADD KEY `idx_token_lookup` (`salesRepId`,`tokenType`,`blacklisted`,`expiresAt`);

--
-- Indexes for table `UpliftSale`
--
ALTER TABLE `UpliftSale`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UpliftSale_clientId_fkey` (`clientId`),
  ADD KEY `UpliftSale_userId_fkey` (`userId`);

--
-- Indexes for table `UpliftSaleItem`
--
ALTER TABLE `UpliftSaleItem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UpliftSaleItem_upliftSaleId_fkey` (`upliftSaleId`),
  ADD KEY `UpliftSaleItem_productId_fkey` (`productId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_devices`
--
ALTER TABLE `user_devices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_user_device` (`user_id`,`device_id`),
  ADD KEY `idx_device_id` (`device_id`),
  ADD KEY `idx_user_active` (`user_id`,`is_active`),
  ADD KEY `idx_ip_address` (`ip_address`);

--
-- Indexes for table `versions`
--
ALTER TABLE `versions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `VisibilityReport`
--
ALTER TABLE `VisibilityReport`
  ADD PRIMARY KEY (`id`),
  ADD KEY `VisibilityReport_userId_idx` (`userId`),
  ADD KEY `VisibilityReport_clientId_idx` (`clientId`);

--
-- Indexes for table `warning_letters`
--
ALTER TABLE `warning_letters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account_category`
--
ALTER TABLE `account_category`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `account_ledger`
--
ALTER TABLE `account_ledger`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `account_types`
--
ALTER TABLE `account_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `allowed_ips`
--
ALTER TABLE `allowed_ips`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assets`
--
ALTER TABLE `assets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `asset_types`
--
ALTER TABLE `asset_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Category`
--
ALTER TABLE `Category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `CategoryPriceOption`
--
ALTER TABLE `CategoryPriceOption`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chart_of_accounts`
--
ALTER TABLE `chart_of_accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=145;

--
-- AUTO_INCREMENT for table `chart_of_accounts1`
--
ALTER TABLE `chart_of_accounts1`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chat_rooms`
--
ALTER TABLE `chat_rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chat_room_members`
--
ALTER TABLE `chat_room_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ClientAssignment`
--
ALTER TABLE `ClientAssignment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `Clients`
--
ALTER TABLE `Clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `ClientStock`
--
ALTER TABLE `ClientStock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `client_ledger`
--
ALTER TABLE `client_ledger`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `client_payments`
--
ALTER TABLE `client_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Country`
--
ALTER TABLE `Country`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `credit_notes`
--
ALTER TABLE `credit_notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `credit_note_items`
--
ALTER TABLE `credit_note_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `distributors_targets`
--
ALTER TABLE `distributors_targets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee_contracts`
--
ALTER TABLE `employee_contracts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee_documents`
--
ALTER TABLE `employee_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee_warnings`
--
ALTER TABLE `employee_warnings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faulty_products_items`
--
ALTER TABLE `faulty_products_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faulty_products_reports`
--
ALTER TABLE `faulty_products_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `FeedbackReport`
--
ALTER TABLE `FeedbackReport`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `hr_calendar_tasks`
--
ALTER TABLE `hr_calendar_tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `inventory_receipts`
--
ALTER TABLE `inventory_receipts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory_transactions`
--
ALTER TABLE `inventory_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `inventory_transfers`
--
ALTER TABLE `inventory_transfers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `journal_entries`
--
ALTER TABLE `journal_entries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `journal_entry_lines`
--
ALTER TABLE `journal_entry_lines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `JourneyPlan`
--
ALTER TABLE `JourneyPlan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `key_account_targets`
--
ALTER TABLE `key_account_targets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leaves`
--
ALTER TABLE `leaves`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `leave_balances`
--
ALTER TABLE `leave_balances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `leave_requests`
--
ALTER TABLE `leave_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `leave_types`
--
ALTER TABLE `leave_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `LoginHistory`
--
ALTER TABLE `LoginHistory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2243;

--
-- AUTO_INCREMENT for table `managers`
--
ALTER TABLE `managers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `my_assets`
--
ALTER TABLE `my_assets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `my_receipts`
--
ALTER TABLE `my_receipts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `NoticeBoard`
--
ALTER TABLE `NoticeBoard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notices`
--
ALTER TABLE `notices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `outlet_categories`
--
ALTER TABLE `outlet_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `out_of_office_requests`
--
ALTER TABLE `out_of_office_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payroll_history`
--
ALTER TABLE `payroll_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ProductReport`
--
ALTER TABLE `ProductReport`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `receipts`
--
ALTER TABLE `receipts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Regions`
--
ALTER TABLE `Regions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `retail_targets`
--
ALTER TABLE `retail_targets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Riders`
--
ALTER TABLE `Riders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `routes`
--
ALTER TABLE `routes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `salesclient_payment`
--
ALTER TABLE `salesclient_payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `SalesRep`
--
ALTER TABLE `SalesRep`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `sales_orders`
--
ALTER TABLE `sales_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `sales_order_items`
--
ALTER TABLE `sales_order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `sales_rep_managers`
--
ALTER TABLE `sales_rep_managers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sales_rep_manager_assignments`
--
ALTER TABLE `sales_rep_manager_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `staff_tasks`
--
ALTER TABLE `staff_tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stock_takes`
--
ALTER TABLE `stock_takes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stock_take_items`
--
ALTER TABLE `stock_take_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stores`
--
ALTER TABLE `stores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `store_inventory`
--
ALTER TABLE `store_inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier_ledger`
--
ALTER TABLE `supplier_ledger`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `targets`
--
ALTER TABLE `targets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `termination_letters`
--
ALTER TABLE `termination_letters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Token`
--
ALTER TABLE `Token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `UpliftSale`
--
ALTER TABLE `UpliftSale`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `UpliftSaleItem`
--
ALTER TABLE `UpliftSaleItem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_devices`
--
ALTER TABLE `user_devices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `versions`
--
ALTER TABLE `versions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `VisibilityReport`
--
ALTER TABLE `VisibilityReport`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `warning_letters`
--
ALTER TABLE `warning_letters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ClientAssignment`
--
ALTER TABLE `ClientAssignment`
  ADD CONSTRAINT `client_` FOREIGN KEY (`outletId`) REFERENCES `Clients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `salesrep_id` FOREIGN KEY (`salesRepId`) REFERENCES `SalesRep` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ClientStock`
--
ALTER TABLE `ClientStock`
  ADD CONSTRAINT `sale` FOREIGN KEY (`salesrepId`) REFERENCES `SalesRep` (`id`);

--
-- Constraints for table `credit_notes`
--
ALTER TABLE `credit_notes`
  ADD CONSTRAINT `credit_notes_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `Clients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `credit_notes_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `credit_note_items`
--
ALTER TABLE `credit_note_items`
  ADD CONSTRAINT `credit_note_items_ibfk_1` FOREIGN KEY (`credit_note_id`) REFERENCES `credit_notes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `credit_note_items_ibfk_2` FOREIGN KEY (`invoice_id`) REFERENCES `sales_orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `credit_note_items_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `SalesRep`
--
ALTER TABLE `SalesRep`
  ADD CONSTRAINT `role_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);

--
-- Constraints for table `staff_tasks`
--
ALTER TABLE `staff_tasks`
  ADD CONSTRAINT `fk_staff_tasks_assigned_by` FOREIGN KEY (`assigned_by_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_staff_tasks_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `store_inventory`
--
ALTER TABLE `store_inventory`
  ADD CONSTRAINT `store_rel` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
