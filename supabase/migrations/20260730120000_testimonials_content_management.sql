-- ============================================================
-- Testimonials, Content Management & Student Requests Module
-- ============================================================

-- 1. Testimonials table (video testimonials from past students)
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    university TEXT NOT NULL DEFAULT '',
    destination TEXT NOT NULL DEFAULT '',
    video_url TEXT,
    thumbnail_url TEXT,
    quote TEXT,
    is_published BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Homepage content items (promos, events, announcements)
CREATE TABLE IF NOT EXISTS public.content_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    content_type TEXT NOT NULL DEFAULT 'announcement',
    image_url TEXT,
    link_url TEXT,
    is_published BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Student requests table (booking + lead requests combined view)
-- (leads and contacts already exist; this is for consultation/booking requests)
-- We'll use the existing consultations table but add a student_requests view

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON public.testimonials(is_published);
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON public.testimonials(display_order);
CREATE INDEX IF NOT EXISTS idx_content_items_type ON public.content_items(content_type);
CREATE INDEX IF NOT EXISTS idx_content_items_published ON public.content_items(is_published);

-- 5. Admin helper function (check admin via auth metadata)
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
        OR au.email = 'admin@psycheconsult.com'
    )
)
$$;

-- 6. Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for testimonials
DROP POLICY IF EXISTS "public_read_published_testimonials" ON public.testimonials;
CREATE POLICY "public_read_published_testimonials"
ON public.testimonials
FOR SELECT
TO public
USING (is_published = true);

DROP POLICY IF EXISTS "admin_manage_testimonials" ON public.testimonials;
CREATE POLICY "admin_manage_testimonials"
ON public.testimonials
FOR ALL
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- 8. RLS Policies for content_items
DROP POLICY IF EXISTS "public_read_published_content" ON public.content_items;
CREATE POLICY "public_read_published_content"
ON public.content_items
FOR SELECT
TO public
USING (is_published = true);

DROP POLICY IF EXISTS "admin_manage_content_items" ON public.content_items;
CREATE POLICY "admin_manage_content_items"
ON public.content_items
FOR ALL
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- 9. Updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER set_testimonials_updated_at
    BEFORE UPDATE ON public.testimonials
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_content_items_updated_at ON public.content_items;
CREATE TRIGGER set_content_items_updated_at
    BEFORE UPDATE ON public.content_items
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 10. Sample content data
DO $$
BEGIN
    INSERT INTO public.content_items (id, title, description, content_type, is_published, display_order)
    VALUES
        (gen_random_uuid(), 'Scholarship Applications Now Open 2026', 'Apply now for full and partial scholarships to top universities in the USA, UK, and Canada. Limited slots available!', 'scholarship', true, 1),
        (gen_random_uuid(), 'Free Visa Counselling Workshop', 'Join our free workshop on student visa applications. Learn tips and tricks from our expert advisors.', 'event', true, 2),
        (gen_random_uuid(), 'New Partner Universities Added', 'We have added 15 new partner universities in Australia and Germany. Explore your options today!', 'announcement', true, 3)
    ON CONFLICT (id) DO NOTHING;
END $$;
