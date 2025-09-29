-- Migration: Optimize login performance with database indexes
-- Date: 2025-09-28
-- Purpose: Add indexes to improve login query performance

-- Add composite index for phone number and status (most common login query)
CREATE INDEX IF NOT EXISTS idx_phone_status ON SalesRep (phoneNumber, status);

-- Add unique index for phone number to ensure uniqueness and fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_phone_unique ON SalesRep (phoneNumber);

-- Add index for role lookups during login
CREATE INDEX IF NOT EXISTS idx_role_id ON SalesRep (roleId);

-- Optimize existing indexes if needed
-- Note: These indexes will significantly improve login performance by:
-- 1. Fast phone number lookups with status filtering
-- 2. Quick role information retrieval
-- 3. Ensuring data integrity with unique constraints

-- Drop the old token table if it exists (since we're not using it anymore)
DROP TABLE IF EXISTS Token;

