-- Migration: homepage study destinations + partner universities (regions) + first seed batch
-- Timestamp: 20260924120000
-- Idempotent: safe to run more than once, never duplicates or overwrites admin-entered data.

ALTER TABLE public.study_countries ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.universities    ADD COLUMN IF NOT EXISTS region TEXT;
CREATE INDEX IF NOT EXISTS idx_universities_region ON public.universities(region);

-- 1. Countries (flag + whether it shows on the homepage "Study Destinations" grid)
WITH c(name, code, flag, ord, featured) AS (VALUES
  ('United States',  'US', '🇺🇸',  1, true),
  ('United Kingdom', 'GB', '🇬🇧',  2, true),
  ('Canada',         'CA', '🇨🇦',  3, true),
  ('Australia',      'AU', '🇦🇺',  4, true),
  ('Germany',        'DE', '🇩🇪',  5, true),
  ('France',         'FR', '🇫🇷',  6, true),
  ('Netherlands',    'NL', '🇳🇱',  7, true),
  ('Ireland',        'IE', '🇮🇪',  8, true),
  ('New Zealand',    'NZ', '🇳🇿',  9, true),
  ('Singapore',      'SG', '🇸🇬', 10, true),
  ('Japan',          'JP', '🇯🇵', 11, false),
  ('Malaysia',       'MY', '🇲🇾', 12, false),
  ('United Arab Emirates', 'AE', '🇦🇪', 13, false),
  ('Austria',        'AT', '🇦🇹', 14, false),
  ('Belgium',        'BE', '🇧🇪', 15, false),
  ('Cyprus',         'CY', '🇨🇾', 16, false),
  ('Czech Republic', 'CZ', '🇨🇿', 17, false),
  ('Finland',        'FI', '🇫🇮', 18, false),
  ('Hungary',        'HU', '🇭🇺', 19, false),
  ('Italy',          'IT', '🇮🇹', 20, false),
  ('Malta',          'MT', '🇲🇹', 21, false),
  ('Poland',         'PL', '🇵🇱', 22, false),
  ('Spain',          'ES', '🇪🇸', 23, false),
  ('Portugal',       'PT', '🇵🇹', 24, false),
  ('Switzerland',    'CH', '🇨🇭', 25, false),
  ('Turkey',         'TR', '🇹🇷', 26, false),
  ('China',          'CN', '🇨🇳', 27, false)
)
INSERT INTO public.study_countries (name, code, flag_emoji, display_order, is_featured, is_active)
SELECT c.name, c.code, c.flag, c.ord, c.featured, true
FROM c
WHERE NOT EXISTS (SELECT 1 FROM public.study_countries s WHERE lower(s.name) = lower(c.name));

-- Existing rows with the same name: fill in a missing flag and mark the 10 homepage destinations
WITH c(name, flag, ord, featured) AS (VALUES
  ('United States','🇺🇸',1,true),('United Kingdom','🇬🇧',2,true),('Canada','🇨🇦',3,true),
  ('Australia','🇦🇺',4,true),('Germany','🇩🇪',5,true),('France','🇫🇷',6,true),
  ('Netherlands','🇳🇱',7,true),('Ireland','🇮🇪',8,true),('New Zealand','🇳🇿',9,true),
  ('Singapore','🇸🇬',10,true)
)
UPDATE public.study_countries s
SET flag_emoji    = COALESCE(NULLIF(s.flag_emoji, ''), c.flag),
    is_featured   = c.featured,
    display_order = c.ord
FROM c
WHERE lower(s.name) = lower(c.name);

