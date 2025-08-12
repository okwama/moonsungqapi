-- Outlet Quantity Transactions Table
-- Tracks all stock movements for UpliftSales and ClientStock operations

CREATE TABLE `outlet_quantity_transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `clientId` (`clientId`),
  KEY `productId` (`productId`),
  KEY `transactionType` (`transactionType`),
  KEY `transactionDate` (`transactionDate`),
  KEY `referenceId` (`referenceId`),
  CONSTRAINT `outlet_quantity_transactions_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Clients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `outlet_quantity_transactions_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `outlet_quantity_transactions_saleRepId_fkey` FOREIGN KEY (`userId`) REFERENCES `SalesRep` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data for testing
INSERT INTO `outlet_quantity_transactions` 
(`clientId`, `productId`, `transactionType`, `quantityIn`, `quantityOut`, `previousBalance`, `newBalance`, `referenceId`, `referenceType`, `transactionDate`, `userId`, `notes`) VALUES

-- Initial stock setup
(19, 17, 'stock_adjustment', 100.00, 0.00, 0.00, 100.00, 1, 'client_stock', '2025-08-12 09:00:00', 1, 'Initial stock setup'),

-- Sale made (stock goes out)
(19, 17, 'sale', 0.00, 5.00, 100.00, 95.00, 1, 'uplift_sale', '2025-08-12 10:30:00', 2, 'Sale made'),

-- Another sale
(19, 17, 'sale', 0.00, 3.00, 95.00, 92.00, 2, 'uplift_sale', '2025-08-12 11:15:00', 2, 'Sale made'),

-- Sale voided (stock comes back in)
(19, 17, 'void', 5.00, 0.00, 92.00, 97.00, 1, 'uplift_sale', '2025-08-12 11:45:00', 2, 'Sale voided - customer returned'),

-- Stock replenishment
(19, 17, 'stock_adjustment', 50.00, 0.00, 97.00, 147.00, 5, 'client_stock', '2025-08-12 14:20:00', 1, 'Stock replenished'),

-- Return from customer
(19, 17, 'return', 2.00, 0.00, 147.00, 149.00, 3, 'uplift_sale', '2025-08-12 15:30:00', 2, 'Customer return');
