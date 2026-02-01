-- =====================================================
-- ADD EXPLICIT ANON DENIAL POLICIES FOR ALL TABLES
-- This blocks unauthenticated access completely
-- =====================================================

-- 1. students table - deny anon access
CREATE POLICY "Deny anonymous access to students" ON public.students
  AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

-- 2. study_sessions table - deny anon access
CREATE POLICY "Deny anonymous access to study sessions" ON public.study_sessions
  AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

-- 3. chat_messages table - deny anon access
CREATE POLICY "Deny anonymous access to chat messages" ON public.chat_messages
  AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

-- 4. quiz_attempts table - deny anon access
CREATE POLICY "Deny anonymous access to quiz attempts" ON public.quiz_attempts
  AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

-- 5. ranking_history table - deny anon access
CREATE POLICY "Deny anonymous access to ranking history" ON public.ranking_history
  AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

-- 6. achievements table - deny anon access
CREATE POLICY "Deny anonymous access to achievements" ON public.achievements
  AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

-- 7. rank_notifications table - deny anon access
CREATE POLICY "Deny anonymous access to rank notifications" ON public.rank_notifications
  AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

-- 8. parent_reports table - deny anon access (add separate for anon)
CREATE POLICY "Deny anonymous access to parent reports" ON public.parent_reports
  AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);