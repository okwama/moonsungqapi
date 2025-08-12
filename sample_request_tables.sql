-- Simple Sample Product Request System Tables

-- Table for sample requests
CREATE TABLE `sample_request` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clientId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `requestNumber` varchar(50) NOT NULL,
  `requestDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `approvedBy` int(11) DEFAULT NULL,
  `approvedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `requestNumber` (`requestNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for sample request items
CREATE TABLE `sample_request_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sampleRequestId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `notes` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sampleRequestId` (`sampleRequestId`),
  KEY `productId` (`productId`),
  CONSTRAINT `sample_request_item_sampleRequestId_fkey` FOREIGN KEY (`sampleRequestId`) REFERENCES `sample_request` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sample_request_item_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Simple sample data
INSERT INTO `sample_request` (`id`, `clientId`, `userId`, `requestNumber`, `requestDate`, `status`, `notes`, `approvedBy`, `approvedAt`) VALUES
(1, 22, 2, 'SR-001', '2025-08-12 10:00:00', 'pending', 'Client wants to test new products', NULL, NULL),
(2, 19, 2, 'SR-002', '2025-08-12 11:30:00', 'approved', 'Sample for new store opening', 1, '2025-08-12 12:00:00');

INSERT INTO `sample_request_item` (`id`, `sampleRequestId`, `productId`, `quantity`, `notes`) VALUES
(1, 1, 17, 2, 'Eyebrow pencil samples'),
(2, 1, 26, 3, 'Eyelash samples'),
(3, 2, 9, 3, 'Lipstick samples for testing');
