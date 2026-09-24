-- Migration: lock down leads + contacts (privacy fix) and give admins read access
-- Timestamp: 20260924150000
--
-- Problem: the original policies "authenticated_can_read_leads" / "authenticated_can_read_contacts"
-- used USING (true), so ANY logged-in student could read every inquiry (names, emails, phone numbers)
-- of every visitor. Replace them with admin-only read access.
-- Public inserts (the website forms) are unchanged. Students can still read their own leads
-- through the existing "students_read_own_leads" policy.

DROP POLICY IF EXISTS "authenticated_can_read_leads" ON public.leads;
DROP POLICY IF EXISTS "admin_read_all_leads" ON public.leads;
CREATE POLICY "admin_read_all_leads"
ON public.leads
FOR SELECT
TO authenticated
USING (public.is_admin_user());

DROP POLICY IF EXISTS "authenticated_can_read_contacts" ON public.contacts;
DROP POLICY IF EXISTS "admin_read_all_contacts" ON public.contacts;
CREATE POLICY "admin_read_all_contacts"
ON public.contacts
FOR SELECT
TO authenticated
USING (public.is_admin_user());
