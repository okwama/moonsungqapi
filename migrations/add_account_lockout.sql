-- ✅ Add account lockout fields to SalesRep table
-- Purpose: Prevent brute force attacks by locking accounts after failed attempts
-- Date: 2025-10-17

ALTER TABLE SalesRep
ADD COLUMN failedLoginAttempts INT DEFAULT 0 COMMENT 'Number of consecutive failed login attempts',
ADD COLUMN lockedUntil TIMESTAMP NULL COMMENT 'Account locked until this timestamp',
ADD INDEX idx_failed_attempts (failedLoginAttempts),
ADD INDEX idx_locked_until (lockedUntil);

-- Reset existing accounts
UPDATE SalesRep 
SET failedLoginAttempts = 0, 
    lockedUntil = NULL
WHERE failedLoginAttempts IS NULL;
