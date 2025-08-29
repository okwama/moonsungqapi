-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 29, 2025 at 06:49 AM
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
-- Table structure for table `asset_requests`
--

CREATE TABLE `asset_requests` (
  `id` int(11) NOT NULL,
  `requestNumber` varchar(50) NOT NULL,
  `salesRepId` int(11) NOT NULL,
  `requestDate` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','approved','rejected','assigned','returned') NOT NULL DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `approvedBy` int(11) DEFAULT NULL,
  `approvedAt` datetime DEFAULT NULL,
  `assignedBy` int(11) DEFAULT NULL,
  `assignedAt` datetime DEFAULT NULL,
  `returnDate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `asset_requests`
--

INSERT INTO `asset_requests` (`id`, `requestNumber`, `salesRepId`, `requestDate`, `status`, `notes`, `approvedBy`, `approvedAt`, `assignedBy`, `assignedAt`, `returnDate`, `createdAt`, `updatedAt`) VALUES
(1, 'AR-20250829-001', 2, '2025-08-29 00:55:53', 'pending', 'test', NULL, NULL, NULL, NULL, NULL, '2025-08-29 00:55:53', '2025-08-29 00:55:53');

-- --------------------------------------------------------

--
-- Table structure for table `asset_request_items`
--

CREATE TABLE `asset_request_items` (
  `id` int(11) NOT NULL,
  `assetRequestId` int(11) NOT NULL,
  `assetName` varchar(255) NOT NULL,
  `assetType` varchar(100) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `notes` text DEFAULT NULL,
  `assignedQuantity` int(11) DEFAULT 0,
  `returnedQuantity` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `asset_request_items`
--

INSERT INTO `asset_request_items` (`id`, `assetRequestId`, `assetName`, `assetType`, `quantity`, `notes`, `assignedQuantity`, `returnedQuantity`, `createdAt`) VALUES
(1, 1, 'wipes', 'Other', 1, '', 0, 0, '2025-08-29 00:55:53');

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
(1, 'Lipsticks'),
(2, 'EyeLashes'),
(3, 'Highlighter'),
(4, 'Lipgloss'),
(5, 'Eyeliner'),
(6, 'lipbams'),
(9, 'Foundation'),
(10, 'EyeShadows');

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

--
-- Dumping data for table `CategoryPriceOption`
--

INSERT INTO `CategoryPriceOption` (`id`, `category_id`, `label`, `value`, `value_tzs`, `value_ngn`, `created_at`, `updated_at`) VALUES
(1, 2, '1', 995.00, 0.00, 0.00, '2025-08-26 10:39:23', '2025-08-26 10:39:23'),
(2, 9, '1', 3450.00, 0.00, 0.00, '2025-08-26 10:39:41', '2025-08-26 10:39:41'),
(3, 4, '1', 1100.00, 0.00, 0.00, '2025-08-26 10:40:51', '2025-08-26 10:40:51'),
(4, 4, '2', 1000.00, 0.00, 0.00, '2025-08-26 10:41:05', '2025-08-26 10:41:05'),
(6, 10, '1', 3850.00, 0.00, 0.00, '2025-08-26 10:42:18', '2025-08-26 10:42:18'),
(7, 5, '1', 1600.00, 0.00, 0.00, '2025-08-26 10:42:34', '2025-08-26 10:42:34'),
(8, 1, '1', 2450.00, 0.00, 0.00, '2025-08-26 10:42:49', '2025-08-26 10:42:49');

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
(1, 1, 63, '2025-06-25 15:16:10.359', 'inactive'),
(2, 19, 63, '2025-06-25 15:16:10.375', 'inactive'),
(4, 3, 82, '2025-06-25 15:16:10.375', 'inactive'),
(6, 6, 86, '2025-06-25 15:16:10.375', 'active'),
(7, 7, 81, '2025-06-25 15:16:10.375', 'active'),
(8, 8, 64, '2025-06-25 15:16:10.375', 'inactive'),
(9, 9, 71, '2025-06-25 15:16:10.375', 'inactive'),
(10, 11, 84, '2025-06-25 15:16:10.375', 'inactive'),
(11, 12, 72, '2025-06-25 15:16:10.375', 'active'),
(12, 13, 73, '2025-06-25 15:16:10.375', 'inactive'),
(13, 15, 70, '2025-06-25 15:16:10.375', 'active'),
(14, 16, 68, '2025-06-25 15:16:10.375', 'inactive'),
(15, 17, 65, '2025-06-25 15:16:10.375', 'inactive'),
(16, 18, 74, '2025-06-25 15:16:10.375', 'active'),
(17, 20, 78, '2025-06-25 15:16:10.375', 'inactive'),
(18, 21, 77, '2025-06-25 15:16:10.375', 'inactive'),
(19, 22, 75, '2025-06-25 15:16:10.375', 'active'),
(20, 1, 3, '2025-06-25 15:16:10.359', 'inactive'),
(21, 19, 2, '2025-08-11 20:19:42.347', 'active'),
(22, 22, 2, '2025-08-11 20:19:42.539', 'active'),
(23, 20, 2, '2025-08-11 20:20:48.252', 'inactive'),
(24, 7, 2, '2025-08-11 20:20:48.296', 'inactive'),
(25, 1, 73, '2025-08-13 09:41:03.718', 'active'),
(26, 1, 64, '2025-08-13 09:41:37.975', 'inactive'),
(27, 5, 66, '2025-08-13 09:46:21.498', 'active'),
(28, 4, 77, '2025-08-13 09:46:40.509', 'active'),
(29, 2, 62, '2025-08-13 09:47:04.678', 'active'),
(30, 3, 3, '2025-08-13 09:48:39.673', 'active'),
(31, 22, 63, '2025-08-13 09:49:20.251', 'inactive'),
(32, 9, 63, '2025-08-13 09:49:20.363', 'active'),
(33, 3, 89, '2025-08-13 09:53:55.930', 'active'),
(35, 16, 85, '2025-08-13 09:54:37.873', 'active'),
(36, 14, 76, '2025-08-13 09:55:20.488', 'active'),
(37, 17, 68, '2025-08-13 09:55:43.491', 'active'),
(38, 18, 65, '2025-08-13 09:55:56.581', 'active'),
(39, 10, 78, '2025-08-13 09:56:21.287', 'active'),
(40, 12, 84, '2025-08-13 09:56:38.323', 'active'),
(41, 19, 71, '2025-08-13 10:02:33.881', 'active'),
(42, 20, 71, '2025-08-13 10:02:33.994', 'active'),
(43, 22, 90, '2025-08-13 10:02:50.716', 'active'),
(44, 21, 90, '2025-08-13 10:02:50.719', 'active'),
(45, 16, 88, '2025-08-13 10:03:53.817', 'active'),
(46, 7, 96, '2025-08-13 10:07:01.052', 'active'),
(47, 17, 98, '2025-08-13 15:49:06.181', 'active'),
(48, 5, 64, '2025-08-19 10:57:35.244', 'active'),
(49, 21, 82, '2025-08-19 11:00:52.393', 'inactive'),
(50, 7, 87, '2025-08-19 11:01:42.249', 'active'),
(51, 17, 87, '2025-08-19 11:01:42.290', 'active'),
(52, 16, 87, '2025-08-19 11:01:42.339', 'active'),
(53, 8, 87, '2025-08-19 11:01:42.366', 'active'),
(54, 3, 87, '2025-08-19 11:01:42.396', 'active'),
(55, 18, 87, '2025-08-19 11:01:42.430', 'active'),
(56, 11, 87, '2025-08-19 11:01:42.613', 'active'),
(57, 4, 87, '2025-08-19 11:01:42.725', 'active'),
(58, 1, 87, '2025-08-19 11:01:42.758', 'active'),
(59, 6, 87, '2025-08-19 11:01:42.795', 'active'),
(60, 10, 87, '2025-08-19 11:01:42.820', 'active'),
(61, 15, 87, '2025-08-19 11:01:42.904', 'active'),
(62, 14, 87, '2025-08-19 11:01:42.915', 'active'),
(63, 9, 87, '2025-08-19 11:01:42.939', 'active'),
(64, 2, 87, '2025-08-19 11:01:42.977', 'active'),
(65, 12, 87, '2025-08-19 11:01:42.997', 'active'),
(66, 5, 87, '2025-08-19 11:01:43.089', 'active'),
(67, 13, 87, '2025-08-19 11:01:43.095', 'active'),
(68, 8, 66, '2025-08-19 11:06:40.629', 'active'),
(69, 16, 66, '2025-08-19 11:06:40.643', 'active'),
(70, 17, 66, '2025-08-19 11:06:40.647', 'active'),
(71, 7, 66, '2025-08-19 11:06:40.700', 'active'),
(72, 4, 66, '2025-08-19 11:06:40.714', 'active'),
(73, 3, 66, '2025-08-19 11:06:40.806', 'active'),
(74, 18, 66, '2025-08-19 11:06:40.824', 'active'),
(75, 10, 66, '2025-08-19 11:06:40.829', 'active'),
(76, 2, 66, '2025-08-19 11:06:40.883', 'active'),
(77, 13, 66, '2025-08-19 11:06:40.896', 'active'),
(78, 11, 66, '2025-08-19 11:06:40.982', 'active'),
(79, 1, 66, '2025-08-19 11:06:41.004', 'active'),
(80, 12, 66, '2025-08-19 11:06:41.012', 'active'),
(81, 9, 66, '2025-08-19 11:06:41.069', 'active'),
(82, 15, 66, '2025-08-19 11:06:41.079', 'active'),
(83, 14, 66, '2025-08-19 11:06:41.159', 'active'),
(84, 6, 66, '2025-08-19 11:06:41.185', 'active'),
(85, 6, 92, '2025-08-19 11:07:21.759', 'active'),
(86, 17, 74, '2025-08-19 11:08:58.842', 'active'),
(87, 16, 74, '2025-08-19 11:08:58.866', 'active'),
(88, 13, 91, '2025-08-19 11:09:31.146', 'active'),
(89, 11, 82, '2025-08-26 10:42:39.155', 'active');

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
(1, 63, 'MINISO SARIT', 'Kenya', -1.2607772, 36.8016888, 0.00, NULL, 0, '', 1, 0, '', 0, '', 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(2, 79, 'MINISO WESTGATE', 'Kenya', -1.2570443, 36.803133, NULL, NULL, 0, '', 1, 0, '', 0, '', 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(3, 82, 'MINISO HUB', 'Kenya', -1.3204357, 36.7038018, NULL, NULL, 0, '', 1, 0, '', 0, '', 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(4, 67, 'MINISO JUNCTION', 'Kenya', NULL, NULL, NULL, NULL, 0, '', 1, 0, '', 0, '', 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(5, NULL, 'MINISO YAYA', 'Kenya', -1.2930186, 36.7876109, NULL, NULL, 0, '', 1, 0, '', 0, '', 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(6, 86, 'MINISO SOUTHFIELD', 'Kenya', -1.3287807, 36.8906387, NULL, NULL, 0, '', 1, 0, '', 0, '', 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(7, 81, 'MINISO BBS', 'Kenya', 0, 0, 0.00, NULL, 0, '', 1, 0, '', 0, '', 'notprovided', '', NULL, 1, 2, 1, NULL, '2025-06-22 13:23:45.095', 25),
(8, 64, 'MINISO GARDEN CITY', 'Kenya', -1.2327165, 36.8785436, NULL, NULL, 0, '', 1, NULL, NULL, NULL, NULL, 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(9, 71, 'MINISO TRM', 'Kenya', -1.2196795, 36.8885403, NULL, NULL, 0, '', 1, 0, '', 0, '', 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(10, NULL, 'MINISO NORD', 'Kenya', NULL, NULL, NULL, NULL, 0, '', 1, 1, '', 1, '', 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(11, 84, 'MINISO RUNDA', 'Kenya', -1.2182119, 36.8089887, NULL, NULL, 0, '', 1, 0, '', 0, '', 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(12, 72, 'MINISO TWO RIVERS', 'Kenya', -1.2107912, 36.7952337, NULL, NULL, 0, '', 1, 0, '', 0, '', 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(13, 73, 'MINISO VILLAGE MARKET', 'Kenya', -1.2293818, 36.8047495, NULL, NULL, 0, '', 1, 0, '', 0, '', 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(14, NULL, 'MINISO UNITED MALL', 'Kenya', -0.0983823, 34.7625269, NULL, NULL, 0, '', 1, 0, '', 0, '', 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(15, 70, 'MINISO RUPAS', 'Kenya', NULL, NULL, NULL, NULL, 0, '', 1, NULL, NULL, NULL, NULL, 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(16, 68, 'MINISO LIKONI', 'Kenya', -4.1027192, 39.6454038, NULL, NULL, 0, '', 1, 0, '', 0, '', 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(17, 65, 'MINISO CITY MALL', 'Kenya', -4.0195589, 39.7210391, NULL, NULL, 0, '', 1, 0, '', 0, '', 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(18, 74, 'MINISO PROMINADE', 'Kenya', -4.0378888, 39.7064404, NULL, NULL, 0, '', 1, 0, '', 0, '', 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 25),
(19, 63, 'GOODLIFE SARIT', 'Kenya', -1.2607772, 36.8016888, NULL, NULL, 0, '', 2, 1, 'k', 1, 'k', 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 38),
(20, 78, 'GOODLIFE VILLAGE MARKET', 'Kenya', -1.2293818, 36.8047495, NULL, NULL, 0, '', 2, NULL, NULL, NULL, NULL, 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 38),
(21, 77, 'GOODLIFE GARDEN CITY', 'Kenya', -1.2327165, 36.8785436, NULL, NULL, 0, '', 2, NULL, NULL, 39, 'NAIROBI/MURANGA/KIRINYAGA', 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 38),
(22, 75, 'GOODLIFE TRM', 'Kenya', -1.2196795, 36.8885403, 995.00, NULL, 0, '', 2, 1, 'k', 1, 'k', 'notprovided', NULL, NULL, 1, NULL, 1, NULL, '2025-06-22 13:23:45.095', 38),
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
(1, 6, 22, 17, 2),
(2, 9, 22, 18, 2),
(3, 10, 22, 21, 2),
(4, 9, 22, 22, 2),
(5, 53, 3, 14, 89),
(8, 15, 2, 1, 2),
(9, 19, 2, 3, 62),
(14, 0, 19, 17, 2),
(15, 14, 3, 17, 89),
(16, 1, 9, 21, 63),
(17, 5, 5, 21, 64),
(18, 8, 13, 21, 91),
(19, 5, 13, 22, 91),
(20, 8, 13, 23, 91),
(21, 6, 10, 21, 78),
(22, 0, 1, 18, 73),
(23, 0, 12, 25, 84),
(24, 0, 6, 17, 92),
(25, 0, 6, 18, 92),
(26, 8, 6, 21, 92),
(27, 0, 12, 23, 84),
(28, 3, 10, 22, 78),
(29, 0, 7, 17, 67),
(30, 3, 10, 23, 78),
(31, 0, 12, 14, 84),
(32, 4, 10, 24, 78),
(33, 0, 7, 22, 96),
(34, 5, 10, 27, 78),
(35, 4, 10, 28, 78),
(36, 2, 10, 20, 78),
(37, 0, 4, 17, 77),
(38, 5, 10, 19, 78),
(39, 4, 10, 25, 78),
(40, 18, 5, 3, 64),
(41, 7, 10, 26, 78),
(42, 0, 18, 30, 65),
(43, 13, 10, 30, 78),
(44, 14, 9, 16, 63),
(45, 0, 14, 9, 76),
(46, 17, 10, 29, 78),
(47, 22, 9, 15, 63),
(48, 7, 9, 14, 63),
(49, 8, 9, 11, 63),
(50, 8, 9, 12, 63),
(51, 23, 9, 3, 63),
(52, 5, 9, 10, 63),
(53, 3, 9, 8, 63),
(54, 5, 9, 7, 63),
(55, 0, 9, 31, 63),
(56, 21, 9, 30, 63),
(57, 20, 9, 29, 63),
(58, 2, 9, 20, 63),
(59, 0, 14, 17, 76),
(60, 3, 9, 19, 63),
(61, 2, 9, 25, 63),
(62, 2, 9, 27, 63),
(63, 2, 9, 28, 63),
(64, 2, 9, 24, 63),
(65, 3, 9, 23, 63),
(66, 3, 9, 22, 63),
(67, 0, 16, 24, 88),
(68, 24, 10, 3, 78),
(69, 37, 10, 10, 78),
(70, 11, 10, 13, 78),
(71, 13, 10, 8, 78),
(72, 8, 10, 7, 78),
(73, 10, 10, 14, 78),
(74, 10, 10, 12, 78),
(75, 5, 5, 23, 64),
(76, 5, 5, 24, 64),
(77, 0, 5, 27, 64),
(78, 6, 5, 19, 64),
(79, 49, 5, 15, 64),
(80, 42, 5, 16, 64),
(81, 23, 5, 10, 64),
(82, 17, 5, 13, 64),
(83, 16, 5, 8, 64),
(84, 20, 5, 7, 64),
(85, 50, 10, 16, 78),
(86, 18, 5, 11, 64),
(87, 21, 10, 15, 78),
(88, 11, 5, 14, 64),
(89, 9, 5, 12, 64),
(90, 0, 9, 1, 63),
(91, 18, 10, 31, 78),
(92, 0, 7, 21, 96),
(93, 0, 7, 18, 96),
(94, 2, 7, 27, 96),
(95, 0, 7, 28, 96),
(96, 6, 7, 20, 96),
(97, 2, 7, 19, 96),
(98, 3, 7, 25, 66),
(99, 0, 3, 18, 89),
(100, 6, 3, 21, 89),
(101, 7, 3, 22, 89),
(102, 11, 3, 23, 89),
(103, 8, 3, 24, 89),
(104, 12, 3, 27, 3),
(105, 5, 3, 28, 89),
(106, 4, 7, 26, 96),
(107, 0, 7, 6, 96),
(108, 0, 7, 5, 96),
(109, 0, 7, 4, 96),
(110, 0, 7, 2, 96),
(111, 0, 7, 1, 96),
(112, 14, 7, 15, 96),
(113, 22, 7, 16, 96),
(114, 2, 7, 3, 96),
(115, 9, 7, 10, 96),
(116, 12, 7, 13, 96),
(117, 20, 7, 8, 96),
(118, 10, 7, 7, 96),
(119, 17, 7, 11, 96),
(120, 15, 7, 14, 96),
(121, 22, 7, 12, 96),
(122, 14, 7, 9, 96),
(123, 1, 7, 24, 96),
(124, 1, 7, 23, 66),
(125, 12, 7, 31, 96),
(126, 28, 7, 30, 96),
(127, 10, 7, 29, 96),
(128, 3, 3, 20, 89),
(129, 8, 3, 19, 89),
(130, 6, 3, 25, 89),
(131, 6, 3, 26, 3),
(132, 14, 3, 15, 89),
(133, 18, 3, 16, 89),
(134, 33, 3, 3, 89),
(135, 27, 3, 10, 89),
(136, 25, 3, 13, 89),
(137, 39, 3, 8, 89),
(138, 25, 3, 7, 89),
(139, 16, 3, 11, 89),
(140, 26, 3, 12, 3),
(141, 36, 3, 31, 89),
(142, 63, 3, 30, 89),
(143, 44, 3, 29, 89),
(144, 0, 11, 17, 82),
(145, 3, 11, 21, 82),
(146, 3, 11, 22, 82),
(147, 3, 11, 23, 82),
(148, 42, 11, 15, 82),
(149, 30, 11, 16, 82),
(150, 33, 11, 3, 82),
(151, 35, 11, 29, 82),
(152, 11, 2, 28, 62),
(153, 8, 6, 26, 92),
(154, 0, 10, 18, 78),
(155, 10, 12, 5, 84),
(156, 0, 18, 17, 65),
(157, 7, 4, 21, 77),
(158, 7, 4, 22, 77),
(159, 4, 4, 23, 77),
(160, 7, 4, 24, 77),
(161, 2, 4, 27, 77),
(162, 2, 4, 28, 77),
(163, 6, 4, 20, 77),
(164, 6, 4, 19, 77),
(165, 9, 4, 25, 77),
(166, 7, 4, 26, 77),
(167, 12, 13, 16, 91),
(168, 8, 2, 23, 62),
(169, 0, 17, 16, 68),
(170, 41, 14, 16, 76),
(171, 16, 14, 33, 76),
(172, 24, 14, 35, 76),
(173, 6, 14, 21, 76),
(174, 3, 14, 22, 76),
(175, 2, 14, 23, 76),
(176, 3, 14, 24, 76),
(177, 5, 14, 27, 76),
(178, 7, 14, 28, 76),
(179, 4, 14, 20, 76),
(180, 3, 14, 19, 76),
(181, 3, 14, 25, 76),
(182, 3, 14, 26, 76),
(183, 37, 14, 31, 76),
(184, 24, 14, 30, 76),
(185, 20, 14, 29, 76),
(186, 29, 14, 15, 76),
(187, 8, 14, 34, 76),
(188, 24, 14, 3, 76),
(189, 35, 14, 10, 76),
(190, 22, 14, 13, 76),
(191, 4, 14, 8, 76),
(192, 25, 14, 7, 76),
(193, 38, 14, 11, 76),
(194, 13, 14, 14, 76),
(195, 29, 14, 12, 76),
(196, 7, 14, 32, 76),
(197, 73, 1, 16, 73),
(198, 29, 15, 16, 70),
(199, 13, 15, 33, 70),
(200, 13, 6, 30, 92),
(201, 21, 4, 16, 77),
(202, 30, 4, 33, 77),
(203, 24, 4, 35, 77),
(204, 19, 4, 31, 77),
(205, 73, 4, 30, 77),
(206, 40, 4, 29, 77),
(207, 37, 4, 15, 77),
(208, 25, 4, 34, 77),
(209, 60, 4, 3, 77),
(210, 11, 4, 10, 77),
(211, 35, 4, 13, 77),
(212, 25, 4, 8, 77),
(213, 27, 4, 7, 77),
(214, 6, 4, 11, 77),
(215, 26, 4, 14, 77),
(216, 30, 4, 12, 77),
(217, 29, 4, 32, 77),
(218, 31, 5, 31, 64),
(219, 8, 5, 33, 64),
(220, 4, 5, 35, 64),
(221, 28, 5, 30, 64),
(222, 29, 5, 29, 64),
(223, 10, 5, 34, 64),
(224, 9, 5, 32, 64),
(225, 1, 10, 33, 78),
(226, 7, 10, 35, 78),
(227, 0, 10, 17, 78),
(228, 0, 10, 5, 78),
(229, 0, 10, 4, 78),
(230, 0, 10, 2, 78),
(231, 0, 10, 1, 78),
(232, 7, 10, 34, 78),
(233, 8, 10, 11, 78),
(234, 0, 10, 9, 78),
(235, 6, 10, 32, 78),
(236, 0, 10, 38, 78),
(237, 0, 10, 40, 78),
(238, 7, 15, 35, 70),
(239, 0, 15, 17, 70),
(240, 0, 15, 18, 70),
(241, 1, 15, 21, 70),
(242, 3, 15, 22, 70),
(243, 2, 15, 23, 70),
(244, 4, 15, 24, 70),
(245, 0, 15, 27, 70),
(246, 0, 15, 28, 70),
(247, 2, 15, 20, 70),
(248, 1, 15, 19, 70),
(249, 3, 15, 25, 70),
(250, 2, 15, 26, 70),
(251, 0, 15, 6, 70),
(252, 0, 15, 5, 70),
(253, 0, 15, 4, 70),
(254, 0, 15, 2, 70),
(255, 0, 15, 1, 70),
(256, 41, 15, 15, 70),
(257, 7, 15, 34, 70),
(258, 13, 15, 3, 70),
(259, 13, 15, 10, 70),
(260, 11, 15, 13, 70),
(261, 7, 15, 8, 70),
(262, 12, 15, 7, 70),
(263, 9, 15, 11, 70),
(264, 5, 15, 14, 70),
(265, 12, 15, 12, 70),
(266, 0, 15, 9, 70),
(267, 10, 15, 32, 70),
(268, 0, 15, 38, 70),
(269, 0, 15, 40, 70),
(270, 19, 15, 31, 70),
(271, 34, 2, 16, 62),
(272, 27, 2, 33, 62),
(273, 19, 2, 35, 62),
(274, 14, 2, 31, 99),
(275, 34, 2, 30, 62),
(276, 18, 2, 29, 62),
(277, 25, 2, 15, 62),
(278, 28, 2, 34, 62),
(279, 24, 2, 10, 62),
(280, 22, 2, 13, 62),
(281, 19, 2, 8, 62),
(282, 34, 2, 7, 62),
(283, 48, 2, 11, 62),
(284, 30, 2, 14, 62),
(285, 21, 2, 12, 62),
(286, 7, 2, 21, 62),
(287, 11, 2, 22, 62),
(288, 10, 2, 24, 62),
(289, 7, 2, 27, 62),
(290, 4, 2, 20, 62),
(291, 12, 2, 19, 62),
(292, 8, 2, 25, 62),
(293, 11, 2, 26, 62),
(294, 30, 13, 33, 91),
(295, 29, 13, 35, 91),
(296, 7, 13, 24, 91),
(297, 2, 13, 27, 91),
(298, 18, 13, 28, 91),
(299, 5, 13, 20, 91),
(300, 10, 13, 19, 91),
(301, 4, 13, 25, 91),
(302, 9, 13, 26, 91),
(303, 25, 13, 31, 91),
(304, 22, 13, 30, 91),
(305, 44, 13, 29, 91),
(306, 32, 13, 15, 91),
(307, 29, 13, 34, 91),
(308, 18, 13, 3, 91),
(309, 37, 13, 10, 91),
(310, 25, 13, 13, 91),
(311, 26, 13, 8, 91),
(312, 28, 13, 7, 91),
(313, 29, 13, 11, 91),
(314, 28, 13, 14, 91),
(315, 24, 13, 12, 91),
(316, 29, 13, 32, 91),
(317, 33, 15, 30, 70),
(318, 43, 15, 29, 70),
(319, 9, 9, 32, 63),
(320, 10, 9, 13, 63),
(321, 12, 9, 34, 63),
(322, 11, 9, 35, 63),
(323, 8, 9, 33, 63),
(324, 3, 11, 33, 82),
(325, 5, 11, 35, 82),
(326, 3, 11, 24, 82),
(327, 2, 11, 27, 82),
(328, 2, 11, 28, 82),
(329, 3, 11, 19, 82),
(330, 0, 11, 25, 82),
(331, 1, 11, 26, 82),
(332, 41, 11, 31, 82),
(333, 42, 11, 30, 82),
(334, 5, 11, 34, 82),
(335, 15, 11, 10, 82),
(336, 12, 11, 13, 82),
(337, 17, 11, 8, 82),
(338, 19, 11, 7, 82),
(339, 17, 11, 11, 82),
(340, 18, 11, 14, 82),
(341, 20, 6, 16, 92),
(342, 8, 6, 33, 92),
(343, 5, 6, 35, 92),
(344, 8, 6, 22, 92),
(345, 11, 6, 23, 92),
(346, 2, 6, 24, 92),
(347, 8, 6, 27, 92),
(348, 8, 6, 28, 92),
(349, 2, 6, 19, 92),
(350, 6, 6, 25, 92),
(351, 12, 6, 29, 92),
(352, 17, 6, 31, 92),
(353, 7, 6, 15, 92),
(354, 12, 6, 34, 92),
(355, 23, 6, 3, 92),
(356, 7, 6, 10, 92),
(357, 10, 6, 13, 92),
(358, 11, 6, 8, 92),
(359, 12, 6, 7, 92),
(360, 13, 6, 11, 92),
(361, 12, 6, 14, 92),
(362, 22, 6, 12, 92),
(363, 10, 6, 32, 92),
(364, 0, 6, 20, 92),
(365, 0, 6, 6, 92),
(366, 0, 6, 5, 92),
(367, 0, 6, 4, 92),
(368, 1, 6, 1, 92),
(369, 25, 3, 33, 89),
(370, 27, 3, 35, 89),
(371, 27, 3, 34, 89),
(372, 26, 3, 32, 89);

-- --------------------------------------------------------

--
-- Table structure for table `ClientTargets`
--

CREATE TABLE `ClientTargets` (
  `id` int(11) NOT NULL,
  `clientId` int(11) NOT NULL,
  `month` varchar(2) NOT NULL,
  `year` int(11) NOT NULL,
  `amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ClientTargets`
--

INSERT INTO `ClientTargets` (`id`, `clientId`, `month`, `year`, `amount`, `createdAt`, `updatedAt`) VALUES
(1, 23, '08', 2025, 7000.00, '2025-08-28 22:30:47', '2025-08-28 22:30:47');

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
(2, 23, '2025-08-12', 'Invoice - INV-7', 'sales_order', 7, 3850.00, 0.00, 4845.00, '2025-08-12 13:21:02'),
(3, 22, '2025-08-18', 'Invoice - INV-10', 'sales_order', 10, 995.00, 0.00, 995.00, '2025-08-18 21:45:05');

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
('d', '2025-08-12 18:53:30.418', 19, 7, 2),
('test', '2025-08-13 16:52:16.622', 17, 8, 98),
('my feedback ', '2025-08-19 00:28:51.028', 22, 9, 2),
('testing ', '2025-08-19 11:50:11.943', 19, 10, 2),
('United mall ', '2025-08-27 11:20:14.872', 14, 11, 76),
('sales are improving ', '2025-08-27 11:46:50.041', 5, 12, 64),
('Organising after stock take', '2025-08-28 12:06:24.328', 2, 13, 99),
('test', '2025-08-29 07:14:50.831', 19, 14, 2);

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
(1, '2025-08-25', 'testing', 'test here', 'Pending', 'Chagadwa Valencia', '', 'none', NULL, '2025-08-11 18:42:13', '2025-08-26 12:02:15');

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
(25, 6, 'Manual Stock Update', 3528.00, 0.00, 3528.00, '2025-08-12 15:18:27', 1, 0.00, 0.00, 1, '2025-08-12 13:18:27'),
(26, 16, 'Manual Stock Update', 5196.00, 0.00, 5196.00, '2025-08-26 11:48:05', 1, 0.00, 0.00, 1, '2025-08-26 09:48:05'),
(28, 27, 'Manual Stock Update', 0.00, 3.00, 101.00, '2025-08-26 12:01:47', 1, 0.00, 0.00, 1, '2025-08-26 10:01:47'),
(29, 28, 'Manual Stock Update', 0.00, 5.00, 211.00, '2025-08-26 12:02:07', 1, 0.00, 0.00, 1, '2025-08-26 10:02:07'),
(30, 17, 'Manual Stock Update', 235.00, 0.00, 235.00, '2025-08-26 12:03:31', 1, 0.00, 0.00, 1, '2025-08-26 10:03:31'),
(31, 21, 'Manual Stock Update', 0.00, 62.00, 231.00, '2025-08-26 12:03:53', 1, 0.00, 0.00, 1, '2025-08-26 10:03:53'),
(32, 24, 'Manual Stock Update', 0.00, 1.00, 380.00, '2025-08-26 12:04:09', 1, 0.00, 0.00, 1, '2025-08-26 10:04:09'),
(33, 23, 'Manual Stock Update', 32.00, 0.00, 380.00, '2025-08-26 12:04:22', 1, 0.00, 0.00, 1, '2025-08-26 10:04:22'),
(34, 26, 'Manual Stock Update', 232.00, 0.00, 232.00, '2025-08-26 12:05:04', 1, 0.00, 0.00, 1, '2025-08-26 10:05:04'),
(35, 25, 'Manual Stock Update', 0.00, 20.00, 85.00, '2025-08-26 12:05:18', 1, 0.00, 0.00, 1, '2025-08-26 10:05:18'),
(36, 11, 'Manual Stock Update', 0.00, 22.00, 1195.00, '2025-08-26 12:07:11', 1, 0.00, 0.00, 1, '2025-08-26 10:07:11'),
(37, 13, 'Manual Stock Update', 0.00, 53.00, 411.00, '2025-08-26 12:07:25', 1, 0.00, 0.00, 1, '2025-08-26 10:07:25'),
(38, 10, 'Manual Stock Update', 0.00, 25.00, 1008.00, '2025-08-26 12:07:37', 1, 0.00, 0.00, 1, '2025-08-26 10:07:37'),
(39, 12, 'Manual Stock Update', 28.00, 0.00, 1642.00, '2025-08-26 12:07:51', 1, 0.00, 0.00, 1, '2025-08-26 10:07:51'),
(40, 3, 'Manual Stock Update', 3781.00, 0.00, 3840.00, '2025-08-26 12:09:37', 1, 0.00, 0.00, 1, '2025-08-26 10:09:37'),
(41, 16, 'Manual Stock Update', 0.00, 3116.00, 2080.00, '2025-08-26 12:09:58', 1, 0.00, 0.00, 1, '2025-08-26 10:09:58');

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
(2, 'JE-INV-7-17550048632', '2025-08-12', 'INV-7', 'Invoice created from order - SO-000007', 3850.00, 3850.00, 'posted', 1, '2025-08-12 13:21:02', '2025-08-12 13:21:02'),
(3, 'JE-INV-10-1755553505', '2025-08-18', 'INV-10', 'Invoice created from order - SO-2025-0003', 995.00, 995.00, 'posted', 1, '2025-08-18 21:45:04', '2025-08-18 21:45:04');

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
(4, 2, 3, 0.00, 3318.97, 'Sales revenue for invoice INV-7'),
(5, 3, 140, 995.00, 0.00, 'Invoice INV-10'),
(6, 3, 3, 0.00, 995.00, 'Sales revenue for invoice INV-10');

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
(10, '2025-08-12 18:52:38.746', '18:52:38', 2, 19, 3, '2025-08-12 18:52:51.646', -1.3008978450663726, 36.777742416894895, 'https://res.cloudinary.com/otienobryan/image/upload/v1755013973/whoosh/uploads/upload_1755013969744_2.jpg', NULL, -1.3008978450663726, 36.777742416894895, '2025-08-12 18:53:33.385', 1, NULL),
(11, '2025-08-13 16:51:09.380', '16:51:09', 98, 17, 3, '2025-08-13 16:51:45.858', -1.3009593, 36.7776606, 'https://res.cloudinary.com/otienobryan/image/upload/v1755093107/whoosh/uploads/upload_1755093107010_98.jpg', NULL, -1.3009601, 36.7777265, '2025-08-13 16:52:33.630', 1, NULL),
(12, '2025-08-19 00:27:31.913', '00:27:31', 2, 22, 3, '2025-08-19 00:28:03.447', -1.3009354, 36.777909, 'https://res.cloudinary.com/otienobryan/image/upload/v1755552485/whoosh/uploads/upload_1755552485167_2.jpg', NULL, -1.3010445, 36.7778266, '2025-08-19 00:29:11.567', 1, NULL),
(13, '2025-08-19 11:45:45.855', '11:45:45', 2, 19, 2, '2025-08-19 11:46:13.412', -1.2658019, 36.8019171, 'https://res.cloudinary.com/otienobryan/image/upload/v1755593175/whoosh/uploads/upload_1755593175020_2.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(14, '2025-08-26 11:52:14.486', '11:52:14', 2, 19, 2, '2025-08-26 11:59:20.179', -1.2658011976178243, 36.80178625362351, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(15, '2025-08-26 11:52:22.062', '11:52:22', 92, 6, 2, '2025-08-26 12:01:08.278', -1.2659247, 36.8018839, 'https://res.cloudinary.com/otienobryan/image/upload/v1756198869/whoosh/uploads/upload_1756198869235_92.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(16, '2025-08-26 11:52:20.223', '11:52:20', 64, 5, 2, '2025-08-26 11:58:39.022', 0, 0, 'https://res.cloudinary.com/otienobryan/image/upload/v1756198720/whoosh/uploads/upload_1756198720103_64.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(17, '2025-08-26 11:52:19.379', '11:52:19', 91, 13, 2, '2025-08-26 12:00:20.583', -1.2659171, 36.8017717, 'https://res.cloudinary.com/otienobryan/image/upload/v1756198822/whoosh/uploads/upload_1756198822664_91.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(21, '2025-08-26 11:53:43.701', '11:53:43', 67, 4, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(22, '2025-08-26 11:53:31.455', '11:53:31', 82, 11, 2, '2025-08-26 12:06:30.570', -1.2659153, 36.8019309, 'https://res.cloudinary.com/otienobryan/image/upload/v1756200123/whoosh/uploads/upload_1756200123192_82.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(23, '2025-08-26 11:53:31.338', '11:53:31', 78, 10, 2, '2025-08-26 11:59:38.469', -1.300897837533575, 36.777742335574864, 'https://res.cloudinary.com/otienobryan/image/upload/v1756198780/whoosh/uploads/upload_1756198780171_78.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(24, '2025-08-26 11:53:47.608', '11:53:47', 62, 2, 2, '2025-08-26 11:59:09.454', 0, 0, 'https://res.cloudinary.com/otienobryan/image/upload/v1756198750/whoosh/uploads/upload_1756198750589_62.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(25, '2025-08-26 11:53:42.706', '11:53:42', 73, 1, 2, '2025-08-26 12:01:08.065', -1.2658947, 36.8017077, 'https://res.cloudinary.com/otienobryan/image/upload/v1756198870/whoosh/uploads/upload_1756198870389_73.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(26, '2025-08-26 11:54:05.768', '11:54:05', 3, 3, 2, '2025-08-26 11:59:46.419', -1.3204357, 36.7038018, 'https://res.cloudinary.com/otienobryan/image/upload/v1756198784/whoosh/uploads/upload_1756198784513_3.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(27, '2025-08-26 11:53:44.954', '11:53:44', 63, 9, 2, '2025-08-26 11:59:31.270', -1.2196795, 36.8885403, 'https://res.cloudinary.com/otienobryan/image/upload/v1756198772/whoosh/uploads/upload_1756198772619_63.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(28, '2025-08-26 11:53:20.076', '11:53:20', 84, 12, 2, '2025-08-26 12:01:35.516', -1.2659008, 36.8017735, 'https://res.cloudinary.com/otienobryan/image/upload/v1756198897/whoosh/uploads/upload_1756198896751_84.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(29, '2025-08-26 11:54:30.481', '11:54:30', 76, 14, 2, '2025-08-26 11:59:30.925', -0.0983823, 34.7625269, 'https://res.cloudinary.com/otienobryan/image/upload/v1756198835/whoosh/uploads/upload_1756198835193_76.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(30, '2025-08-26 11:53:45.574', '11:53:45', 96, 7, 2, '2025-08-26 12:01:25.615', 0, 0, 'https://res.cloudinary.com/otienobryan/image/upload/v1756198886/whoosh/uploads/upload_1756198886530_96.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(31, '2025-08-26 11:53:44.730', '11:53:44', 89, 3, 2, '2025-08-26 12:01:14.533', -1.2658012, 36.8014611, 'https://res.cloudinary.com/otienobryan/image/upload/v1756198875/whoosh/uploads/upload_1756198875606_89.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(33, '2025-08-26 11:53:46.405', '11:53:46', 66, 7, 2, '2025-08-26 12:01:07.710', -1.2659158, 36.8018102, 'https://res.cloudinary.com/otienobryan/image/upload/v1756198869/whoosh/uploads/upload_1756198869829_66.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(34, '2025-08-26 11:53:43.119', '11:53:43', 65, 18, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(35, '2025-08-26 11:57:46.667', '11:57:46', 74, 16, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(36, '2025-08-26 11:57:26.902', '11:57:26', 67, 7, 2, '2025-08-26 12:01:07.613', -1.265827, 36.8018763, 'https://res.cloudinary.com/otienobryan/image/upload/v1756198870/whoosh/uploads/upload_1756198869680_67.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(37, '2025-08-26 11:58:01.328', '11:58:01', 88, 16, 2, '2025-08-26 12:00:18.880', 1.0280194, 34.976349, 'https://res.cloudinary.com/otienobryan/image/upload/v1756198820/whoosh/uploads/upload_1756198820213_88.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(38, '2025-08-26 11:59:24.962', '11:59:24', 77, 4, 2, '2025-08-26 12:01:45.786', -1.265689555737454, 36.80164561470216, 'https://res.cloudinary.com/otienobryan/image/upload/v1756198906/whoosh/uploads/upload_1756198906786_77.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(39, '2025-08-26 12:01:03.510', '12:01:03', 99, 3, 2, '2025-08-26 12:01:28.349', -1.2659788, 36.8018419, 'https://res.cloudinary.com/otienobryan/image/upload/v1756198890/whoosh/uploads/upload_1756198890879_99.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(40, '2025-08-26 13:11:21.647', '13:11:21', 68, 17, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(41, '2025-08-27 09:56:31.261', '09:56:31', 78, 10, 2, '2025-08-27 09:57:35.482', -1.1497505, 36.957954, 'https://res.cloudinary.com/otienobryan/image/upload/v1756277858/whoosh/uploads/upload_1756277858036_78.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(42, '2025-08-27 10:03:05.734', '10:03:05', 63, 9, 2, '2025-08-27 10:03:46.129', -1.2196795, 36.8885403, 'https://res.cloudinary.com/otienobryan/image/upload/v1756278227/whoosh/uploads/upload_1756278227531_63.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(45, '2025-08-27 10:26:57.199', '10:26:57', 91, 13, 2, '2025-08-27 10:28:13.794', -1.2283599, 36.8050358, 'https://res.cloudinary.com/otienobryan/image/upload/v1756279696/whoosh/uploads/upload_1756279696246_91.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(46, '2025-08-27 10:34:03.305', '10:34:03', 67, 6, 2, '2025-08-27 10:34:33.139', -1.3287596, 36.8906383, 'https://res.cloudinary.com/otienobryan/image/upload/v1756280071/whoosh/uploads/upload_1756280071611_67.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(47, '2025-08-27 10:36:47.015', '10:36:47', 99, 1, 2, '2025-08-27 10:37:26.063', -1.2609149, 36.8016974, 'https://res.cloudinary.com/otienobryan/image/upload/v1756280246/whoosh/uploads/upload_1756280246853_99.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(48, '2025-08-27 10:48:18.692', '10:48:18', 74, 17, 2, '2025-08-27 11:00:49.880', -4.021172, 39.719357, 'https://res.cloudinary.com/otienobryan/image/upload/v1756281651/whoosh/uploads/upload_1756281651806_74.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(49, '2025-08-27 10:48:24.717', '10:48:24', 64, 5, 2, '2025-08-27 11:45:36.671', -1.2930186, 36.7876109, 'https://res.cloudinary.com/otienobryan/image/upload/v1756284338/whoosh/uploads/upload_1756284338584_64.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(50, '2025-08-27 11:14:20.178', '11:14:20', 76, 14, 2, '2025-08-27 11:17:00.411', -0.0983823, 34.7625269, 'https://res.cloudinary.com/otienobryan/image/upload/v1756282623/whoosh/uploads/upload_1756282623365_76.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(53, '2025-08-27 12:18:36.926', '12:18:36', 65, 18, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(54, '2025-08-27 12:20:31.502', '12:20:31', 62, 2, 2, '2025-08-27 12:21:06.327', -1.2570443, 36.803133, 'https://res.cloudinary.com/otienobryan/image/upload/v1756286468/whoosh/uploads/upload_1756286468150_62.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(55, '2025-08-28 00:17:50.658', '00:17:50', 2, 19, 2, '2025-08-28 00:28:49.985', -1.2151858376775693, 36.88697560199328, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(56, '2025-08-28 10:30:08.537', '10:30:08', 63, 9, 2, '2025-08-28 10:30:41.013', -1.2196795, 36.8885403, 'https://res.cloudinary.com/otienobryan/image/upload/v1756366242/whoosh/uploads/upload_1756366242351_63.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(57, '2025-08-28 10:34:07.267', '10:34:07', 84, 12, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(58, '2025-08-28 10:36:57.201', '10:36:57', 91, 13, 2, '2025-08-28 10:37:29.792', -1.228376, 36.805045, 'https://res.cloudinary.com/otienobryan/image/upload/v1756366654/whoosh/uploads/upload_1756366654225_91.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(59, '2025-08-28 10:57:05.257', '10:57:05', 67, 9, 2, '2025-08-28 10:57:33.554', -1.2196795, 36.8885403, 'https://res.cloudinary.com/otienobryan/image/upload/v1756367855/whoosh/uploads/upload_1756367855860_67.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(60, '2025-08-28 11:07:08.335', '11:07:08', 74, 16, 2, '2025-08-28 11:12:07.421', -4.074688, 39.665527, 'https://res.cloudinary.com/otienobryan/image/upload/v1756368729/whoosh/uploads/upload_1756368729845_74.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(61, '2025-08-28 11:11:50.525', '11:11:50', 99, 2, 2, '2025-08-28 11:12:55.495', -1.2568501, 36.8037684, 'https://res.cloudinary.com/otienobryan/image/upload/v1756368777/whoosh/uploads/upload_1756368777242_99.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(62, '2025-08-28 13:54:46.657', '13:54:46', 73, 1, 2, '2025-08-28 13:55:48.590', -1.2609386, 36.8015962, 'https://res.cloudinary.com/otienobryan/image/upload/v1756378551/whoosh/uploads/upload_1756378551145_73.jpg', NULL, NULL, NULL, NULL, 1, NULL),
(63, '2025-08-28 17:07:56.130', '17:07:56', 96, 7, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(64, '2025-08-28 22:43:00.538', '22:43:00', 2, 19, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(65, '2025-08-29 00:00:11.422', '00:00:11', 2, 19, 3, '2025-08-29 00:00:32.961', -1.3009032577586774, 36.77775287316497, NULL, NULL, -1.300896370665229, 36.77774306343038, '2025-08-29 07:18:04.771', 1, NULL);

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
(1, 2, 'Annual Leave', '2025-08-12 00:00:00.000', '2025-08-22 00:00:00.000', 'just a round test', NULL, 'PENDING', '2025-08-12 17:06:36.471', '0000-00-00 00:00:00.000'),
(2, 65, 'Sick Leave', '2025-08-23 00:00:00.000', '2025-08-24 00:00:00.000', 'I tend to have dysmenorrhea which affects me during my months cycle sometimes .', NULL, 'PENDING', '2025-08-23 07:44:47.254', '0000-00-00 00:00:00.000'),
(3, 2, 'Sick Leave', '2025-08-26 00:00:00.000', '2025-08-28 00:00:00.000', ' test test test', NULL, 'PENDING', '2025-08-26 12:51:30.377', '0000-00-00 00:00:00.000');

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
(1, NULL, 1, '2025-08-12', '2025-08-22', 0, 'just a round test', NULL, 'pending', NULL, NULL, 2, NULL, '2025-08-12 17:06:37', '2025-08-12 15:06:37', '2025-08-12 15:06:37'),
(2, NULL, 2, '2025-08-23', '2025-08-24', 0, 'I tend to have dysmenorrhea which affects me during my months cycle sometimes .', NULL, 'pending', NULL, NULL, 65, NULL, '2025-08-23 07:44:48', '2025-08-23 05:44:48', '2025-08-23 05:44:48'),
(3, NULL, 2, '2025-08-26', '2025-08-28', 0, ' test test test', NULL, 'pending', NULL, NULL, 2, NULL, '2025-08-26 12:51:31', '2025-08-26 10:51:31', '2025-08-26 10:51:31');

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
(2244, 2, 'Africa/Nairobi', 0, 2, '2025-08-13 06:39:07.000', '2025-08-13 06:38:23.000'),
(2245, 88, 'Africa/Nairobi', 0, 2, '2025-08-14 20:11:20.000', '2025-08-13 10:04:37.000'),
(2246, 98, 'Africa/Nairobi', 0, 2, '2025-08-14 20:11:20.000', '2025-08-13 16:51:00.000'),
(2247, 89, 'Africa/Nairobi', 0, 2, '2025-08-13 20:08:41.000', '2025-08-13 20:08:31.000'),
(2248, 73, 'Africa/Nairobi', 0, 2, '2025-08-14 20:11:20.000', '2025-08-14 09:21:23.000'),
(2249, 74, 'Africa/Nairobi', 552, 2, '2025-08-14 20:01:49.000', '2025-08-14 10:59:40.000'),
(2250, 70, 'Africa/Nairobi', 549, 2, '2025-08-14 20:16:43.000', '2025-08-14 11:07:06.000'),
(2251, 89, 'Africa/Nairobi', 541, 2, '2025-08-14 19:52:20.000', '2025-08-14 11:10:13.000'),
(2252, 65, 'Africa/Nairobi', 0, 2, '2025-08-14 12:36:47.000', '2025-08-14 12:36:34.000'),
(2253, 76, 'Africa/Nairobi', 511, 2, '2025-08-14 21:57:00.000', '2025-08-14 13:25:24.000'),
(2254, 87, 'Africa/Nairobi', 0, 2, '2025-08-14 20:11:20.000', '2025-08-14 13:35:57.000'),
(2255, 68, 'Africa/Nairobi', 452, 2, '2025-08-14 21:16:25.000', '2025-08-14 13:44:13.000'),
(2256, 90, 'Africa/Nairobi', 264, 2, '2025-08-14 19:00:15.000', '2025-08-14 14:35:39.000'),
(2257, 71, 'Africa/Nairobi', 548, 2, '2025-08-15 19:02:59.000', '2025-08-15 09:54:26.000'),
(2258, 73, 'Africa/Nairobi', 0, 2, '2025-08-15 19:42:25.000', '2025-08-15 10:17:24.000'),
(2259, 91, 'Africa/Nairobi', 558, 2, '2025-08-15 19:42:25.000', '2025-08-15 10:23:31.000'),
(2260, 70, 'Africa/Nairobi', 577, 2, '2025-08-15 20:34:30.000', '2025-08-15 10:56:50.000'),
(2261, 76, 'Africa/Nairobi', 552, 2, '2025-08-15 20:13:03.000', '2025-08-15 11:00:49.000'),
(2262, 89, 'Africa/Nairobi', 544, 2, '2025-08-15 20:05:27.000', '2025-08-15 11:01:18.000'),
(2263, 65, 'Africa/Nairobi', 618, 2, '2025-08-15 21:25:07.000', '2025-08-15 11:06:57.000'),
(2264, 96, 'Africa/Nairobi', 0, 2, '2025-08-15 19:42:25.000', '2025-08-15 11:31:34.000'),
(2265, 62, 'Africa/Nairobi', 481, 2, '2025-08-15 20:04:31.000', '2025-08-15 12:02:47.000'),
(2266, 84, 'Africa/Nairobi', 0, 2, '2025-08-15 19:42:25.000', '2025-08-15 13:09:49.000'),
(2267, 77, 'Africa/Nairobi', 0, 2, '2025-08-15 19:42:25.000', '2025-08-15 13:12:34.000'),
(2268, 78, 'Africa/Nairobi', 407, 2, '2025-08-15 20:01:57.000', '2025-08-15 13:14:28.000'),
(2269, 82, 'Africa/Nairobi', 0, 2, '2025-08-15 19:42:25.000', '2025-08-15 13:35:34.000'),
(2270, 91, 'Africa/Nairobi', 557, 2, '2025-08-16 19:01:54.000', '2025-08-16 09:44:24.000'),
(2271, 71, 'Africa/Nairobi', 552, 2, '2025-08-16 19:06:46.000', '2025-08-16 09:53:51.000'),
(2272, 78, 'Africa/Nairobi', 0, 2, '2025-08-16 19:06:46.000', '2025-08-16 10:14:52.000'),
(2273, 76, 'Africa/Nairobi', 625, 2, '2025-08-16 20:57:00.000', '2025-08-16 10:31:22.000'),
(2274, 77, 'Africa/Nairobi', 0, 2, '2025-08-16 19:06:46.000', '2025-08-16 10:57:21.000'),
(2275, 65, 'Africa/Nairobi', 0, 2, '2025-08-16 19:06:46.000', '2025-08-16 11:04:42.000'),
(2276, 89, 'Africa/Nairobi', 547, 2, '2025-08-16 20:14:07.000', '2025-08-16 11:07:02.000'),
(2277, 70, 'Africa/Nairobi', 586, 2, '2025-08-16 20:54:31.000', '2025-08-16 11:08:17.000'),
(2278, 62, 'Africa/Nairobi', 0, 2, '2025-08-16 19:06:46.000', '2025-08-16 11:19:39.000'),
(2279, 74, 'Africa/Nairobi', 640, 2, '2025-08-16 22:24:01.000', '2025-08-16 11:43:08.000'),
(2280, 76, 'Africa/Nairobi', 631, 2, '2025-08-17 20:03:25.000', '2025-08-17 09:31:27.000'),
(2281, 91, 'Africa/Nairobi', 562, 2, '2025-08-17 19:26:49.000', '2025-08-17 10:04:13.000'),
(2282, 70, 'Africa/Nairobi', 750, 2, '2025-08-17 23:16:41.000', '2025-08-17 10:46:27.000'),
(2283, 89, 'Africa/Nairobi', 552, 2, '2025-08-17 20:15:07.000', '2025-08-17 11:02:13.000'),
(2284, 74, 'Africa/Nairobi', 652, 2, '2025-08-17 22:00:33.000', '2025-08-17 11:07:44.000'),
(2285, 66, 'Africa/Nairobi', 536, 2, '2025-08-17 20:05:59.000', '2025-08-17 11:09:17.000'),
(2286, 62, 'Africa/Nairobi', 0, 2, '2025-08-17 20:05:59.000', '2025-08-17 11:09:45.000'),
(2287, 71, 'Africa/Nairobi', 570, 2, '2025-08-18 19:40:43.000', '2025-08-18 10:10:08.000'),
(2288, 68, 'Africa/Nairobi', 0, 2, '2025-08-18 20:01:07.000', '2025-08-18 10:35:13.000'),
(2289, 91, 'Africa/Nairobi', 549, 2, '2025-08-18 20:01:07.000', '2025-08-18 10:52:01.000'),
(2290, 74, 'Africa/Nairobi', 0, 2, '2025-08-18 20:00:07.000', '2025-08-18 11:02:36.000'),
(2291, 89, 'Africa/Nairobi', 522, 2, '2025-08-18 20:06:28.000', '2025-08-18 11:24:00.000'),
(2292, 62, 'Africa/Nairobi', 0, 2, '2025-08-18 20:00:07.000', '2025-08-18 11:33:39.000'),
(2293, 65, 'Africa/Nairobi', 0, 2, '2025-08-18 20:00:07.000', '2025-08-18 11:36:53.000'),
(2294, 66, 'Africa/Nairobi', 0, 2, '2025-08-18 20:00:07.000', '2025-08-18 12:19:34.000'),
(2295, 2, 'Africa/Nairobi', 0, 2, '2025-08-19 20:00:52.000', '2025-08-19 06:06:40.000'),
(2296, 91, 'Africa/Nairobi', 546, 2, '2025-08-19 19:31:04.000', '2025-08-19 10:24:30.000'),
(2297, 71, 'Africa/Nairobi', 542, 2, '2025-08-19 19:32:29.000', '2025-08-19 10:30:28.000'),
(2298, 70, 'Africa/Nairobi', 583, 2, '2025-08-19 20:36:00.000', '2025-08-19 10:52:49.000'),
(2299, 76, 'Africa/Nairobi', 604, 2, '2025-08-19 20:58:36.000', '2025-08-19 10:54:05.000'),
(2300, 62, 'Africa/Nairobi', 0, 2, '2025-08-19 20:00:52.000', '2025-08-19 11:11:07.000'),
(2301, 74, 'Africa/Nairobi', 511, 2, '2025-08-19 20:02:52.000', '2025-08-19 11:31:29.000'),
(2302, 67, 'Africa/Nairobi', 0, 2, '2025-08-19 20:00:52.000', '2025-08-19 11:34:11.000'),
(2303, 65, 'Africa/Nairobi', 0, 2, '2025-08-19 20:00:52.000', '2025-08-19 11:34:15.000'),
(2304, 64, 'Africa/Nairobi', 507, 2, '2025-08-19 20:03:23.000', '2025-08-19 11:35:49.000'),
(2305, 77, 'Africa/Nairobi', 0, 2, '2025-08-19 20:00:52.000', '2025-08-19 11:40:00.000'),
(2306, 82, 'Africa/Nairobi', 447, 2, '2025-08-19 19:08:26.000', '2025-08-19 11:40:45.000'),
(2307, 84, 'Africa/Nairobi', 0, 2, '2025-08-19 20:00:52.000', '2025-08-19 11:46:50.000'),
(2308, 66, 'Africa/Nairobi', 0, 2, '2025-08-19 20:00:52.000', '2025-08-19 11:47:33.000'),
(2309, 96, 'Africa/Nairobi', 423, 2, '2025-08-19 19:15:54.000', '2025-08-19 12:12:40.000'),
(2310, 87, 'Africa/Nairobi', 0, 2, '2025-08-19 20:00:52.000', '2025-08-19 13:01:43.000'),
(2311, 68, 'Africa/Nairobi', 232, 2, '2025-08-19 21:02:31.000', '2025-08-19 17:09:40.000'),
(2312, 87, 'Africa/Nairobi', 0, 2, '2025-08-20 20:00:41.000', '2025-08-20 09:01:59.000'),
(2313, 76, 'Africa/Nairobi', 0, 2, '2025-08-20 20:00:41.000', '2025-08-20 09:29:32.000'),
(2314, 71, 'Africa/Nairobi', 551, 2, '2025-08-20 19:19:08.000', '2025-08-20 10:07:33.000'),
(2315, 91, 'Africa/Nairobi', 553, 2, '2025-08-20 19:38:43.000', '2025-08-20 10:25:29.000'),
(2316, 70, 'Africa/Nairobi', 711, 2, '2025-08-20 22:23:43.000', '2025-08-20 10:32:33.000'),
(2317, 67, 'Africa/Nairobi', 0, 2, '2025-08-20 20:00:41.000', '2025-08-20 10:37:24.000'),
(2318, 84, 'Africa/Nairobi', 0, 2, '2025-08-20 20:00:41.000', '2025-08-20 10:42:41.000'),
(2319, 64, 'Africa/Nairobi', 580, 2, '2025-08-20 20:27:59.000', '2025-08-20 10:47:58.000'),
(2320, 65, 'Africa/Nairobi', 0, 2, '2025-08-20 20:00:41.000', '2025-08-20 10:57:00.000'),
(2321, 96, 'Africa/Nairobi', 518, 2, '2025-08-20 19:37:04.000', '2025-08-20 10:58:59.000'),
(2322, 74, 'Africa/Nairobi', 659, 2, '2025-08-20 21:59:37.000', '2025-08-20 10:59:44.000'),
(2323, 62, 'Africa/Nairobi', 0, 2, '2025-08-20 20:00:41.000', '2025-08-20 11:09:46.000'),
(2324, 89, 'Africa/Nairobi', 527, 2, '2025-08-20 20:10:44.000', '2025-08-20 11:22:46.000'),
(2325, 66, 'Africa/Nairobi', 0, 2, '2025-08-20 20:00:41.000', '2025-08-20 12:54:29.000'),
(2326, 78, 'Africa/Nairobi', 204, 2, '2025-08-20 20:07:20.000', '2025-08-20 16:43:17.000'),
(2327, 87, 'Africa/Nairobi', 0, 2, '2025-08-21 20:00:41.000', '2025-08-21 09:42:45.000'),
(2328, 76, 'Africa/Nairobi', 628, 2, '2025-08-21 20:24:43.000', '2025-08-21 09:56:41.000'),
(2329, 65, 'Africa/Nairobi', 687, 2, '2025-08-21 21:32:00.000', '2025-08-21 10:04:16.000'),
(2330, 71, 'Africa/Nairobi', 550, 2, '2025-08-21 19:18:34.000', '2025-08-21 10:07:43.000'),
(2331, 70, 'Africa/Nairobi', 716, 2, '2025-08-21 22:25:32.000', '2025-08-21 10:28:46.000'),
(2332, 73, 'Africa/Nairobi', 579, 2, '2025-08-21 20:10:14.000', '2025-08-21 10:30:31.000'),
(2333, 84, 'Africa/Nairobi', 637, 2, '2025-08-21 21:12:40.000', '2025-08-21 10:35:39.000'),
(2334, 68, 'Africa/Nairobi', 631, 2, '2025-08-21 21:25:11.000', '2025-08-21 10:53:28.000'),
(2335, 74, 'Africa/Nairobi', 552, 2, '2025-08-21 20:08:01.000', '2025-08-21 10:55:52.000'),
(2336, 89, 'Africa/Nairobi', 552, 2, '2025-08-21 20:10:15.000', '2025-08-21 10:57:24.000'),
(2337, 67, 'Africa/Nairobi', 0, 2, '2025-08-21 20:00:41.000', '2025-08-21 10:57:25.000'),
(2338, 82, 'Africa/Nairobi', 0, 2, '2025-08-21 20:00:41.000', '2025-08-21 11:00:56.000'),
(2339, 96, 'Africa/Nairobi', 492, 2, '2025-08-21 19:14:06.000', '2025-08-21 11:01:49.000'),
(2340, 66, 'Africa/Nairobi', 726, 2, '2025-08-21 23:13:39.000', '2025-08-21 11:07:20.000'),
(2341, 92, 'Africa/Nairobi', 0, 2, '2025-08-21 20:00:41.000', '2025-08-21 11:17:01.000'),
(2342, 64, 'Africa/Nairobi', 0, 2, '2025-08-21 20:00:41.000', '2025-08-21 20:02:17.000'),
(2343, 76, 'Africa/Nairobi', 690, 2, '2025-08-22 20:54:37.000', '2025-08-22 09:24:20.000'),
(2344, 71, 'Africa/Nairobi', 545, 2, '2025-08-22 19:07:00.000', '2025-08-22 10:01:05.000'),
(2345, 84, 'Africa/Nairobi', 0, 2, '2025-08-22 20:00:41.000', '2025-08-22 10:12:53.000'),
(2346, 91, 'Africa/Nairobi', 546, 2, '2025-08-22 19:30:40.000', '2025-08-22 10:23:58.000'),
(2347, 3, 'Africa/Nairobi', 0, 2, '2025-08-22 20:00:41.000', '2025-08-22 10:36:22.000'),
(2348, 65, 'Africa/Nairobi', 0, 2, '2025-08-22 20:00:41.000', '2025-08-22 10:43:55.000'),
(2349, 70, 'Africa/Nairobi', 592, 2, '2025-08-22 20:49:09.000', '2025-08-22 10:56:48.000'),
(2350, 63, 'Africa/Nairobi', 536, 2, '2025-08-22 19:53:59.000', '2025-08-22 10:57:26.000'),
(2351, 78, 'Africa/Nairobi', 546, 2, '2025-08-22 20:05:02.000', '2025-08-22 10:58:51.000'),
(2352, 73, 'Africa/Nairobi', 630, 2, '2025-08-22 21:30:49.000', '2025-08-22 11:00:13.000'),
(2353, 68, 'Africa/Nairobi', 534, 2, '2025-08-22 19:55:04.000', '2025-08-22 11:00:20.000'),
(2354, 96, 'Africa/Nairobi', 632, 2, '2025-08-22 21:43:36.000', '2025-08-22 11:11:05.000'),
(2355, 89, 'Africa/Nairobi', 546, 2, '2025-08-22 20:29:16.000', '2025-08-22 11:22:23.000'),
(2356, 77, 'Africa/Nairobi', 0, 2, '2025-08-22 20:00:41.000', '2025-08-22 12:15:44.000'),
(2357, 3, 'Africa/Nairobi', 0, 2, '2025-08-23 20:00:41.000', '2025-08-23 10:32:28.000'),
(2358, 84, 'Africa/Nairobi', 0, 2, '2025-08-23 20:00:41.000', '2025-08-23 10:35:17.000'),
(2359, 91, 'Africa/Nairobi', 580, 2, '2025-08-23 20:16:42.000', '2025-08-23 10:35:57.000'),
(2360, 67, 'Africa/Nairobi', 532, 2, '2025-08-23 19:38:39.000', '2025-08-23 10:45:57.000'),
(2361, 68, 'Africa/Nairobi', 561, 2, '2025-08-23 20:07:54.000', '2025-08-23 10:46:40.000'),
(2362, 63, 'Africa/Nairobi', 549, 2, '2025-08-23 20:01:07.000', '2025-08-23 10:51:43.000'),
(2363, 70, 'Africa/Nairobi', 590, 2, '2025-08-23 20:45:46.000', '2025-08-23 10:55:30.000'),
(2364, 74, 'Africa/Nairobi', 547, 2, '2025-08-23 20:04:34.000', '2025-08-23 10:57:16.000'),
(2365, 76, 'Africa/Nairobi', 554, 2, '2025-08-23 20:13:48.000', '2025-08-23 10:58:58.000'),
(2366, 71, 'Africa/Nairobi', 542, 2, '2025-08-23 20:09:41.000', '2025-08-23 11:07:20.000'),
(2367, 89, 'Africa/Nairobi', 560, 2, '2025-08-23 20:30:08.000', '2025-08-23 11:09:15.000'),
(2368, 62, 'Africa/Nairobi', 0, 2, '2025-08-23 20:00:41.000', '2025-08-23 11:09:36.000'),
(2369, 77, 'Africa/Nairobi', 523, 2, '2025-08-23 20:16:23.000', '2025-08-23 11:33:17.000'),
(2370, 76, 'Africa/Nairobi', 662, 2, '2025-08-24 21:11:14.000', '2025-08-24 10:08:42.000'),
(2371, 84, 'Africa/Nairobi', 0, 2, '2025-08-25 20:00:42.000', '2025-08-24 10:09:19.000'),
(2372, 91, 'Africa/Nairobi', 574, 2, '2025-08-24 20:03:00.000', '2025-08-24 10:28:35.000'),
(2373, 3, 'Africa/Nairobi', 0, 2, '2025-08-25 20:00:42.000', '2025-08-24 10:36:32.000'),
(2374, 67, 'Africa/Nairobi', 557, 2, '2025-08-24 19:55:17.000', '2025-08-24 10:37:23.000'),
(2375, 63, 'Africa/Nairobi', 555, 2, '2025-08-24 19:54:11.000', '2025-08-24 10:39:01.000'),
(2376, 78, 'Africa/Nairobi', 0, 2, '2025-08-25 20:00:42.000', '2025-08-24 10:53:03.000'),
(2377, 89, 'Africa/Nairobi', 577, 2, '2025-08-24 20:31:00.000', '2025-08-24 10:53:12.000'),
(2378, 96, 'Africa/Nairobi', 0, 2, '2025-08-25 20:00:42.000', '2025-08-24 10:53:15.000'),
(2379, 66, 'Africa/Nairobi', 0, 2, '2025-08-25 20:00:42.000', '2025-08-24 10:55:59.000'),
(2380, 82, 'Africa/Nairobi', 488, 2, '2025-08-24 19:05:46.000', '2025-08-24 10:56:59.000'),
(2381, 70, 'Africa/Nairobi', 607, 2, '2025-08-24 21:05:39.000', '2025-08-24 10:58:11.000'),
(2382, 68, 'Africa/Nairobi', 538, 2, '2025-08-24 19:58:50.000', '2025-08-24 11:00:08.000'),
(2383, 74, 'Africa/Nairobi', 546, 2, '2025-08-24 20:07:12.000', '2025-08-24 11:00:35.000'),
(2384, 62, 'Africa/Nairobi', 0, 2, '2025-08-25 20:00:42.000', '2025-08-24 13:35:23.000'),
(2385, 91, 'Africa/Nairobi', 532, 2, '2025-08-25 18:50:42.000', '2025-08-25 09:57:50.000'),
(2386, 71, 'Africa/Nairobi', 544, 2, '2025-08-25 19:13:17.000', '2025-08-25 10:09:13.000'),
(2387, 65, 'Africa/Nairobi', 0, 2, '2025-08-25 20:00:42.000', '2025-08-25 10:33:53.000'),
(2388, 67, 'Africa/Nairobi', 568, 2, '2025-08-25 20:11:39.000', '2025-08-25 10:42:59.000'),
(2389, 74, 'Africa/Nairobi', 0, 2, '2025-08-25 20:00:42.000', '2025-08-25 10:56:40.000'),
(2390, 3, 'Africa/Nairobi', 555, 2, '2025-08-25 20:13:05.000', '2025-08-25 10:57:07.000'),
(2391, 68, 'Africa/Nairobi', 553, 2, '2025-08-25 20:11:13.000', '2025-08-25 10:57:28.000'),
(2392, 78, 'Africa/Nairobi', 552, 2, '2025-08-25 20:10:33.000', '2025-08-25 10:58:24.000'),
(2393, 96, 'Africa/Nairobi', 503, 2, '2025-08-25 19:26:08.000', '2025-08-25 11:02:27.000'),
(2394, 64, 'Africa/Nairobi', 552, 2, '2025-08-25 20:15:15.000', '2025-08-25 11:03:15.000'),
(2395, 92, 'Africa/Nairobi', 580, 2, '2025-08-25 20:44:02.000', '2025-08-25 11:03:49.000'),
(2396, 89, 'Africa/Nairobi', 556, 2, '2025-08-25 20:20:46.000', '2025-08-25 11:03:55.000'),
(2397, 62, 'Africa/Nairobi', 544, 2, '2025-08-25 20:11:17.000', '2025-08-25 11:06:47.000'),
(2398, 63, 'Africa/Nairobi', 555, 2, '2025-08-25 20:00:42.000', '2025-08-25 11:08:18.000'),
(2399, 73, 'Africa/Nairobi', 0, 2, '2025-08-25 20:00:42.000', '2025-08-25 11:18:31.000'),
(2400, 84, 'Africa/Nairobi', 0, 2, '2025-08-25 20:00:42.000', '2025-08-25 13:38:44.000'),
(2401, 76, 'Africa/Nairobi', 641, 2, '2025-08-26 20:01:21.000', '2025-08-26 09:19:43.000'),
(2402, 71, 'Africa/Nairobi', 577, 2, '2025-08-26 19:42:06.000', '2025-08-26 10:04:09.000'),
(2403, 65, 'Africa/Nairobi', 592, 2, '2025-08-26 20:00:49.000', '2025-08-26 10:08:13.000'),
(2404, 84, 'Africa/Nairobi', 543, 2, '2025-08-26 19:23:28.000', '2025-08-26 10:19:33.000'),
(2405, 78, 'Africa/Nairobi', 581, 2, '2025-08-26 20:04:40.000', '2025-08-26 10:22:59.000'),
(2406, 82, 'Africa/Nairobi', 0, 2, '2025-08-26 20:00:01.000', '2025-08-26 10:45:12.000'),
(2407, 91, 'Africa/Nairobi', 563, 2, '2025-08-26 20:10:08.000', '2025-08-26 10:46:34.000'),
(2408, 68, 'Africa/Nairobi', 566, 2, '2025-08-26 20:18:32.000', '2025-08-26 10:51:58.000'),
(2409, 74, 'Africa/Nairobi', 546, 2, '2025-08-26 20:05:19.000', '2025-08-26 10:59:05.000'),
(2410, 63, 'Africa/Nairobi', 538, 2, '2025-08-26 20:02:34.000', '2025-08-26 11:03:58.000'),
(2411, 64, 'Africa/Nairobi', 0, 2, '2025-08-26 20:00:01.000', '2025-08-26 11:08:37.000'),
(2412, 70, 'Africa/Nairobi', 565, 2, '2025-08-26 20:38:58.000', '2025-08-26 11:13:01.000'),
(2413, 89, 'Africa/Nairobi', 525, 2, '2025-08-26 20:00:13.000', '2025-08-26 11:14:26.000'),
(2414, 73, 'Africa/Nairobi', 519, 2, '2025-08-26 20:06:07.000', '2025-08-26 11:26:42.000'),
(2415, 67, 'Africa/Nairobi', 514, 2, '2025-08-26 20:01:38.000', '2025-08-26 11:26:52.000'),
(2416, 3, 'Africa/Nairobi', 513, 2, '2025-08-26 20:00:43.000', '2025-08-26 11:27:05.000'),
(2417, 92, 'Africa/Nairobi', 515, 2, '2025-08-26 20:04:46.000', '2025-08-26 11:28:58.000'),
(2418, 2, 'Africa/Nairobi', 226, 2, '2025-08-26 15:21:23.000', '2025-08-26 11:35:09.000'),
(2419, 66, 'Africa/Nairobi', 475, 2, '2025-08-26 19:33:20.000', '2025-08-26 11:37:28.000'),
(2420, 62, 'Africa/Nairobi', 0, 2, '2025-08-26 20:00:01.000', '2025-08-26 11:51:09.000'),
(2421, 99, 'Africa/Nairobi', 480, 2, '2025-08-26 19:52:09.000', '2025-08-26 11:51:24.000'),
(2422, 96, 'Africa/Nairobi', 493, 2, '2025-08-26 20:04:42.000', '2025-08-26 11:51:35.000'),
(2423, 77, 'Africa/Nairobi', 484, 2, '2025-08-26 20:03:49.000', '2025-08-26 11:58:50.000'),
(2424, 88, 'Africa/Nairobi', 0, 2, '2025-08-26 20:00:01.000', '2025-08-26 13:07:25.000'),
(2425, 78, 'Africa/Nairobi', 618, 2, '2025-08-27 20:12:35.000', '2025-08-27 09:53:55.000'),
(2426, 90, 'Africa/Nairobi', 557, 2, '2025-08-27 19:15:02.000', '2025-08-27 09:57:30.000'),
(2427, 63, 'Africa/Nairobi', 551, 2, '2025-08-27 19:13:36.000', '2025-08-27 10:02:31.000'),
(2428, 65, 'Africa/Nairobi', 0, 2, '2025-08-27 20:00:01.000', '2025-08-27 10:07:39.000'),
(2429, 91, 'Africa/Nairobi', 582, 2, '2025-08-27 20:07:10.000', '2025-08-27 10:24:30.000'),
(2430, 67, 'Africa/Nairobi', 573, 2, '2025-08-27 20:05:07.000', '2025-08-27 10:31:57.000'),
(2431, 99, 'Africa/Nairobi', 721, 2, '2025-08-27 22:36:50.000', '2025-08-27 10:34:59.000'),
(2432, 82, 'Africa/Nairobi', 537, 2, '2025-08-27 19:37:23.000', '2025-08-27 10:39:32.000'),
(2433, 74, 'Africa/Nairobi', 573, 2, '2025-08-27 20:21:57.000', '2025-08-27 10:48:05.000'),
(2434, 70, 'Africa/Nairobi', 590, 2, '2025-08-27 20:47:22.000', '2025-08-27 10:57:07.000'),
(2435, 76, 'Africa/Nairobi', 551, 2, '2025-08-27 20:10:46.000', '2025-08-27 10:58:55.000'),
(2436, 64, 'Africa/Nairobi', 537, 2, '2025-08-27 20:00:01.000', '2025-08-27 11:02:31.000'),
(2437, 62, 'Africa/Nairobi', 695, 2, '2025-08-27 22:51:01.000', '2025-08-27 11:15:21.000'),
(2438, 77, 'Africa/Nairobi', 515, 2, '2025-08-27 20:15:04.000', '2025-08-27 11:39:12.000'),
(2439, 66, 'Africa/Nairobi', 0, 2, '2025-08-27 20:00:01.000', '2025-08-27 12:23:20.000'),
(2440, 2, 'Africa/Nairobi', 0, 2, '2025-08-27 20:00:01.000', '2025-08-27 23:59:47.000'),
(2441, 84, 'Africa/Nairobi', 0, 2, '2025-08-28 20:02:00.000', '2025-08-28 09:51:28.000'),
(2442, 90, 'Africa/Nairobi', 556, 2, '2025-08-28 19:17:35.000', '2025-08-28 10:00:51.000'),
(2443, 71, 'Africa/Nairobi', 575, 2, '2025-08-28 19:42:03.000', '2025-08-28 10:06:33.000'),
(2444, 63, 'Africa/Nairobi', 566, 2, '2025-08-28 19:52:24.000', '2025-08-28 10:25:40.000'),
(2445, 76, 'Africa/Nairobi', 574, 2, '2025-08-28 20:02:27.000', '2025-08-28 10:27:52.000'),
(2446, 73, 'Africa/Nairobi', 0, 2, '2025-08-28 20:02:00.000', '2025-08-28 10:29:39.000'),
(2447, 65, 'Africa/Nairobi', 636, 2, '2025-08-28 21:13:33.000', '2025-08-28 10:36:35.000'),
(2448, 3, 'Africa/Nairobi', 569, 2, '2025-08-28 20:06:31.000', '2025-08-28 10:36:41.000'),
(2449, 91, 'Africa/Nairobi', 571, 2, '2025-08-28 20:08:07.000', '2025-08-28 10:36:47.000'),
(2450, 68, 'Africa/Nairobi', 559, 2, '2025-08-28 20:02:43.000', '2025-08-28 10:43:35.000'),
(2451, 67, 'Africa/Nairobi', 545, 2, '2025-08-28 20:02:00.000', '2025-08-28 10:56:51.000'),
(2452, 92, 'Africa/Nairobi', 0, 2, '2025-08-28 20:02:00.000', '2025-08-28 10:59:14.000'),
(2453, 64, 'Africa/Nairobi', 539, 2, '2025-08-28 20:00:33.000', '2025-08-28 11:01:29.000'),
(2454, 89, 'Africa/Nairobi', 569, 2, '2025-08-28 20:31:18.000', '2025-08-28 11:02:17.000'),
(2455, 96, 'Africa/Nairobi', 542, 2, '2025-08-28 20:05:03.000', '2025-08-28 11:02:28.000'),
(2456, 74, 'Africa/Nairobi', 0, 2, '2025-08-28 20:02:00.000', '2025-08-28 11:04:00.000'),
(2457, 99, 'Africa/Nairobi', 0, 2, '2025-08-28 20:02:00.000', '2025-08-28 11:08:03.000'),
(2458, 66, 'Africa/Nairobi', 0, 2, '2025-08-28 20:02:00.000', '2025-08-28 11:12:54.000'),
(2459, 70, 'Africa/Nairobi', 600, 2, '2025-08-28 21:19:45.000', '2025-08-28 11:19:41.000'),
(2460, 82, 'Africa/Nairobi', 460, 2, '2025-08-28 19:03:44.000', '2025-08-28 11:23:37.000'),
(2461, 2, 'Africa/Nairobi', 0, 2, '2025-08-28 20:02:00.000', '2025-08-28 20:05:17.000'),
(2462, 2, 'Africa/Nairobi', 0, 1, NULL, '2025-08-29 06:58:34.000');

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
-- Table structure for table `outlet_quantity_transactions`
--

CREATE TABLE `outlet_quantity_transactions` (
  `id` int(11) NOT NULL,
  `clientId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `transactionType` enum('sale','return','stock_adjustment','void') NOT NULL,
  `quantityIn` decimal(10,2) DEFAULT 0.00,
  `quantityOut` decimal(10,2) DEFAULT 0.00,
  `previousBalance` decimal(10,2) DEFAULT 0.00,
  `newBalance` decimal(10,2) DEFAULT 0.00,
  `referenceId` int(11) DEFAULT NULL,
  `referenceType` varchar(50) DEFAULT NULL,
  `transactionDate` datetime NOT NULL,
  `userId` int(11) NOT NULL,
  `notes` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `outlet_quantity_transactions`
--

INSERT INTO `outlet_quantity_transactions` (`id`, `clientId`, `productId`, `transactionType`, `quantityIn`, `quantityOut`, `previousBalance`, `newBalance`, `referenceId`, `referenceType`, `transactionDate`, `userId`, `notes`, `createdAt`) VALUES
(7, 22, 17, 'sale', 0.00, 1.00, 7.00, 6.00, 0, 'uplift_sale', '2025-08-12 23:11:31', 2, 'Sale made', '2025-08-12 20:11:31'),
(8, 22, 17, 'void', 1.00, 0.00, 6.00, 7.00, 0, 'uplift_sale', '2025-08-12 23:11:54', 2, 'Sale voided', '2025-08-12 20:11:54'),
(9, 22, 17, 'sale', 0.00, 1.00, 7.00, 6.00, 0, 'uplift_sale', '2025-08-13 04:35:37', 2, 'Sale made', '2025-08-13 04:35:37'),
(10, 19, 17, 'sale', 0.00, 1.00, 5.00, 4.00, 0, 'uplift_sale', '2025-08-19 08:53:29', 2, 'Sale made', '2025-08-19 08:53:28'),
(11, 19, 17, 'sale', 0.00, 1.00, 1.00, 0.00, 0, 'uplift_sale', '2025-08-26 10:59:20', 2, 'Sale made', '2025-08-26 10:59:19'),
(12, 10, 16, 'sale', 0.00, 1.00, 27.00, 26.00, 0, 'uplift_sale', '2025-08-26 11:02:53', 78, 'Sale made', '2025-08-26 11:02:53'),
(13, 9, 31, 'sale', 0.00, 1.00, 9.00, 8.00, 0, 'uplift_sale', '2025-08-26 11:04:48', 63, 'Sale made', '2025-08-26 11:04:47'),
(14, 7, 23, 'sale', 0.00, 1.00, 2.00, 1.00, 0, 'uplift_sale', '2025-08-26 11:05:44', 66, 'Sale made', '2025-08-26 11:05:44'),
(15, 7, 25, 'sale', 0.00, 1.00, 4.00, 3.00, 0, 'uplift_sale', '2025-08-26 11:07:13', 66, 'Sale made', '2025-08-26 11:07:12'),
(16, 13, 21, 'sale', 0.00, 1.00, 9.00, 8.00, 0, 'uplift_sale', '2025-08-26 11:13:23', 91, 'Sale made', '2025-08-26 11:13:22'),
(17, 5, 16, 'sale', 0.00, 1.00, 44.00, 43.00, 0, 'uplift_sale', '2025-08-26 11:20:24', 64, 'Sale made', '2025-08-26 11:20:24'),
(18, 3, 16, 'sale', 0.00, 1.00, 12.00, 11.00, 0, 'uplift_sale', '2025-08-26 11:21:05', 89, 'Sale made', '2025-08-26 11:21:04'),
(19, 2, 23, 'sale', 0.00, 1.00, 8.00, 7.00, 0, 'uplift_sale', '2025-08-26 11:21:15', 62, 'Sale made', '2025-08-26 11:21:15'),
(20, 13, 22, 'sale', 0.00, 1.00, 19.00, 18.00, 0, 'uplift_sale', '2025-08-26 11:21:29', 99, 'Sale made', '2025-08-26 11:21:28'),
(21, 3, 22, 'sale', 0.00, 2.00, 7.00, 5.00, 0, 'uplift_sale', '2025-08-26 11:24:32', 3, 'Sale made', '2025-08-26 11:24:31'),
(22, 14, 15, 'sale', 0.00, 1.00, 36.00, 35.00, 0, 'uplift_sale', '2025-08-26 11:58:37', 76, 'Sale made', '2025-08-26 11:58:37'),
(23, 14, 30, 'sale', 0.00, 1.00, 26.00, 25.00, 0, 'uplift_sale', '2025-08-26 14:47:41', 76, 'Sale made', '2025-08-26 14:47:41'),
(24, 14, 14, 'sale', 0.00, 1.00, 15.00, 14.00, 0, 'uplift_sale', '2025-08-26 14:48:39', 76, 'Sale made', '2025-08-26 14:48:38'),
(25, 9, 15, 'sale', 0.00, 1.00, 25.00, 24.00, 0, 'uplift_sale', '2025-08-26 17:01:27', 63, 'Sale made', '2025-08-26 17:01:27'),
(26, 9, 29, 'sale', 0.00, 1.00, 14.00, 13.00, 0, 'uplift_sale', '2025-08-26 17:01:29', 63, 'Sale made', '2025-08-26 17:01:29'),
(27, 9, 31, 'sale', 0.00, 1.00, 8.00, 7.00, 0, 'uplift_sale', '2025-08-26 17:01:31', 63, 'Sale made', '2025-08-26 17:01:31'),
(28, 4, 13, 'sale', 0.00, 1.00, 37.00, 36.00, 0, 'uplift_sale', '2025-08-26 21:43:17', 77, 'Sale made', '2025-08-26 21:43:16'),
(29, 4, 29, 'sale', 0.00, 2.00, 43.00, 41.00, 0, 'uplift_sale', '2025-08-26 21:43:19', 77, 'Sale made', '2025-08-26 21:43:18'),
(30, 4, 15, 'sale', 0.00, 1.00, 31.00, 30.00, 0, 'uplift_sale', '2025-08-26 21:43:21', 77, 'Sale made', '2025-08-26 21:43:21'),
(31, 13, 33, 'sale', 0.00, 1.00, 31.00, 30.00, 0, 'uplift_sale', '2025-08-27 17:06:52', 91, 'Sale made', '2025-08-27 17:06:52'),
(32, 13, 31, 'sale', 0.00, 1.00, 28.00, 27.00, 0, 'uplift_sale', '2025-08-27 17:06:54', 91, 'Sale made', '2025-08-27 17:06:54'),
(33, 13, 15, 'sale', 0.00, 3.00, 38.00, 35.00, 0, 'uplift_sale', '2025-08-27 17:06:56', 91, 'Sale made', '2025-08-27 17:06:56'),
(34, 13, 13, 'sale', 0.00, 1.00, 26.00, 25.00, 0, 'uplift_sale', '2025-08-27 17:06:58', 91, 'Sale made', '2025-08-27 17:06:58'),
(35, 14, 16, 'sale', 0.00, 1.00, 42.00, 41.00, 0, 'uplift_sale', '2025-08-27 17:13:40', 76, 'Sale made', '2025-08-27 17:13:40'),
(36, 14, 15, 'sale', 0.00, 2.00, 35.00, 33.00, 0, 'uplift_sale', '2025-08-27 17:13:42', 76, 'Sale made', '2025-08-27 17:13:42'),
(37, 14, 35, 'sale', 0.00, 1.00, 25.00, 24.00, 0, 'uplift_sale', '2025-08-27 17:28:31', 76, 'Sale made', '2025-08-27 17:28:31'),
(38, 5, 16, 'sale', 0.00, 1.00, 43.00, 42.00, 0, 'uplift_sale', '2025-08-27 18:28:54', 64, 'Sale made', '2025-08-27 18:28:53'),
(39, 5, 3, 'sale', 0.00, 1.00, 20.00, 19.00, 0, 'uplift_sale', '2025-08-27 18:28:56', 64, 'Sale made', '2025-08-27 18:28:55'),
(40, 5, 31, 'sale', 0.00, 1.00, 32.00, 31.00, 0, 'uplift_sale', '2025-08-27 18:28:58', 64, 'Sale made', '2025-08-27 18:28:57'),
(41, 5, 29, 'sale', 0.00, 1.00, 30.00, 29.00, 0, 'uplift_sale', '2025-08-27 18:29:00', 64, 'Sale made', '2025-08-27 18:28:59'),
(42, 5, 8, 'sale', 0.00, 1.00, 17.00, 16.00, 0, 'uplift_sale', '2025-08-27 18:29:02', 64, 'Sale made', '2025-08-27 18:29:01'),
(43, 5, 32, 'sale', 0.00, 1.00, 10.00, 9.00, 0, 'uplift_sale', '2025-08-27 18:29:04', 64, 'Sale made', '2025-08-27 18:29:03'),
(44, 4, 15, 'sale', 0.00, 4.00, 41.00, 37.00, 0, 'uplift_sale', '2025-08-27 19:56:06', 77, 'Sale made', '2025-08-27 19:56:06'),
(45, 4, 13, 'sale', 0.00, 1.00, 36.00, 35.00, 0, 'uplift_sale', '2025-08-27 19:56:08', 77, 'Sale made', '2025-08-27 19:56:08'),
(46, 4, 8, 'sale', 0.00, 1.00, 26.00, 25.00, 0, 'uplift_sale', '2025-08-27 19:56:11', 77, 'Sale made', '2025-08-27 19:56:10'),
(47, 4, 30, 'sale', 0.00, 1.00, 74.00, 73.00, 0, 'uplift_sale', '2025-08-27 19:56:13', 77, 'Sale made', '2025-08-27 19:56:12'),
(48, 4, 31, 'sale', 0.00, 2.00, 21.00, 19.00, 0, 'uplift_sale', '2025-08-27 19:56:15', 77, 'Sale made', '2025-08-27 19:56:15'),
(49, 4, 29, 'sale', 0.00, 1.00, 41.00, 40.00, 0, 'uplift_sale', '2025-08-27 19:56:17', 77, 'Sale made', '2025-08-27 19:56:17'),
(50, 9, 32, 'sale', 0.00, 1.00, 10.00, 9.00, 0, 'uplift_sale', '2025-08-27 20:17:08', 63, 'Sale made', '2025-08-27 20:17:08'),
(51, 9, 29, 'sale', 0.00, 2.00, 23.00, 21.00, 0, 'uplift_sale', '2025-08-27 20:17:10', 63, 'Sale made', '2025-08-27 20:17:10'),
(52, 9, 31, 'sale', 0.00, 6.00, 8.00, 2.00, 0, 'uplift_sale', '2025-08-27 20:17:12', 63, 'Sale made', '2025-08-27 20:17:12'),
(53, 13, 16, 'sale', 0.00, 1.00, 13.00, 12.00, 0, 'uplift_sale', '2025-08-28 16:32:54', 91, 'Sale made', '2025-08-28 16:32:53'),
(54, 13, 25, 'sale', 0.00, 1.00, 5.00, 4.00, 0, 'uplift_sale', '2025-08-28 16:32:56', 91, 'Sale made', '2025-08-28 16:32:55'),
(55, 13, 26, 'sale', 0.00, 1.00, 10.00, 9.00, 0, 'uplift_sale', '2025-08-28 16:32:58', 91, 'Sale made', '2025-08-28 16:32:57'),
(56, 13, 31, 'sale', 0.00, 2.00, 27.00, 25.00, 0, 'uplift_sale', '2025-08-28 16:33:00', 91, 'Sale made', '2025-08-28 16:32:59'),
(57, 13, 8, 'sale', 0.00, 1.00, 27.00, 26.00, 0, 'uplift_sale', '2025-08-28 16:33:02', 91, 'Sale made', '2025-08-28 16:33:02'),
(58, 13, 11, 'sale', 0.00, 1.00, 30.00, 29.00, 0, 'uplift_sale', '2025-08-28 16:33:04', 91, 'Sale made', '2025-08-28 16:33:04'),
(59, 13, 14, 'sale', 0.00, 1.00, 29.00, 28.00, 0, 'uplift_sale', '2025-08-28 16:33:06', 91, 'Sale made', '2025-08-28 16:33:06'),
(60, 13, 12, 'sale', 0.00, 1.00, 25.00, 24.00, 0, 'uplift_sale', '2025-08-28 16:33:08', 91, 'Sale made', '2025-08-28 16:33:08'),
(61, 13, 15, 'sale', 0.00, 3.00, 35.00, 32.00, 0, 'uplift_sale', '2025-08-28 16:33:10', 91, 'Sale made', '2025-08-28 16:33:10'),
(62, 9, 16, 'sale', 0.00, 1.00, 15.00, 14.00, 0, 'uplift_sale', '2025-08-28 16:35:36', 63, 'Sale made', '2025-08-28 16:35:35'),
(63, 9, 29, 'sale', 0.00, 1.00, 21.00, 20.00, 0, 'uplift_sale', '2025-08-28 16:35:38', 63, 'Sale made', '2025-08-28 16:35:37'),
(64, 9, 31, 'sale', 0.00, 2.00, 2.00, 0.00, 0, 'uplift_sale', '2025-08-28 16:35:40', 63, 'Sale made', '2025-08-28 16:35:40'),
(65, 9, 15, 'sale', 0.00, 2.00, 24.00, 22.00, 0, 'uplift_sale', '2025-08-28 16:35:42', 63, 'Sale made', '2025-08-28 16:35:42'),
(66, 2, 31, 'sale', 0.00, 1.00, 15.00, 14.00, 0, 'uplift_sale', '2025-08-28 16:57:38', 99, 'Sale made', '2025-08-28 16:57:38'),
(67, 13, 28, 'sale', 0.00, 1.00, 19.00, 18.00, 0, 'uplift_sale', '2025-08-28 17:02:37', 91, 'Sale made', '2025-08-28 17:02:37'),
(68, 13, 7, 'sale', 0.00, 1.00, 29.00, 28.00, 0, 'uplift_sale', '2025-08-28 17:02:39', 91, 'Sale made', '2025-08-28 17:02:39'),
(69, 3, 33, 'sale', 0.00, 1.00, 26.00, 25.00, 0, 'uplift_sale', '2025-08-28 17:07:03', 89, 'Sale made', '2025-08-28 17:07:03'),
(70, 3, 15, 'sale', 0.00, 1.00, 15.00, 14.00, 0, 'uplift_sale', '2025-08-28 17:07:57', 89, 'Sale made', '2025-08-28 17:07:56'),
(71, 3, 30, 'sale', 0.00, 1.00, 64.00, 63.00, 0, 'uplift_sale', '2025-08-28 17:09:07', 89, 'Sale made', '2025-08-28 17:09:07'),
(72, 14, 20, 'sale', 0.00, 2.00, 6.00, 4.00, 0, 'uplift_sale', '2025-08-28 18:30:08', 76, 'Sale made', '2025-08-28 18:30:07'),
(73, 14, 15, 'sale', 0.00, 4.00, 33.00, 29.00, 0, 'uplift_sale', '2025-08-28 18:31:28', 76, 'Sale made', '2025-08-28 18:31:28'),
(74, 14, 20, 'void', 2.00, 0.00, 4.00, 6.00, 0, 'uplift_sale', '2025-08-28 18:32:38', 76, 'Sale voided', '2025-08-28 18:32:38'),
(75, 14, 20, 'sale', 0.00, 2.00, 6.00, 4.00, 0, 'uplift_sale', '2025-08-28 18:33:19', 76, 'Sale made', '2025-08-28 18:33:18'),
(76, 14, 32, 'sale', 0.00, 1.00, 8.00, 7.00, 0, 'uplift_sale', '2025-08-28 18:35:15', 76, 'Sale made', '2025-08-28 18:35:14'),
(77, 14, 8, 'sale', 0.00, 1.00, 5.00, 4.00, 0, 'uplift_sale', '2025-08-28 18:35:53', 76, 'Sale made', '2025-08-28 18:35:53'),
(78, 14, 30, 'sale', 0.00, 1.00, 25.00, 24.00, 0, 'uplift_sale', '2025-08-28 18:36:25', 76, 'Sale made', '2025-08-28 18:36:25'),
(79, 14, 7, 'sale', 0.00, 1.00, 26.00, 25.00, 0, 'uplift_sale', '2025-08-28 18:36:54', 76, 'Sale made', '2025-08-28 18:36:54'),
(80, 14, 14, 'sale', 0.00, 1.00, 14.00, 13.00, 0, 'uplift_sale', '2025-08-28 18:37:26', 76, 'Sale made', '2025-08-28 18:37:26'),
(81, 14, 10, 'sale', 0.00, 1.00, 36.00, 35.00, 0, 'uplift_sale', '2025-08-28 18:38:23', 76, 'Sale made', '2025-08-28 18:38:22'),
(82, 5, 30, 'sale', 0.00, 1.00, 29.00, 28.00, 0, 'uplift_sale', '2025-08-28 18:40:06', 64, 'Sale made', '2025-08-28 18:40:06'),
(83, 5, 3, 'sale', 0.00, 1.00, 19.00, 18.00, 0, 'uplift_sale', '2025-08-28 18:40:09', 64, 'Sale made', '2025-08-28 18:40:08');

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
(NULL, NULL, NULL, '2025-08-12 17:53:20.970', 19, 9, 2, NULL),
('GLAMAOUR QUEEN EYEBROW PENCIL Black', 20, '', '2025-08-13 16:52:00.388', 17, 10, 98, 17),
('GLAMAOUR QUEEN EYEBROW PENCIL Deep Brown', 3, '', '2025-08-13 16:52:00.388', 17, 11, 98, 18),
('GLAMAOUR QUEEN EYEBROW PENCIL Black', 2, '', '2025-08-19 00:28:27.833', 22, 12, 2, 17),
('GLAMAOUR QUEEN EYEBROW PENCIL Deep Brown', 6, '', '2025-08-19 00:28:27.833', 22, 13, 2, 18),
('GLAMAOUR QUEEN EYELASHES Doll Natural', 3, '', '2025-08-19 00:28:27.833', 22, 14, 2, 21),
('GLAMAOUR QUEEN EYELASHES Doll Volumizing', 8, '', '2025-08-19 00:28:27.833', 22, 15, 2, 22),
('GLAMAOUR QUEEN EYEBROW PENCIL Black', 20, '', '2025-08-19 11:50:23.888', 19, 16, 2, 17),
(' INTERSTELLAR Moisturizing Lip Balm', 42, '', '2025-08-26 15:28:58.047', 14, 17, 76, 16),
('Caramel Foundation', 16, '', '2025-08-26 15:28:58.047', 14, 18, 76, 33),
('Chocolate Foundation', 25, '', '2025-08-26 15:28:58.047', 14, 19, 76, 35),
('EYELASHES Doll Natural', 6, '', '2025-08-26 15:28:58.047', 14, 20, 76, 21),
('EYELASHES Doll Volumizing', 3, '', '2025-08-26 15:28:58.047', 14, 21, 76, 22),
('EYELASHES Drama Lengthening', 2, '', '2025-08-26 15:28:58.047', 14, 22, 76, 23),
('EYELASHES Drama Volumizing', 3, '', '2025-08-26 15:28:58.047', 14, 23, 76, 24),
('EYELASHES Flared Lengthening', 5, '', '2025-08-26 15:28:58.047', 14, 24, 76, 27),
('EYELASHES Flared Volumizing', 7, '', '2025-08-26 15:28:58.047', 14, 25, 76, 28),
('EYELASHES Naked Natural', 6, '', '2025-08-26 15:28:58.047', 14, 26, 76, 20),
('EYELASHES Naked Sexy', 3, '', '2025-08-26 15:28:58.047', 14, 27, 76, 19),
('EYELASHES Rounded Lengthening', 3, '', '2025-08-26 15:28:58.047', 14, 28, 76, 25),
('EYELASHES Rounded Volumizing', 3, '', '2025-08-26 15:28:58.047', 14, 29, 76, 26),
('GLAM SAFARI GLOW GLAM LASHES Nibusu', 37, '', '2025-08-26 15:28:58.047', 14, 30, 76, 31),
('GLAM SAFARI GLOW GLAM LASHES Nuru', 26, '', '2025-08-26 15:28:58.047', 14, 31, 76, 30),
('GLAM SAFARI GLOW GLAM LASHES Waridi', 20, '', '2025-08-26 15:28:58.047', 14, 32, 76, 29),
('INTERSTELLAR Colour Changing Lip Balm', 36, '', '2025-08-26 15:28:58.047', 14, 33, 76, 15),
('Latte Foundation', 8, '', '2025-08-26 15:28:58.047', 14, 34, 76, 34),
('LIQUID EYELINER Black', 24, '', '2025-08-26 15:28:58.047', 14, 35, 76, 3),
('LIQUID LIPSTICK Bitterness Kiss', 36, '', '2025-08-26 15:28:58.047', 14, 36, 76, 10),
('LIQUID LIPSTICK Boss In Skirt', 22, '', '2025-08-26 15:28:58.047', 14, 37, 76, 13),
('LIQUID LIPSTICK Crazy In Love', 5, '', '2025-08-26 15:28:58.047', 14, 38, 76, 8),
('LIQUID LIPSTICK Crush On You', 26, '', '2025-08-26 15:28:58.047', 14, 39, 76, 7),
('LIQUID LIPSTICK Don\'t Shush Me', 38, '', '2025-08-26 15:28:58.047', 14, 40, 76, 11),
('LIQUID LIPSTICK No limit', 15, '', '2025-08-26 15:28:58.047', 14, 41, 76, 14),
('LIQUID LIPSTICK Say My Name', 29, '', '2025-08-26 15:28:58.047', 14, 42, 76, 12),
('Peanut Foundation', 8, '', '2025-08-26 15:28:58.047', 14, 43, 76, 32),
(' INTERSTELLAR Moisturizing Lip Balm', 42, '', '2025-08-27 11:19:16.850', 14, 44, 76, 16),
('Caramel Foundation', 16, '', '2025-08-27 11:19:16.850', 14, 45, 76, 33),
('Chocolate Foundation', 25, '', '2025-08-27 11:19:16.850', 14, 46, 76, 35),
('EYELASHES Doll Natural', 6, '', '2025-08-27 11:19:16.850', 14, 47, 76, 21),
('EYELASHES Doll Volumizing', 3, '', '2025-08-27 11:19:16.850', 14, 48, 76, 22),
('EYELASHES Drama Lengthening', 2, '', '2025-08-27 11:19:16.850', 14, 49, 76, 23),
('EYELASHES Drama Volumizing', 3, '', '2025-08-27 11:19:16.850', 14, 50, 76, 24),
('EYELASHES Flared Lengthening', 5, '', '2025-08-27 11:19:16.850', 14, 51, 76, 27),
('EYELASHES Flared Volumizing', 7, '', '2025-08-27 11:19:16.850', 14, 52, 76, 28),
('EYELASHES Naked Natural', 6, '', '2025-08-27 11:19:16.850', 14, 53, 76, 20),
('EYELASHES Naked Sexy', 3, '', '2025-08-27 11:19:16.850', 14, 54, 76, 19),
('EYELASHES Rounded Lengthening', 3, '', '2025-08-27 11:19:16.850', 14, 55, 76, 25),
('EYELASHES Rounded Volumizing', 3, '', '2025-08-27 11:19:16.850', 14, 56, 76, 26),
('GLAM SAFARI GLOW GLAM LASHES Nibusu', 37, '', '2025-08-27 11:19:16.850', 14, 57, 76, 31),
('GLAM SAFARI GLOW GLAM LASHES Nuru', 25, '', '2025-08-27 11:19:16.850', 14, 58, 76, 30),
('GLAM SAFARI GLOW GLAM LASHES Waridi', 20, '', '2025-08-27 11:19:16.850', 14, 59, 76, 29),
('INTERSTELLAR Colour Changing Lip Balm', 35, '', '2025-08-27 11:19:16.850', 14, 60, 76, 15),
('Latte Foundation', 8, '', '2025-08-27 11:19:16.850', 14, 61, 76, 34),
('LIQUID EYELINER Black', 24, '', '2025-08-27 11:19:16.850', 14, 62, 76, 3),
('LIQUID LIPSTICK Bitterness Kiss', 36, '', '2025-08-27 11:19:16.850', 14, 63, 76, 10),
('LIQUID LIPSTICK Boss In Skirt', 22, '', '2025-08-27 11:19:16.850', 14, 64, 76, 13),
('LIQUID LIPSTICK Crazy In Love', 5, '', '2025-08-27 11:19:16.850', 14, 65, 76, 8),
('LIQUID LIPSTICK Crush On You', 26, '', '2025-08-27 11:19:16.850', 14, 66, 76, 7),
('LIQUID LIPSTICK Don\'t Shush Me', 38, '', '2025-08-27 11:19:16.850', 14, 67, 76, 11),
('LIQUID LIPSTICK No limit', 14, '', '2025-08-27 11:19:16.850', 14, 68, 76, 14),
('LIQUID LIPSTICK Say My Name', 29, '', '2025-08-27 11:19:16.850', 14, 69, 76, 12),
('Peanut Foundation', 8, '', '2025-08-27 11:19:16.850', 14, 70, 76, 32),
(' INTERSTELLAR Moisturizing Lip Balm', 42, '', '2025-08-27 11:21:20.720', 14, 71, 76, 16),
('Caramel Foundation', 16, '', '2025-08-27 11:21:20.720', 14, 72, 76, 33),
('Chocolate Foundation', 25, '', '2025-08-27 11:21:20.720', 14, 73, 76, 35),
('EYELASHES Doll Natural', 6, '', '2025-08-27 11:21:20.720', 14, 74, 76, 21),
('EYELASHES Doll Volumizing', 3, '', '2025-08-27 11:21:20.720', 14, 75, 76, 22),
('EYELASHES Drama Lengthening', 2, '', '2025-08-27 11:21:20.720', 14, 76, 76, 23),
('EYELASHES Drama Volumizing', 3, '', '2025-08-27 11:21:20.720', 14, 77, 76, 24),
('EYELASHES Flared Lengthening', 5, '', '2025-08-27 11:21:20.720', 14, 78, 76, 27),
('EYELASHES Flared Volumizing', 7, '', '2025-08-27 11:21:20.720', 14, 79, 76, 28),
('EYELASHES Naked Natural', 6, '', '2025-08-27 11:21:20.720', 14, 80, 76, 20),
('EYELASHES Naked Sexy', 3, '', '2025-08-27 11:21:20.720', 14, 81, 76, 19),
('EYELASHES Rounded Lengthening', 3, '', '2025-08-27 11:21:20.720', 14, 82, 76, 25),
('EYELASHES Rounded Volumizing', 3, '', '2025-08-27 11:21:20.720', 14, 83, 76, 26),
('GLAM SAFARI GLOW GLAM LASHES Nibusu', 37, '', '2025-08-27 11:21:20.720', 14, 84, 76, 31),
('GLAM SAFARI GLOW GLAM LASHES Nuru', 25, '', '2025-08-27 11:21:20.720', 14, 85, 76, 30),
('GLAM SAFARI GLOW GLAM LASHES Waridi', 20, '', '2025-08-27 11:21:20.720', 14, 86, 76, 29),
('INTERSTELLAR Colour Changing Lip Balm', 35, '', '2025-08-27 11:21:20.720', 14, 87, 76, 15),
('Latte Foundation', 8, '', '2025-08-27 11:21:20.720', 14, 88, 76, 34),
('LIQUID EYELINER Black', 24, '', '2025-08-27 11:21:20.720', 14, 89, 76, 3),
('LIQUID LIPSTICK Bitterness Kiss', 36, '', '2025-08-27 11:21:20.720', 14, 90, 76, 10),
('LIQUID LIPSTICK Boss In Skirt', 22, '', '2025-08-27 11:21:20.720', 14, 91, 76, 13),
('LIQUID LIPSTICK Crazy In Love', 5, '', '2025-08-27 11:21:20.720', 14, 92, 76, 8),
('LIQUID LIPSTICK Crush On You', 26, '', '2025-08-27 11:21:20.720', 14, 93, 76, 7),
('LIQUID LIPSTICK Don\'t Shush Me', 38, '', '2025-08-27 11:21:20.720', 14, 94, 76, 11),
('LIQUID LIPSTICK No limit', 14, '', '2025-08-27 11:21:20.720', 14, 95, 76, 14),
('LIQUID LIPSTICK Say My Name', 29, '', '2025-08-27 11:21:20.720', 14, 96, 76, 12),
('Peanut Foundation', 8, '', '2025-08-27 11:21:20.720', 14, 97, 76, 32),
(NULL, NULL, NULL, '2025-08-27 10:46:34.987', 5, 98, 64, NULL),
(' INTERSTELLAR Moisturizing Lip Balm', 15, '', '2025-08-28 10:39:01.522', 9, 99, 63, 16),
('Caramel Foundation', 8, '', '2025-08-28 10:39:01.522', 9, 100, 63, 33),
('Chocolate Foundation', 11, '', '2025-08-28 10:39:01.522', 9, 101, 63, 35),
('EYELASHES Doll Natural', 1, '', '2025-08-28 10:39:01.522', 9, 102, 63, 21),
('EYELASHES Doll Volumizing', 3, '', '2025-08-28 10:39:01.522', 9, 103, 63, 22),
('EYELASHES Drama Lengthening', 3, '', '2025-08-28 10:39:01.522', 9, 104, 63, 23),
('EYELASHES Drama Volumizing', 2, '', '2025-08-28 10:39:01.522', 9, 105, 63, 24),
('EYELASHES Flared Lengthening', 2, '', '2025-08-28 10:39:01.522', 9, 106, 63, 27),
('EYELASHES Flared Volumizing', 2, '', '2025-08-28 10:39:01.522', 9, 107, 63, 28),
('EYELASHES Naked Natural', 2, '', '2025-08-28 10:39:01.522', 9, 108, 63, 20),
('EYELASHES Naked Sexy', 3, '', '2025-08-28 10:39:01.522', 9, 109, 63, 19),
('EYELASHES Rounded Lengthening', 2, '', '2025-08-28 10:39:01.522', 9, 110, 63, 25),
('GLAM SAFARI GLOW GLAM LASHES Nibusu', 2, '', '2025-08-28 10:39:01.522', 9, 111, 63, 31),
('GLAM SAFARI GLOW GLAM LASHES Nuru', 21, '', '2025-08-28 10:39:01.522', 9, 112, 63, 30),
('GLAM SAFARI GLOW GLAM LASHES Waridi', 21, '', '2025-08-28 10:39:01.522', 9, 113, 63, 29),
('INTERSTELLAR Colour Changing Lip Balm', 24, '', '2025-08-28 10:39:01.522', 9, 114, 63, 15),
('Latte Foundation', 12, '', '2025-08-28 10:39:01.522', 9, 115, 63, 34),
('LIQUID EYELINER Black', 23, '', '2025-08-28 10:39:01.522', 9, 116, 63, 3),
('LIQUID LIPSTICK Bitterness Kiss', 5, '', '2025-08-28 10:39:01.522', 9, 117, 63, 10),
('LIQUID LIPSTICK Boss In Skirt', 10, '', '2025-08-28 10:39:01.522', 9, 118, 63, 13),
('LIQUID LIPSTICK Crazy In Love', 3, '', '2025-08-28 10:39:01.522', 9, 119, 63, 8),
('LIQUID LIPSTICK Crush On You', 5, '', '2025-08-28 10:39:01.522', 9, 120, 63, 7),
('LIQUID LIPSTICK Don\'t Shush Me', 8, '', '2025-08-28 10:39:01.522', 9, 121, 63, 11),
('LIQUID LIPSTICK No limit', 7, '', '2025-08-28 10:39:01.522', 9, 122, 63, 14),
('LIQUID LIPSTICK Say My Name', 8, '', '2025-08-28 10:39:01.522', 9, 123, 63, 12),
('Peanut Foundation', 11, '', '2025-08-28 10:39:01.522', 9, 124, 63, 32),
(' INTERSTELLAR Moisturizing Lip Balm', 29, '', '2025-08-28 11:40:33.908', 2, 125, 99, 16),
('Caramel Foundation', 28, '', '2025-08-28 11:40:33.908', 2, 126, 99, 33),
('Chocolate Foundation', 20, '', '2025-08-28 11:40:33.908', 2, 127, 99, 35),
('EYELASHES Doll Natural', 7, '', '2025-08-28 11:40:33.908', 2, 128, 99, 21),
('EYELASHES Doll Volumizing', 11, '', '2025-08-28 11:40:33.908', 2, 129, 99, 22),
('EYELASHES Drama Lengthening', 8, '', '2025-08-28 11:40:33.908', 2, 130, 99, 23),
('EYELASHES Drama Volumizing', 10, '', '2025-08-28 11:40:33.908', 2, 131, 99, 24),
('EYELASHES Flared Lengthening', 7, '', '2025-08-28 11:40:33.908', 2, 132, 99, 27),
('EYELASHES Flared Volumizing', 11, '', '2025-08-28 11:40:33.908', 2, 133, 99, 28),
('EYELASHES Naked Natural', 4, '', '2025-08-28 11:40:33.908', 2, 134, 99, 20),
('EYELASHES Naked Sexy', 12, '', '2025-08-28 11:40:33.908', 2, 135, 99, 19),
('EYELASHES Rounded Lengthening', 8, '', '2025-08-28 11:40:33.908', 2, 136, 99, 25),
('EYELASHES Rounded Volumizing', 11, '', '2025-08-28 11:40:33.908', 2, 137, 99, 26),
('GLAM SAFARI GLOW GLAM LASHES Nibusu', 15, '', '2025-08-28 11:40:33.908', 2, 138, 99, 31),
('GLAM SAFARI GLOW GLAM LASHES Nuru', 34, '', '2025-08-28 11:40:33.908', 2, 139, 99, 30),
('GLAM SAFARI GLOW GLAM LASHES Waridi', 18, '', '2025-08-28 11:40:33.908', 2, 140, 99, 29),
('INTERSTELLAR Colour Changing Lip Balm', 25, '', '2025-08-28 11:40:33.908', 2, 141, 99, 15),
('Latte Foundation', 26, '', '2025-08-28 11:40:33.908', 2, 142, 99, 34),
('LIQUID EYELINER Black', 19, '', '2025-08-28 11:40:33.908', 2, 143, 99, 3),
('LIQUID LIPSTICK Bitterness Kiss', 24, '', '2025-08-28 11:40:33.908', 2, 144, 99, 10),
('LIQUID LIPSTICK Boss In Skirt', 20, '', '2025-08-28 11:40:33.908', 2, 145, 99, 13),
('LIQUID LIPSTICK Crazy In Love', 18, '', '2025-08-28 11:40:33.908', 2, 146, 99, 8),
('LIQUID LIPSTICK Crush On You', 18, '', '2025-08-28 11:40:33.908', 2, 147, 99, 7),
('LIQUID LIPSTICK Don\'t Shush Me', 47, '', '2025-08-28 11:40:33.908', 2, 148, 99, 11),
('LIQUID LIPSTICK No limit', 29, '', '2025-08-28 11:40:33.908', 2, 149, 99, 14),
('LIQUID LIPSTICK Say My Name', 20, '', '2025-08-28 11:40:33.908', 2, 150, 99, 12),
('LIQUID LIPSTICK Wildnight', 11, '', '2025-08-28 11:40:33.908', 2, 151, 99, 9),
('Peanut Foundation', 23, '', '2025-08-28 11:40:33.908', 2, 152, 99, 32),
(' INTERSTELLAR Moisturizing Lip Balm', 34, '', '2025-08-28 12:05:11.513', 2, 153, 99, 16),
('Caramel Foundation', 28, '', '2025-08-28 12:05:11.513', 2, 154, 99, 33),
('Chocolate Foundation', 20, '', '2025-08-28 12:05:11.513', 2, 155, 99, 35),
('EYELASHES Doll Natural', 7, '', '2025-08-28 12:05:11.513', 2, 156, 99, 21),
('EYELASHES Doll Volumizing', 11, '', '2025-08-28 12:05:11.513', 2, 157, 99, 22),
('EYELASHES Drama Lengthening', 8, '', '2025-08-28 12:05:11.513', 2, 158, 99, 23),
('EYELASHES Drama Volumizing', 10, '', '2025-08-28 12:05:11.513', 2, 159, 99, 24),
('EYELASHES Flared Lengthening', 7, '', '2025-08-28 12:05:11.513', 2, 160, 99, 27),
('EYELASHES Flared Volumizing', 11, '', '2025-08-28 12:05:11.513', 2, 161, 99, 28),
('EYELASHES Naked Natural', 4, '', '2025-08-28 12:05:11.513', 2, 162, 99, 20),
('EYELASHES Naked Sexy', 12, '', '2025-08-28 12:05:11.513', 2, 163, 99, 19),
('EYELASHES Rounded Lengthening', 8, '', '2025-08-28 12:05:11.513', 2, 164, 99, 25),
('EYELASHES Rounded Volumizing', 11, '', '2025-08-28 12:05:11.513', 2, 165, 99, 26),
('GLAM SAFARI GLOW GLAM LASHES Nibusu', 15, '', '2025-08-28 12:05:11.513', 2, 166, 99, 31),
('GLAM SAFARI GLOW GLAM LASHES Nuru', 34, '', '2025-08-28 12:05:11.513', 2, 167, 99, 30),
('GLAM SAFARI GLOW GLAM LASHES Waridi', 18, '', '2025-08-28 12:05:11.513', 2, 168, 99, 29),
('INTERSTELLAR Colour Changing Lip Balm', 25, '', '2025-08-28 12:05:11.513', 2, 169, 99, 15),
('Latte Foundation', 26, '', '2025-08-28 12:05:11.513', 2, 170, 99, 34),
('LIQUID EYELINER Black', 19, '', '2025-08-28 12:05:11.513', 2, 171, 99, 3),
('LIQUID LIPSTICK Bitterness Kiss', 24, '', '2025-08-28 12:05:11.513', 2, 172, 99, 10),
('LIQUID LIPSTICK Boss In Skirt', 20, '', '2025-08-28 12:05:11.513', 2, 173, 99, 13),
('LIQUID LIPSTICK Crazy In Love', 18, '', '2025-08-28 12:05:11.513', 2, 174, 99, 8),
('LIQUID LIPSTICK Crush On You', 18, '', '2025-08-28 12:05:11.513', 2, 175, 99, 7),
('LIQUID LIPSTICK Don\'t Shush Me', 47, '', '2025-08-28 12:05:11.513', 2, 176, 99, 11),
('LIQUID LIPSTICK No limit', 29, '', '2025-08-28 12:05:11.513', 2, 177, 99, 14),
('LIQUID LIPSTICK Say My Name', 20, '', '2025-08-28 12:05:11.513', 2, 178, 99, 12),
('LIQUID LIPSTICK Wildnight', 11, '', '2025-08-28 12:05:11.513', 2, 179, 99, 9),
('Peanut Foundation', 23, '', '2025-08-28 12:05:11.513', 2, 180, 99, 32),
(' INTERSTELLAR Moisturizing Lip Balm', 34, '', '2025-08-28 18:56:38.494', 2, 181, 99, 16),
('Caramel Foundation', 28, '', '2025-08-28 18:56:39.377', 2, 182, 99, 33),
('Chocolate Foundation', 20, '', '2025-08-28 18:56:40.261', 2, 183, 99, 35),
('EYELASHES Doll Natural', 7, '', '2025-08-28 18:56:41.144', 2, 184, 99, 21),
('EYELASHES Doll Volumizing', 11, '', '2025-08-28 18:56:42.029', 2, 185, 99, 22),
('EYELASHES Drama Lengthening', 8, '', '2025-08-28 18:56:42.914', 2, 186, 99, 23),
('EYELASHES Drama Volumizing', 10, '', '2025-08-28 18:56:43.798', 2, 187, 99, 24),
('EYELASHES Flared Lengthening', 7, '', '2025-08-28 18:56:44.680', 2, 188, 99, 27),
('EYELASHES Flared Volumizing', 11, '', '2025-08-28 18:56:45.563', 2, 189, 99, 28),
('EYELASHES Naked Natural', 4, '', '2025-08-28 18:56:46.450', 2, 190, 99, 20),
('EYELASHES Naked Sexy', 12, '', '2025-08-28 18:56:47.346', 2, 191, 99, 19),
('EYELASHES Rounded Lengthening', 8, '', '2025-08-28 18:56:48.228', 2, 192, 99, 25),
('EYELASHES Rounded Volumizing', 11, '', '2025-08-28 18:56:49.111', 2, 193, 99, 26),
('GLAM SAFARI GLOW GLAM LASHES Nibusu', 15, '', '2025-08-28 18:56:49.997', 2, 194, 99, 31),
('GLAM SAFARI GLOW GLAM LASHES Nuru', 34, '', '2025-08-28 18:56:50.878', 2, 195, 99, 30),
('GLAM SAFARI GLOW GLAM LASHES Waridi', 18, '', '2025-08-28 18:56:51.761', 2, 196, 99, 29),
('INTERSTELLAR Colour Changing Lip Balm', 25, '', '2025-08-28 18:56:52.644', 2, 197, 99, 15),
('Latte Foundation', 26, '', '2025-08-28 18:56:53.527', 2, 198, 99, 34),
('LIQUID EYELINER Black', 19, '', '2025-08-28 18:56:54.410', 2, 199, 99, 3),
('LIQUID LIPSTICK Bitterness Kiss', 24, '', '2025-08-28 18:56:55.292', 2, 200, 99, 10),
('LIQUID LIPSTICK Boss In Skirt', 20, '', '2025-08-28 18:56:56.175', 2, 201, 99, 13),
('LIQUID LIPSTICK Crazy In Love', 18, '', '2025-08-28 18:56:57.057', 2, 202, 99, 8),
('LIQUID LIPSTICK Crush On You', 18, '', '2025-08-28 18:56:57.941', 2, 203, 99, 7),
('LIQUID LIPSTICK Don\'t Shush Me', 47, '', '2025-08-28 18:56:58.827', 2, 204, 99, 11),
('LIQUID LIPSTICK No limit', 29, '', '2025-08-28 18:56:59.710', 2, 205, 99, 14),
('LIQUID LIPSTICK Say My Name', 20, '', '2025-08-28 18:57:00.592', 2, 206, 99, 12),
('LIQUID LIPSTICK Wildnight', 11, '', '2025-08-28 18:57:01.473', 2, 207, 99, 9),
('Peanut Foundation', 23, '', '2025-08-28 18:57:02.354', 2, 208, 99, 32);

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
(1, 'GQ001', 'HIGHLIGHTER Deser Rose Pink Gold', NULL, 1, 'Highlighter', 'PCS', 2500.00, 2500.00, '16%', 0, 0, 1, '2025-06-22 11:39:41', '2025-08-26 09:42:46', 'https://ik.imagekit.io/bja2qwwdjjy/glamour_JpRmrZIDQN.webp?updatedAt=1745913190192'),
(2, 'GQ002', 'HIGHLIGHTER Deser Rose Gold', NULL, 1, 'Highlighter', 'PCS', 2500.00, 2500.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:42:54', ''),
(3, 'GQ003', 'LIQUID EYELINER Black', '', 2, 'Eyeliner', 'PCS', 1600.00, 1600.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:28:49', 'https://citlogisticssystems.com/glamour_queen/upload/products/product_3_1750839947.png'),
(4, 'GQ004', 'EYESHADOW PALETTE Sunset Sahara', '', 3, 'EyeLashes', 'PCS', 3850.00, 3850.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:32:02', 'https://citlogisticssystems.com/glamour_queen/upload/products/product_4_1750839993.png'),
(5, 'GQ005', 'EYESHADOW PALETTE Sunrise Kilimanjaro', '', 3, 'EyeLashes', 'PCS', 3850.00, 3850.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:31:57', 'https://citlogisticssystems.com/glamour_queen/upload/products/product_5_1750840012.png'),
(6, 'GQ006', 'EYESHADOW PALETTE Midnight Nile', NULL, 3, 'EyeLashes', 'PCS', 3850.00, 3850.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:31:50', ''),
(7, 'GQ007', 'LIQUID LIPSTICK Crush On You', NULL, 4, 'Lipsticks', 'PCS', 2450.00, 2450.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:29:31', ''),
(8, 'GQ008', 'LIQUID LIPSTICK Crazy In Love', NULL, 4, 'Lipsticks', 'PCS', 2450.00, 2450.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:29:21', ''),
(9, 'GQ009', 'LIQUID LIPSTICK Wildnight', NULL, 4, 'Lipsticks', 'PCS', 2450.00, 2450.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:30:21', ''),
(10, 'GQ010', 'LIQUID LIPSTICK Bitterness Kiss', NULL, 4, 'Lipsticks', 'PCS', 2450.00, 2450.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:29:01', ''),
(11, 'GQ011', 'LIQUID LIPSTICK Don\'t Shush Me', NULL, 4, 'Lipsticks', 'PCS', 2450.00, 2450.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:29:41', ''),
(12, 'GQ012', 'LIQUID LIPSTICK Say My Name', NULL, 4, 'Lipsticks', 'PCS', 2450.00, 2450.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:30:07', ''),
(13, 'GQ013', 'LIQUID LIPSTICK Boss In Skirt', NULL, 4, 'Lipsticks', 'PCS', 2450.00, 2450.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:29:11', ''),
(14, 'GQ014', 'LIQUID LIPSTICK No limit', NULL, 4, 'Lipsticks', 'PCS', 2450.00, 2450.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:29:55', ''),
(15, 'GQ015', 'INTERSTELLAR Colour Changing Lip Balm', NULL, 5, 'lipbams', 'PCS', 1100.00, 1100.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:27:58', ''),
(16, 'GQ016', ' INTERSTELLAR Moisturizing Lip Balm', NULL, 5, 'lipbams', 'PCS', 1000.00, 1000.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:28:07', ''),
(17, 'GQ017', 'EYEBROW PENCIL Black', '', 6, 'EyeLashes', 'PCS', 1400.00, 1400.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:24:29', './upload/products/product_17_1750839356.jpg'),
(18, 'GQ018', 'EYEBROW PENCIL Deep Brown', '', 6, 'Lipsticks', 'PCS', 1400.00, 1400.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:37:53', 'https://citlogisticssystems.com/glamour_queen/upload/products/product_18_1750839680.jpg'),
(19, 'GQ019', 'EYELASHES Naked Sexy', NULL, 7, 'EyeLashes', 'PCS', 995.00, 995.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:31:28', ''),
(20, 'GQ020', 'EYELASHES Naked Natural', '', 7, 'EyeLashes', 'PCS', 995.00, 995.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:31:22', 'https://citlogisticssystems.com/glamour_queen/upload/products/product_20_1750840100.png'),
(21, 'GQ021', 'EYELASHES Doll Natural', NULL, 7, 'EyeLashes', 'PCS', 995.00, 995.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:24:46', ''),
(22, 'GQ022', 'EYELASHES Doll Volumizing', NULL, 7, 'EyeLashes', 'PCS', 995.00, 995.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:30:53', ''),
(23, 'GQ023', 'EYELASHES Drama Lengthening', NULL, 7, 'EyeLashes', 'PCS', 995.00, 995.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:31:00', ''),
(24, 'GQ024', 'EYELASHES Drama Volumizing', NULL, 7, 'EyeLashes', 'PCS', 995.00, 995.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:31:06', ''),
(25, 'GQ025', 'EYELASHES Rounded Lengthening', NULL, 7, 'EyeLashes', 'PCS', 995.00, 995.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:31:40', ''),
(26, 'GQ026', 'EYELASHES Rounded Volumizing', NULL, 7, 'EyeLashes', 'PCS', 995.00, 995.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:31:45', ''),
(27, 'GQ027', 'EYELASHES Flared Lengthening', NULL, 7, 'EyeLashes', 'PCS', 995.00, 995.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:31:10', ''),
(28, 'GQ028', 'EYELASHES Flared Volumizing', NULL, 7, 'EyeLashes', 'PCS', 995.00, 995.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:31:17', ''),
(29, 'GQ029', 'GLAM SAFARI GLOW GLAM LASHES Waridi', NULL, 8, 'EyeLashes', 'PCS', 1100.00, 1100.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:25:10', ''),
(30, 'GQ030', 'GLAM SAFARI GLOW GLAM LASHES Nuru', NULL, 8, 'EyeLashes', 'PCS', 1000.00, 1000.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:32:13', ''),
(31, 'GQ031', 'GLAM SAFARI GLOW GLAM LASHES Nibusu', NULL, 8, 'EyeLashes', 'PCS', 1100.00, 1100.00, '16%', 0, 0, 1, '2025-06-22 11:39:42', '2025-08-26 09:32:08', ''),
(32, 'pea', 'Peanut Foundation', NULL, 9, 'Foundation', 'PCS', 100.00, 0.00, '16%', 0, 0, 1, '2025-08-26 10:12:14', '2025-08-26 10:15:14', NULL),
(33, 'cara', 'Caramel Foundation', NULL, 9, 'Foundation', 'PCS', 100.00, 0.00, '16%', 0, 0, 1, '2025-08-26 10:12:36', '2025-08-26 10:15:19', NULL),
(34, 'foun', 'Latte Foundation', NULL, 9, 'Foundation', 'PCS', 100.00, 0.00, '16%', 0, 0, 1, '2025-08-26 10:13:14', '2025-08-26 10:15:21', NULL),
(35, 'choco', 'Chocolate Foundation', NULL, 9, 'Foundation', 'PCS', 100.00, 0.00, '16%', 0, 0, 1, '2025-08-26 10:13:33', '2025-08-26 10:15:24', NULL),
(38, 'eys', 'Sunrise Kilimanjaro', NULL, 10, 'Eyeshadows', 'PCS', 10.00, 0.00, '16%', 0, 0, 1, '2025-08-26 10:19:38', '2025-08-26 10:20:38', NULL),
(40, '', 'Sunset Sahara Eyeshadow', NULL, 0, NULL, 'PCS', 0.00, 0.00, '16%', 0, 0, 1, '2025-08-26 10:22:50', '2025-08-26 10:22:50', NULL);

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
(3, 'Hannah', 'hannah@gmail.com', '0768925496', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 1, 'Kilimani', 44, 'DODOMA', 0, 0, 1, 0, 1, '2025-06-22 12:54:08.149', '2025-06-22 21:25:11.297', 0, 0, 0, 'https://res.cloudinary.com/otienobryan/image/upload/v1750627510/whoosh/profile_photos/1750627510743-profile.png', NULL),
(62, 'Gladwell Njuka Mbugua', 'njukambugua003@gmail.com', '0708698469', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, 'https://res.cloudinary.com/otienobryan/image/upload/v1755238555/whoosh/profile_photos/profile_62_1755238555292.jpg', NULL),
(63, 'SARAH KIGAMWA', 'Sarahkigamwa94@gmail.com', '0794410122', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(64, 'FAITH NDUNGE', 'fndunge084@gmail.com', '0707498138', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, 'https://res.cloudinary.com/otienobryan/image/upload/v1755289972/whoosh/profile_photos/profile_64_1755289972221.jpg', NULL),
(65, 'NINA KANGAI MICHENI', 'ninakangai1@gmail.com', '0798643547', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(66, 'MAGDALENA WANJIRU', 'magdalenawanjiru72@gmail.com', '0704187193', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-07-24 13:20:56.290', 0, 0, 0, 'https://res.cloudinary.com/otienobryan/image/upload/v1753363236/whoosh/profile_photos/1753363236290-profile.jpg', NULL),
(67, 'Blessing Inawedi', 'blessinginawedi@gmail.com', '0705898877', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 2, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, 'https://res.cloudinary.com/otienobryan/image/upload/v1755592622/whoosh/profile_photos/profile_67_1755592622573.jpg', NULL),
(68, 'Mercy Marion Chepng\'eno', 'mercymarion0@gmail.com', '0726818313', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(70, 'RUTH NJERI MURIGI', 'ruthmurigi33@gmail.com', '0720366028', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, 'https://res.cloudinary.com/otienobryan/image/upload/v1755279659/whoosh/profile_photos/profile_70_1755279658919.jpg', NULL),
(71, 'ALICE MUTHONI WANYOIKE', 'aliceevelyn254@gmail.com', '0798996031', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(72, 'MARY WANJIKU NJOKI', 'njokimary75@gmail.com', '0727931220', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(73, 'VERNER AMBALA', 'venamissy78@gmail.com', '0748896253', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(74, 'FATMA RAMADHAN', 'fatmahr26@gmail.com', '0702339559', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 2, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(75, 'TABITHA MUKULU WAMBUA', 'tabbytabz98@gmail.com', '0706011876', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(76, 'STACY AKINYI', 'ochielstaicy001@gmail.com', '0746015959', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(77, 'JECINTA ATIENO', 'jecintak952@gmail.com', '0715453567', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(78, 'EVE NGANGA', 'evenganga88@gmail.com', '0745638757', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 1, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, 'https://res.cloudinary.com/otienobryan/image/upload/v1755252856/whoosh/profile_photos/profile_78_1755252856431.jpg', NULL),
(81, 'SUSAN NYAMBURA NDUNGU', 'nsuziepesh@gmail.com', '0115331662', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(82, 'GRACE MWENDE KATA', 'aishakata@gmail.com', '0714692441', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, 'https://res.cloudinary.com/otienobryan/image/upload/v1755241223/whoosh/profile_photos/profile_82_1755241223590.jpg', NULL),
(84, 'DORIS AYUMA ASHUNDU', 'dorisayuma352@gmail.com', '0710808489', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, 'https://res.cloudinary.com/otienobryan/image/upload/v1755248541/whoosh/profile_photos/profile_84_1755248540360.jpg', NULL),
(85, 'PAMELA', 'pamela.reliever@placeholder.com', '0734567890', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(86, 'SPHILIAN KERUBO MOGAKA', 'mogakashilian@gmail.com', '0797232452', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, '', NULL),
(87, 'FRUMENCE MAGDALENA SHIYO', 'frumence.reliever@placeholder.com', '0708144980', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 2, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, 'https://res.cloudinary.com/otienobryan/image/upload/v1755160602/whoosh/profile_photos/profile_87_1755160602604.jpg', NULL),
(88, 'Pamela adhiambo', 'adhiambopamela26@gmail.com', '0706778462', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 1, 'Kilimani', 1, 'Kilimani', 0, 0, 1, 0, 1, '2025-07-23 21:25:38.386', '2025-07-23 21:27:16.780', 0, 0, 0, 'https://res.cloudinary.com/otienobryan/image/upload/v1755237657/whoosh/profile_photos/profile_88_1755237657056.jpg', NULL),
(89, 'Chagadwa Valencia', 'valenciachagadwa@gmail.com', '0743924259', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 1, 'Kilimani', 1, 'Kilimani', 0, 0, 1, 0, 1, '2025-07-24 05:50:44.496', '2025-07-24 06:40:59.221', 0, 0, 0, 'https://res.cloudinary.com/otienobryan/image/upload/v1753339258/whoosh/profile_photos/1753339258802-profile.jpg', NULL),
(90, 'Juliet Nduati', 'loisejuliet@gmail.com', '0798153264', '$2a$10$8tohsnDrE4TWxaigz/O/pOuCqjMv4f5e75iGsrLps89K7RtfMBANy', 1, 'Kenya', 1, 'Nairobi', 1, 'Kilimani', 1, 'Kilimani', 0, 0, 1, 0, 1, '2025-07-24 06:02:55.806', '2025-07-24 07:18:13.293', 0, 0, 0, '', NULL),
(91, 'Felicia Wambui', 'shareyourmail@here.com', '0782119519', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-06-25 10:08:34.000', '2025-06-25 10:08:34.000', 0, 0, 0, 'https://res.cloudinary.com/otienobryan/image/upload/v1755242811/whoosh/profile_photos/profile_91_1755242811664.jpg', NULL),
(92, 'Densy Wambui Ndungu', 'ndunguwambui032@gmail.com', '0710410836', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 1, 'Kilimani', 1, 'Kilimani', 0, 0, 1, 0, 1, '2025-07-24 08:32:21.999', '2025-07-24 08:32:21.999', 0, 0, 0, 'https://res.cloudinary.com/otienobryan/image/upload/v1755707437/whoosh/profile_photos/profile_92_1755707437498.jpg', NULL),
(96, 'CECILIA', 'cecilia@gmail.com', '0746201960', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-08-13 09:57:38.985', '2025-07-24 08:32:21.999', 0, 0, 0, 'https://res.cloudinary.com/otienobryan/image/upload/v1755246685/whoosh/profile_photos/profile_96_1755246685536.jpg', NULL),
(98, 'Mariah Wanyoike', 'mariah@gmail.com', '0723300607', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 1, 0, 1, '2025-08-13 15:45:11.141', '2025-07-24 08:32:21.999', 0, 0, 0, '', NULL),
(99, 'Wamagata Wambui', 'wambuiwamagatah@gmai.com', '0748021611', '$2b$10$wCiwvdIuaC11/dD5xo9HlONGSEVwBuV1eAITaJHyFJ/O5apC4m.WG', 1, 'Kenya', 1, 'Nairobi', 0, '', 0, '', 0, 0, 2, 0, 1, '2025-08-26 10:31:44.612', '2025-07-24 08:32:21.999', 0, 0, 0, '', NULL);

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
(8, 'SO-2025-0001', 22, '2025-08-12', NULL, 857.76, 137.24, 995.00, 995.00, NULL, NULL, 2, '2025-08-12 14:59:21', '2025-08-12 14:59:21', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(9, 'SO-2025-0002', 17, '2025-08-13', NULL, 1715.52, 274.48, 1990.00, 1990.00, NULL, NULL, 98, '2025-08-13 13:53:00', '2025-08-13 13:53:00', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(10, 'INV-10', 22, '2025-08-18', NULL, 995.00, 0.00, 995.00, 995.00, NULL, NULL, 2, '2025-08-18 21:44:30', '2025-08-18 21:45:04', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'confirmed', 1, NULL, 0, '0000-00-00 00:00:00'),
(11, 'SO-2025-0003', 19, '2025-08-26', NULL, 857.76, 137.24, 995.00, 995.00, NULL, NULL, 2, '2025-08-26 10:08:05', '2025-08-26 10:08:05', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(13, 'SO-2025-0005', 9, '2025-08-26', NULL, 6336.21, 1013.79, 7350.00, 7350.00, NULL, NULL, 63, '2025-08-26 10:42:52', '2025-08-26 10:42:52', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(14, 'SO-2025-0006', 1, '2025-08-26', NULL, 84482.76, 13517.24, 98000.00, 98000.00, NULL, NULL, 73, '2025-08-26 10:43:07', '2025-08-26 10:43:07', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(15, 'SO-2025-0007', 19, '2025-08-26', NULL, 2573.28, 411.72, 2985.00, 2985.00, NULL, NULL, 2, '2025-08-26 10:43:10', '2025-08-26 10:43:10', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(16, 'SO-2025-0008', 17, '2025-08-26', NULL, 862.07, 137.93, 1000.00, 1000.00, NULL, NULL, 68, '2025-08-26 10:43:12', '2025-08-26 10:43:12', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(17, 'SO-2025-0009', 13, '2025-08-26', NULL, 73275.86, 11724.14, 85000.00, 85000.00, NULL, NULL, 91, '2025-08-26 10:43:14', '2025-08-26 10:43:14', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(23, 'SO-2025-0012', 10, '2025-08-26', NULL, 5146.55, 823.45, 5970.00, 5970.00, NULL, NULL, 78, '2025-08-26 10:43:35', '2025-08-26 10:43:35', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(24, 'SO-2025-0013', 12, '2025-08-26', NULL, 1715.52, 274.48, 1990.00, 1990.00, NULL, NULL, 84, '2025-08-26 10:43:40', '2025-08-26 10:43:40', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(25, 'SO-2025-0014', 2, '2025-08-26', NULL, 45689.66, 7310.34, 53000.00, 53000.00, NULL, NULL, 62, '2025-08-26 10:43:42', '2025-08-26 10:43:42', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(26, 'SO-2025-0015', 6, '2025-08-26', NULL, 862.07, 137.93, 1000.00, 1000.00, NULL, NULL, 92, '2025-08-26 10:43:45', '2025-08-26 10:43:45', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(27, 'SO-2025-0016', 11, '2025-08-26', NULL, 2112.07, 337.93, 2450.00, 2450.00, NULL, NULL, 82, '2025-08-26 10:44:05', '2025-08-26 10:44:05', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(28, 'SO-2025-0017', 6, '2025-08-26', NULL, 0.00, 0.00, 0.00, 0.00, NULL, NULL, 92, '2025-08-26 10:44:44', '2025-08-26 10:44:44', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(29, 'SO-2025-0018', 4, '2025-08-26', NULL, 4288.79, 686.21, 4975.00, 4975.00, NULL, NULL, 77, '2025-08-26 10:44:50', '2025-08-26 10:44:50', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(33, 'SO-2025-0021', 9, '2025-08-26', NULL, 52073.28, 8331.72, 60405.00, 60405.00, NULL, NULL, 63, '2025-08-26 10:45:50', '2025-08-26 10:45:50', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(35, 'SO-2025-0023', 12, '2025-08-26', NULL, 0.00, 0.00, 0.00, 0.00, NULL, NULL, 84, '2025-08-26 10:46:09', '2025-08-26 10:46:09', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(36, 'SO-2025-0024', 14, '2025-08-26', NULL, 33405.17, 5344.83, 38750.00, 38750.00, NULL, NULL, 76, '2025-08-26 10:46:22', '2025-08-26 10:46:22', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(37, 'SO-2025-0025', 3, '2025-08-26', NULL, 9482.76, 1517.24, 11000.00, 11000.00, NULL, NULL, 3, '2025-08-26 10:47:22', '2025-08-26 10:47:22', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(38, 'SO-2025-0026', 1, '2025-08-26', NULL, 67586.21, 10813.79, 78400.00, 78400.00, NULL, NULL, 73, '2025-08-26 10:48:28', '2025-08-26 10:48:28', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(39, 'SO-2025-0027', 5, '2025-08-26', NULL, 51625.00, 8260.00, 59885.00, 59885.00, NULL, NULL, 64, '2025-08-26 10:49:37', '2025-08-26 10:49:37', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(40, 'SO-2025-0028', 16, '2025-08-26', NULL, 6896.55, 1103.45, 8000.00, 8000.00, 'likoni mall', NULL, 88, '2025-08-26 10:50:13', '2025-08-26 11:47:43', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(41, 'SO-2025-0029', 6, '2025-08-26', NULL, 0.00, 0.00, 0.00, 0.00, NULL, NULL, 92, '2025-08-26 11:44:31', '2025-08-26 11:44:31', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(42, 'SO-2025-0030', 10, '2025-08-26', NULL, 0.00, 0.00, 0.00, 0.00, NULL, NULL, 78, '2025-08-26 11:47:40', '2025-08-26 11:57:57', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(44, 'SO-2025-0032', 4, '2025-08-26', NULL, 86616.38, 13858.62, 100475.00, 100475.00, NULL, NULL, 77, '2025-08-26 11:48:43', '2025-08-26 11:48:43', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(45, 'SO-2025-0033', 13, '2025-08-26', NULL, 73275.86, 11724.14, 85000.00, 85000.00, NULL, NULL, 91, '2025-08-26 11:49:49', '2025-08-26 11:49:49', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(46, 'SO-2025-0034', 11, '2025-08-26', NULL, 55107.76, 8817.24, 63925.00, 63925.00, NULL, NULL, 82, '2025-08-26 11:50:53', '2025-08-26 11:50:53', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(47, 'SO-2025-0035', 3, '2025-08-26', NULL, 18965.52, 3034.48, 22000.00, 22000.00, NULL, NULL, 3, '2025-08-26 11:51:13', '2025-08-26 11:51:13', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(50, 'SO-2025-0037', 12, '2025-08-26', NULL, 17327.59, 2772.41, 20100.00, 20100.00, NULL, NULL, 84, '2025-08-26 11:53:08', '2025-08-26 11:53:08', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(51, 'SO-2025-0038', 17, '2025-08-26', NULL, 33176.72, 5308.28, 38485.00, 38485.00, NULL, NULL, 68, '2025-08-26 11:54:07', '2025-08-26 12:01:43', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(52, 'SO-2025-0039', 6, '2025-08-26', NULL, 4741.38, 758.62, 5500.00, 5500.00, NULL, NULL, 92, '2025-08-26 11:55:24', '2025-08-26 11:55:24', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(53, 'SO-2025-0040', 9, '2025-08-26', NULL, 100956.90, 16153.10, 117110.00, 117110.00, NULL, NULL, 63, '2025-08-26 11:55:40', '2025-08-26 11:55:40', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(54, 'SO-2025-0041', 6, '2025-08-26', NULL, 10560.34, 1689.66, 12250.00, 12250.00, NULL, NULL, 92, '2025-08-26 11:55:53', '2025-08-26 11:55:53', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(55, 'SO-2025-0042', 6, '2025-08-26', NULL, 5146.55, 823.45, 5970.00, 5970.00, NULL, NULL, 92, '2025-08-26 11:56:22', '2025-08-26 11:56:22', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(56, 'SO-2025-0043', 12, '2025-08-26', NULL, 31465.52, 5034.48, 36500.00, 36500.00, NULL, NULL, 84, '2025-08-26 11:56:41', '2025-08-26 11:56:41', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(57, 'SO-2025-0044', 6, '2025-08-26', NULL, 10560.34, 1689.66, 12250.00, 12250.00, NULL, NULL, 92, '2025-08-26 11:56:46', '2025-08-26 11:56:46', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(58, 'SO-2025-0045', 6, '2025-08-26', NULL, 6336.21, 1013.79, 7350.00, 7350.00, NULL, NULL, 92, '2025-08-26 11:57:07', '2025-08-26 11:57:07', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(59, 'SO-2025-0046', 2, '2025-08-26', NULL, 74137.93, 11862.07, 86000.00, 86000.00, NULL, NULL, 62, '2025-08-26 11:57:12', '2025-08-26 11:57:12', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(60, 'SO-2025-0047', 6, '2025-08-26', NULL, 5146.55, 823.45, 5970.00, 5970.00, NULL, NULL, 92, '2025-08-26 11:57:42', '2025-08-26 11:57:42', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(61, 'SO-2025-0048', 7, '2025-08-26', NULL, 113793.10, 18206.90, 132000.00, 132000.00, NULL, NULL, 96, '2025-08-26 11:58:29', '2025-08-28 14:11:15', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(62, 'SO-2025-0049', 6, '2025-08-26', NULL, 6862.07, 1097.93, 7960.00, 7960.00, NULL, NULL, 92, '2025-08-26 11:58:37', '2025-08-26 11:58:37', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(63, 'SO-2025-0050', 6, '2025-08-26', NULL, 5146.55, 823.45, 5970.00, 5970.00, NULL, NULL, 92, '2025-08-26 11:59:06', '2025-08-26 11:59:06', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(64, 'SO-2025-0051', 6, '2025-08-26', NULL, 2573.28, 411.72, 2985.00, 2985.00, NULL, NULL, 92, '2025-08-26 11:59:40', '2025-08-26 11:59:40', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(65, 'SO-2025-0052', 10, '2025-08-26', NULL, 2573.28, 411.72, 2985.00, 2985.00, NULL, NULL, 78, '2025-08-26 12:00:07', '2025-08-26 12:00:07', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(67, 'SO-2025-0053', 6, '2025-08-26', NULL, 5146.55, 823.45, 5970.00, 5970.00, NULL, NULL, 92, '2025-08-26 12:00:09', '2025-08-26 12:00:09', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(68, 'SO-2025-0054', 6, '2025-08-26', NULL, 5146.55, 823.45, 5970.00, 5970.00, NULL, NULL, 92, '2025-08-26 12:00:37', '2025-08-26 12:00:37', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(69, 'SO-2025-0055', 6, '2025-08-26', NULL, 6862.07, 1097.93, 7960.00, 7960.00, NULL, NULL, 92, '2025-08-26 12:01:05', '2025-08-26 12:01:05', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(70, 'SO-2025-0056', 3, '2025-08-26', NULL, 32737.07, 5237.93, 37975.00, 37975.00, NULL, NULL, 89, '2025-08-26 12:01:56', '2025-08-26 12:01:56', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(71, 'SO-2025-0057', 1, '2025-08-26', NULL, 146870.69, 23499.31, 170370.00, 170370.00, NULL, NULL, 73, '2025-08-26 12:02:27', '2025-08-26 12:02:27', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(72, 'SO-2025-0058', 6, '2025-08-26', NULL, 8620.69, 1379.31, 10000.00, 10000.00, NULL, NULL, 92, '2025-08-26 12:04:19', '2025-08-26 12:04:19', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(73, 'SO-2025-0059', 3, '2025-08-26', NULL, 47413.79, 7586.21, 55000.00, 55000.00, NULL, NULL, 3, '2025-08-26 12:04:22', '2025-08-26 12:04:22', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(74, 'SO-2025-0060', 6, '2025-08-26', NULL, 0.00, 0.00, 0.00, 0.00, NULL, NULL, 92, '2025-08-26 12:04:45', '2025-08-26 12:04:45', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(75, 'SO-2025-0061', 6, '2025-08-26', NULL, 0.00, 0.00, 0.00, 0.00, NULL, NULL, 92, '2025-08-26 12:05:06', '2025-08-26 12:05:06', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(76, 'SO-2025-0062', 6, '2025-08-26', NULL, 0.00, 0.00, 0.00, 0.00, NULL, NULL, 92, '2025-08-26 12:05:31', '2025-08-26 12:05:31', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(77, 'SO-2025-0063', 6, '2025-08-26', NULL, 0.00, 0.00, 0.00, 0.00, NULL, NULL, 92, '2025-08-26 12:05:56', '2025-08-26 12:05:56', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(78, 'SO-2025-0064', 18, '2025-08-26', NULL, 12931.03, 2068.97, 15000.00, 15000.00, NULL, NULL, 65, '2025-08-26 12:08:43', '2025-08-26 12:08:43', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(79, 'SO-2025-0065', 9, '2025-08-26', NULL, 0.00, 0.00, 0.00, 0.00, NULL, NULL, 63, '2025-08-26 12:10:24', '2025-08-26 12:10:24', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00'),
(80, 'SO-2025-0066', 13, '2025-08-26', NULL, 73275.86, 11724.14, 85000.00, 85000.00, NULL, NULL, 91, '2025-08-26 12:13:11', '2025-08-26 12:13:11', NULL, '0000-00-00 00:00:00', NULL, NULL, NULL, 'draft', 0, NULL, 0, '0000-00-00 00:00:00');

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
(9, 8, 21, 1, 995.00, 137.24, 995.00, '', 995.00, 0),
(10, 9, 21, 2, 995.00, 274.48, 1990.00, '', 1990.00, 0),
(11, 10, 21, 1, 995.00, 137.24, 995.00, '', 995.00, 0),
(12, 11, 21, 1, 995.00, 137.24, 995.00, '', 995.00, 0),
(13, 12, 3, 10, 1600.00, 2206.90, 16000.00, '', 16000.00, 0),
(14, 13, 14, 3, 2450.00, 1013.79, 7350.00, '', 7350.00, 0),
(15, 14, 11, 40, 2450.00, 13517.24, 98000.00, '', 98000.00, 0),
(16, 15, 21, 2, 995.00, 274.48, 1990.00, '', 1990.00, 0),
(17, 15, 23, 1, 995.00, 137.24, 995.00, '', 995.00, 0),
(18, 16, 16, 1, 1000.00, 137.93, 1000.00, '', 1000.00, 0),
(19, 17, 16, 30, 1000.00, 4137.93, 30000.00, '', 30000.00, 0),
(20, 17, 30, 20, 1000.00, 2758.62, 20000.00, '', 20000.00, 0),
(21, 17, 31, 10, 1100.00, 1517.24, 11000.00, '', 11000.00, 0),
(22, 17, 3, 15, 1600.00, 3310.34, 24000.00, '', 24000.00, 0),
(23, 20, 16, 2, 1000.00, 275.86, 2000.00, '', 2000.00, 0),
(24, 22, 20, 5, 995.00, 686.21, 4975.00, '', 4975.00, 0),
(25, 23, 20, 6, 995.00, 823.45, 5970.00, '', 5970.00, 0),
(26, 24, 21, 2, 995.00, 274.48, 1990.00, '', 1990.00, 0),
(27, 25, 15, 10, 1100.00, 1517.24, 11000.00, '', 11000.00, 0),
(28, 25, 31, 20, 1100.00, 3034.48, 22000.00, '', 22000.00, 0),
(29, 25, 30, 20, 1000.00, 2758.62, 20000.00, '', 20000.00, 0),
(30, 26, 16, 1, 1000.00, 137.93, 1000.00, '', 1000.00, 0),
(31, 27, 12, 1, 2450.00, 337.93, 2450.00, '', 2450.00, 0),
(32, 28, 33, 15, 0.00, 0.00, 0.00, '', 0.00, 0),
(33, 29, 27, 5, 995.00, 686.21, 4975.00, '', 4975.00, 0),
(34, 31, 29, 10, 1100.00, 1517.24, 11000.00, '', 11000.00, 0),
(35, 32, 31, 10, 1100.00, 1517.24, 11000.00, '', 11000.00, 0),
(36, 33, 13, 15, 2450.00, 5068.97, 36750.00, '', 36750.00, 0),
(37, 33, 11, 3, 2450.00, 1013.79, 7350.00, '', 7350.00, 0),
(38, 33, 12, 3, 2450.00, 1013.79, 7350.00, '', 7350.00, 0),
(39, 33, 20, 3, 995.00, 411.72, 2985.00, '', 2985.00, 0),
(40, 33, 21, 3, 995.00, 411.72, 2985.00, '', 2985.00, 0),
(41, 33, 25, 3, 995.00, 411.72, 2985.00, '', 2985.00, 0),
(42, 34, 15, 15, 1100.00, 2275.86, 16500.00, '', 16500.00, 0),
(43, 35, 35, 1, 0.00, 0.00, 0.00, '', 0.00, 0),
(44, 36, 15, 15, 1100.00, 2275.86, 16500.00, '', 16500.00, 0),
(45, 36, 14, 5, 2450.00, 1689.66, 12250.00, '', 12250.00, 0),
(46, 36, 30, 10, 1000.00, 1379.31, 10000.00, '', 10000.00, 0),
(47, 37, 15, 10, 1100.00, 1517.24, 11000.00, '', 11000.00, 0),
(48, 38, 11, 20, 2450.00, 6758.62, 49000.00, '', 49000.00, 0),
(49, 38, 14, 12, 2450.00, 4055.17, 29400.00, '', 29400.00, 0),
(50, 39, 30, 10, 1000.00, 1379.31, 10000.00, '', 10000.00, 0),
(51, 39, 29, 10, 1100.00, 1517.24, 11000.00, '', 11000.00, 0),
(52, 39, 3, 10, 1600.00, 2206.90, 16000.00, '', 16000.00, 0),
(53, 39, 25, 5, 995.00, 686.21, 4975.00, '', 4975.00, 0),
(54, 39, 26, 3, 995.00, 411.72, 2985.00, '', 2985.00, 0),
(55, 39, 27, 5, 995.00, 686.21, 4975.00, '', 4975.00, 0),
(56, 39, 28, 5, 995.00, 686.21, 4975.00, '', 4975.00, 0),
(57, 39, 35, 5, 0.00, 0.00, 0.00, '', 0.00, 0),
(58, 39, 22, 5, 995.00, 686.21, 4975.00, '', 4975.00, 0),
(68, 41, 33, 10, 0.00, 0.00, 0.00, '', 0.00, 0),
(71, 40, 3, 5, 1600.00, 1103.45, 8000.00, '', 8000.00, 0),
(72, 43, 20, 3, 995.00, 411.72, 2985.00, '', 2985.00, 0),
(73, 44, 10, 20, 2450.00, 6758.62, 49000.00, '', 49000.00, 0),
(74, 44, 11, 10, 2450.00, 3379.31, 24500.00, '', 24500.00, 0),
(75, 44, 31, 20, 1100.00, 3034.48, 22000.00, '', 22000.00, 0),
(76, 44, 27, 5, 995.00, 686.21, 4975.00, '', 4975.00, 0),
(77, 45, 16, 30, 1000.00, 4137.93, 30000.00, '', 30000.00, 0),
(78, 45, 30, 20, 1000.00, 2758.62, 20000.00, '', 20000.00, 0),
(79, 45, 31, 10, 1100.00, 1517.24, 11000.00, '', 11000.00, 0),
(80, 45, 3, 15, 1600.00, 3310.34, 24000.00, '', 24000.00, 0),
(81, 46, 13, 20, 2450.00, 6758.62, 49000.00, '', 49000.00, 0),
(82, 46, 20, 5, 995.00, 686.21, 4975.00, '', 4975.00, 0),
(83, 46, 26, 5, 995.00, 686.21, 4975.00, '', 4975.00, 0),
(84, 46, 27, 5, 995.00, 686.21, 4975.00, '', 4975.00, 0),
(85, 47, 31, 20, 1100.00, 3034.48, 22000.00, '', 22000.00, 0),
(86, 48, 35, 5, 0.00, 0.00, 0.00, '', 0.00, 0),
(87, 48, 30, 10, 1000.00, 1379.31, 10000.00, '', 10000.00, 0),
(88, 48, 29, 10, 1100.00, 1517.24, 11000.00, '', 11000.00, 0),
(89, 48, 3, 10, 1600.00, 2206.90, 16000.00, '', 16000.00, 0),
(90, 48, 25, 5, 995.00, 686.21, 4975.00, '', 4975.00, 0),
(91, 48, 26, 3, 995.00, 411.72, 2985.00, '', 2985.00, 0),
(92, 48, 28, 5, 995.00, 686.21, 4975.00, '', 4975.00, 0),
(93, 48, 27, 5, 995.00, 686.21, 4975.00, '', 4975.00, 0),
(94, 48, 22, 5, 995.00, 686.21, 4975.00, '', 4975.00, 0),
(95, 50, 1, 1, 2500.00, 344.83, 2500.00, '', 2500.00, 0),
(96, 50, 3, 11, 1600.00, 2427.59, 17600.00, '', 17600.00, 0),
(101, 52, 15, 5, 1100.00, 758.62, 5500.00, '', 5500.00, 0),
(102, 53, 33, 5, 0.00, 0.00, 0.00, '', 0.00, 0),
(103, 53, 35, 5, 0.00, 0.00, 0.00, '', 0.00, 0),
(104, 53, 21, 3, 995.00, 411.72, 2985.00, '', 2985.00, 0),
(105, 53, 20, 3, 995.00, 411.72, 2985.00, '', 2985.00, 0),
(106, 53, 25, 2, 995.00, 274.48, 1990.00, '', 1990.00, 0),
(107, 53, 31, 30, 1100.00, 4551.72, 33000.00, '', 33000.00, 0),
(108, 53, 30, 10, 1000.00, 1379.31, 10000.00, '', 10000.00, 0),
(109, 53, 13, 15, 2450.00, 5068.97, 36750.00, '', 36750.00, 0),
(110, 53, 11, 6, 2450.00, 2027.59, 14700.00, '', 14700.00, 0),
(111, 53, 14, 3, 2450.00, 1013.79, 7350.00, '', 7350.00, 0),
(112, 53, 12, 3, 2450.00, 1013.79, 7350.00, '', 7350.00, 0),
(113, 54, 8, 5, 2450.00, 1689.66, 12250.00, '', 12250.00, 0),
(114, 55, 19, 6, 995.00, 823.45, 5970.00, '', 5970.00, 0),
(115, 56, 30, 20, 1000.00, 2758.62, 20000.00, '', 20000.00, 0),
(116, 56, 15, 15, 1100.00, 2275.86, 16500.00, '', 16500.00, 0),
(117, 57, 13, 5, 2450.00, 1689.66, 12250.00, '', 12250.00, 0),
(118, 58, 14, 3, 2450.00, 1013.79, 7350.00, '', 7350.00, 0),
(119, 59, 31, 20, 1100.00, 3034.48, 22000.00, '', 22000.00, 0),
(120, 59, 30, 20, 1000.00, 2758.62, 20000.00, '', 20000.00, 0),
(121, 59, 29, 20, 1100.00, 3034.48, 22000.00, '', 22000.00, 0),
(122, 59, 15, 20, 1100.00, 3034.48, 22000.00, '', 22000.00, 0),
(123, 60, 28, 6, 995.00, 823.45, 5970.00, '', 5970.00, 0),
(124, 42, 33, 5, 0.00, 0.00, 0.00, '', 0.00, 0),
(131, 62, 27, 8, 995.00, 1097.93, 7960.00, '', 7960.00, 0),
(132, 63, 26, 6, 995.00, 823.45, 5970.00, '', 5970.00, 0),
(133, 64, 25, 3, 995.00, 411.72, 2985.00, '', 2985.00, 0),
(134, 65, 33, 5, 0.00, 0.00, 0.00, '', 0.00, 0),
(135, 65, 20, 3, 995.00, 411.72, 2985.00, '', 2985.00, 0),
(136, 67, 21, 6, 995.00, 823.45, 5970.00, '', 5970.00, 0),
(137, 68, 22, 6, 995.00, 823.45, 5970.00, '', 5970.00, 0),
(142, 69, 23, 8, 995.00, 1097.93, 7960.00, '', 7960.00, 0),
(151, 51, 15, 10, 1100.00, 1517.24, 11000.00, '', 11000.00, 0),
(152, 51, 27, 3, 995.00, 411.72, 2985.00, '', 2985.00, 0),
(153, 51, 13, 5, 2450.00, 1689.66, 12250.00, '', 12250.00, 0),
(154, 51, 14, 5, 2450.00, 1689.66, 12250.00, '', 12250.00, 0),
(155, 70, 15, 10, 1100.00, 1517.24, 11000.00, '', 11000.00, 0),
(156, 70, 29, 10, 1100.00, 1517.24, 11000.00, '', 11000.00, 0),
(157, 70, 31, 10, 1100.00, 1517.24, 11000.00, '', 11000.00, 0),
(158, 70, 20, 5, 995.00, 686.21, 4975.00, '', 4975.00, 0),
(159, 71, 31, 40, 1100.00, 6068.97, 44000.00, '', 44000.00, 0),
(160, 71, 11, 20, 2450.00, 6758.62, 49000.00, '', 49000.00, 0),
(161, 71, 14, 12, 2450.00, 4055.17, 29400.00, '', 29400.00, 0),
(162, 71, 15, 20, 1100.00, 3034.48, 22000.00, '', 22000.00, 0),
(163, 71, 30, 20, 1000.00, 2758.62, 20000.00, '', 20000.00, 0),
(164, 71, 22, 3, 995.00, 411.72, 2985.00, '', 2985.00, 0),
(165, 71, 25, 3, 995.00, 411.72, 2985.00, '', 2985.00, 0),
(166, 72, 30, 10, 1000.00, 1379.31, 10000.00, '', 10000.00, 0),
(167, 73, 35, 2, 0.00, 0.00, 0.00, '', 0.00, 0),
(168, 73, 33, 2, 0.00, 0.00, 0.00, '', 0.00, 0),
(169, 73, 34, 3, 0.00, 0.00, 0.00, '', 0.00, 0),
(170, 73, 31, 20, 1100.00, 3034.48, 22000.00, '', 22000.00, 0),
(171, 73, 29, 20, 1100.00, 3034.48, 22000.00, '', 22000.00, 0),
(172, 73, 15, 10, 1100.00, 1517.24, 11000.00, '', 11000.00, 0),
(173, 74, 34, 4, 0.00, 0.00, 0.00, '', 0.00, 0),
(174, 75, 33, 5, 0.00, 0.00, 0.00, '', 0.00, 0),
(175, 76, 35, 5, 0.00, 0.00, 0.00, '', 0.00, 0),
(176, 77, 32, 5, 0.00, 0.00, 0.00, '', 0.00, 0),
(177, 78, 30, 15, 1000.00, 2068.97, 15000.00, '', 15000.00, 0),
(178, 79, 35, 5, 0.00, 0.00, 0.00, '', 0.00, 0),
(179, 79, 33, 5, 0.00, 0.00, 0.00, '', 0.00, 0),
(180, 80, 16, 30, 1000.00, 4137.93, 30000.00, '', 30000.00, 0),
(181, 80, 30, 20, 1000.00, 2758.62, 20000.00, '', 20000.00, 0),
(182, 80, 31, 10, 1100.00, 1517.24, 11000.00, '', 11000.00, 0),
(183, 80, 3, 15, 1600.00, 3310.34, 24000.00, '', 24000.00, 0),
(190, 61, 3, 20, 1600.00, 4413.79, 32000.00, '', 32000.00, 0),
(191, 61, 10, 10, 2450.00, 3379.31, 24500.00, '', 24500.00, 0),
(192, 61, 16, 15, 1000.00, 2068.97, 15000.00, '', 15000.00, 0),
(193, 61, 15, 15, 1100.00, 2275.86, 16500.00, '', 16500.00, 0),
(194, 61, 29, 20, 1100.00, 3034.48, 22000.00, '', 22000.00, 0),
(195, 61, 31, 20, 1100.00, 3034.48, 22000.00, '', 22000.00, 0);

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
-- Table structure for table `sales_rep_targets`
--

CREATE TABLE `sales_rep_targets` (
  `id` int(11) NOT NULL,
  `salesRepId` int(11) NOT NULL,
  `targetMonth` varchar(7) NOT NULL COMMENT 'Target month in YYYY-MM format',
  `monthlyRevenue` decimal(12,2) DEFAULT NULL COMMENT 'Monthly revenue target in KSH',
  `notes` text DEFAULT NULL COMMENT 'Additional notes or comments',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `sales_rep_targets`
--

INSERT INTO `sales_rep_targets` (`id`, `salesRepId`, `targetMonth`, `monthlyRevenue`, `notes`, `created_at`, `updated_at`) VALUES
(1, 71, '2025-08', 3000.00, '', '2025-08-26 05:14:53', '2025-08-26 05:14:53'),
(2, 2, '2025-08', 50000.00, '', '2025-08-26 05:37:53', '2025-08-26 05:37:53');

-- --------------------------------------------------------

--
-- Table structure for table `sample_request`
--

CREATE TABLE `sample_request` (
  `id` int(11) NOT NULL,
  `clientId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `requestNumber` varchar(50) NOT NULL,
  `requestDate` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `approvedBy` int(11) DEFAULT NULL,
  `approvedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sample_request`
--

INSERT INTO `sample_request` (`id`, `clientId`, `userId`, `requestNumber`, `requestDate`, `status`, `notes`, `approvedBy`, `approvedAt`, `createdAt`, `updatedAt`) VALUES
(1, 22, 2, 'SR-001', '2025-08-12 10:00:00', 'pending', 'Client wants to test new products', NULL, NULL, '2025-08-12 20:24:25', '2025-08-12 20:24:25'),
(2, 19, 2, 'SR-002', '2025-08-12 11:30:00', 'approved', 'Sample for new store opening', 1, '2025-08-12 12:00:00', '2025-08-12 20:24:25', '2025-08-12 20:24:25'),
(3, 19, 2, 'SR-20250812-003', '2025-08-12 21:47:25', 'pending', 'i want to', NULL, NULL, '2025-08-12 20:47:25', '2025-08-12 20:47:25'),
(4, 19, 2, 'SR-20250812-004', '2025-08-12 21:51:09', 'pending', 'test', NULL, NULL, '2025-08-12 20:51:09', '2025-08-12 20:51:09'),
(5, 19, 2, 'SR-20250826-001', '2025-08-26 09:51:55', 'pending', '', NULL, NULL, '2025-08-26 11:51:55', '2025-08-26 11:51:55'),
(6, 6, 92, 'SR-20250826-002', '2025-08-26 09:52:02', 'pending', '', NULL, NULL, '2025-08-26 11:52:02', '2025-08-26 11:52:02'),
(7, 13, 91, 'SR-20250826-003', '2025-08-26 09:52:58', 'pending', '', NULL, NULL, '2025-08-26 11:52:57', '2025-08-26 11:52:57'),
(8, 6, 92, 'SR-20250826-004', '2025-08-26 09:53:34', 'pending', '', NULL, NULL, '2025-08-26 11:53:33', '2025-08-26 11:53:33'),
(9, 5, 64, 'SR-20250826-005', '2025-08-26 09:53:52', 'pending', '', NULL, NULL, '2025-08-26 11:53:51', '2025-08-26 11:53:51'),
(10, 2, 62, 'SR-20250826-006', '2025-08-26 09:54:56', 'pending', '', NULL, NULL, '2025-08-26 11:54:56', '2025-08-26 11:54:56'),
(11, 6, 92, 'SR-20250826-007', '2025-08-26 09:55:37', 'pending', '', NULL, NULL, '2025-08-26 11:55:37', '2025-08-26 11:55:37'),
(12, 4, 77, 'SR-20250826-008', '2025-08-26 09:55:46', 'pending', '', NULL, NULL, '2025-08-26 11:55:46', '2025-08-26 11:55:46'),
(13, 13, 91, 'SR-20250826-009', '2025-08-26 09:56:15', 'pending', '', NULL, NULL, '2025-08-26 11:56:15', '2025-08-26 11:56:15'),
(14, 9, 63, 'SR-20250826-010', '2025-08-26 09:57:01', 'pending', '', NULL, NULL, '2025-08-26 11:57:01', '2025-08-26 11:57:01'),
(15, 3, 89, 'SR-20250826-011', '2025-08-26 09:59:09', 'pending', '', NULL, NULL, '2025-08-26 11:59:08', '2025-08-26 11:59:08'),
(16, 3, 89, 'SR-20250826-012', '2025-08-26 11:50:45', 'pending', '', NULL, NULL, '2025-08-26 13:50:45', '2025-08-26 13:50:45'),
(17, 4, 77, 'SR-20250826-013', '2025-08-26 11:52:27', 'pending', '', NULL, NULL, '2025-08-26 13:52:26', '2025-08-26 13:52:26'),
(19, 10, 78, 'SR-20250826-014', '2025-08-26 11:52:38', 'pending', '', NULL, NULL, '2025-08-26 13:52:37', '2025-08-26 13:52:37'),
(20, 11, 82, 'SR-20250826-015', '2025-08-26 11:52:53', 'pending', '', NULL, NULL, '2025-08-26 13:52:52', '2025-08-26 13:52:52'),
(21, 7, 96, 'SR-20250826-016', '2025-08-26 11:55:24', 'pending', '', NULL, NULL, '2025-08-26 13:55:24', '2025-08-26 13:55:24'),
(22, 12, 84, 'SR-20250826-017', '2025-08-26 11:58:03', 'pending', '', NULL, NULL, '2025-08-26 13:58:02', '2025-08-26 13:58:02'),
(23, 9, 63, 'SR-20250826-018', '2025-08-26 11:58:22', 'pending', '', NULL, NULL, '2025-08-26 13:58:21', '2025-08-26 13:58:21'),
(24, 2, 62, 'SR-20250826-019', '2025-08-26 11:58:31', 'pending', '', NULL, NULL, '2025-08-26 13:58:30', '2025-08-26 13:58:30'),
(25, 5, 64, 'SR-20250826-020', '2025-08-26 11:59:08', 'pending', '', NULL, NULL, '2025-08-26 13:59:07', '2025-08-26 13:59:07'),
(26, 13, 91, 'SR-20250826-021', '2025-08-26 12:00:43', 'pending', '', NULL, NULL, '2025-08-26 14:00:43', '2025-08-26 14:00:43'),
(27, 14, 76, 'SR-20250826-022', '2025-08-26 12:03:07', 'pending', '', NULL, NULL, '2025-08-26 14:03:06', '2025-08-26 14:03:06'),
(28, 10, 78, 'SR-20250826-023', '2025-08-26 12:04:34', 'pending', '', NULL, NULL, '2025-08-26 14:04:34', '2025-08-26 14:04:34'),
(29, 3, 3, 'SR-20250826-024', '2025-08-26 12:06:40', 'pending', '', NULL, NULL, '2025-08-26 14:06:40', '2025-08-26 14:06:40'),
(30, 18, 65, 'SR-20250826-025', '2025-08-26 12:25:05', 'pending', '', NULL, NULL, '2025-08-26 14:25:05', '2025-08-26 14:25:05');

-- --------------------------------------------------------

--
-- Table structure for table `sample_request_item`
--

CREATE TABLE `sample_request_item` (
  `id` int(11) NOT NULL,
  `sampleRequestId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `notes` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sample_request_item`
--

INSERT INTO `sample_request_item` (`id`, `sampleRequestId`, `productId`, `quantity`, `notes`, `createdAt`) VALUES
(1, 1, 17, 2, 'Eyebrow pencil samples', '2025-08-12 20:24:25'),
(2, 1, 26, 3, 'Eyelash samples', '2025-08-12 20:24:25'),
(3, 2, 9, 3, 'Lipstick samples for testing', '2025-08-12 20:24:25'),
(4, 3, 4, 1, '', '2025-08-12 20:47:25'),
(5, 3, 19, 1, '', '2025-08-12 20:47:25'),
(6, 3, 26, 1, '', '2025-08-12 20:47:25'),
(7, 3, 5, 1, '', '2025-08-12 20:47:25'),
(8, 3, 31, 1, '', '2025-08-12 20:47:25'),
(9, 3, 30, 1, '', '2025-08-12 20:47:25'),
(10, 3, 20, 1, '', '2025-08-12 20:47:26'),
(11, 4, 18, 1, '', '2025-08-12 20:51:09'),
(12, 4, 17, 1, '', '2025-08-12 20:51:10'),
(13, 4, 22, 2, '', '2025-08-12 20:51:10'),
(14, 4, 21, 1, '', '2025-08-12 20:51:10'),
(15, 5, 1, 1, '', '2025-08-26 11:51:55'),
(16, 6, 1, 1, '', '2025-08-26 11:52:02'),
(17, 7, 16, 1, '', '2025-08-26 11:52:58'),
(18, 8, 17, 1, '', '2025-08-26 11:53:33'),
(19, 9, 7, 1, '', '2025-08-26 11:53:52'),
(20, 9, 11, 1, '', '2025-08-26 11:53:52'),
(21, 9, 29, 1, '', '2025-08-26 11:53:53'),
(22, 9, 30, 1, '', '2025-08-26 11:53:54'),
(23, 10, 30, 1, '', '2025-08-26 11:54:56'),
(24, 10, 29, 2, '', '2025-08-26 11:54:57'),
(25, 10, 15, 1, '', '2025-08-26 11:54:57'),
(26, 10, 12, 1, '', '2025-08-26 11:54:57'),
(27, 11, 16, 3, '', '2025-08-26 11:55:37'),
(28, 11, 17, 3, '', '2025-08-26 11:55:38'),
(29, 12, 29, 1, '', '2025-08-26 11:55:46'),
(30, 12, 30, 1, '', '2025-08-26 11:55:46'),
(31, 12, 31, 1, '', '2025-08-26 11:55:47'),
(32, 13, 16, 1, '', '2025-08-26 11:56:15'),
(33, 13, 31, 1, '', '2025-08-26 11:56:16'),
(34, 13, 30, 2, '', '2025-08-26 11:56:16'),
(35, 13, 29, 1, '', '2025-08-26 11:56:16'),
(36, 13, 11, 1, '', '2025-08-26 11:56:17'),
(37, 14, 31, 1, '', '2025-08-26 11:57:01'),
(38, 14, 29, 1, '', '2025-08-26 11:57:01'),
(39, 14, 15, 1, '', '2025-08-26 11:57:02'),
(40, 15, 10, 1, '', '2025-08-26 11:59:09'),
(41, 15, 12, 1, '', '2025-08-26 11:59:09'),
(42, 15, 15, 1, '', '2025-08-26 11:59:09'),
(43, 16, 12, 1, '', '2025-08-26 13:50:45'),
(44, 16, 10, 1, '', '2025-08-26 13:50:46'),
(45, 16, 15, 1, '', '2025-08-26 13:50:46'),
(46, 17, 35, 4, '', '2025-08-26 13:52:26'),
(47, 17, 29, 1, '', '2025-08-26 13:52:27'),
(48, 17, 30, 1, '', '2025-08-26 13:52:27'),
(49, 17, 31, 1, '', '2025-08-26 13:52:28'),
(50, 19, 3, 1, '', '2025-08-26 13:52:37'),
(51, 20, 3, 1, '', '2025-08-26 13:52:53'),
(52, 21, 10, 1, '', '2025-08-26 13:55:24'),
(53, 21, 7, 1, '', '2025-08-26 13:55:25'),
(54, 21, 13, 1, '', '2025-08-26 13:55:25'),
(55, 21, 14, 1, '', '2025-08-26 13:55:26'),
(56, 21, 31, 1, '', '2025-08-26 13:55:26'),
(57, 22, 35, 3, '', '2025-08-26 13:58:02'),
(58, 22, 15, 1, '', '2025-08-26 13:58:03'),
(59, 23, 35, 1, '', '2025-08-26 13:58:22'),
(60, 23, 31, 1, '', '2025-08-26 13:58:22'),
(61, 23, 29, 1, '', '2025-08-26 13:58:23'),
(62, 23, 15, 1, '', '2025-08-26 13:58:23'),
(63, 24, 30, 1, '', '2025-08-26 13:58:31'),
(64, 24, 29, 1, '', '2025-08-26 13:58:31'),
(65, 24, 15, 1, '', '2025-08-26 13:58:32'),
(66, 25, 31, 1, '', '2025-08-26 13:59:08'),
(67, 25, 29, 1, '', '2025-08-26 13:59:08'),
(68, 25, 11, 1, '', '2025-08-26 13:59:09'),
(69, 25, 7, 1, '', '2025-08-26 13:59:09'),
(70, 26, 16, 1, '', '2025-08-26 14:00:43'),
(71, 26, 31, 1, '', '2025-08-26 14:00:44'),
(72, 26, 30, 2, '', '2025-08-26 14:00:44'),
(73, 26, 15, 1, '', '2025-08-26 14:00:45'),
(74, 26, 11, 1, '', '2025-08-26 14:00:45'),
(75, 26, 29, 1, '', '2025-08-26 14:00:45'),
(76, 27, 15, 1, '', '2025-08-26 14:03:06'),
(77, 27, 30, 1, '', '2025-08-26 14:03:07'),
(78, 27, 29, 1, '', '2025-08-26 14:03:07'),
(79, 28, 3, 1, '', '2025-08-26 14:04:34'),
(80, 29, 33, 1, '', '2025-08-26 14:06:40'),
(81, 29, 35, 1, '', '2025-08-26 14:06:41'),
(82, 29, 34, 1, '', '2025-08-26 14:06:41'),
(83, 30, 30, 1, '', '2025-08-26 14:25:05'),
(84, 30, 15, 1, '', '2025-08-26 14:25:06');

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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_updated` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `store_inventory`
--

INSERT INTO `store_inventory` (`id`, `store_id`, `product_id`, `quantity`, `updated_at`, `last_updated`) VALUES
(1, 1, 2, 5196, '2025-08-12 12:39:43', ''),
(2, 1, 1, 4508, '2025-08-12 12:41:51', ''),
(3, 1, 27, 101, '2025-08-26 10:01:47', ''),
(4, 1, 28, 211, '2025-08-26 10:02:06', ''),
(5, 1, 19, 348, '2025-08-12 12:44:18', ''),
(6, 1, 20, 59, '2025-08-12 12:44:34', ''),
(7, 1, 25, 85, '2025-08-26 10:05:18', ''),
(8, 1, 24, 380, '2025-08-26 10:04:08', ''),
(9, 1, 23, 380, '2025-08-26 10:04:22', ''),
(10, 1, 21, 231, '2025-08-26 10:03:53', ''),
(11, 1, 22, 239, '2025-08-12 12:46:58', ''),
(12, 1, 11, 1195, '2025-08-26 10:07:11', ''),
(13, 1, 13, 411, '2025-08-26 10:07:25', ''),
(14, 1, 10, 1008, '2025-08-26 10:07:37', ''),
(15, 1, 12, 1642, '2025-08-26 10:07:50', ''),
(16, 1, 14, 1642, '2025-08-12 13:14:36', ''),
(17, 1, 8, 1575, '2025-08-12 13:14:57', ''),
(18, 1, 7, 1189, '2025-08-12 13:15:14', ''),
(19, 1, 3, 3840, '2025-08-26 10:09:36', ''),
(20, 1, 15, 5491, '2025-08-12 13:16:38', ''),
(21, 1, 5, 2553, '2025-08-12 13:17:41', ''),
(22, 1, 4, 3034, '2025-08-12 13:17:53', ''),
(23, 1, 6, 3528, '2025-08-12 13:18:27', ''),
(24, 1, 16, 2080, '2025-08-26 10:09:57', ''),
(25, 1, 17, 235, '2025-08-26 10:03:30', ''),
(26, 1, 26, 232, '2025-08-26 10:05:04', ''),
(27, 1, 38, 2792, '2025-08-26 10:21:58', ''),
(29, 1, 40, 3391, '2025-08-26 10:25:17', ''),
(31, 1, 43, 3450, '2025-08-26 10:25:34', ''),
(32, 1, 32, 2350, '2025-08-26 10:27:17', ''),
(34, 1, 33, 2427, '2025-08-26 10:27:37', ''),
(35, 1, 34, 2413, '2025-08-26 10:27:57', ''),
(36, 1, 35, 1380, '2025-08-26 10:28:16', ''),
(37, 1, 31, 1975, '2025-08-26 10:34:52', ''),
(38, 1, 29, 3440, '2025-08-26 10:35:12', ''),
(39, 1, 30, 4230, '2025-08-26 10:35:33', '');

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

--
-- Dumping data for table `Token`
--

INSERT INTO `Token` (`id`, `token`, `salesRepId`, `createdAt`, `expiresAt`, `blacklisted`, `lastUsedAt`, `tokenType`) VALUES
(1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2MzI2MTk2LCJleHAiOjE3NTYzNTg1OTZ9.rZTrZXHhDAE4KGcHMn5PyhURLsHffCt6v', 2, '2025-08-27 22:23:16.117', '2025-08-28 05:23:16.598', 0, NULL, 'access'),
(2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2MzI2MTk2LCJleHAiOjE3NTY5MzA5OTZ9.wqDhFp-yH8PJ4Dyvq4Qbwwzobtr3zl1Qt', 2, '2025-08-27 22:23:17.044', '2025-09-03 20:23:17.530', 0, NULL, 'refresh'),
(3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MTA0MTA4MzYiLCJzdWIiOjkyLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjoxLCJpYXQiOjE3NTYzNTgwOTMsImV4cCI6MTc1NjM5MDQ5M30.GP8_QSpTAQmlabtv8G--sjs4nsEy9K', 92, '2025-08-28 07:14:52.973', '2025-08-28 14:14:53.187', 0, NULL, 'access'),
(4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MTA0MTA4MzYiLCJzdWIiOjkyLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjoxLCJpYXQiOjE3NTYzNTgwOTMsImV4cCI6MTc1Njk2Mjg5M30.98pDrHbhiGBQsOB3q3mlQ6Ii7T33lD', 92, '2025-08-28 07:14:53.893', '2025-09-04 05:14:54.114', 0, NULL, 'refresh'),
(5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MTA4MDg0ODkiLCJzdWIiOjg0LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjM4NzYsImV4cCI6MTc1NjM5NjI3Nn0.Pn8VvhmVa-Jap4DSxBEKqMR42OfAdP', 84, '2025-08-28 08:51:16.720', '2025-08-28 15:51:16.952', 0, NULL, 'access'),
(6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MTA4MDg0ODkiLCJzdWIiOjg0LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjM4NzYsImV4cCI6MTc1Njk2ODY3Nn0.JcmTlcy4c7j0KI_X1M94IpTAIQCpbQ', 84, '2025-08-28 08:51:17.606', '2025-09-04 06:51:17.839', 0, NULL, 'refresh'),
(7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3OTgxNTMyNjQiLCJzdWIiOjkwLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjoxLCJpYXQiOjE3NTYzNjQ0NDQsImV4cCI6MTc1NjM5Njg0NH0.8FEDyjQVQtfIQAwWi6yw2PBrIgyPPt', 90, '2025-08-28 09:00:43.886', '2025-08-28 16:00:44.116', 0, NULL, 'access'),
(8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3OTgxNTMyNjQiLCJzdWIiOjkwLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjoxLCJpYXQiOjE3NTYzNjQ0NDQsImV4cCI6MTc1Njk2OTI0NH0.KAMiT8zAlUp29nbKsu4R1IkfceqJmg', 90, '2025-08-28 09:00:44.784', '2025-09-04 07:00:45.014', 0, NULL, 'refresh'),
(9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3OTg5OTYwMzEiLCJzdWIiOjcxLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjQ3ODUsImV4cCI6MTc1NjM5NzE4NX0.JquduXPhgQuJr7TJzUnC38ya48j-Zi', 71, '2025-08-28 09:06:25.610', '2025-08-28 16:06:25.839', 0, NULL, 'access'),
(10, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3OTg5OTYwMzEiLCJzdWIiOjcxLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjQ3ODUsImV4cCI6MTc1Njk2OTU4NX0.i5Q4DPRoFfqdFYVSFd5Ph2RO53t-Cp', 71, '2025-08-28 09:06:26.508', '2025-09-04 07:06:26.739', 0, NULL, 'refresh'),
(11, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3NDg4OTYyNTMiLCJzdWIiOjczLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjU1NzQsImV4cCI6MTc1NjM5Nzk3NH0.yTIW8S_KtVW-1bY5soKJskLKvblWAc', 73, '2025-08-28 09:19:33.784', '2025-08-28 16:19:34.017', 0, NULL, 'access'),
(12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3NDg4OTYyNTMiLCJzdWIiOjczLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjU1NzQsImV4cCI6MTc1Njk3MDM3NH0.RHS50Lq4jBmCcZ9gXWHTvbMP7UNjq4', 73, '2025-08-28 09:19:34.668', '2025-09-04 07:19:34.901', 0, NULL, 'refresh'),
(13, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3OTQ0MTAxMjIiLCJzdWIiOjYzLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjU5MjUsImV4cCI6MTc1NjM5ODMyNX0.xSJsPO87DUgD8FwSmaB8mlWw64JRnv', 63, '2025-08-28 09:25:25.058', '2025-08-28 16:25:25.286', 0, NULL, 'access'),
(14, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3OTQ0MTAxMjIiLCJzdWIiOjYzLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjU5MjUsImV4cCI6MTc1Njk3MDcyNX0.ogs3DBEEFkHetUNPRxmbk1R4T2W3yJ', 63, '2025-08-28 09:25:25.959', '2025-09-04 07:25:26.186', 0, NULL, 'refresh'),
(15, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3NDYwMTU5NTkiLCJzdWIiOjc2LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjYwNjYsImV4cCI6MTc1NjM5ODQ2Nn0.AmyYNZKyYoffecusnTtTzCUs2yr9KV', 76, '2025-08-28 09:27:45.848', '2025-08-28 16:27:46.073', 0, NULL, 'access'),
(16, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3NDYwMTU5NTkiLCJzdWIiOjc2LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjYwNjYsImV4cCI6MTc1Njk3MDg2Nn0.mNpXl5neYrnO9OfboPv0heYnhu7FuM', 76, '2025-08-28 09:27:46.748', '2025-09-04 07:27:46.974', 0, NULL, 'refresh'),
(17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3OTg2NDM1NDciLCJzdWIiOjY1LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjY1ODQsImV4cCI6MTc1NjM5ODk4NH0.Wvxk8IFNnJ56vpmrKgpye__KoydEVx', 65, '2025-08-28 09:36:23.847', '2025-08-28 16:36:24.068', 0, NULL, 'access'),
(18, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3OTg2NDM1NDciLCJzdWIiOjY1LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjY1ODQsImV4cCI6MTc1Njk3MTM4NH0.0Bq6m_S2izFuDbQ-9gSksTTHXJMK4C', 65, '2025-08-28 09:36:24.747', '2025-09-04 07:36:24.976', 0, NULL, 'refresh'),
(19, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3Njg5MjU0OTYiLCJzdWIiOjMsInJvbGUiOiJTQUxFU19SRVAiLCJyb2xlSWQiOjEsImNvdW50cnlJZCI6MSwicmVnaW9uSWQiOjEsInJvdXRlSWQiOjEsImlhdCI6MTc1NjM2NjU5MCwiZXhwIjoxNzU2Mzk4OTkwfQ.owKteF8gJfnAB1FFnPr8loGPG7vNVnP', 3, '2025-08-28 09:36:29.907', '2025-08-28 16:36:30.137', 0, NULL, 'access'),
(20, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3Njg5MjU0OTYiLCJzdWIiOjMsInJvbGUiOiJTQUxFU19SRVAiLCJyb2xlSWQiOjEsImNvdW50cnlJZCI6MSwicmVnaW9uSWQiOjEsInJvdXRlSWQiOjEsImlhdCI6MTc1NjM2NjU5MCwiZXhwIjoxNzU2OTcxMzkwfQ.4L4ZFNY-pq6FDYrsBhsb3WxdgRl789r', 3, '2025-08-28 09:36:30.808', '2025-09-04 07:36:31.037', 0, NULL, 'refresh'),
(21, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3ODIxMTk1MTkiLCJzdWIiOjkxLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjY2MDAsImV4cCI6MTc1NjM5OTAwMH0.Gro3HtkMlx1vWR-VmuFafD0ae3x26L', 91, '2025-08-28 09:36:40.438', '2025-08-28 16:36:40.667', 0, NULL, 'access'),
(22, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3ODIxMTk1MTkiLCJzdWIiOjkxLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjY2MDAsImV4cCI6MTc1Njk3MTQwMH0.vQzpM4NdJpcq9YyCDXJB4LPrLD-xoL', 91, '2025-08-28 09:36:41.336', '2025-09-04 07:36:41.566', 0, NULL, 'refresh'),
(23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MjY4MTgzMTMiLCJzdWIiOjY4LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjcwMDcsImV4cCI6MTc1NjM5OTQwN30.rNRrcKx-WzYqEkgVuUIlzZQsx54VrH', 68, '2025-08-28 09:43:27.528', '2025-08-28 16:43:27.758', 0, NULL, 'access'),
(24, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MjY4MTgzMTMiLCJzdWIiOjY4LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjcwMDcsImV4cCI6MTc1Njk3MTgwN30.FxrmA5FE2A_7WA2_jywzn4NzXjLD8q', 68, '2025-08-28 09:43:28.426', '2025-09-04 07:43:28.656', 0, NULL, 'refresh'),
(25, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MTQ2OTI0NDEiLCJzdWIiOjgyLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjc2MTUsImV4cCI6MTc1NjQwMDAxNX0.3d8kUUb1Xi4tBEAuL3iXAdwnpJhbwk', 82, '2025-08-28 09:53:35.282', '2025-08-28 16:53:35.516', 0, NULL, 'access'),
(26, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MTQ2OTI0NDEiLCJzdWIiOjgyLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjc2MTUsImV4cCI6MTc1Njk3MjQxNX0._S7ngGPvslf9afqfZhBL00XFCQO1l7', 82, '2025-08-28 09:53:36.175', '2025-09-04 07:53:36.408', 0, NULL, 'refresh'),
(27, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDU4OTg4NzciLCJzdWIiOjY3LCJyb2xlIjoiUkVMSUVWRVIiLCJyb2xlSWQiOjIsImNvdW50cnlJZCI6MSwicmVnaW9uSWQiOjEsInJvdXRlSWQiOjAsImlhdCI6MTc1NjM2Nzc2NSwiZXhwIjoxNzU2NDAwMTY1fQ.VLWZGi78QNRourFbO7EzSDItIkFtGiW', 67, '2025-08-28 09:56:04.941', '2025-08-28 16:56:05.174', 0, NULL, 'access'),
(28, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDU4OTg4NzciLCJzdWIiOjY3LCJyb2xlIjoiUkVMSUVWRVIiLCJyb2xlSWQiOjIsImNvdW50cnlJZCI6MSwicmVnaW9uSWQiOjEsInJvdXRlSWQiOjAsImlhdCI6MTc1NjM2Nzc2NSwiZXhwIjoxNzU2OTcyNTY1fQ.XW3KOxY8S09GVkRUXnpRniaR64nLGf-', 67, '2025-08-28 09:56:05.823', '2025-09-04 07:56:06.057', 0, NULL, 'refresh'),
(29, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDU4OTg4NzciLCJzdWIiOjY3LCJyb2xlIjoiUkVMSUVWRVIiLCJyb2xlSWQiOjIsImNvdW50cnlJZCI6MSwicmVnaW9uSWQiOjEsInJvdXRlSWQiOjAsImlhdCI6MTc1NjM2Nzc2OSwiZXhwIjoxNzU2NDAwMTY5fQ.JMY4aDx2HfR5n7qFZmE-00FR-XrBz7G', 67, '2025-08-28 09:56:09.758', '2025-08-28 16:56:09.992', 0, NULL, 'access'),
(30, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDU4OTg4NzciLCJzdWIiOjY3LCJyb2xlIjoiUkVMSUVWRVIiLCJyb2xlSWQiOjIsImNvdW50cnlJZCI6MSwicmVnaW9uSWQiOjEsInJvdXRlSWQiOjAsImlhdCI6MTc1NjM2Nzc2OSwiZXhwIjoxNzU2OTcyNTY5fQ.pW6wObHhQ7NUQ_T7rEqs02qJ1H12goQ', 67, '2025-08-28 09:56:10.639', '2025-09-04 07:56:10.872', 0, NULL, 'refresh'),
(31, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDU4OTg4NzciLCJzdWIiOjY3LCJyb2xlIjoiUkVMSUVWRVIiLCJyb2xlSWQiOjIsImNvdW50cnlJZCI6MSwicmVnaW9uSWQiOjEsInJvdXRlSWQiOjAsImlhdCI6MTc1NjM2Nzc5NywiZXhwIjoxNzU2NDAwMTk3fQ.ul4YSk8QQJrotx6HmHPbVVdEcNITxFz', 67, '2025-08-28 09:56:36.966', '2025-08-28 16:56:37.200', 0, NULL, 'access'),
(32, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDU4OTg4NzciLCJzdWIiOjY3LCJyb2xlIjoiUkVMSUVWRVIiLCJyb2xlSWQiOjIsImNvdW50cnlJZCI6MSwicmVnaW9uSWQiOjEsInJvdXRlSWQiOjAsImlhdCI6MTc1NjM2Nzc5NywiZXhwIjoxNzU2OTcyNTk3fQ.gFxBQs2Kk7Wy8uM5tsOFmcARE33UC0W', 67, '2025-08-28 09:56:37.847', '2025-09-04 07:56:38.080', 0, NULL, 'refresh'),
(33, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDc0OTgxMzgiLCJzdWIiOjY0LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjgwODAsImV4cCI6MTc1NjQwMDQ4MH0.ZKntRSJmk23kUSdkCdfBsG-yeckLGt', 64, '2025-08-28 10:01:20.322', '2025-08-28 17:01:20.544', 0, NULL, 'access'),
(34, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDc0OTgxMzgiLCJzdWIiOjY0LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjgwODAsImV4cCI6MTc1Njk3Mjg4MH0.enUKixe5k69HiIm5jwhpz5MKL7kSss', 64, '2025-08-28 10:01:21.235', '2025-09-04 08:01:21.456', 0, NULL, 'refresh'),
(35, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3NDM5MjQyNTkiLCJzdWIiOjg5LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjoxLCJpYXQiOjE3NTYzNjgxMjcsImV4cCI6MTc1NjQwMDUyN30.3acNZ0RGiGOZ34doDEOgD-uaqI8Clj', 89, '2025-08-28 10:02:07.497', '2025-08-28 17:02:07.723', 0, NULL, 'access'),
(36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3NDM5MjQyNTkiLCJzdWIiOjg5LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjoxLCJpYXQiOjE3NTYzNjgxMjcsImV4cCI6MTc1Njk3MjkyN30.hKFIQesH3iVi_QLQk9AllMGKHUt8yU', 89, '2025-08-28 10:02:08.395', '2025-09-04 08:02:08.621', 0, NULL, 'refresh'),
(37, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3NDYyMDE5NjAiLCJzdWIiOjk2LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjgxMzksImV4cCI6MTc1NjQwMDUzOX0.Txjdm0TA7LBNkZFDa9p6857hKmmHa5', 96, '2025-08-28 10:02:18.813', '2025-08-28 17:02:19.038', 0, NULL, 'access'),
(38, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3NDYyMDE5NjAiLCJzdWIiOjk2LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjgxMzksImV4cCI6MTc1Njk3MjkzOX0.qeljKQBkk_C4nT8RU07RJ_XALzRD-h', 96, '2025-08-28 10:02:19.712', '2025-09-04 08:02:19.937', 0, NULL, 'refresh'),
(39, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDIzMzk1NTkiLCJzdWIiOjc0LCJyb2xlIjoiUkVMSUVWRVIiLCJyb2xlSWQiOjIsImNvdW50cnlJZCI6MSwicmVnaW9uSWQiOjEsInJvdXRlSWQiOjAsImlhdCI6MTc1NjM2ODIzMiwiZXhwIjoxNzU2NDAwNjMyfQ.sy--0xIAmINyqg6MNKu0UMtffo-6IqF', 74, '2025-08-28 10:03:52.566', '2025-08-28 17:03:52.786', 0, NULL, 'access'),
(40, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDIzMzk1NTkiLCJzdWIiOjc0LCJyb2xlIjoiUkVMSUVWRVIiLCJyb2xlSWQiOjIsImNvdW50cnlJZCI6MSwicmVnaW9uSWQiOjEsInJvdXRlSWQiOjAsImlhdCI6MTc1NjM2ODIzMiwiZXhwIjoxNzU2OTczMDMyfQ.uzIrJIogR6SjoVlX7F_mcOhIZxkuQ4c', 74, '2025-08-28 10:03:53.465', '2025-09-04 08:03:53.695', 0, NULL, 'refresh'),
(41, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3NDgwMjE2MTEiLCJzdWIiOjk5LCJyb2xlIjoiUkVMSUVWRVIiLCJyb2xlSWQiOjIsImNvdW50cnlJZCI6MSwicmVnaW9uSWQiOjEsInJvdXRlSWQiOjAsImlhdCI6MTc1NjM2ODQ3MywiZXhwIjoxNzU2NDAwODczfQ.M4-3D489LNam-A1hP0akNPjB-bXhnsu', 99, '2025-08-28 10:07:53.248', '2025-08-28 17:07:53.474', 0, NULL, 'access'),
(42, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3NDgwMjE2MTEiLCJzdWIiOjk5LCJyb2xlIjoiUkVMSUVWRVIiLCJyb2xlSWQiOjIsImNvdW50cnlJZCI6MSwicmVnaW9uSWQiOjEsInJvdXRlSWQiOjAsImlhdCI6MTc1NjM2ODQ3MywiZXhwIjoxNzU2OTczMjczfQ.iuWTOfdjeWnS6faVx79Z8TXlAzKwbxH', 99, '2025-08-28 10:07:54.146', '2025-09-04 08:07:54.372', 0, NULL, 'refresh'),
(43, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDQxODcxOTMiLCJzdWIiOjY2LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjg3NjYsImV4cCI6MTc1NjQwMTE2Nn0.--fmILX53mv8dRLWX6g9oxqjVGyFum', 66, '2025-08-28 10:12:46.466', '2025-08-28 17:12:46.687', 0, NULL, 'access'),
(44, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDQxODcxOTMiLCJzdWIiOjY2LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjg3NjYsImV4cCI6MTc1Njk3MzU2Nn0.KE7knCFsoh4jhWtgaVRL_myxMmajcy', 66, '2025-08-28 10:12:47.382', '2025-09-04 08:12:47.602', 0, NULL, 'refresh'),
(45, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MjAzNjYwMjgiLCJzdWIiOjcwLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjkxNjgsImV4cCI6MTc1NjQwMTU2OH0.NcC3Ro8K_sCOud2X7LruqlPWM_BN10', 70, '2025-08-28 10:19:27.932', '2025-08-28 17:19:28.161', 1, NULL, 'access'),
(46, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MjAzNjYwMjgiLCJzdWIiOjcwLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzNjkxNjgsImV4cCI6MTc1Njk3Mzk2OH0.Uco9LN4xgld2yiD3wVqDY41cMnngZu', 70, '2025-08-28 10:19:28.830', '2025-09-04 08:19:29.059', 1, NULL, 'refresh'),
(47, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3OTgxNTMyNjQiLCJzdWIiOjkwLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjoxLCJpYXQiOjE3NTYzOTc4NDYsImV4cCI6MTc1NjQzMDI0Nn0.6OXUZzCUjRi39vrvjQIIaZy4fCXYO3', 90, '2025-08-28 18:17:26.766', '2025-08-29 01:17:26.978', 0, NULL, 'access'),
(48, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3OTgxNTMyNjQiLCJzdWIiOjkwLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjoxLCJpYXQiOjE3NTYzOTc4NDYsImV4cCI6MTc1NzAwMjY0Nn0.6mIblKN7G02fhwUHlvzeaoejIfolJ9', 90, '2025-08-28 18:17:27.683', '2025-09-04 16:17:27.897', 0, NULL, 'refresh'),
(49, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3OTQ0MTAxMjIiLCJzdWIiOjYzLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzOTg1NzMsImV4cCI6MTc1NjQzMDk3M30.r9Ru6QcCCmgSh7aX74UhtnMCKMHHMs', 63, '2025-08-28 18:29:33.730', '2025-08-29 01:29:33.951', 0, NULL, 'access'),
(50, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3OTQ0MTAxMjIiLCJzdWIiOjYzLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzOTg1NzMsImV4cCI6MTc1NzAwMzM3M30.k1agW1jSWaBzoESjsg8aWqgjkbUj_j', 63, '2025-08-28 18:29:34.631', '2025-09-04 16:29:34.853', 0, NULL, 'refresh'),
(51, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3OTg5OTYwMzEiLCJzdWIiOjcxLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzOTkzMTMsImV4cCI6MTc1NjQzMTcxM30.1bVVYdJXVSmWfttJ8-W8BMIhQSgBTG', 71, '2025-08-28 18:41:53.404', '2025-08-29 01:41:53.626', 0, NULL, 'access'),
(52, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3OTg5OTYwMzEiLCJzdWIiOjcxLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTYzOTkzMTMsImV4cCI6MTc1NzAwNDExM30.yUWpPZN4t32rDZ0qD2K89sUBOskL7k', 71, '2025-08-28 18:41:54.303', '2025-09-04 16:41:54.524', 0, NULL, 'refresh'),
(53, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3ODIxMTk1MTkiLCJzdWIiOjkxLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTY0MDA0ODksImV4cCI6MTc1NjQzMjg4OX0.nGZ8Mp3ebScqCCtSZlySNT8Xy0_ikd', 91, '2025-08-28 19:01:29.102', '2025-08-29 02:01:29.327', 0, NULL, 'access'),
(54, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3ODIxMTk1MTkiLCJzdWIiOjkxLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTY0MDA0ODksImV4cCI6MTc1NzAwNTI4OX0.-byk-Rpn6BltdUaym1X8X427CpGbA_', 91, '2025-08-28 19:01:29.983', '2025-09-04 17:01:30.209', 0, NULL, 'refresh'),
(55, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDU4OTg4NzciLCJzdWIiOjY3LCJyb2xlIjoiUkVMSUVWRVIiLCJyb2xlSWQiOjIsImNvdW50cnlJZCI6MSwicmVnaW9uSWQiOjEsInJvdXRlSWQiOjAsImlhdCI6MTc1NjQwMDUwMiwiZXhwIjoxNzU2NDMyOTAyfQ.h16zghLWQds_392quCO8RG4syfXP4Ev', 67, '2025-08-28 19:01:42.744', '2025-08-29 02:01:42.969', 0, NULL, 'access'),
(56, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDU4OTg4NzciLCJzdWIiOjY3LCJyb2xlIjoiUkVMSUVWRVIiLCJyb2xlSWQiOjIsImNvdW50cnlJZCI6MSwicmVnaW9uSWQiOjEsInJvdXRlSWQiOjAsImlhdCI6MTc1NjQwMDUwMiwiZXhwIjoxNzU3MDA1MzAyfQ.kIj0g9NG3nbbnST-hbSOsYRnheMkrQo', 67, '2025-08-28 19:01:43.627', '2025-09-04 17:01:43.853', 0, NULL, 'refresh'),
(57, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3NDYwMTU5NTkiLCJzdWIiOjc2LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTY0MDA1NDEsImV4cCI6MTc1NjQzMjk0MX0.2zXzizf3Goxu4ce1to69O3-hC-4tal', 76, '2025-08-28 19:02:20.865', '2025-08-29 02:02:21.089', 0, NULL, 'access'),
(58, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3NDYwMTU5NTkiLCJzdWIiOjc2LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTY0MDA1NDEsImV4cCI6MTc1NzAwNTM0MX0.JShSG5L3cIWFhpoh8n9-Wa9Ru9OEab', 76, '2025-08-28 19:02:21.750', '2025-09-04 17:02:21.974', 0, NULL, 'refresh'),
(59, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MjY4MTgzMTMiLCJzdWIiOjY4LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTY0MDA1NTcsImV4cCI6MTc1NjQzMjk1N30.L0NrQKv1j3KA9GJWw3_m3dqnsz0MnV', 68, '2025-08-28 19:02:37.640', '2025-08-29 02:02:37.866', 0, NULL, 'access'),
(60, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MjY4MTgzMTMiLCJzdWIiOjY4LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTY0MDA1NTcsImV4cCI6MTc1NzAwNTM1N30.pzLw0J3qv141GEmcNnnx20OpTuFsuB', 68, '2025-08-28 19:02:38.523', '2025-09-04 17:02:38.748', 0, NULL, 'refresh'),
(61, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3NDYyMDE5NjAiLCJzdWIiOjk2LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTY0MDA2OTcsImV4cCI6MTc1NjQzMzA5N30.LA_L67z_wYFpjHZKZBIJMrZHKlxYU3', 96, '2025-08-28 19:04:57.674', '2025-08-29 02:04:57.894', 0, NULL, 'access'),
(62, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3NDYyMDE5NjAiLCJzdWIiOjk2LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTY0MDA2OTcsImV4cCI6MTc1NzAwNTQ5N30.bTRw6geeLF8RXkznxCQ7BeZDfjImUJ', 96, '2025-08-28 19:04:58.575', '2025-09-04 17:04:58.795', 0, NULL, 'refresh'),
(63, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2NDAwNzA1LCJleHAiOjE3NTY0MzMxMDV9.5j2RFXaLke07v5leaaZlY-RlpljrTy1BS', 2, '2025-08-28 19:05:04.918', '2025-08-29 02:05:05.141', 0, NULL, 'access'),
(64, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2NDAwNzA1LCJleHAiOjE3NTcwMDU1MDV9.gs0rFNqdKbsw63ZPr3L3rpVoW2yozNIY_', 2, '2025-08-28 19:05:05.802', '2025-09-04 17:05:06.026', 0, NULL, 'refresh'),
(65, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3NDM5MjQyNTkiLCJzdWIiOjg5LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjoxLCJpYXQiOjE3NTY0MDA3MjEsImV4cCI6MTc1NjQzMzEyMX0.Tq6Mw4NwFx0TS4O1hPJ9S1jLGkburY', 89, '2025-08-28 19:05:21.120', '2025-08-29 02:05:21.341', 0, NULL, 'access'),
(66, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3NDM5MjQyNTkiLCJzdWIiOjg5LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjoxLCJpYXQiOjE3NTY0MDA3MjEsImV4cCI6MTc1NzAwNTUyMX0.45lTdYzEQ1YGCOVmw4BcUuUqqrdjD2', 89, '2025-08-28 19:05:22.017', '2025-09-04 17:05:22.239', 0, NULL, 'refresh'),
(67, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3Njg5MjU0OTYiLCJzdWIiOjMsInJvbGUiOiJTQUxFU19SRVAiLCJyb2xlSWQiOjEsImNvdW50cnlJZCI6MSwicmVnaW9uSWQiOjEsInJvdXRlSWQiOjEsImlhdCI6MTc1NjQwMDc3OSwiZXhwIjoxNzU2NDMzMTc5fQ.eSegWhfWQE8KVEeO9-Fd1K5O_OgZ0c-', 3, '2025-08-28 19:06:19.122', '2025-08-29 02:06:19.347', 0, NULL, 'access'),
(68, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3Njg5MjU0OTYiLCJzdWIiOjMsInJvbGUiOiJTQUxFU19SRVAiLCJyb2xlSWQiOjEsImNvdW50cnlJZCI6MSwicmVnaW9uSWQiOjEsInJvdXRlSWQiOjEsImlhdCI6MTc1NjQwMDc3OSwiZXhwIjoxNzU3MDA1NTc5fQ.oiQ3aoWrvwMGoF9a79IvnjLdjhZFmje', 3, '2025-08-28 19:06:20.006', '2025-09-04 17:06:20.231', 0, NULL, 'refresh'),
(69, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2NDAyODU2LCJleHAiOjE3NTY0MzUyNTZ9.PxnojowYnh5YrnUgVQsU13jcNLFAgq64S', 2, '2025-08-28 19:40:57.505', '2025-08-29 05:40:56.140', 0, NULL, 'access'),
(70, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2NDAyODU2LCJleHAiOjE3NTcwMDc2NTZ9.OGGlUghWRVMYYoNzPuxqSVOHouwVyrxAp', 2, '2025-08-28 19:40:58.380', '2025-09-04 20:40:57.155', 0, NULL, 'refresh'),
(71, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3OTg2NDM1NDciLCJzdWIiOjY1LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTY0MDQ4MDYsImV4cCI6MTc1NjQzNzIwNn0.vrAc2PVQCTFqEtKEgQgzPKAOtaU8Uu', 65, '2025-08-28 20:13:26.686', '2025-08-29 03:13:26.900', 0, NULL, 'access'),
(72, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3OTg2NDM1NDciLCJzdWIiOjY1LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTY0MDQ4MDYsImV4cCI6MTc1NzAwOTYwNn0.xhtLaBczojHwyKxpacoZOd76YqQMTo', 65, '2025-08-28 20:13:27.592', '2025-09-04 18:13:27.801', 0, NULL, 'refresh'),
(73, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MjAzNjYwMjgiLCJzdWIiOjcwLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTY0MDUxNzQsImV4cCI6MTc1NjQzNzU3NH0.4ehkMoyUaka9FbFYJ-X0G2fVj1tiYx', 70, '2025-08-28 20:19:34.047', '2025-08-29 03:19:34.270', 1, NULL, 'access'),
(74, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MjAzNjYwMjgiLCJzdWIiOjcwLCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTY0MDUxNzQsImV4cCI6MTc1NzAwOTk3NH0.0F_3xKiIIx1Fuwl1vzXRxrcXeC07ct', 70, '2025-08-28 20:19:34.930', '2025-09-04 18:19:35.155', 1, NULL, 'refresh'),
(75, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDc0OTgxMzgiLCJzdWIiOjY0LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTY0MDYyNTksImV4cCI6MTc1NjQzODY1OX0.1BfOUaduUKsVatImUKi_nXM1rUS9r4', 64, '2025-08-28 20:37:39.658', '2025-08-29 03:37:39.883', 0, NULL, 'access'),
(76, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDc0OTgxMzgiLCJzdWIiOjY0LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjowLCJpYXQiOjE3NTY0MDYyNTksImV4cCI6MTc1NzAxMTA1OX0.AJfBprs1DurhG6tHOU_duNd2dW-J6O', 64, '2025-08-28 20:37:40.542', '2025-09-04 18:37:40.765', 0, NULL, 'refresh'),
(77, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2NDEwMTczLCJleHAiOjE3NTY0NDI1NzN9.D_m1-CXRf04dztozfxpfVMk9-Xe2lGwOy', 2, '2025-08-28 21:42:53.759', '2025-08-29 07:42:53.808', 0, NULL, 'access'),
(78, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2NDEwMTczLCJleHAiOjE3NTcwMTQ5NzN9.3GEQLBUcuW247lkf9z3W7tS7NhE6FRr7w', 2, '2025-08-28 21:42:54.035', '2025-09-04 22:42:54.085', 0, NULL, 'refresh'),
(79, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2NDExODkyLCJleHAiOjE3NTY0NDQyOTJ9.0LIgLdcDbnqjbcJVPtwPbEU30XAB2Z9jU', 2, '2025-08-28 22:11:32.331', '2025-08-29 05:11:32.553', 0, NULL, 'access'),
(80, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2NDExODkyLCJleHAiOjE3NTcwMTY2OTJ9.RO_xxZS9aXl0ROamBG7-t_HzA3IT9Mdgn', 2, '2025-08-28 22:11:33.220', '2025-09-04 20:11:33.442', 0, NULL, 'refresh'),
(81, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3NDU2Mzg3NTciLCJzdWIiOjc4LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjoxLCJpYXQiOjE3NTY0MTM5MzQsImV4cCI6MTc1NjQ0NjMzNH0.FGt_O4vu9o38VYuvmeBFXyKSEXZ2lX', 78, '2025-08-28 22:45:34.376', '2025-08-29 05:45:34.598', 0, NULL, 'access'),
(82, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3NDU2Mzg3NTciLCJzdWIiOjc4LCJyb2xlIjoiU0FMRVNfUkVQIiwicm9sZUlkIjoxLCJjb3VudHJ5SWQiOjEsInJlZ2lvbklkIjoxLCJyb3V0ZUlkIjoxLCJpYXQiOjE3NTY0MTM5MzQsImV4cCI6MTc1NzAxODczNH0.nGupIDZluk5hH_Svi420YpH0EVWMyM', 78, '2025-08-28 22:45:35.265', '2025-09-04 20:45:35.486', 0, NULL, 'refresh'),
(83, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2NDEzOTU2LCJleHAiOjE3NTY0NDYzNTZ9.GzG6V2ApSylbuGcPqhQ8waA2fEB_OVRMn', 2, '2025-08-28 22:45:56.021', '2025-08-29 05:45:56.240', 0, NULL, 'access'),
(84, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2NDEzOTU2LCJleHAiOjE3NTcwMTg3NTZ9.rrn-shaPiHgwlqAnh_2iqqJ7GNAG_qDav', 2, '2025-08-28 22:45:56.922', '2025-09-04 20:45:57.142', 0, NULL, 'refresh'),
(85, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2NDE0Nzk3LCJleHAiOjE3NTY0NDcxOTd9.tw7Tm5ommE3JPQ3KKlnBgL9-u63uAzJ-O', 2, '2025-08-28 22:59:56.998', '2025-08-29 05:59:57.209', 0, NULL, 'access'),
(86, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2NDE0Nzk3LCJleHAiOjE3NTcwMTk1OTd9.PBqkorU4JCofZqUWBcvaTlGUtsINgEfyO', 2, '2025-08-28 22:59:57.913', '2025-09-04 20:59:58.126', 0, NULL, 'refresh'),
(87, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2NDE2MDI5LCJleHAiOjE3NTY0NDg0Mjl9.w_1zGCljJyKABtXMOV86Cnj5dcSMlfawk', 2, '2025-08-28 23:20:29.738', '2025-08-29 06:20:29.953', 0, NULL, 'access'),
(88, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2NDE2MDI5LCJleHAiOjE3NTcwMjA4Mjl9.Rp3CSoXzixVbwJ1dERanGJS_Zk8gTvvss', 2, '2025-08-28 23:20:30.637', '2025-09-04 21:20:30.853', 0, NULL, 'refresh'),
(89, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2NDIxNzEzLCJleHAiOjE3NTY0NTQxMTN9.mIgAyMje2bu6Yq_csh9RjosTW-vZBpCub', 2, '2025-08-29 00:55:13.302', '2025-08-29 10:55:13.305', 0, NULL, 'access'),
(90, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2NDIxNzEzLCJleHAiOjE3NTcwMjY1MTN9.vEAbW8dWOaEI2yh-5Qc0_-VeTz1deBZol', 2, '2025-08-29 00:55:13.549', '2025-09-05 01:55:13.574', 0, NULL, 'refresh'),
(91, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2NDIyMTg4LCJleHAiOjE3NTY0NTQ1ODh9.p18iLlzi70kl-ChIH7TX0VmaS-yK7R5qG', 2, '2025-08-29 01:03:08.493', '2025-08-29 11:03:08.774', 0, NULL, 'access'),
(92, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2NDIyMTg4LCJleHAiOjE3NTcwMjY5ODh9.hFizexhTxNZGw4vr_xlZpCaM3yDDYaEwG', 2, '2025-08-29 01:03:08.761', '2025-09-05 02:03:09.053', 0, NULL, 'refresh'),
(93, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2NDIyNTEyLCJleHAiOjE3NTY0NTQ5MTJ9.d-1_r5ZRHlvs0uN5RWhSOZ6VCpVJnA3iz', 2, '2025-08-29 01:08:32.307', '2025-08-29 11:08:32.595', 0, NULL, 'access'),
(94, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2NDIyNTEyLCJleHAiOjE3NTcwMjczMTJ9.CWj1lyvv-Qy3jsqrmgPV3wElokPEAsrxR', 2, '2025-08-29 01:08:32.548', '2025-09-05 02:08:32.835', 0, NULL, 'refresh'),
(95, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2NDIzMzQwLCJleHAiOjE3NTY0NTU3NDB9.Y4_mXVBGugIbk7bMngJX3AxYHS_d2hPkz', 2, '2025-08-29 01:22:20.261', '2025-08-29 11:22:20.041', 0, NULL, 'access'),
(96, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2NDIzMzQwLCJleHAiOjE3NTcwMjgxNDB9.4GiNWU85RgKRY56ZcoafbIp5KR33AxqWK', 2, '2025-08-29 01:22:20.495', '2025-09-05 02:22:20.290', 0, NULL, 'refresh'),
(97, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2NDM5OTA2LCJleHAiOjE3NTY0NzIzMDZ9.SRhV02Py6-To7GOe7hnchL_t-1pzoUiFj', 2, '2025-08-29 05:58:25.741', '2025-08-29 12:58:26.007', 0, NULL, 'access'),
(98, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjA3MDYxNjY4NzUiLCJzdWIiOjIsInJvbGUiOiJSRUxJRVZFUiIsInJvbGVJZCI6MiwiY291bnRyeUlkIjoxLCJyZWdpb25JZCI6MSwicm91dGVJZCI6MSwiaWF0IjoxNzU2NDM5OTA2LCJleHAiOjE3NTcwNDQ3MDZ9.qbIsjUL-6ZTdBzlskJqQP55aqWC_pdB1N', 2, '2025-08-29 05:58:26.647', '2025-09-05 03:58:26.919', 0, NULL, 'refresh');

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
(6, 22, 2, 1, 10000, '2025-08-12 20:06:10.923', '2025-08-13 06:09:26.739', 'customer stated it expired'),
(7, 22, 2, 0, 100, '2025-08-12 20:10:01.026', '2025-08-12 21:10:14.507', 'wrong price'),
(8, 22, 2, 1, 30000, '2025-08-12 20:51:29.303', '0000-00-00 00:00:00.000', ''),
(9, 22, 2, 0, 53, '2025-08-12 20:52:10.422', '2025-08-13 06:09:08.530', ''),
(10, 22, 2, 0, 2, '2025-08-12 21:14:08.204', '2025-08-12 22:14:39.477', 'th'),
(11, 22, 2, 0, 2, '2025-08-12 22:11:30.176', '2025-08-12 23:11:54.736', 'test'),
(12, 22, 2, 1, 2, '2025-08-13 06:35:35.800', '0000-00-00 00:00:00.000', ''),
(13, 19, 2, 1, 2000, '2025-08-19 10:53:26.967', '0000-00-00 00:00:00.000', ''),
(14, 19, 2, 1, 995, '2025-08-26 12:59:17.827', '0000-00-00 00:00:00.000', ''),
(15, 10, 78, 1, 1000, '2025-08-26 13:02:51.192', '0000-00-00 00:00:00.000', ''),
(16, 9, 63, 1, 1100, '2025-08-26 13:04:46.099', '0000-00-00 00:00:00.000', ''),
(17, 7, 66, 1, 450, '2025-08-26 13:05:42.609', '0000-00-00 00:00:00.000', ''),
(18, 7, 66, 1, 450, '2025-08-26 13:07:10.778', '0000-00-00 00:00:00.000', ''),
(19, 13, 91, 1, 450, '2025-08-26 13:13:21.150', '0000-00-00 00:00:00.000', ''),
(20, 5, 64, 1, 1000, '2025-08-26 13:20:22.563', '0000-00-00 00:00:00.000', ''),
(21, 3, 89, 1, 1000, '2025-08-26 13:21:02.764', '0000-00-00 00:00:00.000', ''),
(22, 2, 62, 1, 450, '2025-08-26 13:21:13.606', '0000-00-00 00:00:00.000', ''),
(23, 13, 99, 1, 450, '2025-08-26 13:21:27.019', '0000-00-00 00:00:00.000', ''),
(24, 3, 3, 1, 1990, '2025-08-26 13:24:29.941', '0000-00-00 00:00:00.000', ''),
(25, 14, 76, 1, 1100, '2025-08-26 13:58:35.653', '0000-00-00 00:00:00.000', ''),
(26, 14, 76, 1, 1000, '2025-08-26 16:47:39.398', '0000-00-00 00:00:00.000', ''),
(27, 14, 76, 1, 2450, '2025-08-26 16:48:36.870', '0000-00-00 00:00:00.000', ''),
(28, 9, 63, 1, 3300, '2025-08-26 19:01:25.498', '0000-00-00 00:00:00.000', ''),
(29, 4, 77, 1, 5750, '2025-08-26 23:43:15.088', '0000-00-00 00:00:00.000', ''),
(30, 13, 91, 1, 10300, '2025-08-27 19:06:50.209', '0000-00-00 00:00:00.000', ''),
(31, 14, 76, 1, 3200, '2025-08-27 19:13:38.376', '0000-00-00 00:00:00.000', ''),
(32, 14, 76, 1, 3450, '2025-08-27 19:28:29.410', '0000-00-00 00:00:00.000', ''),
(33, 5, 64, 1, 10700, '2025-08-27 20:28:51.771', '0000-00-00 00:00:00.000', ''),
(34, 4, 77, 1, 12987, '2025-08-27 21:56:04.653', '0000-00-00 00:00:00.000', ''),
(35, 9, 63, 1, 12250, '2025-08-27 22:17:06.343', '0000-00-00 00:00:00.000', ''),
(36, 13, 91, 1, 14748, '2025-08-28 18:32:52.047', '0000-00-00 00:00:00.000', ''),
(37, 9, 63, 1, 6500, '2025-08-28 18:35:34.126', '0000-00-00 00:00:00.000', ''),
(38, 2, 99, 1, 1100, '2025-08-28 18:57:36.189', '0000-00-00 00:00:00.000', ''),
(39, 13, 91, 1, 2287, '2025-08-28 19:02:35.681', '0000-00-00 00:00:00.000', ''),
(40, 3, 89, 1, 3450, '2025-08-28 19:07:01.222', '0000-00-00 00:00:00.000', ''),
(41, 3, 89, 1, 1100, '2025-08-28 19:07:55.189', '0000-00-00 00:00:00.000', ''),
(42, 3, 89, 1, 1000, '2025-08-28 19:09:05.912', '0000-00-00 00:00:00.000', ''),
(43, 14, 76, 0, 3980, '2025-08-28 20:30:06.141', '2025-08-28 18:32:39.739', 'wrong input'),
(44, 14, 76, 1, 4400, '2025-08-28 20:31:26.304', '0000-00-00 00:00:00.000', ''),
(45, 14, 76, 1, 1990, '2025-08-28 20:33:17.162', '0000-00-00 00:00:00.000', ''),
(46, 14, 76, 1, 3450, '2025-08-28 20:35:13.086', '0000-00-00 00:00:00.000', ''),
(47, 14, 76, 1, 2450, '2025-08-28 20:35:51.582', '0000-00-00 00:00:00.000', ''),
(48, 14, 76, 1, 1000, '2025-08-28 20:36:23.427', '0000-00-00 00:00:00.000', ''),
(49, 14, 76, 1, 2450, '2025-08-28 20:36:52.823', '0000-00-00 00:00:00.000', ''),
(50, 14, 76, 1, 2450, '2025-08-28 20:37:24.856', '0000-00-00 00:00:00.000', ''),
(51, 14, 76, 1, 2450, '2025-08-28 20:38:21.034', '0000-00-00 00:00:00.000', ''),
(52, 5, 64, 1, 2600, '2025-08-28 20:40:04.821', '0000-00-00 00:00:00.000', '');

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
(3, 4, 21, 1, 200, 200, '2025-08-12 18:16:22.128'),
(4, 5, 17, 1, 10000, 10000, '2025-08-12 19:15:39.776'),
(5, 6, 17, 1, 10000, 10000, '2025-08-12 20:06:11.055'),
(6, 7, 17, 1, 100, 100, '2025-08-12 20:10:01.158'),
(7, 8, 17, 1, 30000, 30000, '2025-08-12 20:51:29.431'),
(8, 9, 17, 1, 10, 10, '2025-08-12 20:52:10.555'),
(9, 9, 18, 1, 23, 23, '2025-08-12 20:52:10.885'),
(10, 9, 22, 1, 20, 20, '2025-08-12 20:52:11.204'),
(11, 10, 17, 1, 2, 2, '2025-08-12 21:14:08.340'),
(12, 11, 17, 1, 2, 2, '2025-08-12 22:11:30.310'),
(13, 12, 17, 1, 2, 2, '2025-08-13 06:35:36.243'),
(14, 13, 17, 1, 2000, 2000, '2025-08-19 10:53:27.427'),
(15, 14, 17, 1, 995, 995, '2025-08-26 12:59:18.279'),
(16, 15, 16, 1, 1000, 1000, '2025-08-26 13:02:51.640'),
(17, 16, 31, 1, 1100, 1100, '2025-08-26 13:04:46.557'),
(18, 17, 23, 1, 450, 450, '2025-08-26 13:05:43.068'),
(19, 18, 25, 1, 450, 450, '2025-08-26 13:07:11.236'),
(20, 19, 21, 1, 450, 450, '2025-08-26 13:13:21.599'),
(21, 20, 16, 1, 1000, 1000, '2025-08-26 13:20:23.011'),
(22, 21, 16, 1, 1000, 1000, '2025-08-26 13:21:03.225'),
(23, 22, 23, 1, 450, 450, '2025-08-26 13:21:14.055'),
(24, 23, 22, 1, 450, 450, '2025-08-26 13:21:27.478'),
(25, 24, 22, 2, 995, 1990, '2025-08-26 13:24:30.387'),
(26, 25, 15, 1, 1100, 1100, '2025-08-26 13:58:36.093'),
(27, 26, 30, 1, 1000, 1000, '2025-08-26 16:47:39.839'),
(28, 27, 14, 1, 2450, 2450, '2025-08-26 16:48:37.319'),
(29, 28, 15, 1, 1100, 1100, '2025-08-26 19:01:25.936'),
(30, 28, 29, 1, 1100, 1100, '2025-08-26 19:01:27.949'),
(31, 28, 31, 1, 1100, 1100, '2025-08-26 19:01:29.957'),
(32, 29, 13, 1, 2450, 2450, '2025-08-26 23:43:15.548'),
(33, 29, 29, 2, 1100, 2200, '2025-08-26 23:43:17.614'),
(34, 29, 15, 1, 1100, 1100, '2025-08-26 23:43:19.677'),
(35, 30, 33, 1, 3450, 3450, '2025-08-27 19:06:50.668'),
(36, 30, 31, 1, 1100, 1100, '2025-08-27 19:06:52.711'),
(37, 30, 15, 3, 1100, 3300, '2025-08-27 19:06:54.753'),
(38, 30, 13, 1, 2450, 2450, '2025-08-27 19:06:56.794'),
(39, 31, 16, 1, 1000, 1000, '2025-08-27 19:13:38.834'),
(40, 31, 15, 2, 1100, 2200, '2025-08-27 19:13:40.860'),
(41, 32, 35, 1, 3450, 3450, '2025-08-27 19:28:29.867'),
(42, 33, 16, 1, 1000, 1000, '2025-08-27 20:28:52.215'),
(43, 33, 3, 1, 1600, 1600, '2025-08-27 20:28:54.223'),
(44, 33, 31, 1, 1100, 1100, '2025-08-27 20:28:56.238'),
(45, 33, 29, 1, 1100, 1100, '2025-08-27 20:28:58.257'),
(46, 33, 8, 1, 2450, 2450, '2025-08-27 20:29:00.269'),
(47, 33, 32, 1, 3450, 3450, '2025-08-27 20:29:02.289'),
(48, 34, 15, 4, 1100, 4400, '2025-08-27 21:56:05.105'),
(49, 34, 13, 1, 2450, 2450, '2025-08-27 21:56:07.136'),
(50, 34, 8, 1, 1837, 1837, '2025-08-27 21:56:09.163'),
(51, 34, 30, 1, 1000, 1000, '2025-08-27 21:56:11.635'),
(52, 34, 31, 2, 1100, 2200, '2025-08-27 21:56:13.666'),
(53, 34, 29, 1, 1100, 1100, '2025-08-27 21:56:15.696'),
(54, 35, 32, 1, 3450, 3450, '2025-08-27 22:17:06.795'),
(55, 35, 29, 2, 1100, 2200, '2025-08-27 22:17:08.831'),
(56, 35, 31, 6, 1100, 6600, '2025-08-27 22:17:10.864'),
(57, 36, 16, 1, 1000, 1000, '2025-08-28 18:32:52.499'),
(58, 36, 25, 1, 450, 450, '2025-08-28 18:32:54.549'),
(59, 36, 26, 1, 450, 450, '2025-08-28 18:32:56.586'),
(60, 36, 31, 2, 1100, 2200, '2025-08-28 18:32:58.622'),
(61, 36, 8, 1, 1837, 1837, '2025-08-28 18:33:00.659'),
(62, 36, 11, 1, 1837, 1837, '2025-08-28 18:33:02.696'),
(63, 36, 14, 1, 1837, 1837, '2025-08-28 18:33:04.736'),
(64, 36, 12, 1, 1837, 1837, '2025-08-28 18:33:06.776'),
(65, 36, 15, 3, 1100, 3300, '2025-08-28 18:33:08.814'),
(66, 37, 16, 1, 1000, 1000, '2025-08-28 18:35:34.583'),
(67, 37, 29, 1, 1100, 1100, '2025-08-28 18:35:36.623'),
(68, 37, 31, 2, 1100, 2200, '2025-08-28 18:35:38.669'),
(69, 37, 15, 2, 1100, 2200, '2025-08-28 18:35:40.707'),
(70, 38, 31, 1, 1100, 1100, '2025-08-28 18:57:36.646'),
(71, 39, 28, 1, 450, 450, '2025-08-28 19:02:36.131'),
(72, 39, 7, 1, 1837, 1837, '2025-08-28 19:02:38.176'),
(73, 40, 33, 1, 3450, 3450, '2025-08-28 19:07:01.672'),
(74, 41, 15, 1, 1100, 1100, '2025-08-28 19:07:55.640'),
(75, 42, 30, 1, 1000, 1000, '2025-08-28 19:09:06.362'),
(76, 43, 20, 2, 1990, 3980, '2025-08-28 20:30:06.592'),
(77, 44, 15, 4, 1100, 4400, '2025-08-28 20:31:26.747'),
(78, 45, 20, 2, 995, 1990, '2025-08-28 20:33:17.619'),
(79, 46, 32, 1, 3450, 3450, '2025-08-28 20:35:13.530'),
(80, 47, 8, 1, 2450, 2450, '2025-08-28 20:35:52.025'),
(81, 48, 30, 1, 1000, 1000, '2025-08-28 20:36:23.878'),
(82, 49, 7, 1, 2450, 2450, '2025-08-28 20:36:53.274'),
(83, 50, 14, 1, 2450, 2450, '2025-08-28 20:37:25.306'),
(84, 51, 10, 1, 2450, 2450, '2025-08-28 20:38:21.477'),
(85, 52, 30, 1, 1000, 1000, '2025-08-28 20:40:05.272'),
(86, 52, 3, 1, 1600, 1600, '2025-08-28 20:40:07.502');

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

--
-- Dumping data for table `versions`
--

INSERT INTO `versions` (`id`, `version`, `build_number`, `min_required_version`, `force_update`, `update_message`, `is_active`, `created_at`) VALUES
(1, '1.0.4', 2, '1.0.0', 0, 'Current stable version', NULL, '2025-08-02 20:19:31');

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
('d', NULL, '2025-08-12 18:53:25.574', 19, 12, 2),
('vg', NULL, '2025-08-13 16:52:09.893', 17, 13, 98),
('', 'https://res.cloudinary.com/otienobryan/image/upload/v1755552521/whoosh/uploads/upload_1755552521698_2.jpg', '2025-08-19 00:28:41.884', 22, 14, 2),
('nice', 'https://res.cloudinary.com/otienobryan/image/upload/v1755593201/whoosh/uploads/upload_1755593201512_2.jpg', '2025-08-19 11:46:42.533', 19, 15, 2),
('', 'https://res.cloudinary.com/otienobryan/image/upload/v1756211438/whoosh/uploads/upload_1756211438498_76.jpg', '2025-08-26 15:30:36.575', 14, 16, 76),
('', 'https://res.cloudinary.com/otienobryan/image/upload/v1756277923/whoosh/uploads/upload_1756277923019_78.jpg', '2025-08-27 09:58:42.959', 10, 17, 78),
('', 'https://res.cloudinary.com/otienobryan/image/upload/v1756278277/whoosh/uploads/upload_1756278276941_63.jpg', '2025-08-27 10:04:37.876', 9, 18, 63),
('', 'https://res.cloudinary.com/otienobryan/image/upload/v1756279722/whoosh/uploads/upload_1756279721924_91.jpg', '2025-08-27 10:28:42.757', 13, 19, 91),
('display ', 'https://res.cloudinary.com/otienobryan/image/upload/v1756280110/whoosh/uploads/upload_1756280110649_67.jpg', '2025-08-27 10:35:15.004', 6, 20, 67),
('', 'https://res.cloudinary.com/otienobryan/image/upload/v1756280277/whoosh/uploads/upload_1756280277530_99.jpg', '2025-08-27 10:37:59.271', 1, 21, 99),
('', 'https://res.cloudinary.com/otienobryan/image/upload/v1756282776/whoosh/uploads/upload_1756282776916_76.jpg', '2025-08-27 11:19:36.207', 14, 22, 76),
('', 'https://res.cloudinary.com/otienobryan/image/upload/v1756282899/whoosh/uploads/upload_1756282899770_76.jpg', '2025-08-27 11:21:39.204', 14, 23, 76),
('', 'https://res.cloudinary.com/otienobryan/image/upload/v1756284367/whoosh/uploads/upload_1756284367537_64.jpg', '2025-08-27 11:46:07.783', 5, 24, 64),
('', 'https://res.cloudinary.com/otienobryan/image/upload/v1756366287/whoosh/uploads/upload_1756366287785_63.jpg', '2025-08-28 10:31:28.370', 9, 25, 63),
('', 'https://res.cloudinary.com/otienobryan/image/upload/v1756366680/whoosh/uploads/upload_1756366680014_91.jpg', '2025-08-28 10:37:59.642', 13, 26, 91),
('', 'https://res.cloudinary.com/otienobryan/image/upload/v1756368799/whoosh/uploads/upload_1756368799524_99.jpg', '2025-08-28 11:13:20.286', 2, 27, 99),
('', 'https://res.cloudinary.com/otienobryan/image/upload/v1756371936/whoosh/uploads/upload_1756371936809_99.jpg', '2025-08-28 12:05:36.940', 2, 28, 99),
('', 'https://res.cloudinary.com/otienobryan/image/upload/v1756440874/whoosh/uploads/upload_1756440874505_2.jpg', '2025-08-29 07:14:35.272', 19, 29, 2);

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
-- Indexes for table `asset_requests`
--
ALTER TABLE `asset_requests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `requestNumber` (`requestNumber`),
  ADD KEY `salesRepId` (`salesRepId`),
  ADD KEY `approvedBy` (`approvedBy`),
  ADD KEY `assignedBy` (`assignedBy`);

--
-- Indexes for table `asset_request_items`
--
ALTER TABLE `asset_request_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assetRequestId` (`assetRequestId`);

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
-- Indexes for table `ClientTargets`
--
ALTER TABLE `ClientTargets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_client_month_year` (`clientId`,`month`,`year`),
  ADD KEY `idx_clientId` (`clientId`),
  ADD KEY `idx_month_year` (`month`,`year`),
  ADD KEY `idx_createdAt` (`createdAt`);

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
-- Indexes for table `outlet_quantity_transactions`
--
ALTER TABLE `outlet_quantity_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `clientId` (`clientId`),
  ADD KEY `productId` (`productId`),
  ADD KEY `transactionType` (`transactionType`),
  ADD KEY `transactionDate` (`transactionDate`),
  ADD KEY `referenceId` (`referenceId`),
  ADD KEY `outlet_quantity_transactions_saleRepId_fkey` (`userId`);

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
-- Indexes for table `sales_rep_targets`
--
ALTER TABLE `sales_rep_targets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_sales_rep_month` (`salesRepId`,`targetMonth`),
  ADD KEY `idx_sales_rep_id` (`salesRepId`),
  ADD KEY `idx_target_month` (`targetMonth`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `sample_request`
--
ALTER TABLE `sample_request`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `requestNumber` (`requestNumber`);

--
-- Indexes for table `sample_request_item`
--
ALTER TABLE `sample_request_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sampleRequestId` (`sampleRequestId`),
  ADD KEY `productId` (`productId`);

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
-- AUTO_INCREMENT for table `asset_requests`
--
ALTER TABLE `asset_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `asset_request_items`
--
ALTER TABLE `asset_request_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `CategoryPriceOption`
--
ALTER TABLE `CategoryPriceOption`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT for table `Clients`
--
ALTER TABLE `Clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `ClientStock`
--
ALTER TABLE `ClientStock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=373;

--
-- AUTO_INCREMENT for table `ClientTargets`
--
ALTER TABLE `ClientTargets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `client_ledger`
--
ALTER TABLE `client_ledger`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `inventory_transfers`
--
ALTER TABLE `inventory_transfers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `journal_entries`
--
ALTER TABLE `journal_entries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `journal_entry_lines`
--
ALTER TABLE `journal_entry_lines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `JourneyPlan`
--
ALTER TABLE `JourneyPlan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `key_account_targets`
--
ALTER TABLE `key_account_targets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leaves`
--
ALTER TABLE `leaves`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `leave_balances`
--
ALTER TABLE `leave_balances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `leave_requests`
--
ALTER TABLE `leave_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `leave_types`
--
ALTER TABLE `leave_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `LoginHistory`
--
ALTER TABLE `LoginHistory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2463;

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
-- AUTO_INCREMENT for table `outlet_quantity_transactions`
--
ALTER TABLE `outlet_quantity_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=209;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT for table `sales_orders`
--
ALTER TABLE `sales_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT for table `sales_order_items`
--
ALTER TABLE `sales_order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=196;

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
-- AUTO_INCREMENT for table `sales_rep_targets`
--
ALTER TABLE `sales_rep_targets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sample_request`
--
ALTER TABLE `sample_request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `sample_request_item`
--
ALTER TABLE `sample_request_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT for table `UpliftSale`
--
ALTER TABLE `UpliftSale`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `UpliftSaleItem`
--
ALTER TABLE `UpliftSaleItem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `VisibilityReport`
--
ALTER TABLE `VisibilityReport`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `warning_letters`
--
ALTER TABLE `warning_letters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `asset_requests`
--
ALTER TABLE `asset_requests`
  ADD CONSTRAINT `fk_asset_requests_approvedBy` FOREIGN KEY (`approvedBy`) REFERENCES `staff` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_asset_requests_assignedBy` FOREIGN KEY (`assignedBy`) REFERENCES `staff` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_asset_requests_salesRepId` FOREIGN KEY (`salesRepId`) REFERENCES `SalesRep` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `asset_request_items`
--
ALTER TABLE `asset_request_items`
  ADD CONSTRAINT `fk_asset_request_items_assetRequestId` FOREIGN KEY (`assetRequestId`) REFERENCES `asset_requests` (`id`) ON DELETE CASCADE;

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
-- Constraints for table `ClientTargets`
--
ALTER TABLE `ClientTargets`
  ADD CONSTRAINT `ClientTargets_ibfk_1` FOREIGN KEY (`clientId`) REFERENCES `Clients` (`id`) ON DELETE CASCADE;

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
-- Constraints for table `outlet_quantity_transactions`
--
ALTER TABLE `outlet_quantity_transactions`
  ADD CONSTRAINT `outlet_quantity_transactions_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Clients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `outlet_quantity_transactions_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `outlet_quantity_transactions_saleRepId_fkey` FOREIGN KEY (`userId`) REFERENCES `SalesRep` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `SalesRep`
--
ALTER TABLE `SalesRep`
  ADD CONSTRAINT `role_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);

--
-- Constraints for table `sales_rep_targets`
--
ALTER TABLE `sales_rep_targets`
  ADD CONSTRAINT `sales_rep_targets_ibfk_1` FOREIGN KEY (`salesRepId`) REFERENCES `SalesRep` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sample_request_item`
--
ALTER TABLE `sample_request_item`
  ADD CONSTRAINT `sample_request_item_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sample_request_item_sampleRequestId_fkey` FOREIGN KEY (`sampleRequestId`) REFERENCES `sample_request` (`id`) ON DELETE CASCADE;

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

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `fk_tasks_assignedById` FOREIGN KEY (`assignedById`) REFERENCES `staff` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_tasks_salesRepId` FOREIGN KEY (`salesRepId`) REFERENCES `SalesRep` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
