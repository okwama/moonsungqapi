-- Outlet Quantity Transactions Table
-- Tracks all stock movements for UpliftSales and ClientStock operations

CREATE TABLE `outlet_quantity_transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clientId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `transactionType` enum('sale','return','stock_adjustment','void') NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `previousStock` decimal(10,2) DEFAULT 0,
  `newStock` decimal(10,2) DEFAULT 0,
  `referenceId` int(11) DEFAULT NULL,
  `referenceType` varchar(50) DEFAULT NULL,
  `transactionDate` datetime NOT NULL,
  `userId` int(11) NOT NULL,
  `notes` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `clientId` (`clientId`),
  KEY `productId` (`productId`),
  KEY `transactionType` (`transactionType`),
  KEY `transactionDate` (`transactionDate`),
  KEY `referenceId` (`referenceId`),
  CONSTRAINT `outlet_quantity_transactions_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Clients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `outlet_quantity_transactions_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data for testing
INSERT INTO `outlet_quantity_transactions` (`clientId`, `productId`, `transactionType`, `quantity`, `previousStock`, `newStock`, `referenceId`, `referenceType`, `transactionDate`, `userId`, `notes`) VALUES
(19, 17, 'sale', -5.00, 100.00, 95.00, 1, 'uplift_sale', '2025-08-12 10:30:00', 2, 'Sale made'),
(19, 17, 'void', 5.00, 95.00, 100.00, 1, 'uplift_sale', '2025-08-12 11:45:00', 2, 'Sale voided - customer returned'),
(19, 17, 'stock_adjustment', 50.00, 100.00, 150.00, 5, 'client_stock', '2025-08-12 14:20:00', 1, 'Stock replenished');
