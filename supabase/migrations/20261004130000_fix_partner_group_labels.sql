-- The /universities page groups schools by the "location" label.
-- Schools added by 20261004120000 used the country name ("United States") while the existing schools use
-- their own label (e.g. "USA"), so each country showed up as two groups.
-- This gives every newly loaded school the most common existing label for its country. Labels only; no schools are added or removed.
WITH m AS (
  SELECT country_id, mode() WITHIN GROUP (ORDER BY location) AS loc
  FROM public.universities
  WHERE display_order < 1000 AND location IS NOT NULL AND location <> ''
  GROUP BY country_id
)
UPDATE public.universities u
SET location = m.loc
FROM m
WHERE u.country_id = m.country_id
  AND u.display_order >= 1000
  AND u.is_partner = true AND u.is_active = true;
