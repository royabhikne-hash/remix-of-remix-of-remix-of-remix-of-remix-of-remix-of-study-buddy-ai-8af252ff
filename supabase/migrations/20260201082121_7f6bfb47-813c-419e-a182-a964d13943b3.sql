-- Move pg_trgm extension from public schema to extensions schema
-- First drop from public if exists
DROP EXTENSION IF EXISTS pg_trgm;

-- Create in extensions schema
CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA extensions;