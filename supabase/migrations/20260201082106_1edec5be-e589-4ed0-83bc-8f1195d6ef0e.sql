-- Fix schools_public view - This is intentionally public for school directory
-- But we need to ensure sensitive data isn't exposed

-- Drop the existing view
DROP VIEW IF EXISTS public.schools_public;

-- Recreate view with only safe public data (no fee_paid, is_banned)
CREATE VIEW public.schools_public AS
SELECT 
  id,
  school_id,
  name,
  district,
  state,
  created_at
FROM public.schools
WHERE is_banned = false AND fee_paid = true;

-- Grant SELECT to anon and authenticated (this is intentionally public for registration)
GRANT SELECT ON public.schools_public TO anon;
GRANT SELECT ON public.schools_public TO authenticated;