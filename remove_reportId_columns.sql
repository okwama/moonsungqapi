-- SQL script to remove reportId columns from report tables
-- This will fix the "Duplicate entry '0' for key 'VisibilityReport_reportId_key'" error

-- Remove reportId column from VisibilityReport table
ALTER TABLE `VisibilityReport` DROP COLUMN `reportId`;

-- Remove reportId column from ProductReport table (if it exists)
ALTER TABLE `ProductReport` DROP COLUMN `reportId`;

-- Remove reportId column from FeedbackReport table (if it exists)
ALTER TABLE `FeedbackReport` DROP COLUMN `reportId`;

-- Note: If any of these columns don't exist, you'll get an error, but that's fine
-- The important one is VisibilityReport since that's where the error is occurring
