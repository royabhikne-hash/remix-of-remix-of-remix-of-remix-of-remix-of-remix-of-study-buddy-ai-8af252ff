-- Fix Security Definer View issue by using security_invoker = true
DROP VIEW IF EXISTS public.schools_public;

-- Recreate view with security_invoker = true (uses caller's permissions)
CREATE VIEW public.schools_public 
WITH (security_invoker = true)
AS
SELECT 
  id,
  school_id,
  name,
  district,
  state,
  created_at
FROM public.schools
WHERE is_banned = false AND fee_paid = true;

-- Grant SELECT to public roles (this is intentionally public for school directory)
GRANT SELECT ON public.schools_public TO anon;
GRANT SELECT ON public.schools_public TO authenticated;