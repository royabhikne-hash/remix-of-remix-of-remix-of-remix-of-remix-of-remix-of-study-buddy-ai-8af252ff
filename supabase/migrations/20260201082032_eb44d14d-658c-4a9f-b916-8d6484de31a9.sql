-- =====================================================
-- COMPREHENSIVE SECURITY FIX: RLS Policies Overhaul
-- =====================================================

-- 1. FIX: admins table - Ensure deny policy works correctly
-- Drop existing policy and recreate with proper restrictive behavior
DROP POLICY IF EXISTS "Deny all direct access to admins" ON public.admins;
CREATE POLICY "Deny all direct access to admins" ON public.admins
  AS RESTRICTIVE
  FOR ALL
  TO public
  USING (false)
  WITH CHECK (false);

-- 2. FIX: schools table - Ensure deny policy works correctly
DROP POLICY IF EXISTS "Deny all direct access to schools" ON public.schools;
CREATE POLICY "Deny all direct access to schools" ON public.schools
  AS RESTRICTIVE
  FOR ALL
  TO public
  USING (false)
  WITH CHECK (false);

-- 3. FIX: session_tokens table - Only service role access
DROP POLICY IF EXISTS "Service role manages session tokens" ON public.session_tokens;
CREATE POLICY "Deny all client access to session tokens" ON public.session_tokens
  AS RESTRICTIVE
  FOR ALL
  TO public
  USING (false)
  WITH CHECK (false);

-- 4. FIX: login_attempts table - Only service role access
DROP POLICY IF EXISTS "Deny all direct access to login_attempts" ON public.login_attempts;
CREATE POLICY "Deny all client access to login attempts" ON public.login_attempts
  AS RESTRICTIVE
  FOR ALL
  TO public
  USING (false)
  WITH CHECK (false);

-- 5. FIX: ai_rate_limits table - Replace permissive policy
DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.ai_rate_limits;
CREATE POLICY "Deny all client access to rate limits" ON public.ai_rate_limits
  AS RESTRICTIVE
  FOR ALL
  TO public
  USING (false)
  WITH CHECK (false);

-- 6. FIX: parent_reports table - Enable RLS and add proper policies
ALTER TABLE public.parent_reports ENABLE ROW LEVEL SECURITY;

-- Students can view their own reports
CREATE POLICY "Students can view own reports" ON public.parent_reports
  AS RESTRICTIVE
  FOR SELECT
  USING (student_id IN (
    SELECT id FROM students WHERE user_id = auth.uid()
  ));

-- Deny all other operations to clients
CREATE POLICY "Deny client modifications to reports" ON public.parent_reports
  AS RESTRICTIVE
  FOR ALL
  TO public
  USING (false)
  WITH CHECK (false);

-- 7. ADD: Explicit INSERT denial for achievements
CREATE POLICY "Deny student insert on achievements" ON public.achievements
  AS RESTRICTIVE
  FOR INSERT
  TO public
  WITH CHECK (false);

-- 8. ADD: Explicit DELETE denial for achievements
CREATE POLICY "Deny student delete on achievements" ON public.achievements
  AS RESTRICTIVE
  FOR DELETE
  TO public
  USING (false);

-- 9. ADD: Explicit UPDATE/DELETE denial for chat_messages
CREATE POLICY "Deny update on chat messages" ON public.chat_messages
  AS RESTRICTIVE
  FOR UPDATE
  TO public
  USING (false);

CREATE POLICY "Deny delete on chat messages" ON public.chat_messages
  AS RESTRICTIVE
  FOR DELETE
  TO public
  USING (false);

-- 10. ADD: Explicit UPDATE/DELETE denial for quiz_attempts
CREATE POLICY "Deny update on quiz attempts" ON public.quiz_attempts
  AS RESTRICTIVE
  FOR UPDATE
  TO public
  USING (false);

CREATE POLICY "Deny delete on quiz attempts" ON public.quiz_attempts
  AS RESTRICTIVE
  FOR DELETE
  TO public
  USING (false);

-- 11. ADD: Explicit INSERT/UPDATE denial for ranking_history
CREATE POLICY "Deny client insert on ranking history" ON public.ranking_history
  AS RESTRICTIVE
  FOR INSERT
  TO public
  WITH CHECK (false);

CREATE POLICY "Deny client update on ranking history" ON public.ranking_history
  AS RESTRICTIVE
  FOR UPDATE
  TO public
  USING (false);

CREATE POLICY "Deny client delete on ranking history" ON public.ranking_history
  AS RESTRICTIVE
  FOR DELETE
  TO public
  USING (false);

-- 12. ADD: Explicit INSERT/DELETE denial for rank_notifications
CREATE POLICY "Deny student insert on notifications" ON public.rank_notifications
  AS RESTRICTIVE
  FOR INSERT
  TO public
  WITH CHECK (false);

CREATE POLICY "Deny student delete on notifications" ON public.rank_notifications
  AS RESTRICTIVE
  FOR DELETE
  TO public
  USING (false);

-- 13. ADD: Explicit DELETE denial for students table
CREATE POLICY "Deny student deletion" ON public.students
  AS RESTRICTIVE
  FOR DELETE
  TO public
  USING (false);

-- 14. ADD: Explicit DELETE denial for study_sessions
CREATE POLICY "Deny session deletion" ON public.study_sessions
  AS RESTRICTIVE
  FOR DELETE
  TO public
  USING (false);