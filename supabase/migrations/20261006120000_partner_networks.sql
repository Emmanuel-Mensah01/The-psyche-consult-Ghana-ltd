-- Partner networks: MSM, Leverage, INTO Global.
-- 1. Adds partner_network + course_types columns to universities.
-- 2. Tags the schools already loaded by 20261004120000 (Leverage = display_order 1000-1105, MSM = 1106-1121).
-- 3. Loads the INTO Global partner schools (US, UK, Spain, Australia, UAE).
-- 4. Corrects Gifty Sarpong's university in testimonials.
-- Idempotent: safe to run more than once.

ALTER TABLE public.universities ADD COLUMN IF NOT EXISTS partner_network TEXT;
ALTER TABLE public.universities ADD COLUMN IF NOT EXISTS course_types TEXT;
CREATE INDEX IF NOT EXISTS idx_universities_partner_network ON public.universities(partner_network);

-- 2. Tag existing schools
UPDATE public.universities SET partner_network = 'Leverage'
WHERE display_order BETWEEN 1000 AND 1105 AND is_partner = true AND is_active = true;

UPDATE public.universities SET partner_network = 'MSM'
WHERE display_order BETWEEN 1106 AND 1121 AND is_partner = true AND is_active = true;

-- 3. INTO Global partner schools
WITH into_schools(name, country, types, ord) AS (VALUES
  -- United States
  ('Colorado State University', 'US', 'Direct Entry', 2000),
  ('Drew University', 'US', 'Pathway · Direct Entry', 2001),
  ('Eckerd College', 'US', 'Direct Entry', 2002),
  ('Fisher College', 'US', 'Direct Entry', 2003),
  ('George Mason University', 'US', 'Pathway · Direct Entry', 2004),
  ('Hofstra University', 'US', 'Pathway · Direct Entry', 2005),
  ('Illinois State University', 'US', 'Pathway · Direct Entry', 2006),
  ('Long Island University - Brooklyn', 'US', 'Direct Entry', 2007),
  ('Long Island University - Post', 'US', 'Direct Entry', 2008),
  ('Montclair State University', 'US', 'Direct Entry', 2009),
  ('New England College', 'US', 'Direct Entry', 2010),
  ('Oregon State University', 'US', 'Direct Entry · Pathway', 2011),
  ('Rensselaer Polytechnic Institute', 'US', 'Direct Entry', 2012),
  ('Saint Louis University', 'US', 'Pathway · Direct Entry', 2013),
  ('Southern Illinois University', 'US', 'Direct Entry', 2014),
  ('Suffolk University Boston', 'US', 'Direct Entry · Pathway', 2015),
  ('Texas State University', 'US', 'Direct Entry', 2016),
  ('Thomas Jefferson University', 'US', 'Direct Entry', 2017),
  ('The University of Alabama at Birmingham', 'US', 'Pathway · Direct Entry', 2018),
  ('University of Massachusetts Amherst', 'US', 'Direct Entry', 2019),
  ('University of Oklahoma', 'US', 'Direct Entry', 2020),
  -- United Kingdom
  ('City St George''s, University of London International Study Centre', 'UK', 'Pathway · iCAS', 2021),
  ('INTO London', 'UK', 'Pathway', 2022),
  ('INTO Manchester', 'UK', 'Pathway', 2023),
  ('Lancaster University International Study Centre', 'UK', 'Pathway', 2024),
  ('Newcastle University International Study Centre', 'UK', 'Pathway · iCAS', 2025),
  ('Queen''s University Belfast International Study Centre', 'UK', 'Pathway · iCAS', 2026),
  ('University of East Anglia International Study Centre', 'UK', 'Pathway · iCAS · Direct Entry', 2027),
  ('University of Exeter International Study Centre', 'UK', 'Pathway · iCAS', 2028),
  ('The University of Manchester', 'UK', 'Pathway', 2029),
  ('University of Stirling International Study Centre', 'UK', 'Pathway · Direct Entry · iCAS', 2030),
  -- Spain, Australia, UAE
  ('Saint Louis University Madrid', 'ES', 'Direct Entry', 2031),
  ('The University Of Western Australia', 'AU', 'Pathway · Direct Entry', 2032),
  ('University Study Centre', 'AE', 'Pathway', 2033)
),
resolved AS (
  SELECT n.name, n.types, n.ord, c.id AS country_id, c.name AS country_name,
    CASE n.country
      WHEN 'US' THEN 'USA'
      WHEN 'UK' THEN 'UK & IRELAND'
      WHEN 'ES' THEN 'EUROPE - SPAIN & PORTUGAL'
      WHEN 'AU' THEN 'AUSTRALIA & NEW ZEALAND'
      WHEN 'AE' THEN 'UAE'
    END AS region
  FROM into_schools n
  JOIN public.study_countries c ON lower(c.name) IN (
    CASE n.country
      WHEN 'US' THEN 'united states' WHEN 'UK' THEN 'united kingdom' WHEN 'ES' THEN 'spain'
      WHEN 'AU' THEN 'australia' WHEN 'AE' THEN 'united arab emirates'
    END,
    CASE n.country WHEN 'US' THEN 'usa' WHEN 'UK' THEN 'uk' WHEN 'AE' THEN 'uae' ELSE '-' END,
    CASE n.country WHEN 'US' THEN 'united states of america' ELSE '-' END
  )
)
INSERT INTO public.universities (name, country_id, location, region, partner_network, course_types, is_partner, is_active, display_order)
SELECT r.name, r.country_id, r.country_name, r.region, 'INTO Global', r.types, true, true, r.ord
FROM resolved r
WHERE NOT EXISTS (
  SELECT 1 FROM public.universities u
  WHERE u.country_id = r.country_id AND lower(u.name) = lower(r.name) AND u.partner_network = 'INTO Global'
);

-- 4. Testimonial correction
UPDATE public.testimonials SET university = 'Hellenic American University'
WHERE student_name ILIKE 'Gifty Sarpong%';

-- Check: schools per network and country (should show MSM, Leverage and INTO Global rows)
SELECT u.partner_network, c.name AS country, count(*) AS schools
FROM public.universities u JOIN public.study_countries c ON c.id = u.country_id
WHERE u.is_active = true AND u.is_partner = true
GROUP BY 1, 2 ORDER BY 1, 2;
