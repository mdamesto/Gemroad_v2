-- ===========================================================
-- Migration 004: Free Daily Boosters
-- Adds obtained_from column to user_boosters to track free claims
-- ===========================================================

ALTER TABLE user_boosters ADD COLUMN IF NOT EXISTS obtained_from TEXT;
