-- ✅ Add journeyPlanId to all report tables
-- Purpose: Link reports to specific journey plans (critical missing relationship!)
-- Date: 2025-10-17
-- Priority: CRITICAL - Reports cannot be queried by journey plan without this!

-- ============================================================
-- STEP 1: Add journeyPlanId column to ProductReport
-- ============================================================

ALTER TABLE ProductReport
ADD COLUMN journeyPlanId INT NULL COMMENT 'Links report to specific journey plan';

-- Add index for fast queries
CREATE INDEX idx_product_report_journey_plan 
ON ProductReport(journeyPlanId);

-- Add composite index for user + journey plan queries
CREATE INDEX idx_product_report_user_journey 
ON ProductReport(userId, journeyPlanId);

-- Add foreign key constraint
ALTER TABLE ProductReport
ADD CONSTRAINT fk_product_report_journey_plan
FOREIGN KEY (journeyPlanId) REFERENCES JourneyPlan(id)
ON DELETE CASCADE;

-- ============================================================
-- STEP 2: Add journeyPlanId column to VisibilityReport
-- ============================================================

ALTER TABLE VisibilityReport
ADD COLUMN journeyPlanId INT NULL COMMENT 'Links report to specific journey plan';

-- Add index
CREATE INDEX idx_visibility_report_journey_plan 
ON VisibilityReport(journeyPlanId);

-- Add composite index
CREATE INDEX idx_visibility_report_user_journey 
ON VisibilityReport(userId, journeyPlanId);

-- Add foreign key
ALTER TABLE VisibilityReport
ADD CONSTRAINT fk_visibility_report_journey_plan
FOREIGN KEY (journeyPlanId) REFERENCES JourneyPlan(id)
ON DELETE CASCADE;

-- ============================================================
-- STEP 3: Add journeyPlanId column to FeedbackReport
-- ============================================================

ALTER TABLE FeedbackReport
ADD COLUMN journeyPlanId INT NULL COMMENT 'Links report to specific journey plan';

-- Add index
CREATE INDEX idx_feedback_report_journey_plan 
ON FeedbackReport(journeyPlanId);

-- Add composite index
CREATE INDEX idx_feedback_report_user_journey 
ON FeedbackReport(userId, journeyPlanId);

-- Add foreign key
ALTER TABLE FeedbackReport
ADD CONSTRAINT fk_feedback_report_journey_plan
FOREIGN KEY (journeyPlanId) REFERENCES JourneyPlan(id)
ON DELETE CASCADE;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Verify columns were added
SELECT 
  TABLE_NAME,
  COLUMN_NAME,
  DATA_TYPE,
  IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('ProductReport', 'VisibilityReport', 'FeedbackReport')
  AND COLUMN_NAME = 'journeyPlanId';

-- Verify indexes were created
SHOW INDEX FROM ProductReport WHERE Key_name LIKE '%journey%';
SHOW INDEX FROM VisibilityReport WHERE Key_name LIKE '%journey%';
SHOW INDEX FROM FeedbackReport WHERE Key_name LIKE '%journey%';

-- ✅ Migration complete!
-- Next: Update NestJS entities to include journeyPlanId field

