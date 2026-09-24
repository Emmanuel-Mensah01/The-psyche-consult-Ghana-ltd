-- Migration: Add status column to leads/contacts, admin role support, admin user
-- Timestamp: 20260727190000

-- 1. Add status column to leads if not exists
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';

-- 2. Add status column to contacts if not exists
ALTER TABLE public.contacts
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';

-- 3. Add role column to user_profiles if not exists
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';

-- 4. Admin access function (reads from auth metadata to avoid recursion)
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid()
    AND (
        au.raw_user_meta_data->>'role' = 'admin'
        OR au.raw_app_meta_data->>'role' = 'admin'
    )
)
$$;

-- 5. RLS: Admin can update leads status
DROP POLICY IF EXISTS "admin_can_update_leads" ON public.leads;
CREATE POLICY "admin_can_update_leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- 6. RLS: Admin can update contacts status
DROP POLICY IF EXISTS "admin_can_update_contacts" ON public.contacts;
CREATE POLICY "admin_can_update_contacts"
ON public.contacts
FOR UPDATE
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- 7. Create demo admin user
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
BEGIN
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES (
        admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
        'admin@psycheconsult.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
        jsonb_build_object('full_name', 'Admin User', 'role', 'admin'),
        jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[], 'role', 'admin'),
        false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
    )
    ON CONFLICT (id) DO NOTHING;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Admin user creation skipped: %', SQLERRM;
END $$;

-- 8. Insert sample leads and contacts for demo
DO $$
BEGIN
    INSERT INTO public.leads (name, email, phone, status, created_at) VALUES
        ('Kwame Asante', 'kwame.asante@gmail.com', '+233 54 123 4567', 'new', now() - interval '2 days'),
        ('Abena Mensah', 'abena.mensah@yahoo.com', '+233 20 987 6543', 'contacted', now() - interval '5 days'),
        ('Kofi Boateng', 'kofi.boateng@outlook.com', '+233 24 555 0001', 'in_progress', now() - interval '10 days'),
        ('Ama Owusu', 'ama.owusu@gmail.com', '+233 55 444 3322', 'new', now() - interval '1 day')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.contacts (name, email, phone, service, subject, message, status, created_at) VALUES
        ('Yaw Darko', 'yaw.darko@gmail.com', '+233 26 111 2233', 'University Selection', 'Help with UK universities', 'I need guidance on applying to UK universities for MSc programs.', 'new', now() - interval '3 days'),
        ('Efua Asare', 'efua.asare@gmail.com', '+233 50 777 8899', 'Visa Consulting', 'Student visa questions', 'I have questions about the student visa process for Canada.', 'contacted', now() - interval '7 days'),
        ('Nana Adjei', 'nana.adjei@hotmail.com', '+233 27 333 4455', 'Scholarship Info', 'Scholarship opportunities', 'Looking for scholarship options for studying in Germany.', 'in_progress', now() - interval '14 days')
    ON CONFLICT (id) DO NOTHING;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Sample data insertion skipped: %', SQLERRM;
END $$;
