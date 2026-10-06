UPDATE public.universities
SET is_partner = false, is_active = false
WHERE display_order < 1000;