-- 2. Partner universities — batch 1: Australia & New Zealand (34)
WITH u(name, country, region) AS (VALUES
  ('ASC Language School, Perth WA', 'Australia', 'AUSTRALIA & NEW ZEALAND'),
  ('International College of Advanced Education (ICAE)', 'Australia', 'AUSTRALIA & NEW ZEALAND'),
  ('Auckland University of Technology', 'New Zealand', 'AUSTRALIA & NEW ZEALAND'),
  ('Curtin College', 'Australia', 'AUSTRALIA & NEW ZEALAND'),
  ('Deakin University', 'Australia', 'AUSTRALIA & NEW ZEALAND'),
  ('Eynesbury College', 'Australia', 'AUSTRALIA & NEW ZEALAND'),
  ('International College of Hotel Management (ICHM)', 'Australia', 'AUSTRALIA & NEW ZEALAND'),
  ('James Cook University', 'Australia', 'AUSTRALIA & NEW ZEALAND'),
  ('Kaplan Business School', 'Australia', 'AUSTRALIA & NEW ZEALAND'),
  ('La Trobe University', 'Australia', 'AUSTRALIA & NEW ZEALAND'),
  ('LCI Melbourne', 'Australia', 'AUSTRALIA & NEW ZEALAND'),
  ('Lincoln University', 'New Zealand', 'AUSTRALIA & NEW ZEALAND'),
  ('Massey University', 'New Zealand', 'AUSTRALIA & NEW ZEALAND'),
  ('Nelson Marlborough Institute of Technology', 'New Zealand', 'AUSTRALIA & NEW ZEALAND'),
  ('Newcastle University', 'Australia', 'AUSTRALIA & NEW ZEALAND'),
  ('Pacific International Hotel Management School (PIHMS)', 'New Zealand', 'AUSTRALIA & NEW ZEALAND'),
  ('SAE Creative Media', 'Australia', 'AUSTRALIA & NEW ZEALAND'),
  ('The University of Sydney', 'Australia', 'AUSTRALIA & NEW ZEALAND'),
  ('University of Adelaide', 'Australia', 'AUSTRALIA & NEW ZEALAND'),
  ('University of Auckland', 'New Zealand', 'AUSTRALIA & NEW ZEALAND'),
  ('University of Canberra (Sydney campus)', 'Australia', 'AUSTRALIA & NEW ZEALAND'),
  ('University of Canterbury International College', 'New Zealand', 'AUSTRALIA & NEW ZEALAND'),
  ('University of Newcastle, Australia', 'Australia', 'AUSTRALIA & NEW ZEALAND'),
  ('University of New England', 'Australia', 'AUSTRALIA & NEW ZEALAND'),
  ('University of Notre Dame', 'Australia', 'AUSTRALIA & NEW ZEALAND'),
  ('University of Otago', 'New Zealand', 'AUSTRALIA & NEW ZEALAND'),
  ('University of Sydney', 'Australia', 'AUSTRALIA & NEW ZEALAND'),
  ('University of South Australia', 'Australia', 'AUSTRALIA & NEW ZEALAND'),
  ('University of Tasmania', 'Australia', 'AUSTRALIA & NEW ZEALAND'),
  ('University of Waikato', 'New Zealand', 'AUSTRALIA & NEW ZEALAND'),
  ('University of Western Australia', 'Australia', 'AUSTRALIA & NEW ZEALAND'),
  ('Victoria University (Gold Coast)', 'Australia', 'AUSTRALIA & NEW ZEALAND'),
  ('Victoria University of Wellington', 'New Zealand', 'AUSTRALIA & NEW ZEALAND'),
  ('Western Sydney University', 'Australia', 'AUSTRALIA & NEW ZEALAND')
)
INSERT INTO public.universities (name, country_id, region, is_partner, is_active, display_order)
SELECT u.name, sc.id, u.region, true, true, 100 + row_number() OVER ()
FROM u
JOIN public.study_countries sc ON lower(sc.name) = lower(u.country)
WHERE NOT EXISTS (
  SELECT 1 FROM public.universities x
  WHERE lower(x.name) = lower(u.name) AND x.country_id = sc.id
);

-- Existing universities that already match by name get the region label too
UPDATE public.universities x
SET region = 'AUSTRALIA & NEW ZEALAND'
FROM public.study_countries sc
WHERE x.country_id = sc.id AND x.region IS NULL AND sc.name IN ('Australia', 'New Zealand');
